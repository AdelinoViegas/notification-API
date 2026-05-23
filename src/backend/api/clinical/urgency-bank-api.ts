"use server";

import { ClientSession, omitUndefined } from "mongoose";
import { getDataAndHoursFormat } from "@/lib/date-formater";
import { getUserId } from "@/lib/web-token";
import { orderByPriority } from "@/lib/filters";
import { 
  patientModel,
  groupModel,
  accessTypeModel,
  triedModel,
  unitModel,
  userModel as clinicalUserModel,
  workplaceModel,
  doctorCalendarModel,
  externalUnitModel,
  urgencyBankModel,
  urgencyServiceModel,
  screeningModel,
  patientHospitalizedModel,
  prescriptionModel,
  surgeryModel,
  processStateModel,
  hospitalizationModel,
  patientStateModel,
  patientExitModel,
  patientWaitingModel,
  inHospitalizeModel
} from "@/backend/model";
import { 
  patientAccess,
  patientGroup as patientGroups,
  patientStates, 
} from "@/backend/api/clinical/translator"; 
import { db } from "@/backend/model";
import { 
  priorityToComponent,
  unitTypes,
  priority as priorityTranslator
} from "@/backend/api/clinical/translator";
import { getUser } from "@/backend/api/clinical/api";
import { DoctorCalendar } from "@/backend/api/clinical/types";
import { getPatient as mainPatient } from "@/backend/api/clinical/api";
import { closePatientProcess, getSyncedHistories, syncPatientRegister } from "@/backend/api/clinical/process-control";
import { createDischargeRecord } from "@/backend/api/clinical/discharge-history-api";

type UnitType = "workplace" | "internment" | "laboratory" | "imaging";

type Props = {
  name?: string;
  priority?: string;
  filterByWaiting?: boolean;
}

async function getPatients({ 
  name,
  priority,
  filterByWaiting
}:Props){
  try{
    const userId = await getUserId() as string;
    const user = await clinicalUserModel.findOne({ userId }).select({ serviceId: 1 });
    const patients = await triedModel.find({ serviceId: user?.serviceId, served: false });
    const patientList = [];
    
    for(const patient of patients){
      const currentUserId = await getUserId();

      const waitingState = await patientWaitingModel.findOne({ id: patient?.patientId });

      if(waitingState && !filterByWaiting) 
        continue;

      if(filterByWaiting && waitingState?.doctorId?.toString() !== currentUserId.toString())
        continue

      const urgency = await patientModel.findById({ _id: patient.patientId });

      const isProcess = await processStateModel.findOne({
         patientId: patient.patientId,
         location: "urgency",
         isInUse: true
      });

      if(isProcess && 
        isProcess.userId?.toString() !== userId && 
        user?.serviceId.toString() !== patient.serviceId?.toString()
      )
        continue;

      if(!urgency) 
        throw new Error(`${patient._id.toString()} this id not found!`);

      const [ patientGroup, accessType, screening ] = await Promise.all([
        groupModel.findOne({ patientId: urgency._id }),
        accessTypeModel.findOne({ patientId: urgency._id }),
        screeningModel.findById({ _id: patient.srcId })
      ]);
      
      let accessTypeLabel = patientAccess.find((props)=>props._id === accessType?.type)?.label;
      let groupLabel = patientGroups.find((props)=>(props._id === patientGroup?.type))?.label;
      
      accessTypeLabel = accessTypeLabel || "Indefinido";
      groupLabel = groupLabel || "Indefinido";
      
      patientList.push({
        id: urgency._id.toString(),
        fullname: urgency.fullname,
        registerNumber: urgency?.registerNumber as number,
        accessType: accessTypeLabel.toUpperCase(),
        createdAt: patient.createdAt,
        group: groupLabel.toUpperCase(),
        priorityType: priorityToComponent.find((props)=>props._id === screening?.priority)?.label,
      });
    }

    const _patients = name?orderByPriority(patientList.filter((item)=>item.fullname.match(new RegExp(`^${name}`, 'i')))).orderElements:
    priority?orderByPriority(patientList.filter((item)=>item.priorityType === priorityTranslator.find((props)=>props._id === priority)?.label)).orderElements:
    orderByPriority(patientList).orderElements;

    return {
      patients: _patients,
      totalItems: _patients.length,
      availablePages: Math.ceil(_patients.length /10),
      currentPage: 1,
    }
  }catch(e){
    console.error(e);

    return {
      patients: [],
      totalItems: 0,
      availablePages: 1,
      currentPage: 1,
    };
  }
}

export async function isWaiting(id: string){
  try{
    const state = await patientWaitingModel.findOne({ id, doctorId: await getUserId() });
    return state ? true : false;
  }catch(e){
    console.error("urgency-bank: ", e);
    return false;
  }
}

