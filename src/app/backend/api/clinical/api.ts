'use server';

import { whoIsUser } from "@/lib/web-token";
import { userModel as managerUserModel } from '@/app/backend/models/manager';
import {
  Responsable,
  Assured,
  Employee,
  Enterprise,  
} from "@/app/backend/api/clinical/types";
import { 
  userModel,
  patientModel,
  groupModel,
  demographyModel,
  responsibleModel,
  accessTypeModel,
  screeningModel,
  triedModel,
  specialtyModel,
} from "@/app/backend/models/clinical";
import { 
  patientAccess,
  patientGroup as patientGroups,
  userCategory
} from "@/app/backend/api/clinical/translator"; 
// import { closePatientProcess } from "@/app/backend/api/clinical/process-api";
import { getGrantedUnitAccess } from "@/app/backend/api/clinical/urgency-bank-api";
import { validatePatientDoc, validatePatientLocation } from "@/lib/regexp";

type ChoosedGroup = Assured | Employee | Enterprise | undefined;

export type patientFilters = {
  name?: string;
  registerNumber?: string;
  priority?: string;
  page?: number;
}

async function getUsers(){  
  const users = await userModel.find();
  const formatedUsers = [];

  for(const user of users){
    const sysUser = await managerUserModel.findById({ _id: user.userId }).select({ password: 0 });
    const workplaces = await getGrantedUnitAccess(user.userId as unknown as string);
    const role = user?.specialtyId?(await specialtyModel.findById({ _id: user.specialtyId }))?.name:"Indefinido";

    formatedUsers.push({
      _id: user?.userId?.toString() as string,
      id: user?.userId?.toString() as string,
      fullname: sysUser?.fullname as string,
      createdAt: user?.createdAt as Date,
      category: user?.categoryId?userCategory.find(item => item._id == user?.categoryId)?.label:"Indefinido",
      categoryId: user.categoryId?.toString() as string,
      role: role,
      roleId: user.specialtyId?.toString() as string,
      workplaces: workplaces.length,
    });
  }

  return formatedUsers;
}

async function getDoctors(){
  const users = await getUsers();
  const doctors = [];
  
  for(const doctor of users){
    if(doctor.categoryId === "doctor")
      doctors.push({
        _id: doctor._id.toString(), 
        label: doctor.fullname,
        createdAt: doctor.createdAt,
        category: doctor.category,
        categoryId: doctor.categoryId.toString(),
        role: doctor.role,
        roleId: doctor.roleId?.toString(),
        workplaces: doctor.workplaces,
      });
  }

  return doctors;
}

async function getUser(userId: string){
  const clinicalUser = await userModel.findOne({ userId });
  const user = await managerUserModel.findById({ _id: userId }).select({ fullname: 1 });
  const userSpecialty = clinicalUser?.specialtyId?(await specialtyModel.findById({ _id: clinicalUser?.specialtyId }))?.name:"";

  return {
    _id: user?._id.toString() as string,
    fullname: user?.fullname as string,
    category:  userCategory.find(item => item._id == clinicalUser?.categoryId)?.label,
    categoryId: clinicalUser?.categoryId?.toString() as string,
    orderNumber: clinicalUser?.orderNumber as number,
    specialtyId: clinicalUser?.specialtyId?.toString() as string,
    specialty: userSpecialty, 
    serviceId: clinicalUser?.serviceId?.toString() as string
  }
}

async function signUser(prev: unknown, formData: FormData){
  try{
    const userId = formData.get("userId") as string;
    const orderNumber = formData.get("orderNumber") as string;
    const officeId = formData.get("officeId") as string;
    const roleId = formData.get("roleId") as string;
    const categoryId = formData.get("categoryId") as string;

    await userModel.create({
      userId,
      orderNumber,
      officeId,
      roleId,
      categoryId,
    });

    return {
      message: "Usuário clínico registrado!",
      status: true,
    };
  }catch(e: unknown){
    const err = e as Error & {code: number};
    console.log(err.code)
    return {
      message: "Falha no registro",
      status: false
    }
  }
}

