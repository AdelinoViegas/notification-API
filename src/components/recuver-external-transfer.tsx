"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Modal from "@/components/modal";
import Selection, { SelectionOption } from "@/components/ui/selection";
import { getExternalUnits } from "@/backend/api/clinical/urgency-bank-api";
import { externalTransfer, recuverFromExternalTransfer } from "@/backend/api/clinical/api";
import Alert from "./ui/alert";

export default function RecuverExternalTransfer({ id }: { id: string }){
  const [modalstate, setModalState] = useState(false);
  const [ state, action ] = useActionState(recuverFromExternalTransfer, { message: "", status: false });
  const [ selectState, setSelectState ] = useState(false);
  const [ externalUnits, setExternalUnits ] = useState<SelectionOption[]>([]);

  const closeModal = () => {
    setModalState(false);
  };
  const router = useRouter();
  const params = useParams<{ id: string; patientId: string }>();

  useEffect(()=>{

    if(state.message)
      if(state.status)
        toast.success(state.message, {
          onOpen: ()=> {
            router.replace("/clinical/patient/serveds");
          }   
        });
      else 
        toast.error(state.message);

  }, [state, router, selectState]);
  
  return(
    <div>
      <div className="relative">
        <Button onClick={()=> setModalState(true)}>Recuperar</Button>
      </div>

      <Modal 
        title="Retomar antendimento do utente"
        open={modalstate}
        onClose={closeModal}
        asWindow
      >
        <form action={action}>
          <input type="hidden" name="id" value={id} />
          <Alert
            type="warn"
            message="Atenção! Ao recuperar a ficha do usuário para o atendimento, é obrigatório atualizar todas as informações, garantindo que estejam alinhadas com a situação atual do usuário." 
          />

          <p className="uppercase mt-3 font-bold">
            Atenção! Ao recuperar a ficha do usuário para o atendimento, é obrigatório atualizar todas as informações, garantindo que estejam alinhadas com a situação atual do usuário.
          </p>
           
          <div className="flex gap-x-3 justify-end">
            <Button cancel type="button" onClick={closeModal}>Fechar</Button>
            <Button>Compreendi</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}