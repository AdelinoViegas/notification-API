"use client";

import { 
  useEffect,
  useState,
  useActionState
} from "react";
import { useRouter } from "next/navigation";
import { archivingScheduleAppointment } from "@/app/backend/api/clinical/scheduling-api";
import Button from "@/components/ui/button";
import { LuArchiveRestore } from "react-icons/lu";
import Modal from "@/components/modal";
import InputDetails from "@/components/ui/input-details";
import Alert from "@/components/ui/alert";
import { triggerUpdate } from "@/lib/ws-trigger";

export default function ArchivingAppointment({ 
  scheduleId,
  isArchived
}: { 
  scheduleId: string;
  isArchived?: boolean;
}){
  const [ state, action ] = useActionState(archivingScheduleAppointment, { message: "", status: false });
  const [ modalState, setModalState ] = useState(false);
  const [ messageState, setMessageState ] = useState(false);
  const router = useRouter();
  const closeModal = ()=>setModalState(false);

  useEffect(()=>{
    if(state.message){
      setMessageState(true);

      setTimeout(()=>{
        if(state.status){
          closeModal();
          triggerUpdate({ target: "appointment" });
          router.replace(isArchived?'/clinical/appointment/archiveds':'/clinical/appointment');
        }
        setMessageState(false);
      }, 2000);
    }
  }, [state, isArchived, router]);
  
  return(
    <div>
      <Button 
        onClick={()=>setModalState(true)} 
        cancel 
        className="gap-2 items-center">
        <LuArchiveRestore className="size-5" />
        {isArchived?"Desarquivar":"Arquivar"}
      </Button>

      <Modal 
        title={isArchived?"Desarquivar o agendamento":"Arquivar o agendamento"} 
        onClose={closeModal} 
        open={modalState}>
        <form {...{action}} className="pt-3">
          <input type="hidden" name="scheduleId" value={scheduleId} />
          <input type="hidden" name="isArchived" value={String(!!isArchived)} /> 

          {
            !isArchived?
            <InputDetails
              textLabel="Motivo do Arquivamento"
              required
              placeholder="Descreva o motivo"
              name="reason"
            />:
            "Tem certeza que deseja desarquivar este agendamento?"
          }

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