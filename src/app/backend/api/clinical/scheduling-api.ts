"use server";

import { whoAreYou } from "@/lib/web-token";
import { 
  getDataAndHoursFormat, 
  getDateInSlashFormat 
} from "@/lib/date-formater";
import { 
  examModel, 
  examGroupModel,
  scheduleExamModel,
  patientModel,
  unitModel,
  examResultModel,
  examCategoryModel,
  examClassificationModel,
  examCancelModel,
  doctorCalendarModel,
  scheduleAppointmentModel,
  appointmentCancelModel,
} from "@/app/backend/models/clinical";
import { userModel } from "@/app/backend/models/manager";
import { getUser } from "@/app/backend/api/clinical/api";
import { redirect } from "next/navigation";

export type CCGTypes = "category" | "classification" | "group";

async function signExam(prev: unknown, formData: FormData){
  try{
    const name = formData.get("name") as string;
    const categoryId = formData.get("categoryId") as string;
    const classificationId = formData.get("classificationId") as string;
    const groupId = formData.get("groupId") as string;
    const specialtyId = formData.get("specialtyId") as string;
    const price = formData.get("price");

    if(!specialtyId){
      const service = new examModel({
        name,
        groupId,
        categoryId,
        classificationId,
        price: Number(price),
      });

      await service.save();

      return {
        message: "Serviço registrado com sucesso!",
        status: true,
      }
    }     
  
    const service = new examModel({
      name,
      groupId,
      categoryId,
      classificationId,
      specialtyId,
      price: Number(price),
    });

    await service.save();

    return {
      message: "Serviço registrado com sucesso!",
      status: true,
    }
  }catch(e: unknown){
    const err = e as { code: number } & Error;

    if(err.code)
      return {
        message: "Este exame já foi cadastrado!",
        status: false,
      }

    return {
      message: "Falha no registro!",
      status: false,
    };
  }
} 

async function updateExamService(prev: unknown, formData: FormData){
  try{
    const examId = formData.get("examId") as string;
    const name = formData.get("name") as string;
    const groupId = formData.get("groupId") as string;
    const categoryId = formData.get("categoryId") as string;
    const classificationId = formData.get("classificationId") as string;
    const price = formData.get("price");
    const specialtyId = formData.get("specialtyId"); // apenas válido para consultas

    await examModel.updateOne({ _id: examId },{
      name,
      groupId,
      categoryId,
      classificationId,
      price,
      specialtyId: specialtyId?specialtyId:undefined
    });

    return {
      message: "Exame/Serviço actualizado com sucesso!",
      status: true,
    }
  }catch(err: unknown){
    return {
      message: "Falha na actualização!",
      status: false,
      detail: JSON.stringify(err)
    };
  }
} 

async function getExams({ 
  options,
  specialtyId
}: { 
  options: boolean; 
  specialtyId?: string 
}){
  const exams = specialtyId?await examModel.find({specialtyId}):await examModel.find();
  const listFormated = [];

  if(options){
    for(const item of exams)
      listFormated.push({
        _id: item._id.toString() as string,
        label: item.name as string,
      });

    return listFormated;
  }

  for(const exam of exams){
    const group = await examGroupModel.findById({ _id: exam.groupId });
    const category = await examCategoryModel.findById({ _id: exam.categoryId });
    const classification = await examClassificationModel.findById({ _id: exam.classificationId });

    listFormated.push({
      id: exam._id.toString(),
      examCode: exam.examCode as unknown as string,
      name: exam.name as string,
      category: category?.name as string,
      classification: classification?.name as string,
      group: group?.name as string,
      price: exam?.price as unknown as string,
    });
  }
  
  return listFormated;
}

async function getExam(examId: string){
  const exam = await examModel.findById({_id: examId });
  
  return {
    _id: exam?._id.toString() as string,
    name: exam?.name as string,
    groupId: exam?.groupId?.toString() as string,
    categoryId: exam?.categoryId?.toString() as string,
    classificationId: exam?.classificationId?.toString() as string,
    price: exam?.price as number | string,
    examCode: exam?.examCode as number | string,
  }
}

