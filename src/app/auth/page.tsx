"use client";

import { useEffect } from "react";
import { RESTproxy } from "@/app/auth/rest-proxy";
import { useSearchParams, useRouter } from "next/navigation";

export default function Auth(){
  const search = useSearchParams();
  const token = ["h", "p", "s"].map(e => search.get(e)).join('.');
  const router = useRouter();

  useEffect(()=>{
    RESTproxy(token, true).then(()=>router.replace("/wp"))

  }, [token]);
  return(
    <div className="ml-10">Estamos a verificar, por favor aguarde ...</div>
  );
}