"use client";

import Prescription from "@/components/forms/prescription";
import { getPrescription } from "@/backend/api/clinical/urgency-bank-api";

type PrescriptionIF = Awaited<ReturnType<typeof getPrescription>>;

function Item(params: PrescriptionIF ){
  return(
    <div className="ring ring-gray-200 ring-1 rounded px-3 py-2">
      <h2 className="line-clamp-1">Receituário</h2>
      <p className="text-sm text-gray-500 font-medium">{params?.makedAt.toLocaleString()}</p>

      <Prescription
        buttonText="Ver detalhes"
        buttonClass="text-blue-500"
        id={params?._id as string}
        date={params?.makedAt.toLocaleString("pt", { dateStyle: "long", timeStyle: "medium"})}
        description={params?.description} 
      />
    </div>
  );
}

export default function PrescriptionList({ items }:{ items: PrescriptionIF[] }){
  return(
    <div>
      <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
        {items.map((props, index)=>(
          <li key={index}><Item {...props} /></li>
        ))}
      </ul>
    </div>
  )
}