async function signCCG(prev: unknown, formData: FormData){
  try{
    const name = formData.get("name");
    const type = formData.get("type") as CCGTypes;
    let message = "";

    switch(type){
      case "category": {
        const category = new examCategoryModel({ name });
        await category.save();
        message = "Categoria registrada com sucesso!";
        break;
      }
      case "classification": {
        const classification = new examClassificationModel({ name });
        await classification.save();
        message = "Classificação registrada com sucesso!";
        break;
      }
      case "group": {
        const group = new examGroupModel({ name });
        await group.save();
        message = "Grupo registrada com sucesso!";
        break;
      }
      default: {
        throw new Error("Não definido nenhum tipo");
      }
    }

    return {
      message,
      status: true,
    }
  }catch(e: unknown){
    const err = e as  { code: number } & Error;

    if(err.code){
      return {
        message: "Este nome já existe!",
        status: false,
      }
    }
    return {
      message: "Falha no registro",
      status: false,
    }
  }
}

async function updateCCG(formData: FormData){
  try{
    const itemId = formData.get("id");
    const name = formData.get("name");

    await examCategoryModel.updateOne({_id: itemId}, { name });
    await examClassificationModel.updateOne({_id: itemId}, { name });
    await examGroupModel.updateOne({_id: itemId}, { name });
    redirect("/clinical/exams-services");
  }finally{}
}

async function getCCGs(type: CCGTypes){
  const formated = [];
  let ccgs;
  switch(type){
    case "category":
      ccgs = await examCategoryModel.find();
      break;
    case "classification":
      ccgs = await examClassificationModel.find();
      break;
    case "group":
      ccgs = await examGroupModel.find();
  }

  for(const item of ccgs)
    formated.push({
      _id: item._id.toString(),
      id: item._id.toString(),
      name: item.name as string,
      label: item.name as string,
    });
  
  return formated;
}

async function getCCG({ type, id }:{ type?: CCGTypes, id: string }){
  switch(type){
    case "category": {
      const category = await examCategoryModel.findById({ _id: id });
      return {
        _id: category?._id.toString() as string,
        name: category?.name as string,
      }
    }
    case "classification": {
      const classification = await examClassificationModel.findById({ _id: id });
      return {
        _id: classification?._id.toString() as string,
        name: classification?.name as string,
      }
    }
    case "group": {
      const group = await examGroupModel.findById({ _id: id });
      return {
        _id: group?._id.toString() as string,
        name: group?.name as string,
      }
    }

    default: {
      const category = await examCategoryModel.findById({ _id: id });
      const classi = await examClassificationModel.findById({ _id: id });
      const group = await examGroupModel.findById({ _id: id });
      
      if(category)
        return {
          _id: category._id.toString(),
          name: category.name,
        }
      
      if(classi)
        return {
          _id: classi._id.toString(),
          name: classi.name,
        }

      if(group)
        return {
          _id: group._id.toString(),
          name: group.name,
        }
    }
  }
}

// Agendamento de exames
async function schedulePatientExam(prev: unknown, formData: FormData){
  try{
    const patientId = formData.get("patientId") as string;
    const laboratoryId = formData.get("laboratoryId") as string; 
    const dateTime = formData.get("datetime") as unknown as Date;
    const detail = formData.get("detail") as string;
    const exams = formData.get('exams')?JSON.parse(formData.get("exams") as string) as string[]:[];
    
    if(!exams.length)
      throw new Error("Escolha os exames desejado!", { cause: "empty_exams" });

    const schedule = new scheduleExamModel({
      patientId,
      laboratoryId,
      dateTime: dateTime?dateTime:new Date(),
      exams,
      detail,
      userId: await whoAreYou()
    });

    await patientModel.updateOne({_id: patientId }, { served: true });
    await schedule.save();

    return {
      message: "Exame agendado com sucesso!",
      status: true,
    }
  }catch(err: unknown){
    const e = err as Error;
    if(e.cause === "empty_exams")
      return {
        message: e.message,
        status: false,
      }
    return {
      message: "Falha no agendamento!",
      status: false,
    }
  }
}

