"use client";

import clsx from "clsx";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import RequestConsult from "@/components/request-consult";
import Hospitalization from "@/components/hospitalization";
import RequestSurgery from "@/components/request-surgery";

type Components = "internal_moviment" | "request_consult" | "request_hospital" | "request_surgery";

type QuickComponent = {
  id: Components;
  Component: React.ReactNode;
}

export default function QuickFabShurtcut({ visibleComponent }: { visibleComponent: Components[]}){
  const [ state, setState ] = useState(false);

  const actions: QuickComponent [] = [
    { id: "request_consult", Component: <RequestConsult /> },
    { id: "request_surgery", Component: <RequestSurgery /> },
    { id: "request_hospital", Component: <Hospitalization /> }
  ];

  const filterActions = () => {
    const _actions: QuickComponent[] = [];

    visibleComponent.forEach((item)=>{
      const action = actions.find(e => e.id === item);
      if(action){
        _actions.push(action);
      }
    });

    return _actions;
  }

  return(
    <div className="fixed bottom-2 right-[3vw] flex flex-col">
      { state && <div className="grid mb-2 shadow-lg bg-white py-3 px-4 rounded-lg ring ring-gray-200/95 ring-1">
        { filterActions().map((ev, index) => (
          <div key={index}>{ev.Component}</div>
        ))}
      </div>}
      <button onClick={()=>setState(!state)} className={clsx("bg-primary p-5 rounded-full shadow-xl")}>
        <FaPlus className={clsx("size-8 text-white")}/>
      </button>
    </div>
  )
}