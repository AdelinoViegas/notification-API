"use server";

import { whoAreYou } from "@/lib/web-token";
import { orderByPriority } from "@/lib/filters";
import { 
  patientModel,
  groupModel,
  accessTypeModel,
  priorityModel,
  triedModel,
  unitModel,
  userModel as clinicalUserModel,
  workplaceModel,
  doctorCalendarModel,
  externalUnitModel,
  urgencyBankModel,
  // anamnesisModel,
} from "@/app/backend/models/clinical";
import { 
  patientAccess,
  patientGroup as patientGroups, 
} from "@/app/backend/api/clinical/translator"; 
import { DoctorCalendar } from "@/app/backend/api/clinical/types";
import { 
  priorityToComponent,
  unitTypes,
  priority as priorityTranslator
} from "@/app/backend/api/clinical/translator";
import { userModel } from "@/app/backend/models/manager";
import { getUser, patientFilters } from "@/app/backend/api/clinical/api";
import { redirect } from "next/navigation";

type UnitType = "workplace" | "internment" | "laboratory" | "imaging";

async function getPatients({ 
  name,
  priority 
}:patientFilters){
  try{
    const userId = await whoAreYou() as string;
    const user = await clinicalUserModel.findOne({userId}).select({
      officeId: 1,
    });

    const patients = await triedModel.find({ urgencyServices: user?.officeId });
    const patientList = [];

    for(const patient of patients){
      const patientData = await patientModel.findById({_id: patient.patientId});
      
      if(!patientData) 
        throw new Error(`${patient._id.toString()} this id not found!`);
  
      const patientGroup = await groupModel.findOne({patientId: patientData._id});
      const accessType = await accessTypeModel.findOne({patientId: patientData._id});
      let accessTypeLabel = patientAccess.find((props)=>props._id === accessType?.type)?.label;
      let groupLabel = patientGroups.find((props)=>(props._id === patientGroup?.type))?.label;
      const priority = await priorityModel.findOne({patientId: patient.patientId})
      
      accessTypeLabel = accessTypeLabel?accessTypeLabel:"Indefinido";
      groupLabel = groupLabel?groupLabel:"Indefinido";

      patientList.push({
        id: patientData._id.toString(),
        fullname: patientData.fullname,
        registerNumber: patientData.registerNumber,
        accessType: accessTypeLabel.toUpperCase(),
        createdAt: patientData.createdAt,
        group: groupLabel.toUpperCase(),
        priorityType: priorityToComponent.find((props)=>props._id == priority?.priority)?.label,
      });
    }
    
    return name?orderByPriority(patientList.filter((item)=>item.fullname.match(new RegExp(`^${name}`, 'i')))).orderElements:
    priority?orderByPriority(patientList.filter((item)=>item.priorityType === priorityTranslator.find((props)=>props._id === priority)?.label)).orderElements:
    orderByPriority(patientList).orderElements;

  }catch(e: unknown){
    const err = e as Error;
    console.log(err.message);
    return [];
  }
}

async function signUnit(prev: unknown, formData: FormData){
  try{

    const name = formData.get("name") as string;
    const type = formData.get("unitTypeId") as UnitType;
    const userId = await whoAreYou();

    switch(type){
      case "internment": {
        const wing = formData.get("wing");
        const nursing = formData.get("nursing"); 
        const bed = formData.get("bed");
        
        const unit = new unitModel({ 
          name, 
          unitTypeId: type,
          userId, 
          wing,
          nursing,
          bed,
        });

        await unit.save();
        break;
      }
      default: {
        const unit = new unitModel({ 
          name, 
          unitTypeId: type,
          userId, 
        });
        await unit.save();
      }
    }
    
    return {
      message: "Unidade Fisica cadastrado com sucesso!",
      status: true,
    }
  }catch(e: unknown){
    const err = e as Error & {code: number};

    if(err.code)
      return {
        message: "Este unidade já existe!",
        status: false,
      }
    return {
      message: "Erro",
      status: false,
    }
  }
}