export async function patientWaiting(pv: unknown, formData: FormData){
  try{
    const id = formData.get("patientId") as string;
    
    const patient = await patientWaitingModel.findOne({ 
      id, 
      doctorId: await getUserId() 
    });

    if(patient) {
      await patientWaitingModel.deleteOne({ _id: patient._id });

      return {
        message: "Retirado da lista de espera!",
        status: true
      }
    }

    await patientWaitingModel.create({
      id,
      doctorId: await getUserId()
    });

    return {
      message: "Utente colocado em espera!",
      status: true
    }
  }catch (e){
    console.error("urgency-bank: ", e);

    return {
      message: "Opps!!",
      status: false
    }
  }
}

async function getPatient({ patientId }: { patientId: string }){
  try{
    const [ 
      patient, 
      personalData,
      state, 
    ] = await Promise.all([
      triedModel.findOne({ patientId, served: false }),
      mainPatient(patientId),
      urgencyBankModel.findOne({ patientId }).select({ patientStatus: 1})
    ]);
     
    if(!patient || !personalData?.personal.fullname)
      throw new Error("opps!! Esta ficha não existe!", { cause: "not_found"});

    const screening = await screeningModel.findById({ _id: patient.srcId });

    if(!screening)
      throw new Error("Não foi encontrado a ficha de triagem!", { cause: "not_found"});

    return {
      _id: patient._id.toString() as string,
      fullname: personalData.personal.fullname,
      screening: {
        _id: screening._id.toString() as string,
        priority: screening.priority as string,
        reason: screening.reason as string,
        advice: screening.advice as string,
        state: screening.state as string,
        vitalSignals: {}
      }, 
      patientStatus: state?.patientStatus as string,
    }
  }catch(e){
    const err = e as Error;
    return {
      message: err.cause === "not_found"?err.message: "Falha no servidor!"
    }
  }
}

async function signUnit(prev: unknown, formData: FormData){
  try{

    const name = formData.get("name") as string;
    const type = formData.get("unitTypeId") as UnitType;
    const userId = await getUserId();

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
    const userId = await getUserId();

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

async function getUnits({ 
  type,
  searchByName 
}: { 
  type?: UnitType[];
  searchByName?: string;
}){
  try{
    const units = await (
      type
      ?unitModel.find({ 
        unitTypeId: { $in: type },
        name: searchByName?new RegExp(`^${searchByName}`, "i"):/[a-z]/gi 
      })
      :unitModel.find({
        name: searchByName?new RegExp(`^${searchByName}`, "i"):/[a-z]/gi
      })
    );
    
    const formatedList = units.map(item => {
      return {
        _id: item._id.toString(),
        id: item._id.toString(),
        name: item.name,
        unitName: item.name,
        label: item.name,
        userId: item.userId?.toString(),
        createdAt: item.createdAt,
        type: unitTypes.find(props => props._id === item.unitTypeId)?.label,
        status: "activo",
        user: "#"
      }
    });
    
    return formatedList;
  }catch(e){
    console.log(e)
    return [];
  }
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
      userId: await getUserId(),
      maxSchedule,
      signatureDateTo: calendarSignature.toISOString().split('T')[0],
    });
    
    await doctorCalendar.save();

    return {
      message: "Calendário/Escala dos médicos registrado com sucesso!",
      status: true,
    }
  }catch(e){
    const err = e as Error & { code: number };
    console.log(err);

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
      userId: await getUserId(),
    });

    return {
      message: "Agenda actualizada com sucesso!",
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
  try{
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
        id: calendar._id.toString() as string,
        createdAt: calendar.createdAt,
        monthNumber: calendar.month as number,
        monthName: new Date(new Date().getFullYear(), calendar.month as number).toLocaleString('pt-AO', { month: 'long' }),
        creator: creator?.fullname as string,
        doctors: handleDoctors,
        description: calendar.description as string,
      });
    }
    
    return handleCalendars;
  }catch(e){
    console.error(e);
    return []
  }
}

async function addUserWorkplace(prev: unknown, formData: FormData){
  try{
    const userId = formData.get("userId");
    const workplaceId = formData.get("id");
    
    const verifyAccess = await workplaceModel.findOne({ userId, workplaceId });

    if(verifyAccess)
      throw new Error("Accesso já atribuido", { cause: 1 });

    await workplaceModel.create({
      userId,
      workplaceId,
      actor: await getUserId(),
    });

    return { 
      message: "Area de trabalho adicionado!",
      status: true
    }
  }catch(e){
    const err = e as Error;
    
    return { 
      message: err.cause ? err.message: "impossivel",
      status: false
    }
  }
}

export async function removeUserWorkplace(prev: unknown, formData: FormData){
  try{
    const id = formData.get("id");
    
    await workplaceModel.deleteOne({ _id: id });

    return { 
      message: "Area de trabalho adicionado!",
      status: true
    }
  }catch(e){
    const err = e as Error;

    return { 
      message: err.cause ? err.message: "impossivel",
      status: false
    }
  }
}

async function getGrantedUnitAccess(userId: string){
  const grantedAccess = await workplaceModel.find({ userId })
  const formatedList = [];

  for(const access of grantedAccess)
    formatedList.push({
      _id: access?._id.toString() as string,
      label: (await unitModel.findById({_id: access?.workplaceId }))?.name as string,
    });
  
  return formatedList;
}

