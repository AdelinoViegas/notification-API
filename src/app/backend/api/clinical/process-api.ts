"use server";

import { getUserId } from "@/lib/web-token";
import { processStateModel } from "@/app/backend/model";
import { getFirstAndLastName } from "@/components/userbar";
import { getUser } from "@/app/backend/api/admin";

type WorkLocation = "screening" | "urgency" | "laboratory" | "imaging" ;


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
      throw new Error(`Este processo está em uso pelo Sr(a).${getFirstAndLastName(fullname as string)}!`, { cause: "busy" });
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