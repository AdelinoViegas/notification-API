"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { logout } from "@/app/backend/api/manager/api";
export default function Refresh(){
  const worker = useRef<Worker>(null);
  const middlewareWorker = useRef<Worker>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(()=>{
    worker.current = new window.Worker('/ws/refresh-data.js');
    middlewareWorker.current = new window.Worker("/ws/middleware.js");

    worker.current.onmessage = ()=> {
      middlewareWorker.current?.postMessage(pathname);
      router.refresh();
    };  

    middlewareWorker.current.onmessage = (ev: MessageEvent<{ status: boolean }>)=>{
      if(!ev.data.status)
        logout()
    }
  }, []);

  return<></>;
}