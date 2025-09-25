"use server";

import {priorityInOperatingRoom } from "@/lib/filters";
import { getUserId } from "@/lib/web-token";
import { surgerySchedulingArea } from "./translator";
import { 
  examModel, 
  patientModel,
  scheduleSugeryModel,
  operatingRoomModel,
  processStateModel,
  patientOperatingRoomModel
} from "@/backend/model";
import { getUser } from "@/backend/api/clinical/api";
import { calculateAge } from "@/lib/calculate-age";
//import { findDoctorCalendar } from "./scheduling-api";
//import { findDoctorCalendar, getNumberDoctorAppointment } from "./scheduling-api";

async function getPatients({
  name,
  served,
  priority,
}:{
  name?: string,
  served?: boolean,
  priority?: string, 
}){
  const formatedList = [];
  const operatingRoom = await operatingRoomModel.find({
    served: served?served:false,
  });

  for(const items of operatingRoom){
    const schedule = await scheduleSugeryModel.findById({_id: items.scheduleId })
    const patient = await patientModel.findById({_id: schedule?.patientId}).select({fullname: 1});
    const doctor = await getUser(schedule?.doctorId?.toString() as string);
    const sugeryType = await examModel.findById({_id: schedule?.sugeryType}).select({name: 1});
    
    const isProcess = await processStateModel.findOne({
        patientId: patient?._id,
        location: "block",
        isInUse: true
    });

    if(isProcess && isProcess.userId?.toString() !== await getUserId())
      continue;

    formatedList.push({
      id: items?.id.toString() as string,
      requestingService: surgerySchedulingArea.find( props => props._id === schedule?.requestingService)?.label as string,
      patient: patient?.fullname as string,
      //infirmary: schedule?.infirmary as string,
      //bed: schedule?.bed as string,
      sugeryType: sugeryType?.name.toString() as string,
      doctor: doctor.fullname as string,
      //date: `${getDateInSlashFormat(schedule?.doctorDay as Date)} ${schedule?.doctorTime}` as string,
    })
  }

  return name?priorityInOperatingRoom(formatedList.filter((item)=>item.patient.match(new RegExp(`^${name}`, 'i')))).orderElements:
  priority?priorityInOperatingRoom(formatedList.filter((item)=>item.requestingService === surgerySchedulingArea.find((props)=>props._id === priority)?.label)).orderElements:
  priorityInOperatingRoom(formatedList).orderElements;
}

