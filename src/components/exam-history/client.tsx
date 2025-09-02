"use client";

import { PatientHistory } from "@/backend/api/clinical/types";
import Modal from "@/components/modal";
import { useState } from "react";
import { getExamResultDetail } from "@/backend/api/clinical/scheduling-api";

export default function ExamHistoryComponent({ items }: { items: PatientHistory[]}){
  const [ modal, setModal ] = useState(false);
  const handlerClick = (id: string)=>{
    getExamResultDetail(id).then()
  }

  return(
    <div>
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-3">
        {items.map((props, index) =>(
          <div 
            key={index} 
            className="ring ring-1 px-3 py-2 ring-gray-200 rounded-lg hover:bg-gray-100"
            onClick={()=>handlerClick(props.internalServiceId)}
          >
            <small>{props.updatedAt.toLocaleString("pt-PT", { dateStyle: "long", timeStyle: "medium" })}</small>
            <h2>Quantidade de Exames: {3}</h2>
          </div>
        ))}

        {!items.length && <>Sem Histórico de exames realizados</>}
      </ul>

      <Modal
        open={modal}
        title="Detalhes do Exame"
        onClose={()=>setModal(false)}
      >
        <>test</>
      </Modal>
    </div>
  )
}

function ComponentChunk(){
  return;
}