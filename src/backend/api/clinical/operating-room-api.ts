"use server";

import {priorityInOperatingRoom } from "@/lib/filters";
import { getUserId } from "@/lib/web-token";
import { surgerySchedulingArea } from "./translator";
import { 
  examModel, 
  patientModel,
  scheduleSugeryModel,
  operatingRoomModel,
  processStateModel,
} from "@/backend/model";
import { getUser } from "@/backend/api/clinical/api";
import { calculateAge } from "@/lib/calculate-age";

async function getPatients({
  name,
  served,
  priority,
}:{
  name?: string,
  served?: boolean,
  priority?: string, 
}){
  const formatedList = [];
  const operatingRoom = await operatingRoomModel.find({
    served: served?served:false,
  });

  for(const items of operatingRoom){
    const schedule = await scheduleSugeryModel.findById({_id: items.scheduleId })
    const patient = await patientModel.findById({_id: schedule?.patientId}).select({fullname: 1});
    const doctor = await getUser(schedule?.doctorId?.toString() as string);
    const sugeryType = await examModel.findById({_id: schedule?.sugeryType}).select({name: 1});
    
    const isProcess = await processStateModel.findOne({
        patientId: patient?._id,
        location: "block",
        isInUse: true
    });

    if(isProcess && isProcess.userId?.toString() !== await getUserId())
      continue;

    formatedList.push({
      id: items?.id.toString() as string,
      requestingService: surgerySchedulingArea.find( props => props._id === schedule?.requestingService)?.label as string,
      patient: patient?.fullname as string,
      //infirmary: schedule?.infirmary as string,
      //bed: schedule?.bed as string,
      sugeryType: sugeryType?.name.toString() as string,
      doctor: doctor.fullname as string,
      //date: `${getDateInSlashFormat(schedule?.doctorDay as Date)} ${schedule?.doctorTime}` as string,
    })
  }

  return name?priorityInOperatingRoom(formatedList.filter((item)=>item.patient.match(new RegExp(`^${name}`, 'i')))).orderElements:
  priority?priorityInOperatingRoom(formatedList.filter((item)=>item.requestingService === surgerySchedulingArea.find((props)=>props._id === priority)?.label)).orderElements:
  priorityInOperatingRoom(formatedList).orderElements;
}

