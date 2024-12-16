"use client";
import { useEffect } from "react";
import { io } from 'socket.io-client';
import { WS_URL } from "@/lib/ws-trigger";
import { useRouter } from "next/navigation";
import { TriggerProps } from "@/lib/ws-trigger";

const ws = io(WS_URL);

export default function WsUpdate({ target, callback }: TriggerProps){
  const router = useRouter();

  useEffect(()=>{
    ws.on(target, () =>{
      router.refresh();
      
      if(callback)
        callback();
    });
  }, [router, target]);
  return <></>;
}