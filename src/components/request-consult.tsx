"use client";

import Modal from "@/components/modal";
import Button from "./ui/button";
import { useActionState, useEffect, useState } from "react";
import Selection from "./ui/selection";
import { useParams, useRouter, usePathname } from "next/navigation";
import { registerRequest } from "@/backend/api/clinical/office-api";
import { toast } from "react-toastify";
import { getServices } from "@/backend/api/clinical/scheduling-api";
import InputDetails from "./ui/input-details";

type GetServices = Awaited<ReturnType<typeof getServices>>;

export default function RequestConsult(){
  const [ modalState, setModalState ] = useState(false);
  const [ state, action ] = useActionState(registerRequest, { message: "", status: false });
  const params = useParams<{ patientId: string }>();
  const [ consultations, setConsultations ] = useState<GetServices>([]);
  const router = useRouter();
  const path = usePathname();
  
  useEffect(()=>{
    getServices({ kind: "consultation" }).then(setConsultations);

    if(state.message)
      if(state.status)
        toast.success(state.message, {
          onOpen: router.refresh
        });
      else
        toast.error(state.message);

  }, [state]);

  return(
    <>
      <Button onClick={()=>setModalState(true)}>Solicitar Consulta</Button>

      <Modal 
        title="Solicitação de consulta" 
        onClose={()=>setModalState(false)} 
        open={modalState}
      >
        <form action={action}>
          <input type="hidden" name="patientId" value={params.patientId} />
          <input type="hidden" name="from" value="consultation" />
          <input type="hidden" name="originOfrequest" defaultValue={path.split("/")[2]}/>

          <Selection
            label="Tipo de Consulta"
            name="kind"
            required
            options={consultations} 
          />

          <InputDetails
            textLabel="Movito"
            placeholder="Descreva o motivo do pedido..."
            required
            name="reason" 
          />

          <Button>Enviar</Button>
        </form>
      </Modal>
    </>
  )
}