"use client";

import { useEffect } from "react";
import { RESTproxy } from "./rest-proxy";
import { useSearchParams, useRouter } from "next/navigation";

export default function Auth(){
  
  const search = useSearchParams();
  const token = ["h", "p", "s"].map(e => search.get(e)).join('.');
  const router = useRouter();

  useEffect(()=>{
    RESTproxy(token, true)
    .then()
    .finally(()=>router.replace("/clinical"))

  }, [token]);
  return(
    <>test {token.length} </>
  )
}