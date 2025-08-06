"use client";
import { useState, useActionState, useEffect } from "react";
import Modal from "@/components/modal";
import Button from "@/components/ui/button";
import InputDetails from "@/components/ui/input-details";
import InputField from "@/components/ui/input-field";
import { addPrescription } from "@/app/backend/api/clinical/urgency-bank-api";
import { toast } from "react-toastify";

export default function Prescription({}: {}){
  const [ state, action ] = useActionState(addPrescription, { message: "", status: false }); 
  const [ modal, setModal ] = useState(false);
  

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message);
      else
        toast.error(state.message);

  }, [state]);
  return(
    <div>
      <Button onClick={()=>setModal(true)}>Novo</Button>

      <Modal
        open={modal}
        asWindow
        onClose={()=>setModal(false)}
        title="Novo Receituario"
      >
        <form action={action}>
          <input type="hidden" name="id" value={""} />

          <InputField
            textLabel="Data"
            type="datetime-local"
            name="makedAt" 
            required
          />

          <InputDetails
            textLabel="Descrição" 
            name="description"
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