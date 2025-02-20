"use server";

import { whoIsUser } from "@/lib/web-token";
import { orderByPriority } from "@/lib/filters";
import { 
  patientModel,
  groupModel,
  accessTypeModel,
  // priorityModel,
  triedModel,
  unitModel,
  userModel as clinicalUserModel,
  workplaceModel,
  doctorCalendarModel,
  externalUnitModel,
  urgencyBankModel,
  urgencyServiceModel,
  screeningModel,
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
import { getPatient as mainPatient } from "@/app/backend/api/clinical/api";
type UnitType = "workplace" | "internment" | "laboratory" | "imaging";

async function getPatients({ 
  name,
  priority 
}:patientFilters){
  try{
    const userId = await whoIsUser() as string;
    const user = await clinicalUserModel.findOne({ userId }).select({ serviceId: 1});
    const patients = await triedModel.find({ serviceId: user?.serviceId, served: false });
    const patientList = [];

    for(const patient of patients){
      const patientData = await patientModel.findById({_id: patient.patientId});
      
      if(!patientData) 
        throw new Error(`${patient._id.toString()} this id not found!`);

      const [ patientGroup, accessType, screening ] = await Promise.all([
        groupModel.findOne({ patientId: patientData._id }),
        accessTypeModel.findOne({ patientId: patientData._id }),
        screeningModel.findById({ _id: patient.srcId })
      ]);
      
      let accessTypeLabel = patientAccess.find((props)=>props._id === accessType?.type)?.label;
      let groupLabel = patientGroups.find((props)=>(props._id === patientGroup?.type))?.label;
      
      accessTypeLabel = accessTypeLabel || "Indefinido";
      groupLabel = groupLabel || "Indefinido";
      
      patientList.push({
        id: patientData._id.toString(),
        fullname: patientData.fullname,
        registerNumber: patientData.registerNumber,
        accessType: accessTypeLabel.toUpperCase(),
        createdAt: patientData.createdAt,
        group: groupLabel.toUpperCase(),
        priorityType: priorityToComponent.find((props)=>props._id === screening?.priority)?.label,
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

async function getPatient({ patientId }: {
  patientId: string;
}){
  try{
    const [ 
      patient, 
      personalData 
    ] = await Promise.all([
      triedModel.findOne({ patientId, served: false }),
      mainPatient(patientId)
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
        priority: screening.priority as string
      }
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
    const userId = await whoIsUser();

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
    const userId = await whoIsUser();

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
  type
}:{
  type?: UnitType | UnitType[];
  searchByName?: string;
}){
  try{
    const units = await unitModel.find({
      unitTypeId: type?type:/[a-z]/gi
    });
    
    const handleUnits = units.map((item) => {
      if(!(type instanceof Array)){
        return {
          _id: item._id.toString(),
          id: item._id.toString(),
          name: item.name,
          unitName: item.name,
          label: item.name,
          userId: item.userId?.toString(),
          createAt: item.createdAt,
          type: unitTypes.find(props => props._id === item.unitTypeId)?.label,
          status: "activo",
          user: "#"
        }
      }
    });

    return handleUnits;
  }catch(e){
    console.error(e);
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
      userId: await whoIsUser(),
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
      userId: await whoIsUser(),
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
      actor: await whoIsUser(),
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
      userId: await whoIsUser()
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
      userId: await whoIsUser()
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
    // const typeMedicine = formData.get("typeMedicine") as string;
    
    // const patientId = formData.get("patientId") as string;
    // const state = formData.get("state") as string;
    // const symptoms = formData.get("symptoms") as string;
    // const diseaseData = formData.get("diseaseData") as string;
    // const complementaryExams = formData.get("complementaryExams") as string;
    // const diagnosticHypothesis = JSON.parse(formData.get("cids") as string) as CID[];
    // const others = formData.get("others") as string;
    // const evaluation = formData.get("evaluation") as string;
    // const meals = formData.get("meals") as string;
    // const typeFood = formData.get("typeFood") as string;
    // const waterConsumption = formData.get("waterConsumption") as string;
    // const typeWater = formData.get("typeWater") as string;
    // const diseasesInFamily = formData.get("diseasesInFamily") as string;
    // const description = formData.get("description") as string;
    // const datetime = formData.get("createdAt");
    // const currentState = formData.get("currentState") as string;
    // const diabetes  = formData.get("diabetes");
    // const hypertension = formData.get("hypertension");
    // const tuberculosis = formData.get("tuberculosis"); 
    // const respirationDiseases = formData.get("respiratoryDiseases");
    // const malaria = formData.get("malaria");
    // const tabaccoConsumption = formData.get("tobaccoConsumption") as string;
    // const alcohol = formData.get('alcoholConsumption') as string;
    // const frequency = formData.get("frequency") as string;
    // const alcoholAmount = Number(formData.get("alcoholAmount"));
    // const exercise = formData.get("exercise") as string;
    // const type = formData.get("type") as string;
    // const physicalAmount = Number(formData.get("physicalAmount"));
    // const timeExercise = formData.get("time") as string;
    // const hasPatientUrgencyBank = await urgencyBankModel.findOne({ patientId });
    // const generalClinic = hasPatientUrgencyBank?.anamnesis?.generalClinic;
    
    // const cidCodes = diagnosticHypothesis
    // .filter((diagnostic: CID) => !generalClinic?.diagnosticHypothesis?.includes(diagnostic.code))
    // .map((CID: CID)=> CID.code);

    // const anamnesis = {
    //   generalClinic:{
    //     symptoms: symptoms || generalClinic?.symptoms,
    //     diseaseData: diseaseData || generalClinic?.diseaseData,
    //     complementaryExams: complementaryExams || generalClinic?.complementaryExams,
    //     diagnosticHypothesis: !!cidCodes.length?generalClinic?.diagnosticHypothesis.concat(cidCodes) ?? cidCodes:generalClinic?.diagnosticHypothesis,
    //     others: others || generalClinic?.others,
    //     diseasesInFamily: diseasesInFamily || generalClinic?.diseasesInFamily,
    //     evaluation: evaluation || generalClinic?.evaluation,
    //     eatingHabits: {
    //       meals: meals || generalClinic?.eatingHabits?.meals,
    //       typeFood: typeFood || generalClinic?.eatingHabits?.typeFood,
    //       waterConsumption: waterConsumption || generalClinic?.eatingHabits?.waterConsumption,
    //       typeWater: typeWater || generalClinic?.eatingHabits?.typeWater,
    //     },
    //     hospitalization: {
    //       description: description || generalClinic?.hospitalization?.description,
    //       dateTime: datetime || generalClinic?.hospitalization?.dateTime,
    //       currentState: currentState || generalClinic?.hospitalization?.currentState,

    //     },
    //     diseases: {
    //       diabetes: diabetes ?? generalClinic?.diseases?.diabetes ?? false,
    //       hypertension: hypertension ?? generalClinic?.diseases?.hypertension ?? false,
    //       respirationDiseases: respirationDiseases ?? generalClinic?.diseases?.respirationDiseases ?? false,
    //       tuberculosis: tuberculosis ?? generalClinic?.diseases?.tuberculosis ?? false,
    //       malaria: malaria ?? generalClinic?.diseases?.malaria ?? false,
    //     },
    //     lifeStyle: {   
    //       tabaccoConsumption: tabaccoConsumption ?? generalClinic?.lifeStyle?.tabaccoConsumption ?? "",
    //       alcoholConsumption: {
    //         alcohol: alcohol ?? generalClinic?.lifeStyle?.alcoholConsumption?.alcohol ?? "",
    //         frequency: frequency || generalClinic?.lifeStyle?.alcoholConsumption?.frequency,
    //         amount: alcoholAmount || generalClinic?.lifeStyle?.alcoholConsumption?.amount,
    //       },
    //       physicalActivity: {
    //         exercise: exercise ?? generalClinic?.lifeStyle?.physicalActivity?.exercise ?? "",
    //         type: type || generalClinic?.lifeStyle?.physicalActivity?.type,
    //         amount: physicalAmount || generalClinic?.lifeStyle?.physicalActivity?.amount,
    //         timeExercise: timeExercise || generalClinic?.lifeStyle?.physicalActivity?.timeExercise,
    //       }
    //     }
    //   }
    // }
    
    const patientId = formData.get("patientId") as string;
    const typeClinicalDiary = formData.get("typeClinicalDiary") as string;
    const date = formData.get("createAt") as unknown as Date;
    const description = formData.get("description") as string;

    const hasPatientUrgencyBank = await urgencyBankModel.findOne({ patientId });
    const clinical = hasPatientUrgencyBank?.clinicalDiary;                                

    
    const clinicalDiary = {
      medicineDiary : {
        date: typeClinicalDiary === "diary"?(date ?? clinical?.medicineDiary?.date):clinical?.medicineDiary?.date,
        description: typeClinicalDiary === "diary"?(description ?? clinical?.medicineDiary?.description):clinical?.medicineDiary?.description,
      },
      nursingNotes: {
        date: typeClinicalDiary === "annotation"?date:clinical?.nursingNotes?.date,
        description: typeClinicalDiary === "annotation"?description:clinical?.nursingNotes?.description,
      },
    }
 
    let message = "";

    if(!hasPatientUrgencyBank){
      await urgencyBankModel.create({ patientId, clinicalDiary });
      message = "Informações registradas com sucesso!";
    }else{
      await urgencyBankModel.updateOne({ _id: hasPatientUrgencyBank._id },{ clinicalDiary })
      message = "Informações actualizadas com sucesso!";
    }


    /*let message = "";

    if(!hasPatientUrgencyBank){
      await urgencyBankModel.create({ patientId, anamnesis });
      message = "Informações registradas com sucesso!";
    }else{
      await urgencyBankModel.updateOne({ _id: hasPatientUrgencyBank._id },{ anamnesis })
      message = "Informações actualizadas com sucesso!";
    }*/

    return {
      message,
      status: true,
      state: false,
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
  const patientData = await urgencyBankModel.findOne({ patientId });

  return {
    generalClinic:{
      symptoms: patientData?.anamnesis?.generalClinic?.symptoms as string,
      diseaseData: patientData?.anamnesis?.generalClinic?.diseaseData as string,
      complementaryExams: patientData?.anamnesis?.generalClinic?.complementaryExams as string,
      diagnosticHypothesis: patientData?.anamnesis?.generalClinic?.diagnosticHypothesis as string[],
      others: patientData?.anamnesis?.generalClinic?.others as string,
      evaluation: patientData?.anamnesis?.generalClinic?.evaluation as string,
      diseasesInFamily: patientData?.anamnesis?.generalClinic?.diseasesInFamily as string,
      eatingHabits: {
        meals: patientData?.anamnesis?.generalClinic?.eatingHabits?.meals as string,
        typeFood: patientData?.anamnesis?.generalClinic?.eatingHabits?.typeFood as string,
        waterConsumption: patientData?.anamnesis?.generalClinic?.eatingHabits?.waterConsumption as string,
        typeWater: patientData?.anamnesis?.generalClinic?.eatingHabits?.typeWater as string,
      },
      hospitalization: {
        description: patientData?.anamnesis?.generalClinic?.hospitalization?.description as string,
        dateTime: patientData?.anamnesis?.generalClinic?.hospitalization?.dateTime as Date,
        currentState: patientData?.anamnesis?.generalClinic?.hospitalization?.currentState as string,
      },
      diseases: {
        diabetes: patientData?.anamnesis?.generalClinic?.diseases?.diabetes as boolean,
        hypertension: patientData?.anamnesis?.generalClinic?.diseases?.hypertension as boolean,
        respirationDiseases: patientData?.anamnesis?.generalClinic?.diseases?.respirationDiseases as boolean,
        tuberculosis: patientData?.anamnesis?.generalClinic?.diseases?.tuberculosis as boolean,
        malaria: patientData?.anamnesis?.generalClinic?.diseases?.malaria as boolean,
      },
      lifeStyle: {
        tabaccoConsumption: patientData?.anamnesis?.generalClinic?.lifeStyle?.tabaccoConsumption as string,
        alcoholConsumption: {
          alcohol: patientData?.anamnesis?.generalClinic?.lifeStyle?.alcoholConsumption?.alcohol as string,
          frequency: patientData?.anamnesis?.generalClinic?.lifeStyle?.alcoholConsumption?.frequency as string,
          amount: patientData?.anamnesis?.generalClinic?.lifeStyle?.alcoholConsumption?.amount as number,      
        },
        physicalActivity: {
          exercise: patientData?.anamnesis?.generalClinic?.lifeStyle?.physicalActivity?.exercise as string,
          type: patientData?.anamnesis?.generalClinic?.lifeStyle?.physicalActivity?.type as string,
          amount: patientData?.anamnesis?.generalClinic?.lifeStyle?.physicalActivity?.amount as number,
          timeExercise: patientData?.anamnesis?.generalClinic?.lifeStyle?.physicalActivity?.timeExercise as string,     
        },
      }
    },

    //outras anamneses
  }
}

async function signUrgencyService(prev:unknown, formData:FormData){
  try{
    const label = (formData.get('label') as string)?.trim();
    
    if(!label)
      throw new Error("Campo vazio não é aceite!", { cause: "empty"});

    await urgencyServiceModel.create({  
      label,
      userId: await whoIsUser() 
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

async function getUrgencyServices(){
  const services = await urgencyServiceModel.find();

  return services.map(item => {
    return {
      _id: item._id?.toString() as string,
      label: item.label as string,
      userId: item.userId?.toString() as string,
      isActive: item.isActive as boolean
    }
  });
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
  signUrgencyService,
  getUrgencyService,
  getUrgencyServices,
  getPatient
};