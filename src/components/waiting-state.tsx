"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Modal from "@/components/modal";
import { isWaiting, patientWaiting } from "@/backend/api/clinical/urgency-bank-api";

type PatientState = Awaited<ReturnType<typeof isWaiting>>;

export default function WaitingState({ id }: { id?: string }){
  const [modalstate, setModalState] = useState(false);
  const [ state, action ] = useActionState(patientWaiting, { message: "", status: false });
  const [ patientState, setPatientState] = useState<PatientState | null>(null);
  const [ isLoading, setIsLoading ] = useState(true);
  const closeModal = () => {
    setModalState(false);
  };
  const router = useRouter();
  const params = useParams<{ id: string; patientId: string }>();
  const patientId = id ?? params.id ?? params.patientId;

  const updatePatientState = () => {
    setIsLoading(true)
    isWaiting(patientId)
      .then(setPatientState)
      .finally(()=> setIsLoading(false));
  }
    
  useEffect(()=>{
    updatePatientState();

    if(state.message)
      if(state.status)
        toast.success(state.message, {
          onOpen: ()=> {
            closeModal();

            if(!patientState)
              router.replace("/clinical/urgency-bank");
            else
              router.replace(`/clinical/urgency-bank/${patientId}`);
          }   
        });
      else 
        toast.error(state.message);
  }, [state, router]);
  
  return(
    <div>
      <div className="relative">
        <Button disabled={isLoading} onClick={()=> setModalState(true)}>
          { isLoading ? "..." : patientState ? "Continuar": "Em espera"}
        </Button>
      </div>
     
      <Modal 
        title={patientState ? "Continuar com o atendimento": "Mover para a lista de espera"}
        open={modalstate}
        onClose={closeModal}
        asWindow
      >
        <form action={action}>
          <input type="hidden" name="patientId" defaultValue={patientId} />
          <p>Tem certeza que deseja seguir com a operação ?</p>
          <div className="flex gap-x-3 justify-end">
            <Button cancel type="button" onClick={closeModal}>Não</Button>
            <Button>Sim</Button> 
          </div>
        </form>
      </Modal>
    </div>
  )
}