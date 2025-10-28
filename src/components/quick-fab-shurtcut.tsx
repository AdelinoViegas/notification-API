"use client";

import clsx from "clsx";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import RequestConsult from "@/components/request-consult";
import Hospitalization from "@/components/hospitalization";
import RequestSurgery from "@/components/request-surgery";

type  RequestSugeryElement = {
  id: "reqSurgery";
  Component: typeof RequestSurgery;
}

type  RequestElement = {
  id: "reqConsult";
  Component: typeof RequestConsult;
}

type  HospitalElement = {
  id: "reqHospital";
  Component: typeof Hospitalization;
}

export default function QuickFabShurtcut(){
  const [ state, setState ] = useState(false);

  const actions: [RequestSugeryElement, RequestElement, HospitalElement, ] = [
    { id: "reqSurgery", Component: RequestSurgery },
    { id: "reqConsult", Component: RequestConsult },
    { id: "reqHospital", Component: Hospitalization }
  ];

  return(
    <div className="fixed bottom-2 right-[3vw] flex flex-col">
      { state && <div className="grid mb-2 shadow-lg bg-white py-3 px-4 rounded-lg ring ring-gray-200/95 ring-1">
        { actions.map((ev, index) => (
          <div 
            key={index} 
          >
            {ev.id === "reqSurgery" && <ev.Component />}
            { ev.id === "reqConsult" && <ev.Component /> }
            { ev.id === "reqHospital" && <ev.Component patientId="203040340340340" id="test" /> }
          </div>
        ))}
      </div>}
      <button onClick={()=>setState(!state)} className={clsx("bg-primary p-5 rounded-full shadow-xl")}>
        <FaPlus className={clsx("size-8 text-white")}/>
      </button>
    </div>
  )
}