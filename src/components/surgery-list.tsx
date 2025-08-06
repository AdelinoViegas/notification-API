"use client";

import { useState } from "react";
import { getSurgery } from "@/app/backend/api/clinical/urgency-bank-api";
import Modal from "@/components/modal";
import clsx from "clsx";

type Surgeries = Awaited<ReturnType<typeof getSurgery>>;

function SurgeryState({ state }:{ state: string}){
  const defaults = [
    { id: "opened", name: "Aberto", className: "bg-yellow-200 text-yellow-800 font-semibold" },
    { id: "rejected", name: "Fechado", className: "bg-red-200 text-red-800 font-semibold" },
    { id: "pending", name: "Em Atendimento", className: "bg-orange-200 text-orange-800 font-semibold" },
    { id: "resolved", name: "Atendido", className: "bg-green-200 text-green-800 font-semibold" }
  ];

  const map = new Map<string, typeof defaults[number]>();
  defaults.forEach(e => map.set(e.id, e));
  
  return(
    <div className={clsx(
      "text-xs p-1 text-center rounded-lg",
      map.get(state)?.className,
    )}>
      <h2>{map.get(state)?.name}</h2>
    </div>
  )
}

function Item({ data }: { data: Surgeries[number] }){
  // const [ data, setData ] = useState<PrescriptionIF[number]>();
  // const [ surgery, setSurgery ] = useState<Surgeries[number]>();
  const [ modal, setModal ] = useState(false);

  // const handlerDoubleClick = useCallback(()=>{
  //   getSurgery({ id: data._id }).then(data => {
  //     setSurgery(data[0]);
  //     setModal(true);
  //   })
  // }, [])
  
  // if(data)
  //   return(
  //     <div className="ring ring-gray-200 ring-1 rounded px-3 py-2">
  //       <h2 className="line-clamp-1">{data?.description}</h2>
  //       <p className="text-sm text-gray-500 font-medium">{data?.makedAt.toLocaleString()}</p>
  //       <button>ver detalhes</button>
  //     </div>
  //   );
  return(
    <div className="grid grid-cols-6 gap-x-3 px-3 py-2 hover:bg-primary/25 select-none" onDoubleClick={()=>setModal(true)}>
      <div>
        <h2>{data.createdAt.toISOString().split('T')[0]}</h2>
      </div>

      <div className="col-span-3">
        <h2 className="line-clamp-1">{data.description}</h2>
      </div>

      <div>
        <SurgeryState state={data.state} />
      </div>

      <div>
        <h2>{"Mingo Silas"}</h2>
      </div>

      <Modal 
        title="Detalhes do Pedido"
        open={modal}
        onClose={()=>setModal(false)} 
      >
        <div className="space-y-3 my-3">
          <div>
            <label className="font-semibold text-sm">Data de Registro</label>
            <h2>{data.createdAt.toLocaleString()}</h2>
          </div>

          <div className="col-span-3">
            <label className="font-semibold text-sm">Descrição do Pedido</label>
            <h2 className="line-clamp-1">{data.description}</h2>
          </div>

          <div className="flex flex-col items-start">
            <label className="font-semibold text-sm">Estado do Pedido</label>
            <SurgeryState state={data.state} />
          </div>

          <div>
            <label className="font-semibold text-sm">Médico a tratar do Processo</label>
            <h2>{"Mingo Silas"}</h2>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default function SurgeryList({ items }:{ items: Surgeries }){
  return(
    <div>
      <ul className="mt-3 ring ring-1 ring-gray-300 rounded-lg overflow-hidden">
        <div className="font-bold grid grid-cols-6 gap-x-2 bg-primary/90 text-white px-3 items-center py-3">
          <h2>Registrado em</h2>
          <h2 className="col-span-3">Descrição</h2>
          <h2>Estado</h2>
          <h2>Medico</h2>
        </div>
        {!items.length && <h2>sem registro</h2>}
        {items.map((props, index)=>(
          <li key={index}><Item data={props} /></li>
        ))}
      </ul>
    </div>
  )
}