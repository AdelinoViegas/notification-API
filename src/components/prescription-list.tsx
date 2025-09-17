"use client";

import { useState, useEffect } from "react";
import Prescription from "@/components/forms/prescription";
import { getPrescription } from "@/backend/api/clinical/urgency-bank-api";

type PrescriptionIF = Awaited<ReturnType<typeof getPrescription>>;

function List({ id }:{ id: string }){
  const [ data, setData ] = useState<PrescriptionIF>();

  useEffect(()=>{
    getPrescription(id).then(setData).finally(()=> console.log(data));
  }, []);
  return(
    <div className="ring ring-gray-200 ring-1 rounded px-3 py-2">
      <h2 className="line-clamp-1">Receituário</h2>
      <p className="text-sm text-gray-500 font-medium">{data?.makedAt.toLocaleString()}</p>
      <Prescription
        buttonText="Ver detalhes"
        buttonClass="text-blue-500"
        id={id}
        date={data?.makedAt.toLocaleTimeString()}
        description={data?.description} 
      />
    </div>
  );
}

export default function PrescriptionList({ items }:{ items: PrescriptionIF[] }){
  return(
    <div>
      <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
        {items.map((props, index)=>(
          <li key={index}><List id={props?._id as string} /></li>
        ))}
      </ul>
    </div>
  )
}