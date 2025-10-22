"use client";
import clsx from "clsx";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

type Props = {
  defaultActions: string[];
}

export default function QuickFabShurtcut(){
  const [ state, setState ] = useState(false);

  const actions= [
    { title: "Solicitar Consulta", action: ()=>{} },
    { title: "Solicitar Exame", action: ()=>{} },
    { title: "Solicitar Cirurgia", action: ()=>{} },
    { title: "Internamento", action: ()=>{}}
  ]
  return(
    <div className="fixed bottom-2 right-[3vw] flex flex-col">
      { state && <div className="grid mb-2 shadow-lg bg-white gap-y-2 py-3 px-4 rounded-lg">
        { actions.map(ev => <button className="hover:scale-110">{ev.title}</button>)}
      </div>}
      <button onClick={()=>setState(!state)} className={clsx("bg-indigo-500 p-5 rounded-full shadow-xl")}>
        <FaPlus className={clsx("size-8 text-white")}/>
      </button>
    </div>
  )
}