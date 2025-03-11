"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Refresh(){
  const worker = useRef<Worker>(null);
  const router = useRouter();

  useEffect(()=>{
    worker.current = new window.Worker('/services/refresh-data.js');
    worker.current.onmessage = ()=> {
      router.refresh();
      console.log('reloaded');
    };  
  }, []);

  return<></>;
}