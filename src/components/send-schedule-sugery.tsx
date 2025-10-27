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
import { sendPatientToOperatingRoom } from "@/backend/api/clinical/operating-room-api";

export default function SendScheduleSugery({
  scheduleId,
}:{
  disabled?: boolean;
  scheduleId?: string;
}){
  const [ state, action ] = useActionState(sendPatientToOperatingRoom, { message: "", status: false });
  const [ modalState, setModalState ] = useState(false);
  const closeModal = ()=> setModalState(false);
  const openModal = ()=> setModalState(true);
  const router = useRouter();

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, {
          autoClose: 3500,
          onClose: () => { 
            closeModal();
            router.replace('/clinical/schedule-surgery');
          }          
        });
      else
        toast.error(state.message, {autoClose: 3500});
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
        title="Enviar ao Bloco Operatório"
        open={modalState}
        onClose={closeModal}>
        <p className="mt-3">Tem certeza que deseja enviar este utente para o Bloco Operatório?</p>
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