async function updateUnit(prev: unknown, formData: FormData){
  try{
    const unitId = formData.get("unitId");
    const name = formData.get("name") as string;
    const type = formData.get("unitTypeId") as UnitType;
    const userId = await whoAreYou();

    switch(type){
      case "internment": {
        const wing = formData.get("wing");
        const nursing = formData.get("nursing"); 
        const bed = formData.get("bed");
        
        await unitModel.findByIdAndUpdate({ _id: unitId }, { 
          name, 
          unitTypeId: type,
          userId, 
          wing,
          nursing,
          bed,
        });

        break;
      }
      default: {
        await unitModel.findByIdAndUpdate({ _id: unitId },{ 
          name, 
          unitTypeId: type,
          userId, 
        });
      }
    }
    
    return {
      message: "Unidade Fisica actualizada com sucesso!",
      status: true,
    }
  }catch(e: unknown){
    const err = e as Error & {code: number};

    if(err.code)
      return {
        message: "Este unidade já existe!",
        status: false,
      }
    return {
      message: "Erro",
      status: false,
      detail: err.message,
    }
  }
}

async function getUnits(
  typeId?: UnitType | UnitType[],
  option?: boolean,
  table?: boolean,
  nameUnit?: string,
){
  if(option){
    const formatedOptions = [];

    if(Array.isArray(typeId)){
      for(const type of typeId){
        // const units = await unitModel.find({ unitTypeId: type });
        for await (const unit of unitModel.find({ unitTypeId: type }))
          formatedOptions.push({
            _id: unit._id.toString(),
            label: unit.name,
          });
      }
    }else {
      for await (const unit of unitModel.find({ unitTypeId: typeId })){
        formatedOptions.push({
          _id: unit._id.toString(),
          label: unit.name,
        });
      }
    }

    return formatedOptions;
  }

  if(table){
    const dataTables = [];
    const units = await unitModel.find();
    
    for(const unit of units){
      const user = await userModel.findById({_id: unit.userId }).select({ fullname: 1 }) as {
        fullname: string;
      };

      dataTables.push({
        id: unit._id.toString(),
        createAt: unit.createdAt,
        unitName: unit.name,
        type: unitTypes.find((item)=>item._id === unit.unitTypeId)?.label,
        user: user.fullname.split(" ")[0],
        status: "activo",
      });
    }
     
    return nameUnit?dataTables.filter(items => items.unitName.match(new RegExp(`^${nameUnit}`, 'i'))):dataTables;
  }
  return await unitModel.find({ unitTypeId: typeId });
}

async function getUnit(unitId: string){
  try{
    const unit = await unitModel.findById({_id: unitId });
    if(!unit)
      throw new Error("Unit not found!", { cause: "not found" });

    return {
      _id: unit._id.toString(),
      name: unit.name,
      unitTypeId: unit.unitTypeId,
      wing: unit.wing,
      nursing: unit.nursing,
      bed: unit.bed,
    };
  }finally{}
}

async function signDoctorCalender(prev: unknown, formData: FormData){
  try{
    const month = Number(formData.get("month"));
    const description = formData.get("description");
    const doctors = JSON.parse(formData.get("doctors") as string) as unknown as DoctorCalendar[];
    const maxSchedule = Number(formData.get("maxSchedule"));
    
    if(!doctors.length)
      throw new Error('Por favor, escale os medicos!', { cause: 'empty'});

    const calendarSignature = new Date(doctors[0].day);
    calendarSignature.setDate(1);

    const doctorCalendar = new doctorCalendarModel({
      description,
      month,
      doctors,
      userId: await whoAreYou(),
      maxSchedule,
      signatureDateTo: calendarSignature.toISOString().split('T')[0],
    });
    
    await doctorCalendar.save();

    return {
      message: "Calendário/Escala dos médicos registrado com sucesso!",
      status: true,
    }
  }catch(e: unknown){
    const err = e as Error & { code: number };

    return {
      message: err.cause?err.message:err.code?
      "O calendário/escala para este mes já foi registrado!":"Falha no registro",
      status: false,
    }
  }
}

