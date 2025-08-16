"use client";

import { 
  useEffect,
  useState, 
  useActionState,
} from "react";
import { useRouter } from "next/navigation";
import { archivingScheduleExam } from "@/backend/api/clinical/scheduling-api";
import Button from "@/components/ui/button";
import Modal from "@/components/modal";
import InputDetails from "@/components/ui/input-details";
import Alert from "@/components/ui/alert";
import { LuArchiveRestore } from "react-icons/lu";

export default function ArchivingScheduleExam({ scheduleId }: { scheduleId: string }){
  const [ state, action ] = useActionState(archivingScheduleExam, { message: "", status: false });
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
          router.replace('/clinical/schedule-exams-services');
        }
        setMessageState(false);
      }, 2000);
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