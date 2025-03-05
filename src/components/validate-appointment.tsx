"use client";

import { 
  useState,
  useEffect,
  useActionState, 
} from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import Alert from "@/components/ui/alert";
import { updatePaymentData } from "@/app/backend/api/clinical/office-api";
import { triggerUpdate } from "@/lib/ws-trigger";
import { MdAttachMoney } from "react-icons/md";

export default function ValidateAppointment({
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
  const [ state, action ] = useActionState(updatePaymentData, { message: "", status: false });
  const [ modalState, setModalState ] = useState(false);
  const closeModal = ()=> setModalState(false);
  const openModal = ()=> setModalState(true);
  const [ messageState, setMessageState ] = useState(false);
  const router = useRouter();

  useEffect(()=>{
    if(state?.message){
      setMessageState(true);

      setTimeout(()=>{
        if(state.status){
          triggerUpdate({ target: "office"});
          triggerUpdate({ target: "appointment"});
          closeModal();
          router.replace('/clinical/appointment');
        }
        setMessageState(false);
      }, 2000);
    }
  }, [state, router]);

  return(
    <div>
      <Button disabled={disabled} onClick={openModal}>
        <MdAttachMoney className="size-6" />
        Validar
      </Button>

      <Modal 
        title="Validação da Consulta"
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

        {
          state?.message && messageState &&
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