async function updateDoctorCalender(prev: unknown, formData: FormData){
  try{
    const description = formData.get("description");
    const doctors = JSON.parse(formData.get("doctors")as string) as unknown as DoctorCalendar[];
    const calendarId = formData.get("calendarId"); 

    await doctorCalendarModel.updateOne({ _id: calendarId }, {
      description,
      doctors,
      userId: await whoAreYou(),
    });

    return {
      message: "Agenda de actualizada com sucesso!",
      status: true,
    }
  }catch(err: unknown){

    return {
      message: "Falha na actualização!",
      status: false,
      detail: err
    }
  }
}

async function getDoctorCalender(calendarId: string){
  try{
    const calendar = await doctorCalendarModel.findById({_id: calendarId});

    if(!calendar)
      throw new Error();

    return {
      description: calendar.description,
      month: calendar.month,
      doctors: calendar.doctors,
      maxSchedule: calendar.maxSchedule,
    }
  }finally{}
}

async function getDoctorCalendars(){
  const calendars = await doctorCalendarModel.find();
  const handleCalendars = [];

  for(const calendar of calendars){
    const handleDoctors = [];
    const creator = await getUser(calendar.userId as unknown as string);

    for(const doctor of calendar.doctors){
      const user = await getUser(doctor.doctorId as unknown as string);
      handleDoctors.push({
        fullname: user.fullname,
        initialTime: doctor.initialTime,
        finalTime: doctor.finalTime,
        room: doctor.room,
      });
    }

    handleCalendars.push({
      month: calendar.month as number,
      monthName: new Date(new Date().getFullYear(), calendar.month as number).toLocaleString('pt-AO', { month: 'long' }),
      creator: creator?.fullname as string,
      doctors: handleDoctors,
      description: calendar.description as string,
      id: calendar._id.toString() as string,
      createdAt: calendar.createdAt,
    });
  }
  
  return handleCalendars;
}

async function grantUnitAccess(formData: FormData){
  try{
    const userId = formData.get("userId");
    const workplaceId = formData.get("workplaceId");
    
    const verifyAccess = await workplaceModel.findOne({ userId, workplaceId });

    if(verifyAccess)
      throw new Error("Accesso já atribuido");

    const workplaceAccess = new workplaceModel({
      userId,
      workplaceId,
      actor: await whoAreYou(),
    });

    await workplaceAccess.save();
  }catch(err: unknown){
    console.log("erro: ", err);
  }finally{
    redirect("/clinical/phisical-unit/user");
  }
}

async function removeUnitAccess(formData: FormData){
  try{
    const userId = formData.get("userId");
    const accessId = formData.get("accessId");
    
    await workplaceModel.deleteOne({ userId, _id: accessId });
  }finally{
    redirect("/clinical/phisical-unit/user");
  }
}

async function getGrantedUnitAccess(userId: string){
  const grantedAccess = await workplaceModel.find({ userId });
  const formatedList = [];

  for(const access of grantedAccess)
    formatedList.push({
      _id: access?._id.toString() as string,
      label: (await unitModel.findById({_id: access?.workplaceId }))?.name as string,
    });

  return formatedList;
}

async function signExternalUnit(prev: unknown, formData: FormData){
  try{
    const name = formData.get('name');
    const street = formData.get('street');
    const municipality = formData.get('municipality');
    const province = formData.get('province');

    if(!name) 
      throw new Error("Informe o nome da unidade!", { cause: "empty" });

    const externalUnit = new externalUnitModel({
      name,
      street,
      municipality,
      province,
      userId: await whoAreYou()
    });

    await externalUnit.save();

    return {
      message: "Unidade externa registrada com sucesso!",
      status: true,
    }
  }catch(e: unknown){
    const err = e as Error;

    return {
      message: err.cause?err.message:"Falha no registro!",
      status: false,
      detail: err.message,
    }
  }
}

