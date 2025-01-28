"use client";

import { 
  useState, 
  useActionState,
  useRef, 
  useEffect
} from 'react';
import { 
  useRouter, 
  useParams,  
} from 'next/navigation';
import Button from "@/components/ui/button";
import Modal from '@/components/modal';
import { TiInputChecked } from 'react-icons/ti';
import { finishConsultation } from '@/app/backend/api/clinical/office-api';
import Alert from '@/components/ui/alert';

export default function FinishConsultation(){
  const [ state, action ] = useActionState(finishConsultation, { message: "", status: false });
  const formRef = useRef<HTMLFormElement>(null);
  const [ modalState, setModalState ] = useState(false);
  const [ message, setMessage ] = useState("");
  const router = useRouter();
  const params:{ officeId: string } = useParams();
  
  const closeModal = ()=> setModalState(false);
  const handleConfirm = ()=> formRef.current?.requestSubmit();

  useEffect(()=>{
    if(state.message){
      setMessage(state.message);
      
      setTimeout(()=>{
        setMessage("");
        if(state.status){
          closeModal();
          router.replace("/clinical/office");
        }
      }, 2000);
    }
  }, [state, router]);

  return(
    <form {...{action}} ref={formRef} className="my-3">
      <input type="hidden" name="officeId" value={params.officeId} />
      <Button
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
          <p>Tem certeza que deseja concluir a consulta?</p>
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