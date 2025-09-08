"use client";

import { PatientHistory } from "@/backend/api/clinical/types";
import Modal from "@/components/modal";
import { useState } from "react";
import { getExamResultDetail } from "@/backend/api/clinical/scheduling-api";
import Accordium from "@/components/ui/accordium";
import InputDetails from "@/components/ui/input-details";
import ViewUserFile from "@/components/view-user-file-client";

type  ResultDetails = Awaited<ReturnType<typeof getExamResultDetail>>;

export default function ExamHistoryComponent({ items }: { items: PatientHistory[]}){
  const [ modal, setModal ] = useState(false);
  const [ resultDetail, setResultDetail ] = useState<ResultDetails>([]);

  const handlerClick = (id: string)=>{
    getExamResultDetail(id)
    .then(data => {
      setResultDetail(data);
      setModal(true);
    });
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
            <h2>Quantidade de Exames: {props.examsQuantity}</h2>
          </div>
        ))}

        {!items.length && <span className="col-span-2">Sem Histórico de exames realizados</span>}
      </ul>

      <Modal
        open={modal}
        title="Detalhes do Exame"
        onClose={()=>setModal(false)}
      >
        <div>
          <ul className="space-y-3">
            {resultDetail.map((props, index)=>(
              <Accordium title={props.name} key={index}>
                <h2 className="bg-green-200 px-3 rounded-lg">{props.createdAt.toLocaleString("pt", { dateStyle: "long", timeStyle: "medium" })}</h2>
                <InputDetails
                  textLabel="Resultado Descritivo"
                  defaultValue={props.description as string}
                  rows={2}
                  disabled 
                />

                {
                  props?.storageId && 
                  <ViewUserFile id={props.storageId} />
                }
              </Accordium>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  )
}