async function updateUser(prev: unknown, formData: FormData){
  try{
    const userId = formData.get("userId") as string;
    const orderNumber = formData.get("orderNumber") as string;
    const serviceId = formData.get("serviceId") as string;
    const specialtyId = formData.get("specialtyId") as string;
    const categoryId = formData.get("categoryId") as string;  

    await userModel.updateOne({ userId }, {
      orderNumber,
      serviceId,
      specialtyId,
      categoryId
    });
    
    return {
      message: "Actualizado com sucesso!",
      status: true,
    };
  }catch(e: unknown){
    const err = e as Error;

    return {
      message: "Falha na actualização!",
      status: false,
      detail: err.message, 
    }
  }
}

async function signPatient(prev: unknown, formData: FormData){
  try{
    // personal info 
    const patientName = formData.get("patientName") as string;
    const patientBirthDate = formData.get("patientBirthDate") as string;
    const patientAge = formData.get("patientAge") as string;
    const civilState = formData.get("civilState") as string;
    const gender = formData.get("gender") as string;
    const patientTel = formData.get("patientTel") as string;
    const patientDocument = formData.get("patientDocument") as string;
    const language = formData.get("language") as string;

    const patient = new patientModel({
      fullname: patientName,
      birthDate: patientBirthDate,
      age: patientAge,
      civilState,
      gender,
      tel: patientTel,
      documentation: patientDocument,
      lang: language,
      userId: await whoIsUser()
    });

    // locations info
    const nationality = formData.get("nationality") as string;
    const naturality = formData.get("naturality") as string;
    const province = formData.get("province") as string;
    const actualLocation = formData.get("actualLocation") as string;
    const street = formData.get("street") as string; 
    const homeNumber = formData.get("homeNumber") as string;

    const locationDb = new demographyModel({
      patientId: patient._id,
      nationality,
      naturality,
      province,
      actualLocation,
      street,
      homeNumber,
    });

    //responsibles
    const responsibles:Responsable[] = [];

    for(let i = 0; i < 2; i++){
      const fullname = formData.get(`responsibleName${i == 0 ?'':i}`) as string;
      const kinship = formData.get(`kinship${i == 0 ?'':i}`) as string;
      const tel = formData.get(`responsibleTel${i == 0 ?'':i}`) as string;
      
      if(fullname && kinship && tel)
        responsibles.push({
          name: fullname,
          kinship,
          tel,
        });
    };

    const responsiblesDb = new responsibleModel({
      patientId: patient._id,
      responsibles: responsibles,
    });

    // patient group
    const group = formData.get("patientGroup") as string;
    let choosedGroup: ChoosedGroup;

    if(group === "assured"){
      const name = formData.get("nameInsuranceCompany") as string;
      const apolice = Number(formData.get("apoliceNumber"));
      const tel = formData.get("assuredTel") as string;
      const detail = formData.get("asuredDetails") as string;

      choosedGroup = {
        name,
        apolice,
        tel,
        detail
      };
    }else if(group === "enterprise"){
      const name  = formData.get("enterpriseName") as string;
      const passNumber = formData.get("passNumber") as string;
      const role = formData.get("enterpriseFunction") as string;

      choosedGroup = {
        name,
        passNumber,
        role,
      };
    }else if(group === "employee"){
      const passNumber  = formData.get("passNumber") as string;
      const role = formData.get("employeeFunction") as string;
      const workArea = formData.get("serviceArea") as string;
      
      choosedGroup = {
        passNumber,
        role,
        workArea,
      };
    }

    const groupDb = new groupModel({
      patientId: patient._id,
      type: group,
      group: choosedGroup
    });

    // access type
    const accessType = formData.get("accessType");
    let externalUnitId;

    if(accessType === "transferred")     
      externalUnitId = formData.get("externalUnitId");

    const accessTypeDb = new accessTypeModel({
      patientId: patient._id,
      type: accessType,
      externalUnitId,
    });

    await Promise.all([
      patient.validate(),
      locationDb.validate(),
      groupDb.validate(),
      responsiblesDb.validate(),
      accessTypeDb.validate()
    ]);
    
    await Promise.all([
      patient.save(),
      locationDb.save(),
      groupDb.save(),
      responsiblesDb.save(),
      accessTypeDb.save()
    ]);

    return {
      message: "Utente resgistrado com sucesso!",
      status: true,
    };
  }catch(e: unknown){
    const err = e as Error & { code: number };
    console.log(err.message);

    return {
      message: err.cause?err.message:
      err.code?"Desculpe já existe um utente com o este Nº de BI":
      "Falha no registro do utente",
      status: false,
    }
  }
}