export async function getUserWorkplaces(){
  const items = await unitModel.find({ unitTypeId: "workplace" });
  const list = [];

  for (const item of items){
    list.push({
      _id: item._id.toString() as string,
      label: item?.name as string,
      name: item?.name as string
    });
  }

  return list;
}

async function signExternalUnit(prev: unknown, formData: FormData){
  try{
    const name = formData.get('name');
    const street = formData.get('street');
    const municipality = formData.get('municipality');
    const province = formData.get('province');

    if(!name) 
      throw new Error("Informe o nome da unidade!", { cause: "empty" });

    await externalUnitModel.create({
      name,
      street,
      municipality,
      province,
      userId: await getUserId()
    });

    return {
      message: "Unidade externa registrada com sucesso!",
      status: true,
    }
  }catch(e){
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
      user: (await getUser(externalUnit?.userId?.toString() as string)).fullname,
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
      user: (await getUser(externalUnit?.userId?.toString() as string)).fullname,
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
      userId: await getUserId()
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
    const payload:{ [key: string]: string } = {};
    
    for(const [key, value] of formData.entries())
      payload[key] = value as string;
    
    const hasPatientUrgencyBank = await urgencyBankModel.findOne({ patientId: payload.patientId });
    const generalClinic = hasPatientUrgencyBank?.anamnesis?.generalClinic;
    const diary = hasPatientUrgencyBank?.clinicalDiary;
    const isDiary = payload.typeClinicalDiary === "diary"; 
    const isAnnotation = payload.typeClinicalDiary === "annotation";
    const isTherapeutic = payload.typeClinicalDiary === "therapeutic";
    const isTreatment = payload.typeClinicalDiary === "treatment";  
    const isVitalSignals = payload.typeClinicalDiary === "vital";  
    const isBalance = payload.typeClinicalDiary === "balance"; 
    const w = Number(payload.weight);
    const h = Number(payload.height);
    const imc = Number((w/(h*h)).toFixed(2));
    
    if(h === 0)
      throw new Error("defina uma altura maior que 0", {cause: "Infinity"});

    const anamnesis = {
      generalClinic: {
        symptoms: payload.symptoms || generalClinic?.symptoms,
        diseaseData: payload.diseaseData || generalClinic?.diseaseData,
        complementaryExams: payload.complementaryExams || generalClinic?.complementaryExams,
        diagnosticHypothesis: payload?.CID?.split(",") || generalClinic?.diagnosticHypothesis,
        others: payload.others || generalClinic?.others,
        diseasesInFamily: payload.diseasesInFamily || generalClinic?.diseasesInFamily,
        evaluation: payload.evaluation || generalClinic?.evaluation,
        eatingHabits: {
          meals: payload.meals || generalClinic?.eatingHabits?.meals,
          typeFood: payload.typeFood || generalClinic?.eatingHabits?.typeFood,
          waterConsumption: payload.waterConsumption || generalClinic?.eatingHabits?.waterConsumption,
          typeWater: payload.typeWater || generalClinic?.eatingHabits?.typeWater,
        },
        diseases: {
          diabetes: payload.diabetes?payload.diabetes === "true" || false:generalClinic?.diseases?.diabetes,
          hypertension: payload.hypertension?payload.hypertension === "true" || false:generalClinic?.diseases?.hypertension,
          respiratoryDiseases: payload.respiratoryDiseases?payload.respiratoryDiseases === "true" || false:generalClinic?.diseases?.respiratoryDiseases,
          tuberculosis: payload.tuberculosis?payload.tuberculosis === "true" || false:generalClinic?.diseases?.tuberculosis,
          malaria: payload.malaria?payload.malaria === "true" || false:generalClinic?.diseases?.malaria,
        },
        lifeStyle: {   
            tabaccoConsumption: payload.tabaccoConsumption || generalClinic?.lifeStyle?.tabaccoConsumption,
            alcoholConsumption: {
              alcohol: payload.alcoholConsumption || generalClinic?.lifeStyle?.alcoholConsumption?.alcohol,
              frequency: payload.frequency || generalClinic?.lifeStyle?.alcoholConsumption?.frequency,
              amount: Number(payload.alcoholAmount) || generalClinic?.lifeStyle?.alcoholConsumption?.amount,
          },
            physicalActivity: {
              exercise: payload.exercise || generalClinic?.lifeStyle?.physicalActivity?.exercise,
              type: payload.type || generalClinic?.lifeStyle?.physicalActivity?.type,
              amount: Number(payload.physicalAmount) || generalClinic?.lifeStyle?.physicalActivity?.amount,
              timeExercise: payload.time || generalClinic?.lifeStyle?.physicalActivity?.timeExercise,
          }
        }
      },
    }
   
    const clinicalDiary = {
      medicalDiary: isDiary?
      [...diary?.medicalDiary || [],{
        date: payload.createAt || undefined,
        description: payload.description || undefined,
      }]:diary?.medicalDiary,

      therapeuticDiary: isTherapeutic?
      [...diary?.therapeuticDiary || [],{
        date: payload.createAt || undefined,
        signature: payload.signature || undefined,
        description: payload.description || undefined,
      }]:diary?.therapeuticDiary,

      treatmentDiary: isTreatment?
      [...diary?.treatmentDiary || [],{
        date: payload.createAt || undefined,
        signature: payload.signature || undefined,
        description: payload.description || undefined,
      }]:diary?.treatmentDiary,

      vitalSignals: isVitalSignals?
      [...diary?.vitalSignals || [],{
        date: payload.createAt || undefined,
        description: payload.description || undefined,
        vitalSignals: {
          paMax: Number(payload.pamax),
          paMin: Number(payload.pamin),
          jump: Number(payload.jump),
          pvc: Number(payload.pvc),
          imc,
          spO2: Number(payload.spO2),
          temperature: Number(payload.temperature),
          breathing: Number(payload.breathing),
          weight: Number(payload.weight),
          height: Number(payload.height),
          bloodGlucose: Number(payload.bloodGlucose),
        }
      }]:diary?.vitalSignals,

      nursingNotes: isAnnotation?
      [...diary?.nursingNotes || [],{
        date: payload.createAt || undefined,
        description: payload.description || undefined,
      }]:diary?.nursingNotes,

      hydromineralBalance: isBalance?
      [...diary?.hydromineralBalance || [],{
        date: payload.createAt || undefined,
        siteOfDrugAdministration: payload.local || undefined,
        amount: payload.amount || undefined,
        hidromineralBalance: payload.balance || undefined,
        description: payload.description || undefined,
      }]:diary?.hydromineralBalance,
    }
    
    if(hasPatientUrgencyBank)
      await urgencyBankModel.updateOne({ _id: hasPatientUrgencyBank._id },{ anamnesis, clinicalDiary });

    return {
      message: "Informação actualizada com sucesso!",
      status: true
    }
  }catch(e){
    const err = e as Error;
    console.error(e);
    return {
      message: err.cause?err.message:"Não foi possivel realizar esta operação!",
      status: false,
      isWarn: err.cause === "empty_hy"
    }
  }
}