async function getSchedulePatientExams({
  unitId,
  name,
  isCanceled,
  isServed,
}:{
  unitId?: string, 
  name?: string,
  isCanceled?: boolean, 
  isServed?: boolean, 

}){
  try{
    const schedules = unitId?await scheduleExamModel.find({ 
      laboratoryId: unitId, 
      served: isServed?isServed:false,
      canceled: isCanceled?isCanceled:false, 
    }):
    await scheduleExamModel.find({ 
      served: isServed?isServed:false,
      canceled: isCanceled?isCanceled:false, 
    });

    const formatedList = [];

    for(const item of schedules){
      const patient = await patientModel.findById({_id: item.patientId }).select({ fullname: 1 });
      const laboratory = await unitModel.findById({_id: item.laboratoryId }).select({ name: 1 });
      const user = await userModel.findById({ _id: item.userId }).select({ fullname: 1 });
      const patientExams = await getSchedulePatientExam(item._id.toString());
      
      formatedList.push({
        id: item._id.toString(),
        createAt: item.dateTime,
        patientName: patient?.fullname as string,
        laboratory: laboratory?.name as string,
        user: user?.fullname as string,
        examQty: patientExams?.exams.length as number,
        status: (item.payment?.status === "pending")?"Pendente":"Confirmado" as string,
      });
    }
    return {
      total: formatedList.length,
      scheduleExams: name?formatedList.filter(props => props.patientName.match(new RegExp(`^${name}`, 'i'))):formatedList,
    }
  }catch(err: unknown){
    return {
      total: 0,
      scheduleExams: [],
      detail: err
    };
  }
}

async function getSchedulePatientExam(scheduleId: string){
  try{
    const schedule = await scheduleExamModel.findById({ _id: scheduleId });
    const patient = await patientModel.findById({ _id: schedule?.patientId }).select({ fullname: 1 });
    const unit = await unitModel.findById({ _id: schedule?.laboratoryId }).select({ name: 1});
    const user = await userModel.findById({ _id: schedule?.userId }).select({fullname: 1});
    const exams = [];
    let totalPrice = 0;
    
    if(!schedule?.exams)
      throw new Error("Erro, id do exame inválido!");

    for(const exam of schedule?.exams){
      const examService = await examModel.findById({_id: exam._id}).select({ price: 1, name: 1 });
      totalPrice += examService?.price as number;

      exams.push({
        id: exam._id?.toString() as string,
        name: examService?.name as string,
        price: examService?.price as number,
      });
    }

    return {
      patient: patient?.fullname,
      laboratory: unit?.name,
      user: user?.fullname,
      exams,
      examPrice: totalPrice?totalPrice:"0",
      detail: schedule?.detail,
      createdAt: getDataAndHoursFormat(schedule?.dateTime as Date),
      _createdAt: schedule?.dateTime,
      laboratoryId: unit?._id.toString(),
      payment: {
        code: schedule?.payment?.invoice?.code as string,
        proof: schedule?.payment?.invoice?.proof as string,
        value: schedule?.payment?.invoice?.value as number,
        status: (schedule?.payment?.status as string) === "pending"?"Pendente":"Confirmado",
        porcentage: schedule?.payment?.invoice?.porcentage as string,
      }
    }
  }finally{}
}