async function getPatients({
  fullname,
  served,
  page
}: {
  fullname?: string;
  served?: boolean;
  page: number;
}){
  try{
    const formated = [];
    let patients = await patientModel.find({ 
      served: !!served, 
      fullname: fullname?new RegExp(`^${fullname}`, 'i'):/\w*/ig, 
    }).select({
      fullname: 1,
      createdAt: 1,
      registerNumber: 1,
    });
    let numberOfItems = 10;
    numberOfItems *= page;
    patients = served?patients.reverse():patients;

    for(const patient of patients.slice(numberOfItems - 10, numberOfItems)){
      const patientGroup = await groupModel.findOne({patientId: patient._id});
      const accessType = await accessTypeModel.findOne({patientId: patient._id});
      
      const accessTypeLabel = patientAccess.find((props)=>props._id === accessType?.type)?.label;
      const groupLabel = patientGroups.find((props)=>(props._id === patientGroup?.type))?.label;

      formated.push({
        id: patient._id.toString(),
        fullname: patient.fullname,
        registerNumber: patient.registerNumber,
        accessType: accessTypeLabel?accessTypeLabel.toUpperCase():"Indefinido",
        createdAt: patient.createdAt,
        group: groupLabel?groupLabel.toUpperCase():"Indefinido",
      });
    }

    return {
      patients: formated,
      totalItems: patients.length,
      availablePages: Math.ceil(patients.length /10),
      currentPage: page,
    }
  }catch(err: unknown){
    return {
      patients: [],
      totalItems: 0,
      availablePages: 0,
      currentPage: page,
      detail: err
    }
  }
}

async function getPatient(patientId: string){
  try{
    const personal = await patientModel.findById({ _id: patientId });
    const demography = await demographyModel.findOne({ patientId });
    const responsibles = await responsibleModel.findOne({ patientId });
    const group = await groupModel.findOne({ patientId });
    const accessType = await accessTypeModel.findOne({ patientId });

    return {
      personal: {
        _id: personal?._id.toString() as string,
        fullname: personal?.fullname as string,
        registerNumber: personal?.registerNumber as number,
        birthDate: personal?.birthDate as Date,
        age: personal?.age as number,
        civilState: personal?.civilState as string,
        gender: personal?.gender as string,
        tel: personal?.tel as string,
        documentation: personal?.documentation as string,
        lang: personal?.lang as string,
        served: personal?.served,
      },
      demography: {
        _id: demography?._id.toString() as string,
        nationality: demography?.nationality as string,
        naturality: demography?.naturality as string,
        province: demography?.province as string,
        actualLocation: demography?.actualLocation as string,
        street: demography?.street as string,
        homeNumber: demography?.homeNumber as string,
      },
      responsibles: {
        _id: responsibles?._id.toString() as string,
        responsibles: responsibles?.responsibles
      },
      group: {
        _id: group?._id.toString() as string,
        type: group?.type,
        group: group?.group
      },
      accessType: {
        _id: accessType?._id.toString() as string,
        type: accessType?.type as string,
        externalUnitId: accessType?.externalUnitId,
      }
    };
  }finally{}
}

// update zone
async function updatePersonalInfo(prev:unknown, formData: FormData){
  try{
    const patientId = formData.get("id") as string;
    const fullname = formData.get("fullname") as string;
    const birthDate = formData.get("birthDate");
    const age = Number(formData.get("age"));
    const civilState = formData.get("civilState") as string;
    const gender = formData.get("gender") as string;
    const lang = formData.get("language");
    const tel = formData.get('tel') as string;
    const documentation = formData.get("documentation") as string;

    if(!validatePatientDoc(documentation))
      throw new Error("Formato do documento inválido!", { cause: "incorrect" });

    await patientModel.updateOne({_id: patientId}, {
      fullname,
      birthDate,
      age,
      civilState,
      tel,
      gender,
      documentation,
      lang
    });

    return {
      message: "Actualizado com sucesso!",
      status: true,
    }
  }catch(e: unknown){
    const err = e as Error & { code: number };

    return {
      message: err.code?"Desculpe, já existe um utente com o este documento!":err.cause?err.message:
      "Falha na actualização, contacte o seu administrador!",
      status: false, 
    }
  }
}

