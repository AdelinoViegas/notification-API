"use client";

import { 
  useState, 
  useEffect, 
  useRef,
  useActionState 
} from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import Selection from "@/components/ui/selection";
import { signExternalUnit } from "@/backend/api/clinical/urgency-bank-api";
import { AngolaProvices } from "@/backend/api/clinical/translator";

export default function ExternalUnitForm({ isEdit }: { isEdit?: boolean }) {
  const [ state, action ] = useActionState(signExternalUnit, { message: "", status: false });
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
          },
        });
      else
        toast.error(state.message, {autoClose: 3500});
  }, [state, router]);

  return(
    <div>
      <Button
        disabled={isEdit} 
        type="button" 
        onClick={openModal} 
        className="flex gap-x-2"
      >
        Nova Unidade Externa
      </Button>

      <Modal 
        title="Cadastro de Unidade Externa"
        open={modalState}
        onClose={closeModal}>
        <form ref={formRef} {...{action}}>
          <input type="hidden" name="type" value="group" />
          <InputField
            textLabel="Nome da Unidade" 
            placeholder="Nome da Unidade"
            required
            name="name"
          />

          <InputField
            textLabel="Rua" 
            placeholder="Rua"
            name="street"
          />

          <InputField
            textLabel="Município" 
            placeholder="Município"
            name="municipality"
          />

          <Selection
            label="Província"
            options={AngolaProvices}
            name="province"
            required
          />

          <div className="flex gap-3 justify-end">
            <Button
              onClick={closeModal} 
              type="button" 
              cancel
            >
              Fechar
            </Button>
            <Button>Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}