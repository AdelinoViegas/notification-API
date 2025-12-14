"use server";

import { 
  bedNursingModel, 
  hospitalizationModel, 
  inHospitalizeModel, 
  internalMovimentModel, 
  internalServiceModel, 
  namePatternsModel, 
  nursingModel, 
  // patientHospitalizedModel, 
  patientModel, 
  patientStateModel, 
  sectionModel, 
  urgencyServiceModel 
} from "@/backend/model";
import { omitUndefined } from "mongoose";
import { getUser } from "@/backend/api/clinical/api";
import { getUserId } from "@/lib/web-token";
import { patientStates } from "./translator";

export async function getPatients({
  page,
  served,
  filterByUserId,
  strictQuery
}: {
  fullname?: string;
  page: number;
  served?: boolean;
  filterByUserId?: boolean;
  strictQuery?: boolean; // busca sem a omissão de undefined
}){
  try{
    const queryParams = strictQuery 
      ? {
          served: served ?? false,
          toInternalServiceId: filterByUserId 
            ? (await getUser(await getUserId()))?.internalServiceId
            : undefined
        }
      : omitUndefined({
          served: served ?? false,
          toInternalServiceId: filterByUserId 
            ? (await getUser(await getUserId()))?.internalServiceId
            : undefined
        });

    const patients =  await hospitalizationModel.find(queryParams);
    const formated = [];

    for(const patient of patients){
      const doctor = await getUser(patient.userId?.toString() as string);
      const personalData = await patientModel.findById({ _id: patient.patientId }).select({ fullname: 1 });
      const serviceSource = await urgencyServiceModel.findById({ _id: patient?.fromServiceId })?.select({ label: 1 });
      // const reason = await patientHospitalizedModel.findOne({ hospitalizedId: patient?._id }).select({ currentState: 1 });
      const inHospitalized = await inHospitalizeModel.findOne({ patientId: patient.patientId });
      const patientState = await patientStateModel.findOne({ patientId: patient.patientId });
      const resolvedPatientState = patientState 
        ? patientStates.find(state => state._id === patientState.stateId)?.label
        : "Sem estado"

      if(inHospitalized){
        const bed = await bedNursingModel.findById({ _id: inHospitalized?.bedId });
        const nursing = await nursingModel.findById({ _id: bed?.nursingId });

        formated.push({
          id: patient?.patientId?.toString() as string,
          service: serviceSource?.label as string ?? "Desconhecido",
          createdAt: patient?.createdAt as Date,
          fullname: personalData?.fullname as string,
          currentState: resolvedPatientState,//reason?.currentState as string ?? "Sem motivo",
          user: doctor?.fullname as string,
          processNumber: inHospitalized?.processNumber,
          bed: bed?.bed,
          nursing: nursing?.name,
        });

        continue;
      }
     
      formated.push({
        id: patient?.patientId?.toString() as string,
        service: serviceSource?.label as string ?? "Desconhecido",
        createdAt: patient?.createdAt as Date,
        fullname: personalData?.fullname as string,
        currentState: resolvedPatientState,
        user: doctor?.fullname as string
      });
    }

    return {
      patients: formated.slice(0, 9),
      availablePages: formated.length/10,//formated.length < 11 
        // ? 1
        // : formated.length/10,
      currentPage: page,
      totalItems: formated.length
    }
  }catch (e){
    console.error(e);

    return {
      patients: [],
      availablePages: 1,
      currentPage: 1,
      totalItems: 1
    }
  }
}

export async function signNursing(p: unknown, formData: FormData){
  try{
    const hospitalizationServiceId = formData.get("serviceId");
    const sectionId = formData.get("sectionId") as string;
    const sectionName = formData.get("sectionName") as string;
    const maxBedNumber = formData.get("maxBedNumber");
    let nursingId = formData.get("nursingId") as string;
    const nursingName = formData.get("nursingName") as string;
    const bedNumber = formData.get("bed");

    if(sectionName && nursingName){
      await validateNursingPattern(nursingName);
      const section = await sectionModel.create({ name: sectionName });

      const nursing = await nursingModel.create({
        sectionId: section._id,
        name: nursingName,
        maxBedNumber,
        internalServiceId: hospitalizationServiceId
      });

      nursingId = nursing._id.toString();
    }else
      if(nursingName){
        await validateNursingPattern(nursingName);

        const nursing = await nursingModel.create({
          sectionId,
          name: nursingName,
          maxBedNumber,
          internalServiceId: hospitalizationServiceId
        });

        nursingId = nursing._id.toString();
      }
    
    const allocated = await canAddBedToNursing(nursingId);

    if(!allocated.state) throw new Error(allocated?.message, { cause: 403 });
    
    await bedNursingModel.create({
      internalServiceId: hospitalizationServiceId,
      nursingId,
      bed: bedNumber
    });

    return {
      message: "Cama registrado com sucesso!",
      status: true
    }
  }catch(e) {
    console.error(e);
    const err = e as MongoError;

    return {
      message: err.code === 11000 
        ? "Nº da cama ja existente na enfermaria selecionada!"
        : err.cause 
          ? err.message
          : "Não foi possivel registrar!",
      status: false
    }
  }
}

