"use client";

import { 
  useState, 
  useActionState,
  useRef, 
  useEffect
} from 'react';
import { toast } from 'react-toastify';
import { TiInputChecked } from 'react-icons/ti';
import { useRouter } from 'next/navigation';
import Button from "@/components/ui/button";
import Modal from '@/components/modal';
import { finishOperatingRoom } from '@/backend/api/clinical/operating-room-api';

export default function FinishOperatingRoom({ operatingRoomId }: { operatingRoomId: string }){
  const [ state, action ] = useActionState(finishOperatingRoom, { message: "", status: false });
  const formRef = useRef<HTMLFormElement>(null);
  const [ modalState, setModalState ] = useState(false);
  const closeModal = ()=> setModalState(false);
  const router = useRouter();

  useEffect(()=>{
    if(state.message){
      if(state.status)
        toast.success(
          state.message, { 
            onOpen: ()=> router.replace("/clinical/operating-room") 
        });
      else
        toast.error(state.message);
    }

    return;
  }, [state, router]);

  return(
    <div>
      <Button
        className='bg-orange-500 flex items-center gap-3'
        onClick={()=>setModalState(true)} 
        type="button">
          <TiInputChecked className="size-5" />
          Concluir
      </Button>

      <Modal
        title="Concluir em Bloco Operatório"
        onClose={closeModal}
        open={modalState}>
        <form {...{action}} ref={formRef}>
          <input 
            type="hidden" 
            name="operatingRoomId" 
            value={operatingRoomId} 
          />

          <p>Tem certeza que deseja concluir o processo no bloco operatório?</p>
          <div className="flex gap-3 justify-end">
            <Button 
              type="button" 
              cancel 
              onClick={closeModal}>
                Cancelar
            </Button>
            <Button>Sim</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}