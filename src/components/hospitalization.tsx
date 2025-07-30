"use client";

import Button from "@/components/ui/button";
import Modal from "@/components/modal";
import { useActionState, useEffect, useState } from "react";
import InputDetails from "./ui/input-details";
import InputField from "./ui/input-field";
import { finishHospitalization } from "@/app/backend/api/clinical/urgency-bank-api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Hospitalization({ id }: { id: string }){
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
      >
        Internamento
      </Button>

      <Modal 
        title="Internamento"
        open={modalstate}
        onClose={closeModal}
      >

        <form action={action}>
          <div className="my-4">
            <input type="hidden" name="urgencyId" value={id} />
            <InputDetails
              textLabel="Descrição"
              placeholder="Descreva"
              name="description"
              rows={3}
            />

            <InputField
              type="datetime-local"
              textLabel="Data e Hora"
              name="createdAt"
            />

            <InputField
              type="text"
              textLabel="Estado ao internar"
              placeholder="Estado antes do internamento"
              name="currentState"
            />
          </div>

          <div className="flex gap-x-3 justify-end">
            <Button 
              cancel 
              type="button"
              onClick={closeModal}
              >Cancelar</Button>
            <Button>Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}