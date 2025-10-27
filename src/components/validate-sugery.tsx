"use client";

import { 
  useState,
  useEffect,
  useActionState, 
} from "react";
import { MdAttachMoney } from "react-icons/md";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import { updatePaymentDataToSugery } from "@/backend/api/clinical/scheduling-api";

export default function ValidateSugery({
  scheduleId,
  code,
  proof,
  value,
  disabled,
}:{
  scheduleId: string;
  code?: string;
  proof?: string;
  value?: number;
  disabled: boolean;
}){
  const [ state, action ] = useActionState(updatePaymentDataToSugery, { message: "", status: false });
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
      <Button disabled={disabled} onClick={openModal}>
        <MdAttachMoney className="size-6" />
        Validar
      </Button>

      <Modal 
        title="Validação da Cirurgia"
        open={modalState}
        onClose={closeModal}>
        <form {...{action}}>
          <input 
            type="hidden" 
            name="scheduleId" 
            defaultValue={scheduleId} 
          />

          <InputField
            textLabel="Código da Fatura"
            name="code"
            placeholder="Código da Fatura"
            defaultValue={code}
            required
          />

          <InputField
            textLabel="Código do Comprovante"
            name="proof"
            placeholder="Código do Comprovativo"
            defaultValue={proof}
            required
          />

          <InputField
            textLabel="Valor Pago"
            name="value"
            placeholder="Valor pago pelo utente"
            defaultValue={value}
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
      </Modal>
    </div>
  )
}