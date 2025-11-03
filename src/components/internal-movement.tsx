"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Modal from "@/components/modal";
import Selection, { SelectionOption } from "@/components/ui/selection";
import InputDetails from "@/components/ui/input-details";
import { getUrgencyServices, movementInUrgencyBank } from "@/backend/api/clinical/urgency-bank-api";

export default function InternalMovement(){
  const [modalstate, setModalState] = useState(false);
  const [ services, setServices ] = useState<SelectionOption[]>([]);
  const [ state, action ] = useActionState(movementInUrgencyBank, { message: "", status: false });
  const  openModal = ()=> setModalState(true);
  const closeModal = ()=> setModalState(false);
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

    return;
  }, [state]);

  useEffect( () => {
    getUrgencyServices().then( data => setServices(data));
  }, []);

  return(
    <div>
      <Button onClick={openModal}>Movimento Interno</Button>

      <Modal 
        title="Movimento Interno"
        open={modalstate}
        onClose={closeModal}
        asWindow
      >
        <form action={action}>
          <div className="my-4">
            <input 
              type="hidden" 
              name="patientId" 
              defaultValue={params.patientId} 
            />
             
            <Selection
              label="Selecione o serviço"
              options={services}
              name="urgencyService"
              required
            />

            <InputDetails
              textLabel="Motivo do movimento"
              placeholder="Descreva"
              name="reason"
              required
              rows={3}
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