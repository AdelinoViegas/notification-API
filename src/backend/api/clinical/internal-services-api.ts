"use server";

import { 
  serviceModel,
  scheduleExamModel,
  scheduleServiceModel,
  patientModel,
  unitModel,
  serviceResultModel,
  internalExamResultModel,
  db,
} from "@/backend/model";
import { getUserId } from "@/lib/web-token";
import { getDataAndHoursFormat } from "@/lib/date-formater";
import { getUser } from "@/backend/api/admin";
import { serviceUpload } from "@/backend/api/storage";
import { closePatientProcess, syncPatientRegister } from "@/backend/api/clinical/process-control";
import { CustonAxiosError } from "@/backend/api/types";

async function updatePaymentData(prev: unknown, formData: FormData){
  try{
    const serviceId = formData.get("scheduleId");
    const code = formData.get("code");
    const proof = formData.get("proof");
    const value = Number(formData.get("value"));
    let totalPrice = 0;

    if (!value) 
      throw new Error('Informe o preço!', { cause: "user_price_empty"}); 

    const service = await scheduleExamModel.findById({ _id: serviceId }); 
   
    if(service)
      for(const examId of service?.exams){
        const exam = await serviceModel.findById({ _id:examId }).select({ price: 1});
        totalPrice +=  exam?.price as number; 
      }

    if(totalPrice){
      const paiedPorcent = Math.trunc((value * 100)/totalPrice);

    await scheduleExamModel.updateOne({ _id: serviceId }, {
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
      throw new Error('Não é possivel validar o serviço sem preço!', { cause: "empty_price"});
    
    return {
      message: "Pagamento actualizado com sucesso!",
      status: true,
    }
  }catch(e: unknown){
    const err = e as Error & { code: number };

    return {
      message: err.code?"Os identificadores das faturas já foi usado!":
      err.cause?err.message:"Falha na validação do serviço!",
      status: false,
    }
  }
}

async function sendPatientToUnit(prev: unknown, formData: FormData){
  try{
    const scheduleId = formData.get('scheduleId');
    const scheduleService = await scheduleExamModel.findById({_id: scheduleId });
    const typeUnit = await unitModel.findById({ _id: scheduleService?.phisicalUnitId }).select({ unitTypeId: 1 });
    let totalPrice = 0;
    
    if(scheduleService)
      for(const examId of scheduleService.exams){
        const service = await serviceModel.findById({ _id: examId}).select({ price: 1});
        totalPrice += service?.price as number;
      }

    if(totalPrice){
      if(scheduleService?.payment?.status === "pending")
        throw new Error("Valida o pagamento do serviço!", { cause: "no_payment"});
    }

    const userId = await getUserId();

    await db.transaction(async (session) => {
      await scheduleServiceModel.create([{
        scheduleId,
        userId,
        Type: typeUnit?.unitTypeId
      }], { session });

      await scheduleExamModel.updateOne({ _id: scheduleId }, { served: true }, { session });
    });
   
    return {
      message: "Enviado para o laboratorio/imagiologia com sucesso!",
      status: true,
    }
  }catch(e: unknown){
    const err = e as Error & { code: number };

    return {
      message: err.code?"Utente já se encontra no Laboratório":
      err.cause?err.message:"Falha no envio!",
      status: false,
    }
  }
}

async function getPatients({
  served,
  type,
  filters, 
  page
}:{
  served: boolean;
  type: "laboratory" | "imaging";
  filters?: {
    fullname?: string;
    unitId?: string; // lab ou img
  },
  page: number;
}){
  try{
    const patients = [];
    const services = await scheduleServiceModel.find({ 
      served: served,
      Type: type, 
    });

    let numberOfItems = 10;
    numberOfItems *= page;
    
    for(const service of services.slice(numberOfItems - 10, numberOfItems)){
      const scheduledService = await scheduleExamModel.findById({ _id: service.scheduleId });
      const patient = await patientModel.findById({ _id: scheduledService?.patientId }).select({ fullname: 1 });
      const user = await getUser(service?.userId?.toString() as string);

      patients.push({
        id: service._id.toString() as string,
        patient: patient?.fullname as string,
        markedDataTime: getDataAndHoursFormat(scheduledService?.dateTime as Date),
        user: user.fullname,
        nameLaboratory: (await unitModel.findById({ _id: scheduledService?.phisicalUnitId }))?.name as string,
        unitId: scheduledService?.phisicalUnitId?.toString() as string
      });
    }
    
    let filteredPatients = filters?.fullname?patients.filter((props)=>props.patient.match(new RegExp(`^${filters.fullname}`, 'i'))):patients;
    filteredPatients = filters?.unitId?filteredPatients.filter((props)=>props.unitId === filters.unitId):filteredPatients;

    return {
      patients: filteredPatients,
      total: filteredPatients.length,
      availablePages: Math.ceil(filteredPatients.length / 10),
      currentPage: page
    }
  }catch(err: unknown){
    return {
      patients: [],
      total: 0,
      detail: err,
      availablePages: 0,
      currentPage: page
    }
  }
}

async function getScheduledExams(id: string){
  try{
    const exams = [];
    const scheduleService = await scheduleServiceModel.findById({_id: id}).select({ scheduleId: 1 });
    const service = await scheduleExamModel.findById({_id: scheduleService?.scheduleId}).select({ exams: 1 });
    
    if(service?.exams)
      for(const examId of service?.exams){
        const examService = await serviceModel.findById({_id: examId }).select({ name: 1 });
        exams.push({
          _id: examService?._id.toString() as string,
          name: examService?.name as string
        });
      }

    return exams;
  }catch {
    return []
  }
}

async function finishScheduledExam(prev: unknown, formData: FormData){
  try{
    const serviceId = formData.get("serviceId") as string;
    const patient = await getPatient(serviceId);

    await db.transaction(async (session) => {
      const scheduled = await scheduleServiceModel.findOneAndUpdate({ _id: serviceId }, { served: true }, { session });

      if(patient?.id && scheduled?.Type){
        await closePatientProcess(patient.id, scheduled.Type as string, session);
        await syncPatientRegister(patient.id, session);
      }
    });

    return {
      message: "Exame concluido!",
      status: true
    }
  }catch {
    return {
      message: "Operação impossivel!",
      status: false
    }
  }
}

async function registerExamResult(prev: unknown, formData: FormData) {
  try {
    const serviceId = formData.get("serviceId");
    const description = formData.get("description");
    const examFile = formData.get("userFile") as File | null;
    const examId = formData.get("examId");
    const userId = await getUserId();
    console.warn(examFile);

    if (examFile && examFile.size > 0) {
      const file = await serviceUpload(formData, "userFile");
      if("status" in file) return file

      // Atualiza ou cria o registro com o ID do Storage
      const data = await internalExamResultModel.findOneAndUpdate(
        { serviceId, examId }, 
        { storageId: file.data.id, description } // Atualiza a descrição também se enviada com arquivo
      );

      if (!data) {
        await internalExamResultModel.create({
          serviceId,
          examId,
          description,
          userId,
          storageId: file.data.id
        });
      }
    } else {
      // Fluxo sem arquivo (Apenas descrição)
      const data = await internalExamResultModel.findOneAndUpdate(
        { serviceId, examId }, 
        { description }
      );
      
      if (!data) {
        await internalExamResultModel.create({
          serviceId,
          examId,
          description,
          userId,
        });
      }
    }

    return {
      message: "Salvo com sucesso!",
      status: true
    };

  } catch (e) {
    const err = e as CustonAxiosError;

    return {
      message: err.message || "Erro interno ao processar a operação.",
      status: false,
    };
  }
}

async function getExamResult({serviceResultId}: { serviceResultId: string}){
  try{
    const serviceResult = await serviceResultModel.findOne({ resultId: serviceResultId });
    const list = [];

    if(serviceResult)
      for(const item of serviceResult.exams){
        list.push({
          _id: item.serviceId?.toString() as string,
          plainText: item?.description  as string,
          createdAt: item.createdAt as Date
        });
      }

    return list; // isto n é definitivo, 
  }catch {
    console.error("error ao listar os resultados!");
    
    return [];
  }
}

async function getPatient(id: string){
  try{
    const scheduleId = (await scheduleServiceModel.findById({ _id: id }))?.scheduleId;
    const patientId = (await scheduleExamModel.findById({_id: scheduleId}))?.patientId;
    const patient =  await patientModel.findById({_id: patientId}).select({ fullname: 1 });
    return {
      id: patient?._id.toString() as string,
      fullname: patient?.fullname as string,
    }
  }catch{

  }
}

export {
  updatePaymentData,
  sendPatientToUnit,
  getPatient,
  getPatients,
  getScheduledExams,
  registerExamResult,
  getExamResult,
  finishScheduledExam
}