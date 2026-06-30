"use client";

import { 
  useEffect,
  useState, 
  useActionState,
} from "react";
import { LuArchiveRestore } from "react-icons/lu";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Modal from "@/components/modal";
import InputDetails from "@/components/ui/input-details";
import { archivingScheduleExam } from "@/backend/api/clinical/scheduling-api";

export default function ArchivingScheduleExam({ scheduleId }: { scheduleId: string }){
  const [ state, action ] = useActionState(archivingScheduleExam, { message: "", status: false });
  const [ modalState, setModalState ] = useState(false);
  const router = useRouter();
  const closeModal = ()=>setModalState(false);

  useEffect(()=>{
    if(state?.message){
      if(state.status){
        toast.success(state.message, {
          onClose: ()=>{
            closeModal();
            router.replace('/clinical/schedule-exams');           
          }
        })
      }
    }
  }, [state, router]);
  
  return(
    <div>
      <Button 
        onClick={()=>setModalState(true)} 
        className="gap-2 items-center bg-slate-700"
      >
        <LuArchiveRestore className="size-5" />
        Arquivar
      </Button>

      <Modal 
        title="Arquivar o Exame/Serviço" 
        onClose={closeModal} 
        open={modalState}>
        <form {...{action}}>
          <input type="hidden" name="scheduleId" value={scheduleId} />
          <InputDetails
            textLabel="Motivo do arquivamento"
            required
            placeholder="Descreva o motivo do arquivamento"
            name="reason"
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