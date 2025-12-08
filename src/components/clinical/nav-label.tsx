"use client";

import { usePathname } from "next/navigation";
import { getMyClinicalProfile } from "@/backend/api/clinical/api";
import { useEffect, useState } from "react";

type RouteMap = Map<string, { 
  href: string; 
  label: string;
}>;

type TypeService = "urgency-bank" | "hospitalization";

const TYPE_SERVICES: TypeService[]  = [
  "urgency-bank",
  "hospitalization"
];

export default function NavLabel({ routes }: { routes: RouteMap }){
  const [ service, setService ] = useState<string>();
  const pathname = usePathname();
  const directory = pathname.split("/").slice(0, 3);

  useEffect(()=>{

    TYPE_SERVICES.forEach(ev => {
      if(directory.includes(ev)){
        console.log(ev);
        getMyClinicalProfile().then(e => {
          if(e){
            const serviceName = e[ev];
            setService(serviceName);
          }
        })
      }
    });

  }, [pathname]);
  
  return(
    <div className="px-8 lg:px-48 border-b py-3 mb-3 flex gap-x-3">
      <h2 className="font-semibold uppercase">{routes.get(pathname.split("/").slice(0, 3).join("/"))?.label}</h2>
     {!!service && <h2 className="font-semibold uppercase">»{" "}{service}</h2>}
    </div>
  )
}