async function getPatientUrgencyBank(patientId: string){
  const urgency = await urgencyBankModel.findOne({ patientId, served: false });
  const medicinelDiary:{_id: string, date: string, description: string}[] = [];
  const nursingNotes:{_id:string, date: string, description: string}[] = [];
  const therapeuticDiary:{_id: string, date: string, signature: string, description: string}[] = [];
  const treatmentDiary:{_id: string, date: string, signature: string, description: string}[] = [];
  const vitalSignals:{
    _id: string,
    date: string,  
    description: string,
    vitalSignals: {
      paMax: number,
      paMin: number,
      jump: number,
      pvc: number,
      imc: number,
      spO2: number,
      temperature: number,
      breathing: number,
      weight: number,
      height: number,
      bloodGlucose: number,
    }
  }[] = [];

const hydromineralBalance: {
  _id: string,
  date: string,
  siteOfDrugAdministration: string,
  amount: string,
  hidromineralBalance: string,
  description: string,
}[] = [];

  urgency?.clinicalDiary?.medicalDiary.forEach((value) => {
      medicinelDiary.push({
        _id: value._id.toString(),
        date: getDataAndHoursFormat(value.date as Date),
        description: value.description as string,
      });    
  });

  urgency?.clinicalDiary?.nursingNotes.forEach((value) => {
      nursingNotes.push({
        _id: value._id.toString(),
        date: getDataAndHoursFormat(value.date as Date),
        description: value.description as string,
      });    
  });

  urgency?.clinicalDiary?.therapeuticDiary.forEach((value) => {
      therapeuticDiary.push({
        _id: value._id.toString(),
        date: getDataAndHoursFormat(value.date as Date),
        signature: value.signature as string,
        description: value.description as string,
      });    
  });

  urgency?.clinicalDiary?.treatmentDiary.forEach((value) => {
    treatmentDiary.push({
      _id: value._id.toString(),
      date: getDataAndHoursFormat(value.date as Date),
      signature: value.signature as string,
      description: value.description as string,
    });    
  });

  urgency?.clinicalDiary?.vitalSignals.forEach((value) => {
    vitalSignals.push({
       _id: value._id.toString(),
        date: getDataAndHoursFormat(value.date as Date),
        description: value.description as string,
        vitalSignals: {
          paMax: value.vitalSignals?.paMax as number,
          paMin: value.vitalSignals?.paMin as number,
          jump: value.vitalSignals?.jump as number,
          pvc: value.vitalSignals?.pvc as number,
          imc: value.vitalSignals?.imc as number, 
          spO2: value.vitalSignals?.spO2 as number,
          temperature: value.vitalSignals?.temperature as number,
          breathing: value.vitalSignals?.breathing as number,
          weight: value.vitalSignals?.weight as number,
          height: value.vitalSignals?.height as number,
          bloodGlucose: value.vitalSignals?.bloodGlucose as number,
        }
      });    
  });
  
  urgency?.clinicalDiary?.hydromineralBalance.forEach((value) => {
    hydromineralBalance.push({
       _id: value._id.toString(),
        date: getDataAndHoursFormat(value.date as Date),
        siteOfDrugAdministration: value.siteOfDrugAdministration as string,
        amount: value.amount as  string,
        hidromineralBalance: (value.hidromineralBalance === "ingested"?"ingeridos":"eliminados") as string,
        description: value.description as string,
      });    
  });

  return {
    id: urgency?._id.toString() as string,
    generalClinic:{
      symptoms: urgency?.anamnesis?.generalClinic?.symptoms as string,
      diseaseData: urgency?.anamnesis?.generalClinic?.diseaseData as string,
      complementaryExams: urgency?.anamnesis?.generalClinic?.complementaryExams as string,
      diagnosticHypothesis: urgency?.anamnesis?.generalClinic?.diagnosticHypothesis as string[],
      others: urgency?.anamnesis?.generalClinic?.others as string,
      evaluation: urgency?.anamnesis?.generalClinic?.evaluation as string,
      diseasesInFamily: urgency?.anamnesis?.generalClinic?.diseasesInFamily as string,
      eatingHabits: {
        meals: urgency?.anamnesis?.generalClinic?.eatingHabits?.meals as string,
        typeFood: urgency?.anamnesis?.generalClinic?.eatingHabits?.typeFood as string,
        waterConsumption: urgency?.anamnesis?.generalClinic?.eatingHabits?.waterConsumption as string,
        typeWater: urgency?.anamnesis?.generalClinic?.eatingHabits?.typeWater as string,
      },
      diseases: {
        diabetes: urgency?.anamnesis?.generalClinic?.diseases?.diabetes as boolean,
        hypertension: urgency?.anamnesis?.generalClinic?.diseases?.hypertension as boolean,
        respirationDiseases: urgency?.anamnesis?.generalClinic?.diseases?.respiratoryDiseases as boolean,
        tuberculosis: urgency?.anamnesis?.generalClinic?.diseases?.tuberculosis as boolean,
        malaria: urgency?.anamnesis?.generalClinic?.diseases?.malaria as boolean,
      },
      lifeStyle: {
        tabaccoConsumption: urgency?.anamnesis?.generalClinic?.lifeStyle?.tabaccoConsumption as string,
        alcoholConsumption: {
          alcohol: urgency?.anamnesis?.generalClinic?.lifeStyle?.alcoholConsumption?.alcohol as string,
          frequency: urgency?.anamnesis?.generalClinic?.lifeStyle?.alcoholConsumption?.frequency as string,
          amount: urgency?.anamnesis?.generalClinic?.lifeStyle?.alcoholConsumption?.amount as number,      
        },
        physicalActivity: {
          exercise: urgency?.anamnesis?.generalClinic?.lifeStyle?.physicalActivity?.exercise as string,
          type: urgency?.anamnesis?.generalClinic?.lifeStyle?.physicalActivity?.type as string,
          amount: urgency?.anamnesis?.generalClinic?.lifeStyle?.physicalActivity?.amount as number,
          timeExercise: urgency?.anamnesis?.generalClinic?.lifeStyle?.physicalActivity?.timeExercise as string,     
        },
      }
    },

    clinicalDiary: {
      medicinelDiary,
      nursingNotes,
      therapeuticDiary,
      treatmentDiary,
      vitalSignals,
      hydromineralBalance
    }
  }


}

