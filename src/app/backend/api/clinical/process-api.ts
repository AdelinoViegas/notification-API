"use server";

import { whoAreYou } from "@/lib/web-token";
import { processStateModel, notificationModel } from "@/app/backend/models/clinical";
import { triggerUpdate } from "@/lib/ws-trigger";
import { redirect } from "next/navigation";
import { getFirstAndLastName } from "@/components/status-bar";
import { userModel } from "../../models/manager";

// const NOTFICATION_FORMAT = {
//   appointment: {
   
//   }
// }
async function openPatientProcess(patientId: string, location: string){
  try{
    const existProcess = await processStateModel.findOne({
      patientId, 
      location,  
    });

    if(!existProcess){
      const process = new processStateModel({
        patientId,
        userId: await whoAreYou(),
        location,
        isInUse: true,
      });
      
      await process.save();

      return {
        message: "Processo aberto com sucesso!",
        status: true,
      }
    }
   
    if(!existProcess?.isInUse){
      await processStateModel.updateOne({ patientId, location}, {
        isInUse: true,
        userId: await whoAreYou(),
      });
    }

    if(existProcess?.isInUse && existProcess.userId?.toString() !== (await whoAreYou()))
      throw new Error("Este processo está em uso!", { cause: "busy" }); 
  }catch(err: unknown){
    const error = err as Error;
    
    if(error.cause === "busy")
      return {
        message: error.message,
        status: false
      }
    return {
      message: "falha",
      status: false
    }
  }
}

async function closePatientProcess(patientId: string, location: string){
  try{
    await processStateModel.updateOne({ patientId, location }, { isInUse: false });
   
    return {
      message:"Utente libertado com sucesso!",
      status: true,
    }
  }catch(err: unknown){
    const e = err as { message: string };
    return {
      message: "Falha",
      detail: e.message,
      status: false
    }
  }
}

async function signNotification({
  title,
  sinopse,
  type,
  target
}:{
  title: string;
  sinopse: string;
  type: string;
  target: "appointment" | "laboratory";
}){
  await notificationModel.create({
    title,
    sinopse,
    type,
    target,
    creator: await whoAreYou(),
  });

  triggerUpdate({target: "notification"});
}

async function getNotifications(){
  const notifications = [];
  let reads = 0;
  let notReads = 0;
  let deleteds = 0;

  for await (const notification of notificationModel.find({ visible: true })){
    const user = await userModel.findById({ _id: notification?.creator }).select({ fullname: 1 }); 
    const firstAndLastname = getFirstAndLastName(user?.fullname as string) as string;

    notifications.push({
      _id: notification._id.toString(),
      title: notification.title as string,
      sinopse: notification.sinopse as string,
      target: notification.target as string,
      isReaded: notification.isReaded,
      creator: {
        _id: notification.creator?.toString() as string,
        name: firstAndLastname,
      },
      // reader: notification.reader,
      priority: notification.priority as string,
      visible: notification.visible,
      createdAt: notification.createdAt as Date,
    });
  }

  for await (const notification of notificationModel.find()){
    if(notification.isReaded)
      reads += 1;
    else
      notReads +=1;
    if(!notification.visible)
      deleteds += 1;
  }
    
  return {
    notifications,
    reads,
    notReads,
    deleteds
  };
}

async function readNotification({ notifyId }: { notifyId: string }){
  const notification = await notificationModel.findById({ _id: notifyId});
  const userId = await whoAreYou();
  if(!notification)
    return;

  if(notification.readByUsers.find(item => item?.userId?.toString() === userId))
    return; 

  notification.readByUsers.push({
    userId,
    readedAt: new Date(),
  });

  await notificationModel.updateOne({ _id: notifyId }, {
    isReaded: true,
    readByUsers: notification.readByUsers,
  })
  triggerUpdate({ target: "notification" });
}

async function goToNotification({ notifyId }: { notifyId: string }){
  const notification = await notificationModel.findById({ _id: notifyId });
  await readNotification({ notifyId });
  redirect('/clinical/'+notification?.target as string);    
}

async function deleteNotificaion({ notifyId }: { notifyId: string }){
  await notificationModel.updateOne({ _id: notifyId}, {
    deletedBy: {
      userId: await whoAreYou(),
      deletedAt: new Date(),
    },
    visible: false,
  });

  triggerUpdate({ target: "notification", signal: "delete" });
}

export{
  openPatientProcess,
  closePatientProcess,
  signNotification,
  getNotifications,
  readNotification,
  goToNotification,
  deleteNotificaion
};