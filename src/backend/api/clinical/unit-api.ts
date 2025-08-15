"use server";

import { 
  examModel,
  scheduleExamModel,
  scheduleServiceModel,
  patientModel,
  unitModel,
  serviceResultModel,
  internalExamResultModel
} from "@/backend/model";
import { getUserId } from "@/lib/web-token";
import { getDataAndHoursFormat } from "@/lib/date-formater";
import { getUser } from "@/backend/api/admin";
import { upload } from "@/backend/api/storage";

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
        const exam = await examModel.findById({_id:examId}).select({ price: 1});
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
    const typeUnit = await unitModel.findById({ _id: scheduleService?.laboratoryId }).select({ unitTypeId: 1 });
    let totalPrice = 0;
    
    if(scheduleService)
      for(const examId of scheduleService.exams){
        const service = await examModel.findById({ _id: examId}).select({ price: 1});
        totalPrice += service?.price as number;
      }

    if(totalPrice){
      if(scheduleService?.payment?.status === "pending")
        throw new Error("Valida o pagamento do serviço!", { cause: "no_payment"});
      
      await scheduleServiceModel.create({
        scheduleId,
        userId: await getUserId(),
        Type: typeUnit?.unitTypeId
      });

      await scheduleExamModel.updateOne({ _id: scheduleId }, { served: true });
    }else {

      await scheduleServiceModel.create({
        scheduleId,
        userId: await getUserId(),
        Type: typeUnit?.unitTypeId
      });

      await scheduleExamModel.updateOne({ _id: scheduleId }, { served: true });
    }
   
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
      const patient = await patientModel.findById({_id: scheduledService?.patientId }).select({ fullname: 1});
      const user = await getUser(service?.userId?.toString() as string);

      patients.push({
        id: service._id.toString() as string,
        patient: patient?.fullname as string,
        markedDatatime: getDataAndHoursFormat(scheduledService?.dateTime as Date),
        user: user.fullname,
        nameLaboratory: (await unitModel.findById({ _id: scheduledService?.laboratoryId }))?.name as string,
        unitId: scheduledService?.laboratoryId?.toString() as string
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
        const examService = await examModel.findById({_id: examId }).select({ name: 1 });
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
    const serviceId = formData.get("serviceId");
    await scheduleServiceModel.updateOne({ _id: serviceId }, { served: true });
    
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

async function registerExamResult(prev:unknown, formData:FormData){
  // const serviceId = formData.get("serviceId") as string;
  // const resultId = formData.get("resultId") as string;
  // const file = formData.get("file") as File;
  // const description = formData.get("plainText") as string;

  // try{
  //   const formdata = new FormData();
  //   formdata.append("file", file);
    
  //   const driveFile = await upload(formdata, await getUserId());

  //   const results = await serviceResultModel.findOne({ resultId });

  //   if(!results){
  //     await serviceResultModel.create({
  //       resultId,
  //       exams: [{
  //         serviceId,
  //         description,
  //         storageId: driveFile.id,
  //         userId: await getUserId(),
  //       }],
  //       userId: await getUserId()
  //     });
  //   }

  //   // if(!!results){
  //   //   const allExams = new Map<string, typeof results.exams[number]>();
  //   //   results.exams.forEach(props => allExams.set(props.serviceId?.toString() as string, props)); // carregando os exames

  //   //   if(allExams.has(serviceId)){
  //   //     const exam = allExams.get(serviceId);
  //   //     // verificar as entradas do user se tem arquivo ou texto ou os dois
  //   //     if(file.size && plainText && exam?.results){
  //   //       exam.results.file = {
  //   //         name: fileRenamed,
  //   //         size: file.size,
  //   //         mimeType: file.type,
  //   //         binaryData: Buffer.from(await file.arrayBuffer())
  //   //       };
  //   //       exam.results.plainText = plainText;
  //   //     }else if(!file.size && plainText && exam?.results){
  //   //       exam.results.plainText = plainText;
  //   //     }else if(file.size && !plainText && exam?.results){
  //   //       exam.results.file = {
  //   //         name: fileRenamed,
  //   //         size: file.size,
  //   //         mimeType: file.type,
  //   //         binaryData: Buffer.from(await file.arrayBuffer())
  //   //       }
  //   //     }

  //   //     if(exam)
  //   //       allExams.set(serviceId, exam);
  //   //   }else{
  //   //     const newResults = new serviceResultModel({
  //   //       resultId,
  //   //       exams: [{
  //   //         serviceId,
  //   //         results: {
  //   //           file: {
  //   //             name: fileRenamed,
  //   //             size: file.size,
  //   //             mimeType: file.type,
  //   //             binaryData: Buffer.from(await file.arrayBuffer())
  //   //           },
  //   //           plainText
  //   //         },
  //   //         userId: await getUserId(),
  //   //       }],
  //   //       userId: await getUserId()
  //   //     });

  //   //     allExams.set(serviceId, newResults.exams[0]);
  //   //   }

  //   //   await serviceResultModel.updateOne({ _id:  results._id }, {
  //   //     exams: Array.from(allExams.values())
  //   //   });
  //   // }
      
  //   return {
  //     message: "Informações salvas!",
  //     status: true,
  //     serviceId
  //   }
  // }catch(err: unknown){
  //   const error = err as Error;

  //   return {
  //     message: error.cause?error.message:"Operação impossivel!",
  //     status: false,
  //     serviceId
  //   }
  // }
  try{
    const serviceId = formData.get("serviceId"); // ex: laboratorio ou imagiologia
    const description = formData.get("description");
    const examFile = formData.get("internalExamFile") as File;
    const examId = formData.get("examId");

    if(examFile.size){
      const storage = await upload(formData, await getUserId());
      const data = await internalExamResultModel.findOneAndUpdate({ serviceId, examId }, { storageId: storage.id });

      if(!data)
        await internalExamResultModel.create({
          serviceId,
          examId,
          description,
          userId: await getUserId(),
          storageId: storage.id
        });
    }else{
      const data = await internalExamResultModel.findOneAndUpdate({ serviceId, examId }, { description });
      
      if(!data)
        await internalExamResultModel.create({
          serviceId,
          examId,
          description,
          userId: await getUserId(),
        });
    }

    return {
      message: "salvo com sucesso!",
      status: true
    }
  }catch (e){
    console.log(e);

    return {
      message: "oppss!",
      status: false
    }
  }
}

async function getExamResult({
  serviceResultId
}: {
  serviceResultId: string
}){
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