async function signUrgencyService(prev:unknown, formData:FormData){
  try{
    const label = (formData.get('label') as string)?.trim();
    
    if(!label)
      throw new Error("Campo vazio não é aceite!", { cause: "empty"});

    await urgencyServiceModel.create({  
      label,
      userId: await getUserId() 
    });

    return {
      message: "Serviço de Urgência registrado com sucesso!",
      status: true
    }
  }catch(e){
    const err = e as Error & { code: number };

    return {
      message: !!err.code?"Este serviço ja existe!":err.message,
      status: false
    }
  }
}

async function getUrgencyServices(name?: string){
  const services = await urgencyServiceModel.find();

  const urgencyServicies = services.map(item => {
    return {
      _id: item._id.toString() as string,
      id: item._id.toString() as string,
      label: item.label as string,
      userId: item.userId?.toString() as string,
      isActive: item.isActive as boolean
    }
  });

  return name?urgencyServicies.filter( props => props.label.match(new RegExp(name, 'i'))):urgencyServicies;
}

async function getUrgencyService(serviceId: string){
  try{
    const service = await urgencyServiceModel.findById({ _id: serviceId });
    if(!service)
      throw new Error("serviço não encontrado!", { cause: "not_found" });

    return {
      _id: serviceId,
      label: service.label as string,
      userId: service.userId?.toString() as string
    }
  }catch(e){
    const err = e as Error;

    return {
      message: err.cause?err.message:"Erro critico",
      status: false 
    }
  }
}

