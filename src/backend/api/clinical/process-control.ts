"use server";

import { getUserId } from "@/lib/web-token";
import { patientModel, processStateModel,demographyModel, responsibleModel, groupModel, accessTypeModel, patientSyncModel } from "@/backend/model";
import { getFirstAndLastName } from "@/components/userbar";
import { getUser } from "@/backend/api/admin";
import { Types } from "mongoose";

type WorkLocation = "screening" | "urgency" | "laboratory" | "imaging" | string ;

export async function openPatientProcess(patientId: string, location: WorkLocation){
  try{
    const existProcess = await processStateModel.findOne({
      patientId, 
      location,  
    });
     
    if(!existProcess){
      await processStateModel.create({
        patientId,
        userId: await getUserId(),
        location,
        isInUse: true,
      });

      return {
        message: "Processo aberto com sucesso!",
        status: true,
      }
    }

    if(!existProcess?.isInUse){
      await processStateModel.updateOne({ patientId, location }, {
        isInUse: true,
        userId: await getUserId(),
      });
    } 

    if(existProcess?.isInUse && existProcess.userId?.toString() !== await getUserId()){      
      const { fullname } = await getUser(existProcess.userId?.toString() as string);
      throw new Error(`Processo ocupado pelo Sr(a).${getFirstAndLastName(fullname as string)}!`, { cause: "busy" });
    } 
    
  }catch(e: unknown){
    const err = e as Error;

    return {
      message: err?.cause === "busy"?err.message:"Operação impossivel!",
      status: false
    }
  }
}

export async function closePatientProcess(patientId: string, location: WorkLocation){
  try{
    await processStateModel.updateOne({ 
      patientId, 
      location,
      userId: await getUserId(), 
    }, { 
      isInUse: false 
    });
   
    return {
      message:"Utente libertado com sucesso!",
      status: true,
    }
  }catch {
    return {
      message: "Operação impossivel!",
      status: false
    }
  }
}

export async function syncPatientRegister(id: string){
  try{
    const oldPatient = await patientModel.findById({ _id: id });
    const transformedOldPatient = JSON.parse(JSON.stringify(oldPatient));
    const patient = new patientModel(transformedOldPatient);
    patient._id = new Types.ObjectId();
    await patient.save();
    await patientModel.updateOne({ _id: oldPatient?._id }, { used: true, served: true });

    await syncPatientHistories(id, patient._id.toString());
    
    const oldDemography = await demographyModel.findOne({ patientId: oldPatient?._id });
    const demography = new demographyModel(JSON.parse(JSON.stringify(oldDemography)));
    demography._id = new Types.ObjectId();
    demography.patientId = patient._id

    const oldResponsible = await responsibleModel.findOne({ patientId: oldPatient?._id });
    const responsible = new responsibleModel(JSON.parse(JSON.stringify(oldResponsible)));
    responsible._id = new Types.ObjectId();
    responsible.patientId = patient._id.toString();
    
    const oldGroup = await groupModel.findOne({ patientId: oldPatient?._id });
    const group = new groupModel(JSON.parse(JSON.stringify(oldGroup)));
    group._id = new Types.ObjectId();
    group.patientId = patient._id.toString();
    
    const oldAccessType = await accessTypeModel.findOne({ patientId: oldPatient?._id });
    const accessType = new accessTypeModel(JSON.parse(JSON.stringify(oldAccessType)));
    accessType._id = new Types.ObjectId();
    accessType.patientId = patient._id;

    await responsible.save();
    await demography.save();
    await group.save();
    await accessType.save();
    console.log("dados do utente sincronizado!");
  }catch (e){
    console.log(e);
    throw new Error("Falha na sincronização!");
  }
}

export async function syncPatientHistories(pastId: string, newId: string){
  try{
    const histories = await patientSyncModel.findOne({ id: pastId });
    console.log(histories);

    if(!histories){
      await patientSyncModel.create({
        id: newId,
        secondaries: [ pastId ]
      });
      return true; 
    }

    const currentList = histories.secondaries;
    currentList.push(new Types.ObjectId(pastId));

    await patientSyncModel.updateOne({ id: pastId }, {
      id: newId,
      secondaries: currentList
    });
    
    return true;
  }catch (e) {
    console.log(e);
    return false;
  }
}

export async function getSyncedHistories(id: string){
  try{
    const histories = await patientSyncModel.findOne({ id });
    if(histories)
      return histories;
    
    const allHistory = await patientSyncModel.find();
    
    for (const history of allHistory){
      for(const secondaryId of history.secondaries){
        if(id === secondaryId.toString())
          return history;
      }
    }
    throw new Error();
  }catch{
    return null;
  }
}