export async function getNursings({
  sectionId,
  internalServiceId
}: {
  sectionId?: string;
  internalServiceId?: string;
}){
  try{
    const nursings = await nursingModel.find(omitUndefined({ sectionId, internalServiceId }));

    return nursings.map(props => ({
      _id: props._id.toString(),
      name: props.name as string,
      label: props.name as string
    }));
  }catch (e) {
    console.error(e);
    
    return [];
  }
}

export async function getSections(){
  try{
    const section = await sectionModel.find();

    return section.map(props => ({
      _id: props._id.toString(),
      name: props.name as string,
      label: props.name as string
    }));
  }catch {
    return [];
  }
}

export async function signInternalService(p: unknown, formData: FormData){
  try{
    const serviceName = formData.get("name");

    await internalServiceModel.create({ name: serviceName });

    return {
      message: "Registrado com sucesso!",
      status: true
    }
  }catch(e) {
    console.error(e);

    return {
      message: "Não foi possivel registrar!",
      status: false
    }
  }
}

export async function getInternalServices(){
  try{
    const services = await internalServiceModel.find();
    
    return services.map(props => ({
      _id: props._id.toString(),
      name: props.name as string,
      label: props.name as string
    }));
  }catch (e) {
    console.error(e);
    return [];
  }
}

export async function getBeds(nursingId?: string){
  try{
    const beds = await bedNursingModel.find(omitUndefined({ nursingId }));
    const formatedBeds = [];

    for (const bed of beds){
      const nursing = await nursingModel.findById({ _id: bed.nursingId });
      if(!nursing) continue;

      const internalService = await internalServiceModel.findById({_id: bed.internalServiceId });
      if(!internalService) continue;

      const section = await sectionModel.findById({ _id: nursing?.sectionId });
      if(!section) continue; // pula provaveis camas com erro 

      formatedBeds.push({
        id: bed._id.toString(),
        createdAt: bed.createdAt,
        internalService: internalService?.name as string,
        section: section?.name as string,
        nursing: nursing?.name as string,
        bed: bed?.bed as string,
        _id: bed._id.toString(),
        label: bed?.bed as string,
      });
    }

    return {
      beds: formatedBeds,
      availablePages:  Number(formatedBeds.length/10 < 1 ? 1: formatedBeds.length/10),
      currentPage: 1,
      totalItems: formatedBeds.length
    }
  }catch (e) {
    console.error(e);

    return {
      beds: [],
      availablePages: 1,
      currentPage: 1,
      totalItems: 1
    }
  }
}

export async function resolvedBed(id: string){
  try{
    const bed = await bedNursingModel.findById({ _id: id });

    if(!bed)
      throw new Error("bed not found!");

    const service = await internalServiceModel.findById({ _id: bed?.internalServiceId });
    const nursing = await nursingModel.findById({ _id: bed?.nursingId });
    const section = await sectionModel.findById({ _id: nursing?.sectionId });
    
    return {
      internalService: {
        id: service?._id?.toString() as string,
        name: service?.name as string
      },
      section: {
        id: section?._id.toString() as string,
        name: section?.name as string
      },
      nursing: {
        id: nursing?._id.toString() as string,
        name: nursing?.name as string
      },
      bed: {
        id: bed?._id?.toString() as string,
        name: bed?.bed as string
      }
    }
  }catch(e){
    console.error(e);
  }
}

export async function canAddBedToNursing(id: string){
  // id da enfermaria
  try{
    const nursing = await nursingModel.findById({ _id: id });
    
    if(!nursing) throw new Error("Cama não alocada!");
    
    const beds = (await getBeds(id)).totalItems;
    
    if(beds >= nursing.maxBedNumber) throw new Error("Limite de cama atingido!");
    
    return {
      state: true,
      allocatedBed: beds,
      maxAllowed: nursing.maxBedNumber
    }
  }catch(e) {
    console.error(e);
    const err = e as Error;

    return {
      state: false,
      message: err?.message 
    }
  }
}

