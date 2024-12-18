"use client";

import { 
  useState, 
  useActionState,
  useRef, 
  useEffect
} from 'react';
import { 
  useRouter,  
} from 'next/navigation';
import Button from "@/components/ui/button";
import Modal from '@/components/modal';
import { TiInputChecked } from 'react-icons/ti';
import { finishExam } from '@/app/backend/api/clinical/unit-api';
import Alert from '@/components/alert';
import { triggerUpdate } from '@/lib/ws-trigger';

export default function FinishAnalysis({
  resultId,
}:{
  resultId: string,
}){
  const [ state, action ] = useActionState(finishExam, { message: "", status: false });
  const formRef = useRef<HTMLFormElement>(null);
  const [ modalState, setModalState ] = useState(false);
  const [ message, setMessage ] = useState("");
  const router = useRouter();

  const closeModal = ()=> setModalState(false);
  const handleConfirm = ()=>{
    formRef.current?.requestSubmit();
  }

  useEffect(()=>{
    if(state?.message){
      setMessage(state.message);
      
      setTimeout(()=>{
        setMessage("");
        if(state.status){
          closeModal();
          triggerUpdate({ target: "office-exam-results"});
          triggerUpdate({ target: "laboratory" });
          router.replace(`/clinical/${state.type}`);
        }
      }, 2000);
    }
  }, [state, router]);

  return(
    <form {...{action}} ref={formRef} className="my-3">
      <input 
        type="hidden" 
        name="resultId" 
        defaultValue={resultId} 
      />

      <Button
        disabled={false}
        className='bg-orange-500 flex items-center gap-3'
        onClick={()=>setModalState(true)} 
        type="button">
          <TiInputChecked className="size-5" />
          Concluir
      </Button>

      <Modal
        title="Concluir Consulta"
        onClose={closeModal}
        open={modalState}>
        <div>
          <p>Tem certeza que deseja concluir o processo de análise de exames?</p>
          <div className="flex gap-3 justify-end">
            <Button 
              type="button" 
              cancel 
              onClick={closeModal}>
                Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={handleConfirm}>
                Sim
            </Button>
          </div>
          {
            state?.message && message &&
            <div className="mt-3">
              <Alert
                type={state?.status?'success':'error'}
                message={state?.message}
              />
            </div>
          }
        </div>
      </Modal>
    </form>
  );
}