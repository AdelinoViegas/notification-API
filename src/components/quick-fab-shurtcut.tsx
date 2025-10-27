"use client";

import clsx from "clsx";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import RequestConsult from "@/components/request-consult";
import Hospitalization from "@/components/hospitalization";
import RequestSurgery from "./request-surgery";

type  RequestElement = {
  id: "reqConsult";
  Component: typeof RequestConsult;
}

type  HospitalElement = {
  id: "reqHospital";
  Component: typeof Hospitalization;
}

type SurgeryElement = {
  id: "reqSurgery";
  Component: typeof RequestSurgery;
}

export default function QuickFabShurtcut(){
  const [ state, setState ] = useState(false);
  
  const actions: [ RequestElement, HospitalElement, SurgeryElement ] = [
    { id: "reqConsult", Component: RequestConsult },
    { id: "reqHospital", Component: Hospitalization },
    { id: "reqSurgery", Component: RequestSurgery }
  ];

  return(
    <div className="fixed bottom-2 right-[3vw] flex flex-col">
      { state && <div className="grid mb-2 shadow-lg bg-white py-3 px-4 rounded-lg ring ring-gray-200/95 ring-1">
        { actions.map((ev, index) => (
          <div 
            key={index} 
          >
            { ev.id === "reqConsult" && <ev.Component /> }
            { ev.id === "reqSurgery" && <ev.Component /> }
            { ev.id === "reqHospital" && <ev.Component /> }
          </div>
        ))}
      </div>}
      <button onClick={()=>setState(!state)} className={clsx("bg-primary p-5 rounded-full shadow-xl")}>
        <FaPlus className={clsx("size-8 text-white")}/>
      </button>
    </div>
  )
}