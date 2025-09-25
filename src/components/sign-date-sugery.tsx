"use client";

import { 
  useState,
  useEffect, 
  useActionState 
} from "react";
import { useRouter } from "next/navigation";
import { BiPlus } from "react-icons/bi";
import Modal from "@/components/modal";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import Alert from "@/components/ui/alert";
import { signDateSugery } from "@/backend/api/clinical/scheduling-api";

export default function SignDateSugery({ scheduleId }:{ scheduleId: string;}){
  const [ state, action ] = useActionState(signDateSugery, { message: "", status: false });
  const [ modalState, setModalState ] = useState(false);
  const closeModal = ()=> setModalState(false);
  const openModal = ()=> setModalState(true);
  const [ messageState, setMessageState ] = useState(false);
  const router = useRouter();

  useEffect(()=>{
    if(state.message){
      setMessageState(true);

      setTimeout(()=>{
        setMessageState(false);

        if(state.status){
          closeModal();
          router.refresh();  
        }
      }, state.status?2000:7000);
    }
  }, [state, router]);

  return(
    <div>
      <Button
        className="flex gap-x-2 bg-gray-700"
        onClick={openModal}>
        <BiPlus className="w-5" />
        Definir data da cirurgia 
      </Button>

      <Modal 
        title="Definir data e hora da cirurgia"
        open={modalState}
        onClose={closeModal}>
        <form {...{action}}>
          <input 
            type="hidden" 
            name="scheduleId" 
            defaultValue={scheduleId} 
          />

          <InputField
            textLabel="Hora da Consulta"
            type="Date" 
            name="sugeryDate"
            required
          />

          <InputField
            textLabel="Hora da Consulta"
            type="time" 
            name="sugeryHour"
            required
          />

          <div className="justify-end flex gap-3">
            <Button 
              cancel 
              type="button" 
              onClick={closeModal}>
                Cancelar
            </Button>
            <Button>Salvar</Button>
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