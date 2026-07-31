"use client";

import { useState, useActionState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Modal from "@/components/modal";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import { 
  getInternalServices, 
  signInternalService,
  movePatientTo
} from "@/backend/api/clinical/hospitalization-api";

import { toast } from "react-toastify";
import Selection, { SelectionOption } from "@/components/ui/selection";
import InputDetails from "@/components/ui/input-details";

function InternalMovimentForm(){
  const [ state, action ] = useActionState(movePatientTo, { message: "", status: false }); 
  const [ serviceState, serviceAction ]= useActionState(signInternalService, { message: "", status: false});
  const [ modalService, setModalService ] = useState(false);
  const [ internalServices, setInternalServices ] = useState<SelectionOption[]>([]);

  const router = useRouter();
  const params = useParams();
  
  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, { onOpen: router.refresh });
      else
        toast.error(state.message);

  }, [state]);

  useEffect(()=>{
    if(serviceState.message)
      if(serviceState.status)
        toast.success(serviceState.message, { 
          onClose: () => setModalService(false),
        });
      else
        toast.error(serviceState.message);

    getInternalServices().then(setInternalServices);
  }, [serviceState]);

  return(
    <div>
      <form action={action}>
        <input type="hidden" name="patientId" value={params.patientId} />
        <div className="flex gap-x-3 items-end">
          <Selection
            label="Serviço de Internamento"
            name="serviceId"
            options={internalServices} 
            required
            className="grow"
          />

          <Button disabled type="button" className="mb-4" onClick={()=>setModalService(true)}>Novo</Button>
        </div>

        <InputDetails
          textLabel="Movito"
          placeholder="Descreva o motivo do movimento ..." 
          name="reason"
          required
        />

        <Button disabled>Salvar</Button>
      </form>

      <Modal
        title="Novo serviço de Internamento"
        open={modalService}
        onClose={()=>setModalService(false)}
      >
        <form action={serviceAction}>
          <InputField
            textLabel="Nome"
            name="name"
            placeholder="Nome do serviço de internamento"
            required 
          />
          <Button>Salvar</Button>
        </form>
      </Modal>
    </div>
  )
}

export default function InternalMoviment(){
  const [ modalState, setModalState ] = useState(false);
  return(
    <>
      <Button onClick={()=>setModalState(true)}>Movimentar</Button>
      <Modal
        title="Novo serviço de Internamento"
        open={modalState}
        onClose={()=>setModalState(false)}
      >
        <InternalMovimentForm />
      </Modal>
    </>
  )
}