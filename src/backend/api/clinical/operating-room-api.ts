"use server";

import { 
  getDateInSlashFormat 
} from "@/lib/date-formater";
import { 
  examModel, 
  patientModel,
  scheduleSugeryModel,
} from "@/backend/model";
import { getUser } from "@/backend/api/clinical/api";
import { surgerySchedulingArea } from "./translator";
import { priorityInOperatingRoom } from "@/lib/filters";


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

export {
  getPatients,
}