async function archivingScheduleExam(prev: unknown, formData: FormData){
  try{
    const scheduleId = formData.get("scheduleId") as string;
    const reason = (formData.get("reason") as string).trim();
    if(!reason) 
      throw new Error("Escreva um motivo!", { cause: "empty_reason" });

    const cancel = new examCancelModel({
      scheduleId,
      reason,
      userId: (await whoAreYou()) as string, 
    });

    await scheduleExamModel.updateOne({ _id: scheduleId }, { canceled: true });
    
    await cancel.save();

    return {
      message: "Exame cancelado com sucesso!",
      status: true,
    }
  }catch(e: unknown){
    const err = e as Error;
    if(err.cause == "empty_reason")
      return {
        message: err.message,
        status: false,
      }
    return {
      message: "Falha no cancelamento!",
      status: false,
    }
  }
}

async function reschedulePatientExam(prev: unknown, formData: FormData){
  try{
    const isArchived = Boolean(formData.get("isArchived"))
    const scheduleId = formData.get("scheduleId") as string;
    const laboratoryId = formData.get("laboratoryId") as string; 
    const dateTime = formData.get("datatime"); 
    const detail = formData.get("detail") as string;
 
    await scheduleExamModel.updateOne({_id: scheduleId},{
      laboratoryId,
      dateTime,
      canceled:isArchived?false:true,
      detail,
    });

    return {
      message: "Reagendado com sucesso!",
      status: true,
    }
  }catch(err: unknown){

    return {
      message: "Falha no reagendado!",
      status: false,
      detail: err
    }
  }
}

async function signExamResult(prev: unknown, formData: FormData){
  try{
    const id = formData.get("scheduleId") as string;
    const scheduleId = await scheduleExamModel.findById({ _id:id }).select({_id:1});
    const detail = formData.get("result") as string; 
    const userId = await whoAreYou();
    //const resultExists = await examResultModel.findOne({scheduleId})

    const examResult = new examResultModel({
      scheduleId,
      detail,
      userId,
    })

    await scheduleExamModel.updateOne({_id: scheduleId }, { served: true })
    await examResult.save();
    return {
      message: "Resultado do exame foi registrado com sucesso!",
      status: true,
    }
  }catch(e: unknown){
    const err = e as Error;
    if(err.cause === "resultExists")
      return{
        message: err.message,
        status: false
      }
    return {
      message: "Falha no registro",
      status: false,
    }
  }
}

async function getExamResults(){
  return await scheduleExamModel.find({ 
    served: true,
    canceled: false, 
  });

}

async function getExamResult(scheduleId: string){
  const result  = await examResultModel.findOne({scheduleId});
  const user = await userModel.findById({ _id: result?.userId }).select({fullname: 1});

  return {
    user: user?.fullname,
    detail: result?.detail,
    createdAt: getDataAndHoursFormat(result?.createdAt as Date),
  }
}

async function getExamCancel(scheduleId: string){
  const cancel  = await examCancelModel.findOne({ scheduleId });
  const user = await userModel.findById({ _id: cancel?.userId }).select({fullname: 1});

  return {
    user: user?.fullname as string,
    reason: cancel?.reason as string,
    createdAt: getDataAndHoursFormat(cancel?.createdAt as Date),
  }
}

// Agendamentos de Consultas
async function scheduleAppointment(prev: unknown, formData: FormData){
  try{
    const patientId = formData.get("patientId");
    const consultId = formData.get("consultId");
    const doctorId = formData.get("doctorId") as string;
    const doctorDay = new Date(formData.get("date") as string);
    const doctorTime = formData.get("time");
    const detail = formData.get("detail");
     
    const result = await getNumberDoctorAppointment({ doctorId, day: doctorDay });  
    const consult = await examModel.findById({ _id: consultId });

    if(!consult)
      throw new Error('Selecione uma consulta!', { cause: 'consultation_empty'});
    
    if(!result?.hasSpace)
      throw new Error(`Lamentamos, mas o número máximo de agendamentos para ${doctorDay.toLocaleDateString('pt', { dateStyle: 'full' })} foi alcançado. Por favor, escolha uma data diferente!`, { cause: "full" });

    const existingAppointment = await scheduleAppointmentModel.findOne({
      doctorId,
      doctorDay,
      doctorTime,
      served: false,
      canceled: false,
    });

    if(existingAppointment)
      throw new Error("Desculpe, a hora selecionada já foi ocupada!", { cause: "busy" });
    
    const appointment = new scheduleAppointmentModel({
      doctorId,
      doctorDay,
      doctorTime,
      consultId,
      userId: await whoAreYou(),
      patientId,
      detail,
    });

    await patientModel.updateOne({ _id: patientId }, { served: true });
    await appointment.save();

    return {
      message: "Consulta marcada com sucesso!",
      status: true,
    }
  }catch(e: unknown){
    const err = e as Error;

    return {
      message: err.cause ? err.message : "Desculpe, não foi possível realizar o agendamento!",
      status: false,
      detail: err.message
    };
  }
}

