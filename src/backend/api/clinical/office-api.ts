"use server";

import { 
  examModel, 
  patientModel,
  scheduleAppointmentModel,
  demographyModel,
  responsibleModel,
  externalResultsModel,
} from "@/backend/model";
import { officeModel } from "@/backend/model";
import { getUserId } from "@/lib/web-token";
import { findDoctorCalendar } from "@/backend/api/clinical/scheduling-api";
import { getDateInSlashFormat } from "@/lib/date-formater";
import { getUser } from "@/backend/api/clinical/api";
import { upload } from "@/backend/api/storage";

type ConsultationTypes = "vitalSignals" | "currentStates";

async function updatePaymentData(prev: unknown, formData: FormData){
  try{
    const appointmentId = formData.get("scheduleId");
    const code = formData.get("code");
    const proof = formData.get("proof");
    const value = Number(formData.get("value"));
    
    if (!value) 
      throw new Error('Informe o preço!', { cause: "user_price_empty"}); 

    const appointment = await scheduleAppointmentModel.findById({ _id: appointmentId });
    const consult = await examModel.findById({ _id: appointment?.consultId });

    if(consult?.price){
      const paiedPorcent = Math.trunc((value * 100)/consult.price);

      await scheduleAppointmentModel.updateOne({ _id: appointmentId }, {
        payment: {
          status: paiedPorcent === 100?"confirmed":"pending",
          invoice: {
            code,
            proof,
            value,
            porcentage: `${paiedPorcent}%`
          }
        }
      });
    }else 
      throw new Error('Não é possivel validar consulta sem preço!', { cause: "empty_price"});
    
    return {
      message: "Pagamento actualizado com sucesso!",
      status: true,
    }
  }catch(e: unknown){
    const err = e as Error & { code: number };

    return {
      message: err.code?"Os identificadores das faturas já foi usado!":
      err.cause?err.message:"Falha na validação da consulta!",
      status: false,
    }
  }
}

async function sendPatientToOffice(prev: unknown, formData: FormData){
  try{
    const scheduleId = formData.get('scheduleId');
    const appointment = await scheduleAppointmentModel.findById({_id: scheduleId });
    const service = await examModel.findById({_id: appointment?.consultId}).select({price: 1});
    const scheduleInOffice = await officeModel.find({ served: false });
    
    if(scheduleInOffice.length){
      for(const scheduleOffice of scheduleInOffice){
        const officeAppointment = await scheduleAppointmentModel.findOne({ _id: scheduleOffice.scheduleId });
        if(appointment?.patientId?.toString() === officeAppointment?.patientId?.toString())
          throw new Error('Este utente já está no consultório do Médico!', { cause: "already" });   
      }
    }

    // if(!service?.price){
    //   await officeModel.create({
    //     scheduleId,
    //     userId: await getUserId(),
    //   });
  
    // }else{
    //   if(appointment?.payment?.status !== "confirmed")
    //     throw new Error('A consulta não está validada!', { cause: "not_confirmed" });

    //   await officeModel.create({
    //     scheduleId,
    //     userId: await getUserId(),
    //   });
    // }

    if(!!service?.price && appointment?.payment?.status !== "confirmed")
      throw new Error('A consulta não está validada!', { cause: "not_confirmed" });
    
    if(appointment?.doctorReschedule)
      throw new Error('O Médico solicitou o reagendamento deste utente!', { cause: "doctor_reschedule" });
    
    await officeModel.create({
      scheduleId,
      userId: await getUserId(),
    });

    await scheduleAppointmentModel.updateOne({_id: scheduleId}, { served: true });

    return {
      message: "Utente enviado ao consultório!",
      status: true,
    }
  }catch(e: unknown){
    const err = e as Error & { code: number };

    return {
      message: err.code?"Utente já se encontra no consultório":
      err.cause?err.message:"Falha no envio!",
      status: false,
    }
  }
}

