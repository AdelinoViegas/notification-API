"use client";

import Button from "@/components/ui/button";
import Modal from "@/components/modal";
import { useActionState, useEffect, useState } from "react";
import InputDetails from "@/components/ui/input-details";
import InputField from "@/components/ui/input-field";
import { finishHospitalization } from "@/backend/api/clinical/urgency-bank-api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Hospitalization({ 
  id,
  patientId 
}:{ 
  id: string;
  patientId: string; 
}){
  const [modalstate, setModalState] = useState(false);
  const [ state, action ] = useActionState(finishHospitalization, { message: "", status: false });
  const  openModal = ()=> setModalState(true);
  const closeModal = ()=> setModalState(false);
  const router = useRouter();

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, {
          onOpen: ()=> {
            router.replace("/clinical/urgency-bank");
          },
        });
      else 
        toast.error(state.message);

    return;
  }, [state]);
  return(
    <div>
      <Button 
        onClick={openModal}
        className="bg-slate-700"
        disabled={!id}
      >
        Internamento
      </Button>

      <Modal 
        title="Internamento"
        open={modalstate}
        onClose={closeModal}
        asWindow
      >
        <form action={action}>
          <div className="my-4">
            <input type="hidden" name="urgencyId" value={id} />
            <input type="hidden" name="patientId" value={patientId} />
            
            <InputDetails
              textLabel="Descrição"
              placeholder="Descreva"
              name="description"
              required
              rows={3}
            />

            <InputField
              type="datetime-local"
              textLabel="Data e Hora"
              name="donedAt"
              required
            />

            <InputField
              type="text"
              textLabel="Estado ao internar"
              placeholder="Estado antes do internamento"
              name="currentState"
              required
            />
          </div>

          <div className="flex gap-x-3 justify-end">
            <Button cancel type="button" onClick={closeModal}>Cancelar</Button>
            <Button>Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}