async function getScheduleAppointment(scheduleId:string){
  const schedule = await scheduleAppointmentModel.findById({_id:scheduleId});
  const patient = await patientModel.findById({_id:schedule?.patientId}).select({fullname:1});
  const doctor = await getUser(schedule?.doctorId?.toString() as string);
  const user = await getUser(schedule?.userId?.toString() as string);
  const consult = await examModel.findById({ _id: schedule?.consultId });

  return {
    patient: patient?.fullname,
    doctor: doctor.fullname,
    doctorId: doctor._id,
    responsable: user.fullname as string,
    consult: {
      name: consult?.name as string,
      price: consult?.price as number,
    },
    date: {
      pt: getDateInSlashFormat(schedule?.doctorDay as Date),
      en: schedule?.doctorDay as Date,
    },
    hour: schedule?.doctorTime as string,
    payment: {
      code: schedule?.payment?.invoice?.code as string,
      proof: schedule?.payment?.invoice?.proof as string,
      value: schedule?.payment?.invoice?.value as number,
      status: (schedule?.payment?.status as string) === "pending"?"Pendente":"Confirmado",
      porcentage: schedule?.payment?.invoice?.porcentage as string,
    },
    detail: schedule?.detail as string,
    archiving: {
      reason:schedule?.archiving?.reason as string,
    }
  }
}

async function getScheduleAppointments({
  served,
  canceled,
  patientName,
  }:{
    patientName?: string;
    served?: boolean;
    canceled?: boolean;
  }){
  try{ 
    const schedules = await scheduleAppointmentModel.find({
      served: served?served:false,
      canceled: canceled?canceled:false,
    });

    const formatedList = [];

    for(const item of schedules){
      const patient = await patientModel.findById({_id: item.patientId }).select({ fullname: 1 });
      const doctor = await getUser(item.doctorId?.toString() as string);
      const doctorCalendar = await findDoctorCalendar({doctorId: doctor._id, toSchedule: true});
      const doctorRoom = doctorCalendar.find(props => props.day.toISOString().split('T')[0] === item.doctorDay?.toISOString().split('T')[0]);
      
      if(!doctorRoom)
        continue;

      formatedList.push({
        id: item._id.toString(),
        hour: getDateInSlashFormat(item.doctorDay as Date)+' '+item.doctorTime,
        patient: patient?.fullname as string,
        doctor: doctor.fullname as string,
        room: doctorRoom?.room as string,
        status: (item.payment?.status as string) === "pending"?"Pendente":"Confirmado"
      });
    }

    return patientName?formatedList.filter(props => props.patient.match(new RegExp(`^${patientName}`, 'i'))):formatedList;
  }catch(e: unknown){
    const err = e as Error;
    console.log(err.message);
    return [];
  }
}

