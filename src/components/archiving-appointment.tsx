"use client";

import { 
  useEffect,
  useState,
  useActionState
} from "react";
import { toast } from "react-toastify";
import { LuArchiveRestore } from "react-icons/lu";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Modal from "@/components/modal";
import InputDetails from "@/components/ui/input-details";
import { archivingScheduleAppointment } from "@/backend/api/clinical/scheduling-api";

export default function ArchivingAppointment({ 
  scheduleId,
  isArchived
}: { 
  scheduleId: string;
  isArchived?: boolean;
}){
  const [ state, action ] = useActionState(archivingScheduleAppointment, { message: "", status: false });
  const [ modalState, setModalState ] = useState(false);
  const router = useRouter();
  const closeModal = ()=>setModalState(false);

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, {
          onClose: ()=>{
            closeModal();
            router.replace(isArchived?'/clinical/appointment/archiveds':'/clinical/appointment');
          }
        });
      else
        toast.error(state.message);
  }, [state, router, isArchived]);
  
  return(
    <div>
      <Button 
        onClick={()=>setModalState(true)} 
        className="gap-2 items-center bg-slate-700">
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
      </Modal>
    </div>
  )
}