async function updateDemography(prev: unknown, formData: FormData){
  try{
    const demographyId = formData.get("id") as string;
    const nationality = formData.get("nationality") as string;
    const naturality = formData.get("naturality") as string;
    const province = formData.get("province") as string;
    const actualLocation = formData.get("actualLocation") as string;
    const municipality = formData.get("municipality");
    const neighborhood = formData.get('neighborhood') as string;
    const street = formData.get("street");
    const homeNumber = formData.get("homeNumber");
    const referencePoint = formData.get("referencePoint");
    if(!validatePatientLocation(actualLocation))
      throw new Error("Formato da localização actual inválida!", { cause: "incorrect" });
    // para update basta apenas a chamada do metodo que já actualiza os dados no banco 
    await demographyModel.updateOne({ _id: demographyId }, {
      nationality,
      naturality,
      province,
      actualLocation,
      municipality,
      neighborhood,
      street,
      homeNumber,
      referencePoint,
    });

    return {
      message: "Actualizado com sucesso!",
      status: true,
    }
  }catch(e: unknown){
    const err = e as Error & { code: number };

    return {
      message:err.cause?err.message:
      "Falha na actualização, contacte o seu administrador!",
      status: false, 
    }
  }
}

async function updateResposible(prev: unknown, formData: FormData){
  try{
    const responsibleId = formData.get("id") as string;
    const name = formData.get('name') as string;
    const kinship = formData.get("kinship") as string;
    const tel = formData.get("tel") as string;
    const name1 = formData.get("name1") as string;
    const kinship1 = formData.get("kinship1") as string;
    const tel1 = formData.get("tel1") as string;
    
    //responsibles
    const responsibles:Responsable[] = [];
    responsibles.push({
      name,
      kinship,
      tel,
    });

    if(name && kinship && tel)
      responsibles.push({
        name: name1,
        kinship: kinship1,
        tel: tel1,
      });

    await responsibleModel.updateOne({ _id: responsibleId }, { responsibles });
   
    return {
      message: "Actualizado com sucesso!",
      status: true,
    }
  }catch(err: unknown){
    return {
      message: "Falha na actualização",
      status: false,
      detail: err
    }
  }
}

