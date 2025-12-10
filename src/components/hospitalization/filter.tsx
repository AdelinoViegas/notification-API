"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Selection, { SelectionOption } from "@/components/ui/selection";
import React, { useEffect, useState } from "react";
import { getNursings, getInternalServices, getSections } from "@/backend/api/clinical/hospitalization-api";
type FilterKeys = { [ key: string ] : "_fst" | "_fs" | "_fn"};

export default function Filter({ internalServiceId }: { internalServiceId?: string }){
  const search = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const componentRoute = useSearchParams().get("r") as "n" | null;
  const [ nursings, setNursings ] = useState<SelectionOption[]>([]);
  const [ sections, setSections ] = useState<SelectionOption[]>([]);
  const [ internalServices, setInternalServices ] = useState<SelectionOption[]>([]);

  const filterHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const _search = new URLSearchParams(search);
    const keyIds = ["section", "service", "nursing"];
    const filterKeys: FilterKeys = {
      section: "_fst",
      service: "_fs",
      nursing: "_fn"
    }

    if(keyIds.includes(e.target.id)){
      switch(e.target.id){
        case "section": {

          if(e.target.value)
            _search.set(filterKeys[e.target.id], e.target.value); // filter by sections
          else
            _search.delete(filterKeys[e.target.id]);
          
          router.push([pathname, _search.toString()].join("?"));
          break;
        }

        case "service": {
          
          if(e.target.value)
            _search.set(filterKeys[e.target.id], e.target.value); // filter by sections
          else
            _search.delete(filterKeys[e.target.id]);
          
          router.push([pathname, _search.toString()].join("?"));
          break;
        }

        case "nursing": {
          
          if(e.target.value)
            _search.set(filterKeys[e.target.id], e.target.value); // filter by sections
          else
            _search.delete(filterKeys[e.target.id]);
          
          router.push([pathname, _search.toString()].join("?"));
          break;
        }
      }
    }
  }
  
  useEffect(()=>{
    getInternalServices().then(setInternalServices);
    getSections().then(setSections);
    getNursings({ 
      internalServiceId,
      sectionId: search.get("_fst") ?? undefined 
    }).then(setNursings);
  },[search]);

  return (
    <div className="flex gap-x-3">
      { componentRoute === "n" && 
        <Selection
          label="Filtrar por Serviço"
          options={internalServices} 
          id="service"
          onChange={filterHandler}
        />
      }

      <Selection
        label="Filtrar por Ala"
        id="section"
        options={sections} 
        onChange={filterHandler}
      />

      <Selection
        label="Filtrar por Enfermaria"
        options={nursings} 
        id="nursing"
        onChange={filterHandler}
      />
    </div>
  )
}