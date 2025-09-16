"use client";

import { useState, useActionState, useEffect } from "react";
import { BiPlus } from "react-icons/bi";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import Alert from "@/components/ui/alert";
import { signUrgencyService } from "@/backend/api/clinical/urgency-bank-api";

export default function SignUrgencyService(){
  const [ state, action ] = useActionState(signUrgencyService, { message: "", status: false });
  const [ modalState, setModalState ] = useState(false);
  const closeModal = ()=> setModalState(false);
  const [ messageState, setMessageState ] = useState(false);
  const router = useRouter();

  useEffect(()=>{
    if(state.message){
      setMessageState(true);

      setTimeout(()=>{
        if(state.status){
          router.refresh();
        }
        
        setMessageState(false);
      }, 2000);
    }
  }, [state, router]);
  return(
    <div>
      <Button 
        className="flex gap-x-2"
        onClick={()=>setModalState(true)}
      >
        <BiPlus />  
        Novo Serviço
      </Button>
      <Modal
        open={modalState}
        onClose={closeModal}
        title="Novo Serviço de Urgência"
        asWindow
      >
        <form action={action}>
          <InputField
            textLabel="Nome" 
            placeholder="Nome do Serviço"
            name="label"
            id="label"
            required
          />

          <div className="flex gap-x-3">
            <Button type="button" cancel onClick={closeModal}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
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