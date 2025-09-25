"use client";

import { 
  useEffect,
  useState,
  useActionState
} from "react";
import { LuArchiveRestore } from "react-icons/lu";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Modal from "@/components/modal";
import InputDetails from "@/components/ui/input-details";
import { archivingSugery } from "@/backend/api/clinical/operating-room-api";
import { toast } from "react-toastify";

export default function ArchivingSugery({ 
  scheduleId,
  isArchived
}: { 
  scheduleId: string;
  isArchived?: boolean;
}){
  const [ state, action ] = useActionState(archivingSugery, { message: "", status: false });
  const [ modalState, setModalState ] = useState(false);
  const router = useRouter();
  const closeModal = ()=>setModalState(false);

  useEffect(()=>{
    if(state.message){
      if(state.status){
        closeModal();
        toast.success(state.message, {
            autoClose: 1500,
            onClose: ()=>{
              router.replace(isArchived?'/clinical/schedule-sugery/archiveds':'/clinical/schedule-sugery');
            }
        });
      }else
          toast.error(state.message);

    }
  }, [state, isArchived, router]);
  
  return(
    <div>
      <Button 
        onClick={()=>setModalState(true)} 
        className="gap-x-2 items-center bg-slate-700">
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