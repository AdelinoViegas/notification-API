"use client";

import { 
  useState,
  useEffect,
  useRef,
  useActionState
} from "react";
import { toast } from "react-toastify";
import { BiPlus as PlusIcon } from "react-icons/bi";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import { signSpecialty } from "@/backend/api/clinical/api";

export default function SpecialtyModal({ shortWord }: { shortWord?: boolean; }){
  const [ state, action ] = useActionState(signSpecialty, { message: "", status: false });
  const [ modalState, setModalState ] = useState(false);
  const closeModal = ()=> setModalState(false);
  const openModal = ()=> setModalState(true);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, {
          autoClose: 3500,
          onClose: ()=> {
            router.refresh()
            formRef.current?.reset()
          }
        });
      else
        toast.error(state.message, {autoClose: 3500});
  }, [state, router]);

  return(
    <div>
      <Button type="button" onClick={openModal} className="flex gap-x-1 mb-4">
        <PlusIcon className="w-5" />
        {shortWord?"Nova":"Nova Especialidade"}
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
      </Modal>
    </div>
  )
}