export async function updateBed(prev: unknown, formData: FormData){
  try{
    const id = formData.get("id") // id da cama;
    const nursingId = formData.get("nursingId") as string;
    const bedName = formData.get("name");

    const bed = await bedNursingModel.findById({ _id: id });

    const allocated = await canAddBedToNursing(nursingId);

    if(!bed) throw new Error("cama não encontrada!");

    if(!allocated.state) throw new Error(allocated.message);

    await bedNursingModel.updateOne({ _id: id }, {
      nursingId,
      bed: bedName
    });

    return {
      message: "Informações atualizadas!",
      status: true
    }
  }catch(e){
    console.error(e);
    const err = e as Error;

    return {
      message: err? err.message : "Não foi possivel atualizar!",
      status: false
    }
  }
}

export async function getTransation(patientId: string){
  try{
    const transation = await hospitalizationModel.findOne({ patientId });
    const urgencyService = await urgencyServiceModel.findById({ _id: transation?.fromServiceId });
    const internalService = await internalServiceModel.findById({ _id: transation?.toInternalServiceId });

    if(!urgencyService || !internalService || !transation)
      throw new Error;

    return {
      source: {
        id: transation.fromServiceId?.toString() as string,
        name: urgencyService.label
      },
      destination: {
        id: transation.toInternalServiceId?.toString() as string,
        name: internalService.name
      }
    }
  }catch (e) {
    console.error(e);

    return null;
  }
}

export async function signToHospitalize(p: unknown, formData: FormData){
  try{
    const patientId = formData.get("patientId");
    const bedId = formData.get("bedId");

    await inHospitalizeModel.create({
      patientId,
      bedId
    });

    await hospitalizationModel.updateOne({ patientId }, { served: true });

    return {
      message: "Registrado com sucesso!",
      status: true
    }
  }catch(e) {
    console.error(e);

    return {
      message: "Não foi possivel registrar!",
      status: false
    }
  }
}

export async function getCurrentLocation(patientId: string){
  try{
    const inHospitalized = await inHospitalizeModel.findOne({ patientId, served: false });

    if(!inHospitalized)
      throw new Error();

    const bed = await bedNursingModel.findById({ _id: inHospitalized.bedId });
    const nursing = await nursingModel.findById({ _id: bed?.nursingId });
    const section = await sectionModel.findById({ _id: nursing?.sectionId });
    const internalService = await internalServiceModel.findById({ _id: bed?.internalServiceId });


    return {
      id: inHospitalized._id.toString() as string,
      ids: {
        internalService: internalService?._id.toString() as string,
        section: section?._id.toString() as string,
        nursing: nursing?._id.toString() as string,
        bed: bed?._id?.toString() as string
      },
      direction:  [
        internalService?.name,
        section?.name,
        nursing?.name,
        bed?.bed
      ].join("/")
    }
  }catch(e){
    console.error(e)
  }
}

export async function movePatientTo(p: unknown, formData: FormData){
  try{
    const patientId = formData.get("patientId") as string;
    const to = formData.get("bedId") as string;

    const [ direction, toBed ] = await Promise.all([
      getCurrentLocation(patientId),
      resolvedBed(to)
    ]); // transação das funções
    
    if(!direction || !toBed)
      throw new Error("critial error");

    if(to === direction.ids.bed)
      throw new Error("Mova o utente para um lugar diferente", { cause: "same"});

    await Promise.all([
      inHospitalizeModel.updateOne({ _id: direction.id }, { bedId: toBed.bed.id }),
      internalMovimentModel.create({
        patientId,
        by: await getUserId(),
        from: direction.ids.bed,
        to
      })
    ]); // transação do movimento

    return {
      message: "Movido com sucesso!",
      status: true
    }
  }catch(e) {
    const err = e as Error;
    console.error(err.message);
    
    return {
      message: err?.cause ? err.message : "Não foi possivel!",
      status: false
    }
  }
}

export async function registerPattern({ value, to }:{
  value: string;
  to: "bed" | "nursing";
}){
  try{
    await namePatternsModel.create({ to, regex: value });
    return true;
  }catch (e){
    return false
  }
}

export async function getPattern(type: "bed" | "nursing") {
  try { 
    const pattern = await namePatternsModel.findOne({ to: type });
    return pattern?.regex;
  }catch (e){
    return null;
  }
}

export async function validatePattern({ value, to }:{
  value: string;
  to: "bed" | "nursing";
}){
  try{
    const regex = await getPattern(to);
    
    if(!regex) 
      throw new Error("padrao nao registrado!");

    const reg = new RegExp(regex);

    if(!reg.test(value))
      return false
    
    return true;
  }catch (e){
    console.error(e);
    return null;
  }
}

export async function validateNursingPattern(name: string){
  const isPossible = await registerPattern({
    value: name,
    to: "nursing"
  });

  if(!isPossible){
    // ja existe um padrao registrado
    const isValide = await validatePattern({
      value: name,
      to: "nursing"
    });

    if(!isValide) 
      throw new Error("O nome da enfermaria nao corresponde ao formato do primeiro registro!", { cause: 400 });
  }
}