async function getPatients({
  fullname,
  served,
  inAppointment
}:{
  fullname?: string;
  served?: boolean;
  archived?: boolean;
  inAppointment?: boolean;
}){
  try{
    const appointments = await officeModel.find({ served: served ?? false });

    const formated = [];

    for(const appointment of appointments){
      const scheduledAppointment = inAppointment?
      await scheduleAppointmentModel.findOne({ _id: appointment.scheduleId }):
      await scheduleAppointmentModel.findOne({ 
        _id: appointment.scheduleId,
        doctorId: await getUserId(),
      });

      if(!scheduledAppointment)
        continue;

      const patient = await patientModel.findById({_id: scheduledAppointment?.patientId }).select({ fullname: 1 });
      const doctorCalendar = await findDoctorCalendar({doctorId: scheduledAppointment?.doctorId?.toString() as string, toSchedule: true});
      const doctorRoom = doctorCalendar.find(props => props.day.toISOString().split('T')[0] === scheduledAppointment?.doctorDay?.toISOString().split('T')[0]);
      const doctor = await getUser(scheduledAppointment?.doctorId?.toString() as string);//userModel.findById({ _id: scheduledAppointment?.doctorId });
      const user =  await getUser(appointment?.userId?.toString() as string);

      formated.push({
        _id: appointment._id?.toString() as string,
        id: appointment._id?.toString() as string,
        patient: patient?.fullname as string,
        date: new Date(scheduledAppointment?.doctorDay as Date),
        time: scheduledAppointment?.doctorTime as string,
        markedDatatime: `${getDateInSlashFormat(scheduledAppointment?.doctorDay as Date)} ${scheduledAppointment?.doctorTime}`,
        hour: `${getDateInSlashFormat(scheduledAppointment?.doctorDay as Date)} ${scheduledAppointment?.doctorTime}`,
        room: doctorRoom?.room,
        doctor: doctor?.fullname,
        status: "#",
        user: user.fullname,
      });
    }

    return { 
      patients: fullname?formated.filter(props => props.patient.match(new RegExp(`^${fullname}`, 'i'))):formated,
      total: formated.length,
    }

  }catch {
    return {
      patients: [],
      total: 0,
    }
  }
}

async function getPatient(officeId: string){
  try{
    const inOffice = await officeModel.findById({ _id: officeId });
    const appointment = await scheduleAppointmentModel.findById({ _id: inOffice?.scheduleId });
    const patient = await patientModel.findById({ _id: appointment?.patientId });
    const demography = await demographyModel.findOne({ patientId: patient?._id });
    const responsible = await responsibleModel.findOne({ patientId: patient?._id });

    return {
      personal: {
        fullname: patient?.fullname as string,
        age: patient?.age as number,
        civilState: patient?.civilState as string,
        gender: patient?.gender as string,
        tel: patient?.tel as string,
        _id: patient?._id.toString() as string,
      },
      actualLocation: demography?.actualLocation as string,
      responsible: responsible?.responsibles[0],
      scheduleAppointmentId: inOffice?.scheduleId?.toString() as string
    }
  }finally{}
}

async function signConsutation(prev:unknown, formData:FormData){
  try{
    const type = formData.get("type") as ConsultationTypes;
    const officeId = formData.get("officeId") as string;
    const paMax = formData.get("pamax");
    const paMin = formData.get("pamin");
    const jump = formData.get("jump");
    const pvc = formData.get("pvc");
    const temperature = formData.get("temperature");
    const breathing = formData.get("breathing");
    const weight = formData.get("weight");
    const height = formData.get("height");
    const sp02 = formData.get("sp02");
    const bloodGlucose = formData.get("bloodGlucose");
    const complaints = formData.get("complaints");
    const phisicalExam = formData.get("phisicalExam");
    const detail = formData.get("detail") as string;
    const consultation = await officeModel.findById({ _id: officeId })  
    
    switch(type){
      case "vitalSignals": {
        if(Number(height) <= 0)
          throw new Error("Altura inválida!", { cause: "zero_divisor" });
        
        const imc = Number(weight)/Math.pow(Number(height), 2);   
     
        await officeModel.updateOne({ _id: officeId }, {
          results:{
            vitalSignal: {
              paMax, 
              paMin, 
              jump, 
              pvc,
              imc: imc.toFixed(2),
              temperature, 
              breathing,
              weight,
              height, 
              sp02,
              bloodGlucose, 
            },
            currentStates: consultation?.results?.currentStates,
            "status.vitalSignal": true,
            "status.currentStates": consultation?.results?.status?.currentStates,
          } 
        });
        break;
      }
      case "currentStates": {
        if(!complaints)
          throw new Error("Registre a queixa do Utente!", { cause: "complaints" });

        await officeModel.updateOne({ _id: officeId },{
          results:{ 
            vitalSignal: consultation?.results?.vitalSignal,
            currentStates: {
              complaints,
              phisicalExam,
              detail
            },
            "status.vitalSignal": consultation?.results?.status?.vitalSignal,
            "status.currentStates": true,
          }
        });
        break;   
      }
      default: 
        throw new  Error("Registre a queixa do Utente!", { cause: "complaints" });
    }

    return {
      message: 'Informações registradas com sucesso!',
      status: true,
    }
  }catch(err: unknown){
    const error = err as Error;

    return {
      message: error.cause?error.message:error.message,
      status: false,
    }
  }
}

