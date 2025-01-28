"use client";

import { useEffect, useState, useRef } from "react";
import Modal from "@/components/modal";
import Button from "@/components/ui/button";
import WsUpdate from "@/components/ws-update";
import { 
  deleteNotificaion, 
  getNotifications, 
  goToNotification, 
  readNotification 
} from "@/app/backend/api/clinical/process-api";
import { TiInputChecked } from "react-icons/ti";
import { TiDeleteOutline } from "react-icons/ti";
import { IoMdOpen } from "react-icons/io";
import clsx from "clsx";
import { getDataAndHoursFormat } from "@/lib/date-formater";
import { whoAreYou } from "@/lib/web-token";
import { TbMessage2 } from "react-icons/tb";
type Notification = {
  _id: string;
  title: string;
  sinopse: string;
  target: string;
  isReaded: boolean;
  priority: string;
  visible: boolean;
  createdAt: Date;
  creator: {
    _id: string;
    name: string;
  }
}

type NotifiationStatistics = {
  notifications: Notification[],
  reads: number;
  notReads: number;
  deleteds: number;
}

export default function Notification(){
  const [ state, setState ] = useState(false);
  const notifySound = useRef<HTMLAudioElement>(null);
  const toggle = ()=> setState(!state);
  const [ notifications, setNotifications ] = useState<NotifiationStatistics>({
    deleteds: 0,
    notifications: [],
    notReads: 0,
    reads: 0
  });
  
  const playSound = async ()=>{
    try{
      await notifySound.current?.play();
    }catch(e: unknown){
      const err = e as Error;
      console.log(err?.message);
      alert("Por favor permita acesso a auto reprodução para o som das notificações!");
    }
  }

  const NotReadedNotifications = ()=>{
    let quantity = 0;
    for(const i of notifications.notifications as Notification[])
      if(!i.isReaded)
        quantity += 1;
    return quantity;
  }
  
  const websocketCallback = ()=>{
    getNotifications()
    .then(async (notify) => {
      setNotifications(notify);
      
      if(!notify.notifications.length)
        throw new Error();

      const lastNotification = notify.notifications[notify.notifications.length - 1];
      const currentUserId = await whoAreYou();
      
      if(lastNotification.creator._id !== currentUserId)
        await playSound();

    })
    .catch(()=>console.log('without notifications'))
  }
  
  useEffect(()=>{
    websocketCallback();
  }, []);

  return(
    <div>
      <WsUpdate 
        target="notification"
        callback={websocketCallback} 
      />
      <button onClick={toggle} className="relative hover:bg-gray-100 px-3 py-2 rounded-xl">
        <TbMessage2 className="size-8 animate" />
       { NotReadedNotifications() !== 0 && <span className="animate-ping absolute font-medium right-1 top-0 text-xs bg-red-500 text-white rounded-full px-1">
          {NotReadedNotifications()}
        </span>}
        <span className="absolute font-medium right-1 top-0 text-xs bg-red-500 text-white rounded-full px-1">
          {NotReadedNotifications()}
        </span>
      </button>
      <audio ref={notifySound} src="/audio/notification.wav" />
      <Modal
        onClose={toggle} 
        open={state}
        title="Notificações">
          <div className="h-[50vh] overflow-auto px-3 space-y-1">
            <div className="flex gap-3 border-b pb-3 mb-1">
              <h2 className="bg-primary/15 rounded-md px-3 py-2 text-xs font-medium">Não lidos ({notifications.notReads})</h2>
              <h2 className="bg-primary/15 rounded-md px-3 py-2 text-xs font-medium">Lidos ({notifications.reads})</h2>
              <h2 title="Contacte o seu Administrator para mais informações!" className="bg-primary/15 rounded-md px-3 py-2 text-xs font-medium">Pagados ({notifications.deleteds})</h2>
            </div>
            {!notifications.notifications.length && <div className="text-center text-gray-500">Sem Notificações</div>}
            {notifications.notifications.map((item, i)=>(
              <div key={i} className={clsx(
                "grid items-center gap-3 text-sm hover:bg-gray-100 px-3 py-2 rounded-md",
                { "bg-gray-200": !item.isReaded }
              )}>
                <div className="space-y-1">
                  <span className="text-xs bg-primary/25 text-primary px-3 py-1 rounded-md font-medium">{getDataAndHoursFormat(item.createdAt)}</span>
                  <div className="grid gap-1">
                    <span className="font-medium uppercase">{item.title}</span>
                    <span className="cursor-pointer line-clamp-1 hover:line-clamp-none">{item.sinopse}</span>
                  </div>
                </div>
                <div className="flex gap-x-3">
                  <button onClick={()=>readNotification({ notifyId: item._id})} className="hover:bg-gray-200">
                    <TiInputChecked className="size-7" />
                  </button>
                  <button onClick={()=>deleteNotificaion({ notifyId: item._id })} className="hover:bg-gray-200">
                    <TiDeleteOutline className="size-6 text-red-500" />
                  </button>
                  <button onClick={()=>{
                    goToNotification({ notifyId: item._id});
                    toggle();
                  }} className="hover:bg-gray-200">
                    <IoMdOpen className="size-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        <div className="flex justify-end">
          <Button onClick={toggle}>Ok</Button>
        </div>
      </Modal>
    </div>
  );
}