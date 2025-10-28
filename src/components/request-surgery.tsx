"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import Modal from "@/components/modal";
import Button from "@/components/ui/button";
import Selection from "@/components/ui/selection";
import { registerRequest } from "@/backend/api/clinical/operating-room-api";
import { getServices } from "@/backend/api/clinical/scheduling-api";

type GetServices = Awaited<ReturnType<typeof getServices>>;

export default function RequestSurgery(){
  const [ modalState, setModalState ] = useState(false);
  const [ state, action ] = useActionState(registerRequest, { message: "", status: false });
  const params = useParams<{ patientId: string }>();
  const [ surgeries, setSurgeries ] = useState<GetServices>([]);
  
  useEffect(()=>{
    getServices({ kind: "surgery" }).then(setSurgeries);

    if(state.message)
      if(state.status)
        toast.success(state.message);
      else
        toast.error(state.message);

  }, [state]);

  return(
    <>
      <Button onClick={()=>setModalState(true)}>Solicitar Cirurgia</Button>

      <Modal 
        title="Solicitação da cirurgia" 
        onClose={()=>setModalState(false)} 
        open={modalState}
      >
        <form action={action}>
          <input type="hidden" name="patientId" value={params.patientId} />
          <input type="hidden" name="from" value="surgery" />

          <Selection
            label="Tipo de Cirugia"
            name="kind"
            required
            options={surgeries} 
          />
          <Button>Enviar</Button>
        </form>
      </Modal>
    </>
  )
}