async function rescheduleAppointment(prev: unknown, formData: FormData){
  try{
    const isArchived = Boolean(formData.get("isArchived"));
    const scheduleId = formData.get("scheduleId") as string;
    const doctorId = formData.get("doctorId") as string;
    const doctorDay = new Date(formData.get("date") as string);
    const doctorTime = formData.get("time") as string;
    const existingAppointment = await scheduleAppointmentModel.findById({_id: scheduleId });

    if(!existingAppointment)
      throw new Error("Desculpe, contacte o seu administrador!", { cause: "not_found" });

    if(existingAppointment?.doctorDay?.getTime() === doctorDay.getTime() && existingAppointment?.doctorId?.toString() === doctorId){
      const verifyAppointment = await scheduleAppointmentModel.findOne({
        doctorId,
        doctorDay,
        doctorTime,
        served: false,
        canceled: false,
      });

      if(verifyAppointment)
        throw new Error("Desculpe, a hora selecionada já foi ocupada!", { cause: "busy" });

      const doctorCalendars = await findDoctorCalendar({ doctorId, exceptDay: doctorDay });
      const currentDay = doctorCalendars.find(({ day })=> day.getTime() === doctorDay.getTime());
      const hour = Number(doctorTime.split(':')[0]);
      const finalHour = Number(currentDay?.finalTime.split(':')[0]);
      const initialHour = Number(currentDay?.initialTime.split(':')[0]);

      if(hour > finalHour || hour < initialHour)
        throw new Error(`Horário inválido, permitido apenas das ${currentDay?.initialTime} até as ${currentDay?.finalTime}`, { cause: "invalid_time"});
      
      await scheduleAppointmentModel.updateOne({ _id: scheduleId }, { 
        doctorTime, 
        userId: await whoAreYou(),
        canceled: isArchived?false:true, 
        doctorReschedule: false,
      });
    }else{
      const result = await getNumberDoctorAppointment({ doctorId, day: doctorDay });

      if(!result?.hasSpace && existingAppointment?.doctorId?.toString() !== doctorId)
        throw new Error(`Lamentamos, mas o número máximo de agendamentos para ${doctorDay.toLocaleDateString('pt', { dateStyle: 'full' })} foi alcançado. Por favor, escolha uma data diferente!`, { cause: "full" });
      
      const verifyAppointment = await scheduleAppointmentModel.findOne({
        doctorId,
        doctorDay,
        doctorTime,
        served: false,
        canceled: false,
      });

      if(verifyAppointment)
        throw new Error("Desculpe, a hora selecionada já foi ocupada!", { cause: "busy" });

      await scheduleAppointmentModel.updateOne({ _id: scheduleId }, {
        doctorId,
        doctorDay,
        doctorTime,
        canceled: isArchived?false:true,
        userId: await whoAreYou(),
        doctorReschedule: false,
      });
    }

    return {
      message: "Consulta reagendada com sucesso!",
      status: true,
    }
  }catch(e: unknown){
    const err = e as Error;

    return {
      message: err.cause ? err.message : "Desculpe, não foi possível realizar o reagendamento!",
      status: false,
    };
  }
}

