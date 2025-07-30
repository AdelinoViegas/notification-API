"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Refresh(){
  const router = useRouter();

  useEffect(()=>{
    const interval = setInterval(()=>{
      router.refresh();
    }, 1000);

    return () => clearInterval(interval); 
  }, []);

  return <></>;
}