async function finishHospitalization(prev: unknown, formData: FormData){
  try{
    const userId = await getUserId();
    const description = formData.get("description");
    const donedAt = formData.get("donedAt") as string;
    const currentState = formData.get("currentState") as string;
    const patientId = formData.get("patientId") as string;
    const internalServiceId = formData.get("serviceId");
    const patientState = await getPatientState(patientId);

    if(!patientState) 
      throw new Error("Por favor, defina o estado do utente!", { cause: 404 });
    
    // validação do estado para internamento
    if(!["critical", "serious", "moderate"].includes(patientState._id))
      throw new Error("Lamentamos, mas este utente não aprensenta um estado clínico válido para internar!", { cause: 404 });
    
    const urgencyId = (await getPatientUrgencyBank(patientId))?.id;
    const patient = await getSyncedHistories(patientId);
    const lastPatientId = patient?.secondaries.pop();
    const urgency = await urgencyBankModel.findById({ _id: urgencyId });
    
    await db.transaction(async (session) =>{
      const hospitalizedPatient = await hospitalizationModel.findOne({ patientId: lastPatientId }).session(session);
      const tried = await triedModel.findOneAndUpdate({ _id: urgency?.triedId }, { served: true }, { session, new: true });

      if(hospitalizedPatient)
        throw new Error("Este utente ja se encontra no internamento!");

      if(!tried)
        throw new Error("Este utente não foi encontrado na triagem!");

      await urgencyBankModel.updateOne({ 
        _id: urgencyId 
      }, { served: true }, { session });

      const [ hospitalized ] = await hospitalizationModel.create([{
        fromServiceId: tried.serviceId,
        toInternalServiceId: internalServiceId,
        userId,
        triedId: urgency?.triedId,
        patientId
      }], {session});

      await patientHospitalizedModel.create([{
        hospitalizedId: hospitalized._id,
        urgencyId: urgency?._id,
        userId,
        description,
        donedAt,
        currentState
      }], { session });

      await syncPatientRegister(patientId, session);
      await closePatientProcess(tried.patientId?.toString() as string, "urgency", session);
    });
    
    return {
      message: "Patiente internado com sucesso!",
      status: true
    }
  }catch (e) {
    const err = e as Error;
    console.error(err);

    return {
      message: err.cause ? err.message : "Não foi possivel finalizar!",
      status: false
    }
  }
}

export async function closePatientInUrgency(patientId: string, session?: ClientSession){
  try{
    const urgencyId = (await getPatientUrgencyBank(patientId))?.id;
    const urgency = await urgencyBankModel.findById({ _id: urgencyId });

    await Promise.all([
      triedModel.updateOne({ _id: urgency?.triedId }, { served: true }, { session }),
      urgencyBankModel.updateOne({ _id: urgencyId }, { served: true }, { session }),
      closePatientProcess(patientId, "urgency", session)
    ]);
    
    return true;
  }catch (e) {
    console.error("close urgency: ", e);
    return false;
  }
}
async function addPrescription(p: unknown, form: FormData){
  try{
    const description = form.get("description");
    const makedAt = form.get("makedAt");
    const prescriptionId = form.get("id");
    const patientId = form.get("patientId");

    const hasData = prescriptionId 
      ? await prescriptionModel.findOneAndUpdate({ _id: prescriptionId }, {
          makedAt,
          description,
          patientId
        })
      : null

    if(!hasData)
      await prescriptionModel.create({
        makedAt,
        description,
        patientId,
        userId: await getUserId()
      });
    
    return {
      message: "Salvo com sucesso!",
      status: true
    }
  }catch (e){
    console.error(e);

    return {
      message: "Não foi possivel",
      status: false
    }
  }
}

async function getPrescriptions({
  from,
  to,
  patientId
}: {
  from?: string;
  to?: string;
  patientId: string;
}){
  try{
    const filter = omitUndefined({ 
      patientId,
      makedAt: (to && from) ? {
        $lte: to,
        $gte: from
      }: undefined
    });
    
    const prescriptions = await prescriptionModel.find(filter);

    return prescriptions.map(e => ({ 
      _id: e._id?.toString() as string,
      makedAt: e.makedAt,
      description: e.description
    }));
  } catch {
    return [];
  }
}

async function getPrescription(id: string){
  const prescription = await prescriptionModel.findById({ _id: id });
  return {
    _id: prescription?._id?.toString() as string,
    description: prescription?.description as string,
    makedAt: prescription?.makedAt as Date
  }
};

async function requestSurgery(p: unknown, formData: FormData){
  try{
    const patientId = formData.get("patientId") as string;
    const description = formData.get("description") as string;
    
    await surgeryModel.create({
      userId: await getUserId(),
      description,
      patientId
    });

    return {
      message: "Solicitação enviada!",
      status: true
    }
  }catch {
    return {
      message: "operação impossivel",
      status: false
    }
  }
}

async function getSurgery({ id }:{ id?: string }){
  try{
    const filter = omitUndefined({ _id: id });

    const surgeries = (await surgeryModel.find(filter)).map((e) => ({
      _id: e._id.toString(),
      description: e.description,
      state: e.state,
      createdAt: e.createdAt,
      doctor: "Não assinado" 
    }));

    return surgeries;
  }catch {
    return [];
  }
}

