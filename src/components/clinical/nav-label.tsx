"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getMyClinicalProfile } from "@/backend/api/clinical/api";

type RouteMap = Map<string, { href: string, label: string }>;

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
        getMyClinicalProfile().then(e => {
          if(e){
            const serviceName = e[ev];
            setService(serviceName);
          }
        })
      }else 
        setService(undefined);
    });
  }, [pathname]);
  
  return(
    <div className="px-8 lg:px-48 border-b mb-3 py-1 flex gap-x-3 bg-gray-100">
      <h2 className="font-semibold uppercase">{routes.get(pathname.split("/").slice(0, 3).join("/"))?.label}</h2>
     {!!service && <h2 className="font-semibold uppercase text-white">»{" "}{service}</h2>}
    </div>
  )
}