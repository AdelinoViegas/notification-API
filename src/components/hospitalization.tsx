"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Modal from "@/components/modal";
import InputDetails from "@/components/ui/input-details";
import InputField from "@/components/ui/input-field";
import { finishHospitalization } from "@/backend/api/clinical/urgency-bank-api";
import Selection, { SelectionOption } from "@/components/ui/selection";
import { getInternalServices } from "@/backend/api/clinical/hospitalization-api";

export default function Hospitalization(){
  const [modalstate, setModalState] = useState(false);
  const [ state, action ] = useActionState(finishHospitalization, { message: "", status: false });
  const closeModal = ()=> setModalState(false);
  const [ internalServices, setInternalServices ] = useState<SelectionOption[]>([]);
  const router = useRouter();
  const params = useParams();

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
    
      getInternalServices().then(setInternalServices);
      
  }, [state]);
  return(
    <div>
      <Button onClick={()=> setModalState(true)}>Internamento</Button>

      <Modal 
        title="Internamento"
        open={modalstate}
        onClose={closeModal}
        asWindow
      >
        <form action={action}>
          <div className="my-4">
            <input type="hidden" name="patientId" value={params.patientId} />

            <Selection
              label="Serviço de Internamento"
              name="serviceId"
              options={internalServices} 
              required
              className="grow"
            />
            
            <InputDetails
              textLabel="Descrição"
              placeholder="Descreva o motivo do internamento"
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