async function applyDischarge(p:unknown, formdata:FormData){
  try{
    const patientId = formdata.get("patientId") as string;
    const userMakedAt = formdata.get("makedAt");
    const dischargeKind = (formdata.get("kind") as string) ?? "hospital";
    const reason = formdata.get("reason") as string;
    const userId = await getUserId();
    const recoveredPatient = await patientStateModel.findOne({ patientId , stateId: "recovered" });

    if(!recoveredPatient)
      throw new Error("defina o estado do paciente para recuperado", { cause: "recovered" });

    await db.transaction(async (session) => {
      // fechar ciclo na urgência
      await triedModel.updateOne({
        userId,
        patientId,
        served: false
      }, {
        served: true
      }, { session });

      await closePatientProcess(patientId, "urgency", session);

      // fechar ciclo de internamento — libertar cama/leito
      await inHospitalizeModel.updateOne(
        { patientId, served: false },
        { served: true },
        { session }
      );

      await hospitalizationModel.updateOne(
        { patientId, served: true },
        { served: true },
        { session }
      );

      await closePatientProcess(patientId, "hospitalization", session);

      // sincronizar e criar registo de saída
      await syncPatientRegister(patientId, session);
      const id = (await getSyncedHistories(patientId, session))?.id as string;

      const [ exitRecord ] = await patientExitModel.create([{
        patientId: id,
        userId,
        userEventAt: userMakedAt,
        lockProfileState: true,
        where: "high"
      }], { session });

      // criar registo automático no histórico de altas
      await createDischargeRecord({
        patientId,
        dischargeDate: userMakedAt ? new Date(userMakedAt as string) : new Date(),
        dischargeType: dischargeKind,
        reason: reason || undefined,
        userId,
        patientExitId: exitRecord._id.toString(),
        session,
      });
    });

    return {
      message: "Alta registrada com sucesso!",
      status: true
    }
  }catch (err: unknown){
    const error = err as Error;

    return {
      message: error.cause ? error.message : "Não foi possivel finalizar!",
      status: false
    }
  }
}

async function updateUrgencyServices(prev: unknown, formData:FormData){
  try{
    const serviceId = formData.get("serviceId") as string;
    const serviceName = formData.get("serviceName") as string;
    
    await urgencyServiceModel.updateOne({_id: serviceId }, {label: serviceName});

    return {
      message: "Serviço actualizado com sucesso!",
      status: true,
    }
  }catch(err: unknown){
    const error = err as Error;
    return {
      message: error.message,
      status: false,
    }
  }
}

async function movementInUrgencyBank(prev: unknown, formData: FormData){
  try{
    const patientId = formData.get("patientId");
    const serviceId = formData.get("urgencyService");
    const reasonChangingServices = formData.get("reason");
    const service = await triedModel.findOne({ patientId, served: false });

    if(!serviceId)
      throw new Error("Escolha um serviço de urgência", {cause: "empty"});
    
    if(serviceId === service?.serviceId?.toString())
      throw new Error("Escolha um serviço diferente do actual", {cause: "currentService"});

    await db.transaction(async (session) => {
      await processStateModel.updateOne({ patientId, location: "urgency" }, { isInUse: false }, { session });
      await triedModel.updateOne({ patientId, served: false }, { serviceId, reasonChangingServices }, { session });
    });

    return {
      message: "Serviço alterado com sucesso!",
      status: true
    }
  }catch (e) {
    const err = e as Error;

    return {
      message: err.cause ? err.message : "Não foi possivel finalizar!",
      status: false
    }
  }
}

async function definePatientState(prev: unknown, formData: FormData){
  try{
    const patientId = formData.get("patientId");
    const stateId = formData.get("stateId");

    const state = await patientStateModel.findOneAndUpdate({ patientId }, { stateId });
    
    if(!state){
      await patientStateModel.create({
        patientId,
        stateId
      });

      return {
        message: "Estado do utente registrado!",
        status: true
      }
    }

    return {
      message: "Estado atualizado com sucesso!",
      status: true
    }
  }catch (e) {
    const err = e as Error;
    console.error(e);

    return {
      message: err.cause ? err.message : "Não foi possivel finalizar!",
      status: false
    }
  }
}

async function getPatientState(patientId: string){
  try{
    const state = await patientStateModel.findOne({ patientId });

    if(!state) 
      return null;

    const resolvedState = patientStates.find(e => e._id === state.stateId);

    if(!resolvedState)
      return null;

    return resolvedState;
  }catch (e){
    console.error(e);

    return null;
  }
}