async function archivingScheduleAppointment(prev: unknown, formData: FormData){
  try{
    const scheduleId = formData.get("scheduleId") as string;
    const isArchived = (formData.get('isArchived') as string) === "true"?true:false;
    const reason = (formData.get("reason") as string)?.trim();
    
    if(isArchived){
      await scheduleAppointmentModel.updateOne({ _id: scheduleId }, { canceled: false });
      
      return {
        message: "Consulta desarquivada com sucesso!",
        status: true,
      }
    }

    if(!reason) 
      throw new Error("Escreva um motivo!", { cause: "empty_reason" });

    await scheduleAppointmentModel.updateOne({ _id: scheduleId }, { 
      canceled: true,
      archiving: {
        reason,
        userId: await whoAreYou(),
      } 
    });

    return {
      message: "Consulta arquivada com sucesso!",
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

async function unArchiving(prev: unknown, formData: FormData){
  try{
    const scheduleId = formData.get("scheduleId") as string;
    const reason = (formData.get("reason") as string).trim();

    if(!reason) 
      throw new Error("Escreva um motivo!", { cause: "empty_reason" });

    const appointment = await scheduleAppointmentModel.findOneAndUpdate({ _id: scheduleId }, { canceled: true });

    if(!appointment) 
      throw new Error("Agendamento não encontrado!", { cause: "not_found" });
    
    const canceledAppointment = new appointmentCancelModel({ 
      scheduleId, 
      reason, 
      userId: await whoAreYou(),
    });

    await canceledAppointment.save();

    return {
      message: "Consulta arquivada com sucesso!",
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

async function getNumberDoctorAppointment({
  doctorId,
  day
}: {
  doctorId: string;
  day: Date;
}){
  /**
   * Buscar a quantidade de agendamentos do medico no determinado mes
   */
  try{
    const calendar = await doctorCalendarModel.findOne({ month: day.getMonth() }).select({ maxSchedule: 1 });
    const appointments = await scheduleAppointmentModel.find({ 
      doctorId,
      served: false,
      canceled: false, 
    });
    const validAppointments = [];
    
    if(!calendar) 
      throw new Error();

    for(const appointment of appointments)
      if(appointment.doctorDay?.getDate() === day.getDate())
        validAppointments.push(appointment);
    
    return {
      appointments: validAppointments,
      maxSpace: calendar?.maxSchedule as number,
      filledSpace: validAppointments.length,
      restSpace: calendar?.maxSchedule as number - validAppointments.length,
      hasSpace: calendar?.maxSchedule as number - validAppointments.length === 0?false:true
    };
  }catch(e: unknown){
    console.log('erro na contagem dos agendamentos', e);
  }
}

async function findDoctorCalendar({
  doctorId,
  toSchedule,
  exceptDay
}: { 
  doctorId: string, 
  toSchedule?: boolean,
  exceptDay?: Date, 
}){
  const currentDoctorCalendar = [];
  const calendars = await doctorCalendarModel.find();
  const validDoctorCalendar = calendars.filter((cal)=>{
    if(cal?.doctors.length){
      if(cal.doctors[0].day?.getFullYear() as number >= new Date().getFullYear()){
        return cal;
      }
    }
  });
  
  for(const calendar of validDoctorCalendar){
    for(const doctor of calendar.doctors){
      if(doctor.doctorId?.toString() === doctorId){
        const appointmentDay = await getNumberDoctorAppointment({ doctorId , day: doctor.day as Date });
        
        if(exceptDay && doctor.day?.getTime() === exceptDay.getTime()){
          currentDoctorCalendar.push({
            doctorId: doctor.doctorId?.toString() as string,
            initialTime: doctor.initialTime as string,
            finalTime: doctor.finalTime as string,
            room: doctor.room as string,
            day: doctor.day as Date,
            availableDoctorSpace: {
              spaces: appointmentDay?.restSpace as number,
            }
          });

          continue;
        }
        
        if(!appointmentDay?.hasSpace && !toSchedule)
          continue;

        currentDoctorCalendar.push({
          doctorId: doctor.doctorId?.toString() as string,
          initialTime: doctor.initialTime as string,
          finalTime: doctor.finalTime as string,
          room: doctor.room as string,
          day: doctor.day as Date,
          availableDoctorSpace: {
            spaces: appointmentDay?.restSpace as number,
          }
        });
      }
    }
  }

  return currentDoctorCalendar;
}

export {
  signExam,
  signExamResult,
  getExams,
  getExam,
  getExamResults,
  getExamResult,
  getExamCancel,
  schedulePatientExam,
  getSchedulePatientExams,
  getScheduleAppointment,
  getScheduleAppointments,
  getSchedulePatientExam,
  reschedulePatientExam,
  updateExamService,
  archivingScheduleExam,
  archivingScheduleAppointment,
  unArchiving,
  signCCG,
  getCCGs,
  getCCG,
  updateCCG,
  scheduleAppointment,
  rescheduleAppointment,
  findDoctorCalendar,
  getNumberDoctorAppointment
};