async function sendPatientToOperatingRoom(prev: unknown, formData: FormData){
  try{
    const scheduleId = formData.get('scheduleId');
    const sugery = await scheduleSugeryModel.findById({_id: scheduleId });
    const service = await examModel.findById({_id: sugery?.sugeryType}).select({price: 1});
    const scheduleInOperatingRoom = await operatingRoomModel.find({ served: false });
    
    if(!sugery?.sugeryDate && !sugery?.sugeryHour)
      throw new Error("Defina antes a Data e Hora da cirurgia", { cause: "not_configured"});

    if(scheduleInOperatingRoom.length){
      for(const schedule of scheduleInOperatingRoom){
        const operatingRoom = await scheduleSugeryModel.findOne({ _id: schedule.scheduleId });
        if(sugery?.patientId?.toString() === operatingRoom?.patientId?.toString())
          throw new Error('Este utente já está no Bloco Operatório!', { cause: "already" });   
      }
    }

    if(!!service?.price && sugery?.payment?.status !== "confirmed")
      throw new Error('A cirurgia não está validada!', { cause: "not_confirmed" });
    
    await operatingRoomModel.create({
      scheduleId,
      userId: await getUserId(),
    });

    await scheduleSugeryModel.updateOne({_id: scheduleId}, { served: true });

    return {
      message: "Utente enviado ao Bloco Operatório!",
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

async function archivingSugery(prev: unknown, formData: FormData){
  try{
    const scheduleId = formData.get("scheduleId") as string;
    const isArchived = (formData.get('isArchived') as string) === "true"?true:false;
    const reason = (formData.get("reason") as string)?.trim();
    
    if(isArchived){
      await scheduleSugeryModel.updateOne({ _id: scheduleId }, { canceled: false });
      
      return {
        message: "Cirurgia desarquivada com sucesso!",
        status: true,
      }
    }

    if(!reason) 
      throw new Error("Escreva um motivo!", { cause: "empty_reason" });

    await scheduleSugeryModel.updateOne({ _id: scheduleId }, { 
      canceled: true,
      archiving: {
        reason,
        userId: await getUserId(),
      } 
    });

    return {
      message: "Cirurgia arquivada com sucesso!",
      status: true,
    }
  }catch(e: unknown){
    const err = e as Error;

    return {
      message: err.cause?err.message:"Falha no arquivamento!",
      status: false,
    }
  }
}

/*async function rescheduleSugery(prev: unknown, formData: FormData){
  try{
    const scheduleId = formData.get("scheduleId") as string;
    
    return {
      message: "Cirurgia reagendada com sucesso!",
      status: true,
    }
  }catch(e: unknown){
    const err = e as Error;

    return {
      message: err.cause ? err.message : "Desculpe, não foi possível realizar o reagendamento!",
      status: false,
    };
  }
}*/

async function getPatient({ id }: { id: string}){
  try{
     const operatingRoom = await operatingRoomModel.findOne({_id: id}).select({scheduleId: 1}); 
     const schedule = await scheduleSugeryModel.findById({ _id: operatingRoom?.scheduleId });
     const patient = await patientModel.findById({_id: schedule?.patientId})
     
     return {
      _id: patient?._id.toString() as string,
      scheduleId: schedule?._id.toString() as string,
      fullname: patient?.fullname as string,
      registerNumber: patient?.registerNumber as number,
      age: calculateAge(patient?.birthDate as Date),
      gender: patient?.gender as string,
      priority: surgerySchedulingArea.find( props => props._id === schedule?.requestingService)?.color as string,
    }
    
  }catch(e){
    const err = e as Error;
    return {
      message: err.cause?err.message: "Falha no servidor!"
    }
  }
}

async function signOperatingRoom(prev: unknown, formData: FormData){
  try{
    const patientId = formData.get("patientId") as string;
    const diagnostic = formData.get("preoperative-diagnosis") as string;
    const informedConsent = formData.get("Informed-consent") as string;
    const responsible = formData.get("responsible") as string;
    const surgicalHistory = formData.get("medicalAndsurgicalHistory") as string;
    const allergies = formData.get("allergies") as string;
    const clinicalStatus = formData.get("currentClinicalStatus") as string;
    const surgicalRisk = formData.get("surgicalRisk") as string;
    const fastingConfirmed = formData.get("fastingConfirmed") as string;
    const previousMedication = formData.get("previousMedication") as string;
    const surgicalTeam = formData.get("surgicalTeam") as string;
    const designatedRoom = formData.get("designatedRoom") as string;
    const materialsAndEquipment = formData.get("materialsAndEquipment") as string;
    const implantableDevices = formData.get("implantableDevices") as string;

    const hasPatientOperatingRoom = await patientOperatingRoomModel.findOne({ patientId });
    const patient = hasPatientOperatingRoom?.patientIdentification;
    const evaluation = hasPatientOperatingRoom?.preoperativeEvaluation;
    const planning = hasPatientOperatingRoom?.sugeryPlanning;

    const patientIdentification = {
      preoperativeDiagnosis: diagnostic || patient?.preoperativeDiagnosis,
      informedConsent: informedConsent || patient?.informedConsent,
      responsible: responsible || patient?.responsible,
    }

    const preoperativeEvaluation = {
      medicalAndsurgicalHistory: surgicalHistory || evaluation?.medicalAndsurgicalHistory,
      allergies: allergies || evaluation?.allergies,
      laboratoryTests: false || evaluation?.laboratoryTests,
      imagingTests: false || evaluation?.imagingTests,
      currentClinicalStatus: clinicalStatus || evaluation?.currentClinicalStatus,
      surgicalRisk: surgicalRisk || evaluation?.surgicalRisk,
      fastingConfirmed: fastingConfirmed || evaluation?.fastingConfirmed,
      previousMedication: previousMedication || evaluation?.previousMedication,
    }
    
    const sugeryPlanning = {
      surgicalTeam: surgicalTeam || planning?.surgicalTeam as string,
      designatedRoom: designatedRoom || planning?.designatedRoom as string,
      materialsAndEquipment: materialsAndEquipment || planning?.materialsAndEquipment as string,
      implantableDevices: implantableDevices || planning?.implantableDevices as string,
    }

    if(!hasPatientOperatingRoom)     
      await patientOperatingRoomModel.create({ 
        patientId, 
        patientIdentification,
        preoperativeEvaluation,
        sugeryPlanning
      });
    else
      await patientOperatingRoomModel.updateOne({ 
        _id: hasPatientOperatingRoom._id 
      },{ 
        patientIdentification,
        preoperativeEvaluation,
        sugeryPlanning 
      });

    return {
      message: `Informação ${!hasPatientOperatingRoom?'registrada':'actualizada'} com sucesso!`,
      status: true,
    }
  }catch(e: unknown){
    const err = e as Error;

    return {
      message: err.cause?err.message:"Não foi possivel realizar esta operação!",
      status: false,
    }
  }
}


async function getOperatingRoom(patientId: string){
  const operatingRoom = await patientOperatingRoomModel.findOne({ patientId, served: false });
  
  return {
    id: operatingRoom?._id.toString() as string,
    patientIdentification: {
      preoperativeDiagnosis: operatingRoom?.patientIdentification?.preoperativeDiagnosis as string,
      informedConsent: operatingRoom?.patientIdentification?.informedConsent as string,
      responsible: operatingRoom?.patientIdentification?.responsible as string,
    },
    preoperativeEvaluation: {
      medicalAndsurgicalHistory: operatingRoom?.preoperativeEvaluation?.medicalAndsurgicalHistory as string,
      allergies: operatingRoom?.preoperativeEvaluation?.allergies as string,
      laboratoryTests: operatingRoom?.preoperativeEvaluation?.laboratoryTests as string,
      imagingTests: operatingRoom?.preoperativeEvaluation?.imagingTests as string,
      currentClinicalStatus: operatingRoom?.preoperativeEvaluation?.currentClinicalStatus as string,
      surgicalRisk: operatingRoom?.preoperativeEvaluation?.surgicalRisk as string,
      fastingConfirmed: operatingRoom?.preoperativeEvaluation?.fastingConfirmed as string,
      previousMedication: operatingRoom?.preoperativeEvaluation?.previousMedication as string,
    },
    sugeryPlanning: {
      surgicalTeam: operatingRoom?.sugeryPlanning?.surgicalTeam as string,
      designatedRoom: operatingRoom?.sugeryPlanning?.designatedRoom as string,
      materialsAndEquipment: operatingRoom?.sugeryPlanning?.materialsAndEquipment as string,
      implantableDevices: operatingRoom?.sugeryPlanning?.implantableDevices as string,
    },

  }
  
}

export {
  getPatients,
  getPatient,
  getOperatingRoom,
  sendPatientToOperatingRoom,
  archivingSugery,
  //rescheduleSugery,
  signOperatingRoom,
}