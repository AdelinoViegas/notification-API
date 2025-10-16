"use client";

import { 
  useState,
  useEffect,
  useActionState, 
} from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import Button from "@/components/ui/button";
import Alert from "@/components/ui/alert";
import { sendPatientToOperatingRoom } from "@/backend/api/clinical/operating-room-api";

import { VscSend } from "react-icons/vsc";
import { toast } from "react-toastify";

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
  const [ messageState, setMessageState ] = useState(false);
  const router = useRouter();

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, {
          autoClose: 3500,
          onClose: () => { 
            closeModal();
            router.replace('/clinical/schedule-sugery');
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

        {
          state.message && messageState &&
          <div className="mt-3">
            <Alert
              type={state.status?'success':'error'}
              message={state.message}
            />
          </div>
        }
      </Modal>
    </div>
  )
}