"use server";

import { 
  getDateInSlashFormat 
} from "@/lib/date-formater";
import { priorityInOperatingRoom } from "@/lib/filters";
import { getUserId } from "@/lib/web-token";
import { surgerySchedulingArea } from "./translator";
import { 
  examModel, 
  patientModel,
  scheduleSugeryModel,
  operatingRoomModel
} from "@/backend/model";
import { getUser } from "@/backend/api/clinical/api";
//import { findDoctorCalendar } from "./scheduling-api";
//import { findDoctorCalendar, getNumberDoctorAppointment } from "./scheduling-api";

async function getPatients({
  name,
  priority,
}:{
  name?: string,
  priority?: string, 
}){
  const formatedList = [];
  const schedule = await scheduleSugeryModel.find();

  for(const items of schedule){
    const patient = await patientModel.findById({_id: items.patientId}).select({fullname: 1});
    const doctor = await getUser(items?.doctorId?.toString() as string);
    const sugeryType = await examModel.findById({_id: items.sugeryType}).select({name: 1});

    formatedList.push({
      id: items.id.toString() as string,
      patient: patient?.fullname as string,
      requestingService: surgerySchedulingArea.find( props => props._id === items.requestingService)?.label as string,
      doctor: doctor.fullname as string,
      infirmary: items.infirmary as string,
      bed: items.bed as string,
      sugeryType: sugeryType?.name.toString() as string,
      date: `${getDateInSlashFormat(items.doctorDay as Date)} ${items.doctorTime}` as string,
      status: items.payment?.status === "confirmed"?"Confirmado":"Pendente" as string,
    })
  }

  return name?priorityInOperatingRoom(formatedList.filter((props)=>props.patient.match(new RegExp(`^${name}`, 'i')))).orderElements:
  priority?priorityInOperatingRoom(formatedList.filter((props)=> props.requestingService === surgerySchedulingArea.find((props)=>props.color === priority)?.label)).orderElements:
  priorityInOperatingRoom(formatedList).orderElements;
}

async function sendPatientToOperatingRoom(prev: unknown, formData: FormData){
  try{
    const scheduleId = formData.get('scheduleId');
    const sugery = await scheduleSugeryModel.findById({_id: scheduleId });
    const service = await examModel.findById({_id: sugery?.sugeryType}).select({price: 1});
    const scheduleInOperatingRoom = await operatingRoomModel.find({ served: false });
    
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

export {
  getPatients,
  sendPatientToOperatingRoom,
  archivingSugery,
  //rescheduleSugery,
}