"use client";

import { 
  useState, 
  useActionState,
  useRef, 
  useEffect
} from 'react';
import { useRouter } from 'next/navigation';
import Button from "@/components/ui/button";
import Modal from '@/components/modal';
import { TiInputChecked } from 'react-icons/ti';
import { finishConsultation } from '@/backend/api/clinical/office-api';
import { toast } from 'react-toastify';

export default function FinishConsultation({ id }: { id: string }){
  const [ state, action ] = useActionState(finishConsultation, { message: "", status: false });
  const formRef = useRef<HTMLFormElement>(null);
  const [ modalState, setModalState ] = useState(false);
  const router = useRouter();
  
  const closeModal = ()=> setModalState(false);
  const handleConfirm = ()=> formRef.current?.requestSubmit();

  useEffect(()=>{
    if(state.message){
      if(state.status)
        toast.success(state.message, { onOpen: ()=> router.replace("/clinical/office") });
      else
        toast.error(state.message);
    }

    return;
  }, [state, router]);

  return(
    <form {...{action}} ref={formRef} className="my-3">
      <input type="hidden" name="officeId" value={id} />
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
        </div>
      </Modal>
    </form>
  );
}