async function updatePatientGroup(prev: unknown, formData: FormData){
  try{
    const groupId = formData.get("id") as string; 
    const typeGroup = formData.get("group") as string;
    const patient = await groupModel.findById({ _id: groupId });
    let choosedGroup: ChoosedGroup;
   
    if(typeGroup === "assured"){
      const name = formData.get("name") as string;
      const apolice = Number(formData.get("apolice"));
      const tel = formData.get("tel") as string;
      const detail = formData.get("detail") as string;

      choosedGroup = {
        name,
        apolice,
        tel,
        detail
      };
    }else if(typeGroup === "enterprise"){
      const name  = formData.get("enterpriseName") as string;
      const passNumber = formData.get("passNumber") as string;
      const role = formData.get("enterpriseFunction") as string;

      choosedGroup = {
        name,
        passNumber,
        role,
      };
    }else if(typeGroup === "employee"){
      const passNumber  = formData.get("passNumber") as string;
      const role = formData.get("employeeFunction") as string;
      const workArea = formData.get("serviceArea") as string;
      
      choosedGroup = {
        passNumber,
        role,
        workArea,
      };
    }

    await groupModel.replaceOne({ _id: groupId }, {
      patientId: patient?.patientId,
      type: typeGroup,
      group: choosedGroup?{...choosedGroup}:undefined
    });

    return {
      message: "Actualizado com sucesso!",
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

async function updateAccessType(prev: unknown, formData: FormData){
  try{
    const accessTypeId = formData.get("id");
    const tmpAccessType = await accessTypeModel.findById({ _id: accessTypeId });
    const accessType = formData.get("accessType");
    const externalUnitId = formData.get("externalUnitId");

    await accessTypeModel.replaceOne({ _id: accessTypeId },{
      patientId: tmpAccessType?.patientId,
      type: accessType,
      externalUnitId: accessType === "transferred"?externalUnitId:undefined 
    });
    
    return{
      message: "Actualizado com sucesso!",
      status: true,
    }
  }catch(err: unknown){
    return{
      message: "Falha na actualização",
      status: false,
      detail: err
    }
  }
}

async function putInScreening(prev: unknown, formData: FormData){
  try{
    const patientId = formData.get('patientId');
    const existInScreening = await screeningModel.findOne({ patientId, served: false });

    if(existInScreening)
      if(existInScreening.isArchived)
        throw new Error("Utente está na triagem, mas está arquivado!", { cause: "archived" });
      else
        throw new Error("Utente já em atendimento!", { cause: "exist" });

    const patient = await patientModel.findByIdAndUpdate({_id: patientId}, { served: true });
    
    await screeningModel.create({
      patientId: patient?._id,
      userId: await whoIsUser()
    });

    return {
      message: 'Utente enviado para a Triagem!',
      status: true,
    }
  }catch(e: unknown){
    const err = e as Error & { code: number };
    console.log(err.message);

    return {
      message: err.cause?err.message:err.code?
      "Ja existe!":
      "Falha ao enviar o paciente para a Triagem!",
      status: false,
    }
  }
}

async function changeArchived({
  patientId,
  isArchived
}:{
  patientId: string;
  isArchived: boolean;
}){
  try{
    await screeningModel.updateOne({
      patientId, 
      served: false
    }, {
      isArchived: !isArchived
    });

    return{
      message: !isArchived?"Utente Arquivado com sucesso!":"Utente recuparado com sucesso!",
      status: true,
    }
  }catch(err: unknown){
    return{
      message: "Falha no processo de arquivamento!",
      status: false,
      detail: JSON.stringify(err)
    }
  }
}

async function getPatientsInScreening({
  fullname,
  served,
  isArchived,
  page
}: {
  fullname?: string;
  served?: boolean;
  isArchived?: boolean;
  page: number;
}){
  try{
    const formated = [];
    const patients = await screeningModel.find({ 
      served: !!served,
      isArchived: !!isArchived,  
    });
    let numberOfItems = 10;
    numberOfItems *= page;

    for(const patient of patients.slice(numberOfItems - 10, fullname?patients.length:numberOfItems)){
      const patientData = await patientModel.findById({ 
        _id: patient.patientId,
        fullname: fullname?new RegExp(`^${fullname}`, 'i'):/\w*/ig,  
      });
      
      if(!patientData) 
        throw new Error("Paciente não encontrado!", { cause: "patient_not_found"});
  
      const patientGroup = await groupModel.findOne({patientId: patientData._id});
      const accessType = await accessTypeModel.findOne({patientId: patientData._id});
      const accessTypeLabel = patientAccess.find((props)=>props._id === accessType?.type)?.label;
      const groupLabel = patientGroups.find((props)=>(props._id === patientGroup?.type))?.label;
  
      formated.push({
        id: patientData._id.toString(),
        fullname: patientData.fullname,
        registerNumber: patientData.registerNumber,
        accessType: accessTypeLabel?accessTypeLabel.toUpperCase():"Indefinido",
        createdAt: patientData.createdAt,
        group: groupLabel?groupLabel.toUpperCase():"Indefinido",
      });
    }

    return {
      patients: fullname?formated.filter(props => props.fullname.match(new RegExp(`^${fullname}`, 'i'))):formated,
      totalItems: patients.length,
      availablePages: Math.ceil(patients.length /10),
      currentPage: page,
    }

  }catch(err: unknown){
    
    return {
      patients: [],
      totalItems: 0,
      availablePages: 0,
      currentPage: page,
      detail: err
    }
  }
}

async function getScreening({
  patientId,
  isServed,
  scrId
}:{
  patientId: string;
  isServed?: boolean;
  scrId?: string;
}){
  try{
    const screening = await (
      scrId
      ? screeningModel.findById({ _id: scrId })
      : screeningModel.findOne({ patientId: patientId, served: isServed })
    );

    if(!screening)
      throw new Error("Não foi encontrado nenhuma ficha", { cause: "not_found"});
    
    return {
      _id: screening?._id?.toString() as string,
      patientId,
      reason: screening.reason as string,
      vitalSignals: {
        paMax: screening.vitalSignals?.paMax as number,
        paMin: screening.vitalSignals?.paMin as number,
        jump: screening.vitalSignals?.jump as number,
        pvc: screening.vitalSignals?.pvc as number,
        imc: screening.vitalSignals?.imc as number,
        sp02: screening.vitalSignals?.sp02 as number,
        temperature: screening.vitalSignals?.temperature as number,
        breathing: screening.vitalSignals?.breathing as number,
        weight: screening.vitalSignals?.weight as number,
        height: screening.vitalSignals?.height as number,
        bloodGlucose: screening.vitalSignals?.bloodGlucose as number,
      },
      advice: screening.advice as string,
      priority: screening.priority as string,
      state: screening.state as string,
      isArchived: screening.isArchived as boolean,
      served: screening.served as boolean
    }
  }catch(e){
    const err = e as Error;

    return {
      message: err.cause === "not_found"?err.message:"Erro critico",
      status: false 
    }
  }
}

async function insertScreening(prev: unknown, formData: FormData){
  try{
    const userPayload:{ [key: string]: string } = {};
    const uiType = (formData.get('t') as string)?.trim();
    const patientId = formData.get('Id') as string;
 
    for(const [key, value] of formData.entries()){
      userPayload[key] = value as string;
    }

    userPayload['patientId'] = patientId;
    userPayload['userId'] = (await whoIsUser()) as string;

    if(uiType === "vital-signals"){
      const w = Number(userPayload.weight);
      const h = Number(userPayload.height);
      userPayload['imc'] = (w/(h*h)).toFixed(2);
    }

    await screeningModel.updateOne({
      patientId: patientId,
      served: false
    }, uiType==="vital-signals"
      ?{ 
        vitalSignals: userPayload,
        userId: await whoIsUser(),
        patientId,
      }
      :userPayload
    );

    return {
      message: "Registrado com sucesso!",
      status: true
    }
  }catch(e){
    const err = e as Error;

    return {
      message: "Falha na operação "+err.message,
      status: false,
      type: "error"
    }
  }
}

async function finishScreening(prev: unknown, formData: FormData){
  try{
    const patientId = formData.get('patientId');
    const serviceId = formData.get('serviceId');

    if(!patientId || !serviceId)
      throw new Error("Formato inválido!", { cause: "invalid_request"});

    const scrPatient = await screeningModel.findOne({ patientId, served: false });
    
    if(!scrPatient)
      throw new Error("Opps, ficha não encontrada!", { cause: "not_found"});
    
    if(!scrPatient?.reason)
      throw new Error("Informe o motivo da vinda do Utente!", { cause: "empty"});
    
    if(!scrPatient?.state)
      throw new Error("Informe o estado actual do utente!", { cause: "empty"});

    if(!scrPatient?.priority)
      throw new Error("Escolha a prioridade do utente!", { cause: "empty"});

    const patientExistInUrgency = await triedModel.findOne({
      patientId,
      served: false
    });

    if(patientExistInUrgency)
      throw new Error("Este utente já se encontra no serviço de urgência!", { cause: "in_process"});

    await screeningModel.updateOne({ _id: scrPatient._id }, { 
      served: true,
      userId: await whoIsUser() 
    });

    await triedModel.create({
      srcId: scrPatient?._id,
      patientId,
      userId: await whoIsUser(),
      serviceId
    });

    return {
      message: "Utente triado com sucesso!",
      status: true
    }
  }catch(e){
    const err = e as Error;

    return {
      message: err.cause?err.message:"Opps, algo ocorreu mal!",
      status: false 
    }
  }
}

async function signSpecialty(prev: unknown, formData: FormData){
  try{
    const name = (formData.get('name') as string).toUpperCase();
    if(!name)
      throw new Error("Preencha o nome!", { cause: "empty" });
    
    await specialtyModel.create({ name });

    return {
      message: "Especialidade registrada com sucesso!",
      status: true,
    }
  }catch(e: unknown){
    const err = e as Error;
    
    return {
      message: err.cause?err.message:"Erro!",
      status: false
    }
  }
}

async function getSpecialties(){
  const specialities = await specialtyModel.find();

  return specialities.map(item =>{
    return {
      _id: item._id.toString() as string,
      label: item.name as string,
      name: item.name as string
    }
  });
}

export {
  getUsers,
  getUser,
  getDoctors,
  signUser,
  updateUser,
  signPatient,
  getPatients,
  getPatient,
  getSpecialties,
  updatePersonalInfo,
  updateAccessType,
  updateDemography,
  updatePatientGroup,
  updateResposible,
  putInScreening,
  getPatientsInScreening,
  changeArchived,
  finishScreening,
  signSpecialty,
  getScreening,
  insertScreening
};