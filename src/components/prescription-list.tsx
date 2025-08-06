// "use client";

// import { useState, useEffect } from "react";
// import { getPrescriptions } from "@/app/backend/api/clinical/urgency-bank-api";

// type PrescriptionIF = Awaited<ReturnType<typeof getPrescriptions>>;

// function List({ id }:{ id: string }){
//   const [ data, setData ] = useState<PrescriptionIF[number]>();

//   useEffect(()=>{
//     getPrescriptions({ id }).then(props => setData(props[0]))
//   }, []);
  
//   if(data)
//     return(
//       <div className="ring ring-gray-200 ring-1 rounded px-3 py-2">
//         <h2 className="line-clamp-1">{data?.description}</h2>
//         <p className="text-sm text-gray-500 font-medium">{data?.makedAt.toLocaleString()}</p>
//         <button>ver detalhes</button>
//       </div>
//     );
// }

// export default function PrescriptionList({ items }:{ items: PrescriptionIF }){
//   return(
//     <div>
//       <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
//         {!items.length && <h2>sem registro</h2>}
//         {items.map((props, index)=>(
//           <li key={index}><List id={props._id as string} /></li>
//         ))}
//       </ul>
//     </div>
//   )
// }

"use client";

import { useState, useEffect } from "react";
import Prescription from "@/components/forms/prescription";
import { getPrescriptions } from "@/app/backend/api/clinical/urgency-bank-api";

type PrescriptionIF = Awaited<ReturnType<typeof getPrescriptions>>;

function List({ id }:{ id: string }){
  const [ data, setData ] = useState<PrescriptionIF[number]>();

  useEffect(()=>{
    getPrescriptions({ id })
    .then(props => setData(props[0]))
  })
  return(
    <div className="ring ring-gray-200 ring-1 rounded px-3 py-2">
      <h2 className="line-clamp-1">{data?.description}</h2>
      <p className="text-sm text-gray-500 font-medium">{data?.makedAt.toLocaleString()}</p>
      <Prescription
        buttonText="Editar"
        buttonClass="text-blue-500"
        id={id}
        date={data?.makedAt.toISOString().split('.')[0].slice(0, -3)}
        description={data?.description} 
      />
    </div>
  )
}

export default function PrescriptionList({ items }:{ items: PrescriptionIF }){
  return(
    <div>
      <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
        {items.map((props, index)=>(
          <li key={index}><List id={props._id as string} /></li>
        ))}
      </ul>
    </div>
  )
}