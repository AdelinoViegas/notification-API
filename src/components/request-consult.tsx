"use client";

import Modal from "@/components/modal";
import Button from "./ui/button";
import { useActionState, useEffect, useState } from "react";
import Selection from "./ui/selection";
import { useParams, useRouter } from "next/navigation";
import { registerRequest } from "@/backend/api/clinical/office-api";
import { toast } from "react-toastify";
import { getServices } from "@/backend/api/clinical/scheduling-api";

type GetServices = Awaited<ReturnType<typeof getServices>>;

export default function RequestConsult(){
  const [ modalState, setModalState ] = useState(false);
  const [ state, action ] = useActionState(registerRequest, { message: "", status: false });
  const params = useParams<{ patientId: string }>();
  const [ consultations, setConsultations ] = useState<GetServices>([]);
  const router = useRouter();
  
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

          <Selection
            label="Tipo de Consulta"
            name="kind"
            required
            options={consultations} 
          />
          <Button>Enviar</Button>
        </form>
      </Modal>
    </>
  )
}