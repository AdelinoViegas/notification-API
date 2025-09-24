"use server";

import { 
  bedNursingModel, 
  hospitalizationModel, 
  inHospitalizeModel, 
  internalServiceModel, 
  nursingModel, 
  patientHospitalizedModel, 
  patientModel, 
  sectionModel, 
  urgencyServiceModel 
} from "@/backend/model";
import { omitUndefined } from "mongoose";
import { getUser } from "@/backend/api/clinical/api";

export async function getPatients({
  page,
  served
}: {
  fullname?: string;
  page: number;
  served?: boolean;
}){
  try{
    const patients = await hospitalizationModel.find(omitUndefined({
      served: served ?? false
    }));

    const formated = [];

    for(const patient of patients){
      const doctor = await getUser(patient.userId?.toString() as string);
      const personalData = await patientModel.findById({ _id: patient.patientId }).select({ fullname: 1 });
      const serviceSource = await urgencyServiceModel.findById({ _id: patient?.fromServiceId })?.select({ label: 1 });
      const reason = await patientHospitalizedModel.findOne({ hospitalizedId: patient?._id }).select({ currentState: 1 });
      const inHospitalized = await inHospitalizeModel.findOne({ patientId: patient.patientId });

      if(inHospitalized){
        const bed = await bedNursingModel.findById({ _id: inHospitalized?.bedId });
        const nursing = await nursingModel.findById({ _id: bed?.nursingId });

        formated.push({
          id: patient?.patientId?.toString() as string,
          service: serviceSource?.label as string ?? "Desconhecido",
          createdAt: patient?.createdAt as Date,
          fullname: personalData?.fullname as string,
          currentState: reason?.currentState as string ?? "Sem motivo",
          user: doctor?.fullname as string,
          processNumber: inHospitalized?.processNumber,
          bed: bed?.bed,
          nursing: nursing?.name
        });

        continue;
      }
     
      formated.push({
        id: patient?.patientId?.toString() as string,
        service: serviceSource?.label as string ?? "Desconhecido",
        createdAt: patient?.createdAt as Date,
        fullname: personalData?.fullname as string,
        currentState: reason?.currentState as string ?? "Sem motivo",
        user: doctor?.fullname as string
      });
    }

    return {
      patients: formated.slice(0, 9),
      availablePages:  formated.length/10,
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
    const nursingName = formData.get("nursingName");
    const bedNumber = formData.get("bed");

    if(sectionName && nursingName){
      const section = await sectionModel.create({ name: sectionName });

      const nursing = await nursingModel.create({
        sectionId: section._id,
        name: nursingName,
        maxBedNumber
      });

      nursingId = nursing._id.toString();
    }else
      if(nursingName){
        const nursing = await nursingModel.create({
          sectionId,
          name: nursingName,
          maxBedNumber
        });

        nursingId = nursing._id.toString();
      }
    
    await bedNursingModel.create({
      internalServiceId: hospitalizationServiceId,
      nursingId,
      bed: bedNumber
    });

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

export async function getNursings(sectionId?: string){
  try{
    const nursings = await nursingModel.find(omitUndefined({ sectionId }));

    return nursings.map(props => ({
      _id: props._id.toString(),
      name: props.name as string,
      label: props.name as string
    }));
  }catch {
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
  }catch {
    return [];
  }
}

export async function getBeds(nursingId?: string){
  try{
    const beds = await bedNursingModel.find(omitUndefined({ nursingId }));
    const formatedBeds = [];

    for (const bed of beds){
      const nursing = await nursingModel.findById({ _id: bed.nursingId });
      const internalService = await internalServiceModel.findById({_id: bed.internalServiceId });
      const section = await sectionModel.findById({ _id: nursing?.sectionId });

      formatedBeds.push({
        id: bed._id.toString(),
        createdAt: new Date(),
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

    return [
      internalService?.name,
      section?.name,
      nursing?.name,
      bed?.bed
    ].join("/");

  }catch(e){
    console.error(e)
  }
}

// export async function getHospitalizeds(nursingId?: string){
//   try{
//     const beds = await bedNursingModel.find(omitUndefined({ nursingId }));
//     const formatedBeds = [];

//     for (const bed of beds){
//       const nursing = await nursingModel.findById({ _id: bed.nursingId });
//       const internalService = await internalServiceModel.findById({_id: bed.internalServiceId });
//       const section = await sectionModel.findById({ _id: nursing?.sectionId });

//       formatedBeds.push({
//         id: bed._id.toString(),
//         createdAt: new Date(),
//         internalService: internalService?.name as string,
//         section: section?.name as string,
//         nursing: nursing?.name as string,
//         bed: bed?.bed as string,
//         _id: bed._id.toString(),
//         label: bed?.bed as string,
//       });
//     }

//     return {
//       beds: formatedBeds,
//       availablePages:  Number(formatedBeds.length/10 < 1 ? 1: formatedBeds.length/10),
//       currentPage: 1,
//       totalItems: formatedBeds.length
//     }
//   }catch (e) {
//     console.error(e);

//     return {
//       beds: [],
//       availablePages: 1,
//       currentPage: 1,
//       totalItems: 1
//     }
//   }
// }