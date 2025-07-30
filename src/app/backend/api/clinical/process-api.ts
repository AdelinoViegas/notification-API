"use server";

import { whoIsUser } from "@/lib/web-token";
import { processStateModel, notificationModel } from "@/app/backend/models/clinical";
import { redirect } from "next/navigation";
import { getFirstAndLastName } from "@/components/userbar";
import { userModel } from "@/app/backend/models/manager";
import { getUser } from "@/app/backend/api/manager/api";

type WorkLocation = "screening" | "urgency" | "laboratory" | "imaging" ;


async function openPatientProcess(patientId: string, location: WorkLocation){
  try{
    const existProcess = await processStateModel.findOne({
      patientId, 
      location,  
    });
     
    if(!existProcess){
      await processStateModel.create({
        patientId,
        userId: await whoIsUser(),
        location,
        isInUse: true,
      });

      return {
        message: "Processo aberto com sucesso!",
        status: true,
      }
    }

    if(!existProcess?.isInUse){
      await processStateModel.updateOne({ patientId, location}, {
        isInUse: true,
        userId: await whoIsUser(),
      });
    } 

    if(existProcess?.isInUse && existProcess.userId?.toString() !== await whoIsUser()){
      const { fullname } = await getUser(existProcess.userId?.toString() as string);
      throw new Error(`Este processo está em uso pelo Sr(a).${getFirstAndLastName(fullname as string)}!`, { cause: "busy" });
    } 
    
  }catch(e: unknown){
    const err = e as Error;
    
    return {
      message: err?.cause === "busy"?err.message:"Erro crítico!",
      status: false
    }
  }
}

async function closePatientProcess(patientId: string, location: WorkLocation){
  try{
    await processStateModel.updateOne({ 
      patientId, 
      location,
      userId: await whoIsUser(), 
    }, { 
      isInUse: false 
    });
   
    return {
      message:"Utente libertado com sucesso!",
      status: true,
    }
  }catch(e: unknown){
    const err = e as Error;
    console.log("[CRITICAL]: ", err.message);

    return {
      message: "Falha crítica!",
      status: false
    }
  }
}

async function signNotification({
  title,
  sinopse,
  type,
  target,
  dataId
}:{
  title: string;
  sinopse: string;
  type: string;
  target: "appointment" | "laboratory";
  dataId?: string;
}){
  await notificationModel.create({
    title,
    sinopse,
    type,
    target,
    creator: await whoIsUser(),
    targetDataId: dataId
  });

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
  const userId = await whoIsUser();
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
}
/**
 * @params {dataId} ObjecId da informação que deve fazer parte de uma rota onde tem tabela 
 */
async function goToNotification({ 
  notifyId
}: { 
  notifyId: string; 
}){
  const notification = await notificationModel.findById({ _id: notifyId });
  await readNotification({ notifyId });
  // redirect('/clinical/'+notification?.target as string);
  redirect(`/clinical/${notification?.target}/${notification?.targetDataId?.toString()}`);    
}

async function deleteNotificaion({ notifyId }: { notifyId: string }){
  await notificationModel.updateOne({ _id: notifyId}, {
    deletedBy: {
      userId: await whoIsUser(),
      deletedAt: new Date(),
    },
    visible: false,
  });
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