async function updateClinicalDiary(prev: unknown, formData:FormData){
  try{
    const payload:{ [key: string]: string } = {};
    
    for(const [key, value] of formData.entries())
      payload[key] = value as string;
    
    const hasPatientUrgencyBank = await urgencyBankModel.findOne({ patientId: payload.patientId });
    const isVitalSignals = payload.typeClinicalDiary === "vital";
    const isBalance = payload.typeClinicalDiary === "balance";
    const w = Number(payload.weight);
    const h = Number(payload.height);
    const imc = Number((w/(h*h)).toFixed(2));
     
    if(h === 0)
      throw new Error("defina uma altura maior que 0", {cause: "Infinity"});

    if(!hasPatientUrgencyBank)
      throw new Error("Dados inexistentes", {cause: "inexistent"})

    const diaryTwoFields: Record<string, string> = {
      diary: "medicalDiary",
      annotation: "nursingNotes",
    };

    const diaryThreeFields: Record<string, string> = {
      therapeutic: "therapeuticDiary",
      treatment: "treatmentDiary",
    };

    const firstDiaries = diaryTwoFields[payload.typeClinicalDiary];
    const secondDiaries = diaryThreeFields[payload.typeClinicalDiary];

    if (firstDiaries) {
      await urgencyBankModel.updateOne(
        { _id: hasPatientUrgencyBank._id },
        {
          $set: {
            [`clinicalDiary.${firstDiaries}.$[entry].date`]: payload.createAt,
            [`clinicalDiary.${firstDiaries}.$[entry].description`]: payload.description,
          },
        },
        {
          arrayFilters: [{ "entry._id": payload.diaryId }],
        }
      );
    }else if (secondDiaries) {
      await urgencyBankModel.updateOne(
        { _id: hasPatientUrgencyBank._id },
        {
          $set: {
            [`clinicalDiary.${secondDiaries}.$[entry].date`]: payload.createAt,
            [`clinicalDiary.${secondDiaries}.$[entry].signature`]: payload.signature,
            [`clinicalDiary.${secondDiaries}.$[entry].description`]: payload.description,
          },
        },
        {
          arrayFilters: [{ "entry._id": payload.diaryId }],
        }
      );
    }else if (isVitalSignals) {
      await urgencyBankModel.updateOne(
        { _id: hasPatientUrgencyBank._id },
        {
          $set: {
            [`clinicalDiary.vitalSignals.$[entry].date`]: payload.createAt,
            [`clinicalDiary.vitalSignals.$[entry].description`]: payload.description,
            [`clinicalDiary.vitalSignals.$[entry].vitalSignals.paMax`]: payload.paMax,
            [`clinicalDiary.vitalSignals.$[entry].vitalSignals.paMin`]: payload.paMin,
            [`clinicalDiary.vitalSignals.$[entry].vitalSignals.jump`]: payload.jump,
            [`clinicalDiary.vitalSignals.$[entry].vitalSignals.imc`]: imc,
            [`clinicalDiary.vitalSignals.$[entry].vitalSignals.temperature`]: payload.temperature,
            [`clinicalDiary.vitalSignals.$[entry].vitalSignals.breating`]: payload.breathing,
            [`clinicalDiary.vitalSignals.$[entry].vitalSignals.weight`]: payload.weight,
            [`clinicalDiary.vitalSignals.$[entry].vitalSignals.height`]: payload.height,
            [`clinicalDiary.vitalSignals.$[entry].vitalSignals.spO2`]: payload.spO2,
            [`clinicalDiary.vitalSignals.$[entry].vitalSignals.pvc`]: payload.pvc,
            [`clinicalDiary.vitalSignals.$[entry].vitalSignals.bloodGlucose`]: payload.bloodGlucose,
          },
        },
        {
          arrayFilters: [{ "entry._id": payload.diaryId }],
        }
      );
    }else if (isBalance) {
      await urgencyBankModel.updateOne(
        { _id: hasPatientUrgencyBank._id },
        {
          $set: {
            [`clinicalDiary.hydromineralBalance.$[entry].date`]: payload.createAt,
            [`clinicalDiary.hydromineralBalance.$[entry].siteOfDrugAdministration`]: payload.local,
            [`clinicalDiary.hydromineralBalance.$[entry].amount`]: payload.amount,
            [`clinicalDiary.hydromineralBalance.$[entry].hidromineralBalance`]: payload.balance,
            [`clinicalDiary.hydromineralBalance.$[entry].description`]: payload.description,
          },
        },
        {
          arrayFilters: [{ "entry._id": payload.diaryId }],
        }
      );
    }

    return {
      message: "Diario clínico actualizado com sucesso!",
      status: true
    }

  }catch(e: unknown){
    const error = e as Error;

    return {
      message: error.cause?error.message:"Impossivel actualizar",
      status: false
    }
  }
}

export {
  finishHospitalization,
  getPatients,
  signUnit,
  getUnits,
  updateUnit,
  getUnit,
  signDoctorCalender,
  updateDoctorCalender,
  getDoctorCalender,
  getDoctorCalendars,
  addUserWorkplace,
  getGrantedUnitAccess,
  signExternalUnit,
  getExternalUnits,
  getExternalUnit,
  updateExternalUnit,
  updateClinicalDiary,
  signUrgencyBank,
  getPatientUrgencyBank,
  signUrgencyService,
  getUrgencyService,
  getUrgencyServices,
  updateUrgencyServices,
  getPatient,
  addPrescription,
  getPrescriptions,
  requestSurgery,
  getSurgery,
  applyDischarge,
  getPrescription,
  movementInUrgencyBank,
  definePatientState,
  getPatientState
};