"use client";
import { useState, useActionState, useEffect } from "react";
import Modal from "@/components/modal";
import Button from "@/components/ui/button";
import InputDetails from "@/components/ui/input-details";
import InputField from "@/components/ui/input-field";
import { addPrescription } from "@/app/backend/api/clinical/urgency-bank-api";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

export default function Prescription({
  buttonText,
  buttonClass,
  date,
  description,
  id
}:{
  buttonText?: string;
  buttonClass?: string;
  id?: string;
  date?: string;
  description?: string;
}){
  const [ state, action ] = useActionState(addPrescription, { message: "", status: false }); 
  const [ modal, setModal ] = useState(false);
  const params = useParams();
  
  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, { 
          onClose: () => setModal(false),
          onOpen: () => {
            if(id)
              setModal(false);
            window.location.reload();
          }
        });
      else
        toast.error(state.message);

  }, [state]);
  return(
    <div>
      {!buttonText && <Button onClick={()=>setModal(true)}>Novo</Button>}
      {!!buttonText && <button className={buttonClass} onClick={()=>setModal(true)}>{buttonText}</button>}

      <Modal
        open={modal}
        asWindow
        onClose={()=>setModal(false)}
        title="Novo Receituario"
      >
        <form action={action}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="patientId" value={params.patientId} />

          <InputField
            textLabel="Data"
            type="datetime-local"
            name="makedAt" 
            defaultValue={date}
            required
          />

          <InputDetails
            textLabel="Descrição" 
            name="description"
            defaultValue={description}
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