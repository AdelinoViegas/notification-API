"use client";

import { 
  useState,
  useEffect,
  useActionState, 
} from "react";
import { toast } from "react-toastify";
import { VscSend } from "react-icons/vsc";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import Button from "@/components/ui/button";
import { sendPatientToOffice } from "@/backend/api/clinical/office-api";

export default function SendAppointment({
  scheduleId,
}:{
  disabled?: boolean;
  scheduleId: string;
}){
  const [ state, action ] = useActionState(sendPatientToOffice, { message: "", status: false });
  const [ modalState, setModalState ] = useState(false);
  const closeModal = ()=> setModalState(false);
  const openModal = ()=> setModalState(true);
  const router = useRouter();

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, {
          onClose: ()=>{
            closeModal();
            router.replace('/clinical/appointment');
          }
        });
      else
        toast.error(state.message);
  }, [state, router]);

  return(
    <div>
      <Button 
        className="flex gap-3" 
        onClick={openModal}>
        <VscSend className="size-5" />
        Enviar
      </Button>

      <Modal 
        title="Enviar ao Consultório"
        open={modalState}
        onClose={closeModal}>
        <p className="mt-3">Tem certeza que deseja enviar este utente para o consultório?</p>
        <form {...{action}}>
          <input 
            type="hidden" 
            name="scheduleId" 
            defaultValue={scheduleId} 
          />

          <div className="justify-end flex gap-3">
            <Button 
              cancel 
              type="button" 
              onClick={closeModal}>
                Não
            </Button>
            <Button>Sim</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}