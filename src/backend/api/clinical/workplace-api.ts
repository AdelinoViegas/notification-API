"use server";

import { currentLocationModel } from "@/backend/model";
import { getUserId } from "@/lib/web-token";

async function enterIntoWorkplace(prev: unknown, formData: FormData){
  try{
    const workplaceId = formData.get("workplaceId") as string;
    await openWorkplace(workplaceId);
    
    return {
      message: "Entrada confirmada!",
      status: true
    }
  }catch {
    return {
      message: "operação impossivel",
      status: false
    }
  }
}

async function openWorkplace(workplaceId: string){
  try{
    const userId = await getUserId();
    const workplace = await currentLocationModel.findOne({ isActive: true, userId });

    if(!workplace){
      await currentLocationModel.create({
        locationId: workplaceId,
        userId: await getUserId(),
      });
      return true
    }

    await currentLocationModel.updateOne({ 
      userId, 
      isActive: true
    }, {
      locationId: workplaceId
    });

    return true;
  }catch(e: unknown){
    const err = e as Error;
    console.log(err.message);
    return false;
  }
}

async function exitFromWorkplace(){
  await currentLocationModel.updateOne({ 
    userId: await getUserId(), 
    isActive: true 
  }, { 
    isActive: false 
  });
}

export {
  enterIntoWorkplace,
  exitFromWorkplace,
}