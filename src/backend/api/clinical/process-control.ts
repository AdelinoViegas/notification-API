"use server";

import { getUserId } from "@/lib/web-token";
import { patientModel, processStateModel,demographyModel, responsibleModel, groupModel, accessTypeModel, patientSyncModel } from "@/backend/model";
import { getFirstAndLastName } from "@/components/userbar";
import { getUser } from "@/backend/api/admin";

import { Types} from "mongoose";
import { ClientSession } from "mongodb";


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

export async function closePatientProcess(patientId: string, location: WorkLocation, session?: ClientSession){
  try{
    await processStateModel.updateOne({ 
      patientId, 
      location,
      userId: await getUserId(), 
    }, { 
      isInUse: false 
    }, { session });
   
    return {
      message:"Utente libertado com sucesso!",
      status: true,
    }
  }catch (e) {
    console.error("Erro ao fechar processo:", e);
    
    throw new Error("Falha ao fechar o processo do paciente.");
  }
}

export async function syncPatientRegister(id: string, session?: ClientSession){
  try{
    const oldPatient = await patientModel.findById({ _id: id }).session(session || null).lean();
    
    if(!oldPatient)
      throw new Error("Paciente inexistente!");

    const { _id, ...patientData } = oldPatient;
    const [ patient ] = await patientModel.create([ {...patientData} ], { session });

    await patientModel.updateOne({
      _id: oldPatient._id
    }, { used: true, served: true }, { session});

    await syncPatientHistories(id, patient._id.toString(), session);

    const oldDemography = await demographyModel.findOne({ patientId: oldPatient?._id }).session(session || null).lean();
    if(oldDemography){
      const { _id, ...data } = oldDemography;
      await demographyModel.create([{...data, patientId: patient._id.toString() } ], { session });
    }

    const oldResponsible = await responsibleModel.findOne({ patientId: oldPatient?._id }).session(session || null).lean();
    if(oldResponsible){
      const { _id, ...data } = oldResponsible;
      await responsibleModel.create([{...data, patientId: patient._id.toString() } ], { session });
    }

    const oldGroup = await groupModel.findOne({ patientId: oldPatient?._id }).session(session || null).lean();
    if(oldGroup){
      const { _id, ...data } = oldGroup;
      await groupModel.create([{_id: undefined, ...data, patientId: patient._id.toString() } ], { session });
    }

    const oldAccessType = await accessTypeModel.findOne({ patientId: oldPatient?._id }).session(session || null).lean();
    if(oldAccessType){
      const { _id, ...data } = oldAccessType;
      await accessTypeModel.create([{_id: undefined, ...data, patientId: patient._id.toString() } ], { session });
    }

    console.log("dados do utente sincronizado!");
  }catch (e){
    console.error(e);
    throw new Error("Falha na sincronização!");
  }
}

export async function syncPatientHistories(pastId: string, newId: string, session?: ClientSession){
  try{
    let query = patientSyncModel.findOne({ id: pastId });

    if (session && query) 
      query = query.session(session);

    //Executa a query uma única vez
    const histories = await query;

    if(!histories){
      await patientSyncModel.create([{
        id: newId,
        secondaries: [ pastId ]
      }], { session });
      return true; 
    }

    const currentList = histories.secondaries;
    currentList.push(new Types.ObjectId(pastId));

    await patientSyncModel.updateOne({ id: pastId }, {
      id: newId,
      secondaries: currentList
    }, { session });

    return true;
  }catch (e) {
    console.log(e);
    throw new Error("Falha na sincronização!");
  }
}

export async function getSyncedHistories(id: string){
  try{
    const histories = await patientSyncModel.findOne({ id }).select({ id: 1, secondaries: 1 });  
    if(histories)
      return histories;
    // buscar nas referencias passadas do utente
    const allHistory = await patientSyncModel.find().select({ id: 1, secondaries: 1 }); 
    
    for (const history of allHistory){
      for(const secondaryId of history.secondaries){
        if(id === secondaryId.toString())
          return history;
      }
    }

    throw new Error("paciente sem historico!");
  }catch(e){
    console.error((e as Error)?.message);
    return null;
  }
}

export async function getPatientIds(id: string){
  try{
    const ids = [];
    const history = await getSyncedHistories(id);
    
    ids.push(history?.id?.toString() as string);
    history?.secondaries.forEach(e => ids.push(e?.toString() as string));
    
    return ids;
  }catch(e){
    console.error(e);
    return [];
  }
}