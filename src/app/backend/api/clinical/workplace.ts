"use server";

import { currentLocationModel } from "@/app/backend/models/clinical";
import { whoAreYou } from "@/lib/web-token";
/*
  workplaceId são as unidades do tipo workplace
*/
async function enterIntoWorkplace(prev: unknown, form: FormData){
  try{
    const workplaceId = form.get("workplaceId"); 
    const userId = await whoAreYou();
    const workplace = await currentLocationModel.findOne({ isActive: true, userId });

    if(workplace)
      await exitFromWorkplace()
      //throw new Error("Desculpe, já existe uma sessão aberta com a sua conta, feche-a para poder iniciar!");

    const currentLocation = new currentLocationModel({
      locationId: workplaceId,
      userId: await whoAreYou(),
    });

    await currentLocation.save();
    return {
      status: true,
    };
  }catch(err: unknown){
    const e = err as { message: string };
    return {
      message: e.message,
      status: false,
    }
  }
}

async function exitFromWorkplace(){
  await currentLocationModel.findOneAndUpdate({ 
    isActive: true,
    userId: await whoAreYou(), 
  }, { 
    isActive: false 
  });
}

export {
  enterIntoWorkplace,
  exitFromWorkplace,
}