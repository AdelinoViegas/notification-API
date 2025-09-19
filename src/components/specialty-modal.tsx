"use client";

import { 
  useState,
  useEffect,
  useRef,
  useActionState
} from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import Alert from "@/components/ui/alert";
import { BiPlus as PlusIcon } from "react-icons/bi";
import { signSpecialty } from "@/backend/api/clinical/api";

export default function SpecialtyModal({ isExamServices }: { isExamServices?: boolean; }){
  const [ state, action ] = useActionState(signSpecialty, { message: "", status: false });
  const [ modalState, setModalState ] = useState(false);
  const closeModal = ()=> setModalState(false);
  const openModal = ()=> setModalState(true);
  const [ messageState, setMessageState ] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(()=>{
    if(state.message){
      setMessageState(true);

      setTimeout(()=>{
        if(state.status){
          router.refresh();
          formRef.current?.reset();
        }
        
        setMessageState(false);
      }, 2000);
    }
  }, [state, router]);

  return(
    <div>
      <Button type="button" onClick={openModal} className="flex gap-x-1">
        <PlusIcon className="w-5" />
        {isExamServices?"Nova":"Nova Especialidade"}
      </Button>

      <Modal 
        title="Nova Expecialidade"
        open={modalState}
        onClose={closeModal}>
        <form ref={formRef} {...{action}}>
          <input type="hidden" name="type" value="group" />
          <InputField
            textLabel="Nome da Especialidade" 
            placeholder="Descrição do nome da especialidade"
            required
            name="name"
          />

          <div className="flex gap-3 justify-end">
            <Button
              onClick={closeModal} 
              type="button" 
              cancel>Cancelar</Button>
            <Button>Salvar</Button>
          </div>
        </form>
        
        { messageState &&
          <div className="mt-3">
            <Alert
              message={state.message}
              type={state.status?"success":"error"} 
            /> 
          </div>
        }
      </Modal>
    </div>
  )
}