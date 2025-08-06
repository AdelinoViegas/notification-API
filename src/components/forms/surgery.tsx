"use client";

import { useState, useActionState, useEffect } from "react";
import Modal from "@/components/modal";
import Button from "@/components/ui/button";
import InputDetails from "@/components/ui/input-details";
import { requestSurgery } from "@/app/backend/api/clinical/urgency-bank-api";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

export default function Surgery(){
  const [ state, action ] = useActionState(requestSurgery, { message: "", status: false }); 
  const [ modal, setModal ] = useState(false);
  const params = useParams();
  
  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, { 
          onOpen: () => {
            setModal(false);
            window.location.reload();
          }
        });
      else
        toast.error(state.message);

  }, [state]);
  return(
    <div>
      <Button onClick={()=>setModal(true)}>Novo Pedido</Button>

      <Modal
        open={modal}
        asWindow
        onClose={()=>setModal(false)}
        title="Pedido de Cirurgia"
      >
        <form action={action}>
          <input 
            type="hidden" 
            name="patientId" 
            value={params.patientId} 
          />

          <InputDetails
            textLabel="Descrição" 
            name="description"
            placeholder="Faça um descrição dos movitos que levem a solicitar uma cirurgia"
            required
          />

          <div className="flex gap-x-3 items-center">
            <Button cancel onClick={()=>setModal(false)} type="button">Fechar</Button>
            <Button>Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}