async function getExternalUnits({ name }:{ name?: string }){
  const externalUnits = await externalUnitModel.find();
  const formated = [];

  for(const externalUnit of externalUnits)
    formated.push({
      _id: externalUnit._id.toString() as string,
      id: externalUnit._id.toString() as string,
      name: externalUnit.name,
      label: externalUnit.name,
      street: externalUnit.street?externalUnit.street:"Indefinido",
      municipality: externalUnit.municipality?externalUnit.municipality:"Indefinido",
      province: externalUnit.province?externalUnit.province:"Indefinido",
      user: (await userModel.findById({ _id: externalUnit.userId }))?.fullname,
    });
  
  return name?formated.filter((props) => props.name.match(new RegExp(name, 'i'))):formated;
}

async function getExternalUnit(unitId: string){
  try{
    const externalUnit = await externalUnitModel.findById({ _id: unitId });
    if(!externalUnit)
      throw new Error("Unidade externa não encontrada!", { cause: 'not_found' });

    return {
      _id: externalUnit._id.toString() as string,
      name: externalUnit.name,
      street: externalUnit.street,
      municipality: externalUnit.municipality,
      province: externalUnit.province,
      user: (await userModel.findById({ _id: externalUnit.userId }))?.fullname,
    };
  }finally{}
}

async function updateExternalUnit(prev: unknown, formData: FormData){
  try{
    const unitId = formData.get('unitId');
    const name = formData.get('name');
    const street = formData.get('street');
    const municipality = formData.get('municipality');
    const province = formData.get('province');

    if(!name) 
      throw new Error("Informe o nome da unidade!", { cause: "empty" });

    await externalUnitModel.updateOne({ _id: unitId }, {
      name,
      street,
      municipality,
      province,
      userId: await whoAreYou()
    });

    return {
      message: "Unidade externa actualizada com sucesso!",
      status: true,
    }
  }catch(e: unknown){
    const err = e as Error;

    return {
      message: err.cause?err.message:"Falha na actualização!",
      status: false,
      detail: err.message,
    }
  }
}

async function signUrgencyBank(prev: unknown, formData:FormData){
  try{
    const patientId = formData.get("patientId") as string;
    const state = formData.get("state") as string;
    const symptoms = formData.get("symptoms") as string;
    const diseaseData = formData.get("diseaseData") as string;
    const complementaryExams = formData.get("complementaryExams") as string;
    const diagnosticHypothesis = formData.get("diagnosticHypothesis") as string;
    const hasPatientUrgencyBank = await urgencyBankModel.findOne({ patientId })
    const generalClinic = hasPatientUrgencyBank?.anamnesis?.generalClinic;
    
    const anamnesis = {
      generalClinic:{
        symptoms: symptoms || generalClinic?.symptoms,
        diseaseData: diseaseData || generalClinic?.diseaseData,
        complementaryExams: complementaryExams || generalClinic?.complementaryExams,
        diagnosticHypothesis: diagnosticHypothesis || generalClinic?.diagnosticHypothesis
      }
    }

    if(!hasPatientUrgencyBank)
      await urgencyBankModel.create({patientId, anamnesis})
    else 
      await urgencyBankModel.updateOne({ _id: hasPatientUrgencyBank._id },{ anamnesis })
    
    
    return {
      message:"Dado foi cadastrado com sucesso",
      status: true,
      state
    }
  }catch(e: unknown){
    const err = e as Error;

    return {
      message: err.cause?err.message:"Falha na actualização!",
      status: false,
      detail: err.message,
    }
  }
  
}

async function getPatientUrgencyBank(patientId: string){
  try{ 
    return (await urgencyBankModel.findOne({patientId}))?.anamnesis
  }finally{}
}

export {
  getPatients,
  signUnit,
  getUnits,
  updateUnit,
  getUnit,
  signDoctorCalender,
  updateDoctorCalender,
  getDoctorCalender,
  getDoctorCalendars,
  grantUnitAccess,
  getGrantedUnitAccess,
  removeUnitAccess,
  signExternalUnit,
  getExternalUnits,
  getExternalUnit,
  updateExternalUnit,
  signUrgencyBank,
  getPatientUrgencyBank,
};