"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Selection, { SelectionOption } from "@/components/ui/selection";
import { useEffect, useState } from "react";
import { getNursings } from "@/backend/api/clinical/hospitalization-api";

export default function Filter(){
  const search = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [ nursings, setNursings ] = useState<SelectionOption[]>([]);

  const handlerFilter = (e: React.ChangeEvent<HTMLSelectElement>)=>{
    const _search = new URLSearchParams(search);

    if(e.target.value){
      _search.set("_fn", e.target.value); // filter by nursings
      router.push([pathname, _search.toString()].join("?"));
      return;
    }

    _search.delete("_fn");
    router.push([pathname, _search.toString()].join("?"));
  }
  
  useEffect(()=>{
    getNursings().then(setNursings);
  },[]);

  return (
    <>
      <Selection
        label="Filtrar por Enfermaria"
        options={nursings} 
        onChange={handlerFilter}
      />
    </>
  )
}