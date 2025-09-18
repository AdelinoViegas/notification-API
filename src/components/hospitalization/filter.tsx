"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Selection, { SelectionOption } from "@/components/ui/selection";
import { useEffect, useState } from "react";
import { getNursings } from "@/backend/api/clinical/hospitalization-api";

const nursingsMock = [
  { _id: "enf001", label: "Enfermaria Geral 1" },
  { _id: "enf002", label: "Enfermaria Cirúrgica 2" },
  { _id: "enf003", label: "Enfermaria Pediátrica" },
  { _id: "enf004", label: "Enfermaria Clínica 1" },
  { _id: "enf005", label: "Enfermaria Psiquiátrica" },
  { _id: "enf006", label: "Enfermaria Isolamento" },
  { _id: "enf007", label: "Enfermaria COVID-19" },
  { _id: "enf008", label: "Enfermaria Geriátrica" },
  { _id: "enf009", label: "Enfermaria Obstétrica" },
  { _id: "enf010", label: "Enfermaria Neurológica" }
];

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