async function sendPatientToOperatingRoom(prev: unknown, formData: FormData){
  try{
    const scheduleId = formData.get('scheduleId');
    const sugery = await scheduleSugeryModel.findById({_id: scheduleId });
    const service = await examModel.findById({_id: sugery?.sugeryType}).select({price: 1});
    const scheduleInOperatingRoom = await operatingRoomModel.find({ served: false });
    
    if(!sugery?.sugeryDate && !sugery?.sugeryHour)
      throw new Error("Defina antes a Data e Hora da cirurgia", { cause: "not_configured"});

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

async function getPatient({ id }: { id: string}){
  try{
     const operatingRoom = await operatingRoomModel.findOne({_id: id}).select({scheduleId: 1}); 
     const schedule = await scheduleSugeryModel.findById({ _id: operatingRoom?.scheduleId });
     const patient = await patientModel.findById({_id: schedule?.patientId})
     
     return {
      _id: patient?._id.toString() as string,
      scheduleId: schedule?._id.toString() as string,
      fullname: patient?.fullname as string,
      registerNumber: patient?.registerNumber as number,
      age: calculateAge(patient?.birthDate as Date),
      gender: patient?.gender as string,
      priority: surgerySchedulingArea.find( props => props._id === schedule?.requestingService)?.color as string,
    }
    
  }catch(e){
    const err = e as Error;
    return {
      message: err.cause?err.message: "Falha no servidor!"
    }
  }
}

async function signOperatingRoom(prev: unknown, formData: FormData){
  try{
    const scheduleId = formData.get("scheduleId") as string;
    const diagnostic = formData.get("preoperative-diagnosis") as string;
    const informedConsent = formData.get("Informed-consent") as string;
    const responsible = formData.get("responsible") as string;
    const surgicalHistory = formData.get("medicalAndsurgicalHistory") as string;
    const allergies = formData.get("allergies") as string;
    const clinicalStatus = formData.get("currentClinicalStatus") as string;
    const surgicalRisk = formData.get("surgicalRisk") as string;
    const fastingConfirmed = formData.get("fastingConfirmed") as string;
    const previousMedication = formData.get("previousMedication") as string;
    const surgicalTeam = formData.get("surgicalTeam") as string;
    const designatedRoom = formData.get("designatedRoom") as string;
    const materialsAndEquipment = formData.get("materialsAndEquipment") as string;
    const implantableDevices = formData.get("implantableDevices") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const typeOfAnesthesia = formData.get("typeOfAnesthesia") as string;
    const surgicalTechnique = formData.get("surgicalTechnique") as string;
    const implantsAndProsthesesUsed = formData.get("implantsAndProsthesesUsed") as string;
    const intraoperativeComplications = formData.get("intraoperativeComplications") as string;
    const fluidVolumeAndBloodLoss = formData.get("fluidVolumeAndBloodLoss") as string;
    const otherProcedure = formData.get("otherProcedure") as string;
    const checkInTime = formData.get("checkInTime") as string;
    const checkOutTime = formData.get("checkOutTime") as string;
    const vitalSignsData = formData.get("date") as string;
    const fr = formData.get("fr") as string;
    const pulse = formData.get("pulse") as string;
    const spo2 = formData.get("spo2") as string;
    const ta = formData.get("ta") as string;
    const t = formData.get("t") as string;
    const motorActivity = Number(formData.get("motorActivity"));
    const respiration = Number(formData.get("respiration"));
    const circulation = Number(formData.get("circulation"));
    const consciousness = Number(formData.get("consciousness"));
    const saturation = Number(formData.get("saturation"));
    const medication = formData.get("medication") as string;
    const postAnestheticoccurrences = formData.get("postAnestheticoccurrences") as string;
    const sum = motorActivity + respiration + circulation + consciousness + saturation;
    const result = sum >= 9?"Estável":sum >= 7?"Manter em observação":"Instável";
    const surgicalInformation = formData.get("surgicalInformation") as string;
    const diet = formData.get("diet") as string;
    const analgesia = formData.get("analgesia") as string;
    const mobilization = formData.get("mobilization") as string;
    const antibiotics = formData.get("antibiotics") as string;

    const hasPatientOperatingRoom = await operatingRoomModel.findOne({ scheduleId });
    const patient = hasPatientOperatingRoom?.patientIdentification;
    const evaluation = hasPatientOperatingRoom?.preoperativeEvaluation;
    const planning = hasPatientOperatingRoom?.sugeryPlanning;
    //const security = hasPatientOperatingRoom?.checkSecurity;
    const procedure = hasPatientOperatingRoom?.intraoperativeProcedure;
    const anesthetic = hasPatientOperatingRoom?.postAnestheticRecovery;
    const discharge = hasPatientOperatingRoom?.patientDischarge;

    const patientIdentification = {
      preoperativeDiagnosis: diagnostic || patient?.preoperativeDiagnosis,
      informedConsent: informedConsent || patient?.informedConsent,
      responsible: responsible || patient?.responsible,
    }

    const preoperativeEvaluation = {
      medicalAndsurgicalHistory: surgicalHistory || evaluation?.medicalAndsurgicalHistory,
      allergies: allergies || evaluation?.allergies,
      laboratoryTests: false || evaluation?.laboratoryTests,
      imagingTests: false || evaluation?.imagingTests,
      currentClinicalStatus: clinicalStatus || evaluation?.currentClinicalStatus,
      surgicalRisk: surgicalRisk || evaluation?.surgicalRisk,
      fastingConfirmed: fastingConfirmed || evaluation?.fastingConfirmed,
      previousMedication: previousMedication || evaluation?.previousMedication,
    }
    
    const sugeryPlanning = {
      surgicalTeam: surgicalTeam || planning?.surgicalTeam as string,
      designatedRoom: designatedRoom || planning?.designatedRoom as string,
      materialsAndEquipment: materialsAndEquipment || planning?.materialsAndEquipment as string,
      implantableDevices: implantableDevices || planning?.implantableDevices as string,
    }

    /*const checkSecurity = {
      patientIdentity: security?.patientIdentity as boolean,
      surgerySite: security?.surgerySite as string,
      validConsent: security?.validConsent as boolean,
      anestheticRisk: security?.anestheticRisk as boolean,
      bloodAndEmergencySupplies: security?.bloodAndEmergencySupplies as boolean,
    }*/

    const intraoperativeProcedure = {
      startTime: startTime ||  procedure?.startTime as Date,
      endTime: endTime || procedure?.endTime as Date,
      typeOfAnesthesia: typeOfAnesthesia || procedure?.typeOfAnesthesia as string,
      surgicalTechnique: surgicalTechnique || procedure?.surgicalTechnique as string,
      implantsAndProsthesesUsed: implantsAndProsthesesUsed || procedure?.implantsAndProsthesesUsed as string,
      intraoperativeComplications: intraoperativeComplications || procedure?.intraoperativeComplications as string,
      fluidVolumeAndBloodLoss: fluidVolumeAndBloodLoss || procedure?.fluidVolumeAndBloodLoss as string,
      medicationAdministered: medication || procedure?.medicationAdministered as string,
      otherProcedure: otherProcedure || procedure?.otherProcedure as string,
    }

    const postAnestheticRecovery = {
      checkInTime: checkInTime || anesthetic?.checkInTime as Date,
      checkOutTime:checkOutTime || anesthetic?.checkOutTime as Date,
      vitalSignal:(vitalSignsData && fr && pulse && spo2 && ta && t)?[...anesthetic?.vitalSignal || [],{
        date: vitalSignsData || undefined, 
        fr: Number(fr),
        pulse: Number(pulse), 
        spo2: Number(spo2), 
        ta: Number(ta), 
        t: Number(t),
      }]:anesthetic?.vitalSignal, 
      levelofConsciousness: {
        motorActivity: motorActivity || anesthetic?.levelofConsciousness?.motorActivity as number,
        respiration: respiration || anesthetic?.levelofConsciousness?.respiration as number,
        circulation: circulation || anesthetic?.levelofConsciousness?.circulation as number,
        consciousness: consciousness || anesthetic?.levelofConsciousness?.consciousness as number,
        saturation: saturation || anesthetic?.levelofConsciousness?.saturation as number,
        result: result || anesthetic?.levelofConsciousness?.result as string,
      },
      medicationAdministered: medication || anesthetic?.medicationAdministered as string,
      postAnestheticEvents: postAnestheticoccurrences|| anesthetic?.postAnestheticEvents as string,
    }

    const patientDischarge = {
      surgicalInformation: surgicalInformation || discharge?.surgicalInformation as string,
      postOperativeIndications: {
        diet: diet || discharge?.postOperativeIndications?.diet as string,
        analgesia: analgesia || discharge?.postOperativeIndications?.analgesia as string,
        mobilization: mobilization || discharge?.postOperativeIndications?.mobilization as string,
        antibiotics: antibiotics || discharge?.postOperativeIndications?.antibiotics as string,
      }
    }

    if(!hasPatientOperatingRoom)     
      await operatingRoomModel.create({ 
        scheduleId, 
        patientIdentification,
        preoperativeEvaluation,
        sugeryPlanning,
        intraoperativeProcedure,
        postAnestheticRecovery,
        patientDischarge
      });
    else
      await operatingRoomModel.updateOne({ 
        _id: hasPatientOperatingRoom._id 
      },{ 
        patientIdentification,
        preoperativeEvaluation,
        sugeryPlanning,
        intraoperativeProcedure,
        postAnestheticRecovery,
        patientDischarge, 
      });

    return {
      message: `Informação ${!hasPatientOperatingRoom?'registrada':'actualizada'} com sucesso!`,
      status: true,
    }
  }catch(e: unknown){
    const err = e as Error;

    return {
      message: err.cause?err.message:"Não foi possivel realizar esta operação!",
      status: false,
    }
  }
}

async function getOperatingRoom(scheduleId: string){
  const operatingRoom = await operatingRoomModel.findOne({ scheduleId, served: false });
  const schedule = await scheduleSugeryModel.findById({_id: scheduleId}).select({requestingService: 1});
  const vitalSignal:{
    date: Date, 
    fr: number,
    pulse: number, 
    spo2: number, 
    ta: number, 
    t: number,
  }[] = [];

  operatingRoom?.postAnestheticRecovery?.vitalSignal.forEach((props) => {
    vitalSignal.push({
      date: props.date as Date, 
      fr: props.fr as number,
      pulse: props.pulse as number, 
      spo2: props.spo2 as number, 
      ta: props?.ta as number, 
      t: props.t as number,
    });    
  });

   return {
    id: operatingRoom?._id.toString() as string,
    requestingService: surgerySchedulingArea.find( props => props._id === schedule?.requestingService)?.label as string,
    patientIdentification: {
      preoperativeDiagnosis: operatingRoom?.patientIdentification?.preoperativeDiagnosis as string,
      informedConsent: operatingRoom?.patientIdentification?.informedConsent as string,
      responsible: operatingRoom?.patientIdentification?.responsible as string,
    },
    preoperativeEvaluation: {
      medicalAndsurgicalHistory: operatingRoom?.preoperativeEvaluation?.medicalAndsurgicalHistory as string,
      allergies: operatingRoom?.preoperativeEvaluation?.allergies as string,
      laboratoryTests: operatingRoom?.preoperativeEvaluation?.laboratoryTests as string,
      imagingTests: operatingRoom?.preoperativeEvaluation?.imagingTests as string,
      currentClinicalStatus: operatingRoom?.preoperativeEvaluation?.currentClinicalStatus as string,
      surgicalRisk: operatingRoom?.preoperativeEvaluation?.surgicalRisk as string,
      fastingConfirmed: operatingRoom?.preoperativeEvaluation?.fastingConfirmed as string,
      previousMedication: operatingRoom?.preoperativeEvaluation?.previousMedication as string,
    },
    sugeryPlanning: {
      surgicalTeam: operatingRoom?.sugeryPlanning?.surgicalTeam as string,
      designatedRoom: operatingRoom?.sugeryPlanning?.designatedRoom as string,
      materialsAndEquipment: operatingRoom?.sugeryPlanning?.materialsAndEquipment as string,
      implantableDevices: operatingRoom?.sugeryPlanning?.implantableDevices as string,
    },
    checkSecurity: {
      patientIdentity: operatingRoom?.checkSecurity?.patientIdentity as boolean,
      surgerySite: operatingRoom?.checkSecurity?.surgerySite as string,
      validConsent: operatingRoom?.checkSecurity?.validConsent as boolean,
      anestheticRisk: operatingRoom?.checkSecurity?.anestheticRisk as boolean,
      bloodAndEmergencySupplies: operatingRoom?.checkSecurity?.bloodAndEmergencySupplies as boolean,
    },
    intraoperativeProcedure: {
      startTime: operatingRoom?.intraoperativeProcedure?.startTime as Date,
      endTime: operatingRoom?.intraoperativeProcedure?.endTime as Date,
      typeOfAnesthesia: operatingRoom?.intraoperativeProcedure?.typeOfAnesthesia as string,
      surgicalTechnique: operatingRoom?.intraoperativeProcedure?.surgicalTechnique as string,
      implantsAndProsthesesUsed: operatingRoom?.intraoperativeProcedure?.implantsAndProsthesesUsed as string,
      intraoperativeComplications: operatingRoom?.intraoperativeProcedure?.intraoperativeComplications as string,
      fluidVolumeAndBloodLoss: operatingRoom?.intraoperativeProcedure?.fluidVolumeAndBloodLoss as string,
      medicationAdministered: operatingRoom?.intraoperativeProcedure?.medicationAdministered as string,
      otherProcedure: operatingRoom?.intraoperativeProcedure?.otherProcedure as string,
    },
    postAnestheticRecovery: {
      checkInTime: operatingRoom?.postAnestheticRecovery?.checkInTime as Date,
      checkOutTime: operatingRoom?.postAnestheticRecovery?.checkOutTime as Date,
      vitalSignal,
      levelofConsciousness: {
        motorActivity: operatingRoom?.postAnestheticRecovery?.levelofConsciousness?.motorActivity as number,
        respiration: operatingRoom?.postAnestheticRecovery?.levelofConsciousness?.respiration as number,
        circulation: operatingRoom?.postAnestheticRecovery?.levelofConsciousness?.circulation as number,
        consciousness: operatingRoom?.postAnestheticRecovery?.levelofConsciousness?.consciousness as number,
        saturation: operatingRoom?.postAnestheticRecovery?.levelofConsciousness?.saturation as number,
        result: operatingRoom?.postAnestheticRecovery?.levelofConsciousness?.result as string,
      },
      medicationAdministered: operatingRoom?.postAnestheticRecovery?.medicationAdministered as string,
      postAnestheticEvents: operatingRoom?.postAnestheticRecovery?.postAnestheticEvents as string,
    },
    patientDischarge: {
      surgicalInformation: operatingRoom?.patientDischarge?.surgicalInformation as string,
      postOperativeIndications: {
        diet: operatingRoom?.patientDischarge?.postOperativeIndications?.diet as string,
        analgesia: operatingRoom?.patientDischarge?.postOperativeIndications?.analgesia as string,
        mobilization: operatingRoom?.patientDischarge?.postOperativeIndications?.mobilization as string,
        antibiotics: operatingRoom?.patientDischarge?.postOperativeIndications?.antibiotics as string,
      }
    }
  }
}

export {
  getPatients,
  getPatient,
  getOperatingRoom,
  sendPatientToOperatingRoom,
  archivingSugery,
  //rescheduleSugery,
  signOperatingRoom,
}