async function finishConsultation(prev: unknown, formData: FormData){
  try{
    const officeId = formData.get("officeId");
    const patientConsult = await officeModel.findById({_id: officeId});
    
    if(!patientConsult)
      throw new Error("Falha no regestro!", { cause: "log_not_found"});

    if(!patientConsult?.results?.status?.vitalSignal)
      throw new Error("Preencha os Sinais Vitais!", { cause: "not_fill"});

    if(!patientConsult?.results?.status?.currentStates)
      throw new Error("Preencha os Dados Actuais!", { cause: "not_fill"});

    patientConsult.served = true

    await officeModel.updateOne({ _id: patientConsult._id }, patientConsult);

    return {
      message: 'Consulta concluída com sucesso!',
      status: true,
    }
  }catch(err: unknown){
    const error = err as Error;

    return {
      message: error.cause?error.message:error.message,
      status: false,
    }
  }
}

async function requestReschedule(prev: unknown, formData: FormData){
  try{
    const officeId = formData.get("officeId");
    const patientInOffice = await officeModel.findOneAndUpdate({_id: officeId }, {
      deleted: true
    });
    
    await scheduleAppointmentModel.updateOne({_id: patientInOffice?.scheduleId }, {
      served: false,
      doctorReschedule: true
    });

    return {
      message: 'Solicitação enviada com sucesso!',
      status: true,
    }
  }catch(err: unknown){
    const error = err as Error;

    return {
      message: error.cause?error.message:error.message,
      status: false,
    }
  }
}

async function getConsultResult(id: string){
  try{
    const consult = await officeModel.findById({ _id: id });
    const externalResult = await externalResultsModel.findOne({ _id: consult?.externalId });

    return{   
      vitalSignal:{
        paMax: consult?.results?.vitalSignal?.paMax as number,
        paMin: consult?.results?.vitalSignal?.paMin as number,
        jump: consult?.results?.vitalSignal?.jump as number,
        pvc: consult?.results?.vitalSignal?.pvc as number,
        imc: consult?.results?.vitalSignal?.imc as number,
        sp02: consult?.results?.vitalSignal?.sp02 as number,
        temperature: consult?.results?.vitalSignal?.temperature as number,
        breathing: consult?.results?.vitalSignal?.breathing as number,
        weight: consult?.results?.vitalSignal?.weight as number,
        height: consult?.results?.vitalSignal?.height as number,
        bloodGlucose: consult?.results?.vitalSignal?.bloodGlucose as number,
      },
      currentStates: {
        complaints: consult?.results?.currentStates?.complaints as string,
        phisicalExam: consult?.results?.currentStates?.phisicalExam as string,
        detail: consult?.results?.currentStates?.detail as string,
      },
      storageId: externalResult?.storageId as string
    }
  } catch {
  
  }
}

async function uploadExternalExamFile(prev: unknown, formData: FormData){
  try{
    const file = formData.get("externalFile") as File;
    const officeId = formData.get("officeId");
    const patientId = formData.get("patientId");
    const storageId = formData.get("storageId");

    const formdata = new FormData();
    formdata.append("userFile", file);
    const data = await upload(formdata, await getUserId());

    if(storageId){
      const consult = await officeModel.findById({ _id: officeId });
      await externalResultsModel.updateOne({ _id: consult?.externalId }, { storageId: data.id });
    }else{
      const externalResult = await externalResultsModel.create({
        patientId,
        officeId,
        storageId: data.id,
        userId: await getUserId()
      });
        
      await officeModel.updateOne({ _id: officeId }, { externalId: externalResult._id });
    }

    return {
      message: data.message,
      status: true,
    }
  }catch(e){
    const err = e as Error;
    console.log(err.cause)
    return {
      message: err.message,
      status: false,
    }
  }
}

export {
  sendPatientToOffice,
  getPatient,
  getPatients,
  updatePaymentData,
  signConsutation,
  getConsultResult,
  finishConsultation,
  requestReschedule,
  uploadExternalExamFile
};