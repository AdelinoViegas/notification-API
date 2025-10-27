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
import { toast } from 'react-toastify';
import { MdOutlineMoreTime } from "react-icons/md";
import Button from "@/components/ui/button";
import Modal from '@/components/modal';
import { requestReschedule } from '@/backend/api/clinical/office-api';

export default function RequestReschedule(){
  const [ state, action ] = useActionState(requestReschedule, { message: "", status: false });
  const formRef = useRef<HTMLFormElement>(null);
  const [ modalState, setModalState ] = useState(false);
  const router = useRouter();
  const params:{ officeId: string } = useParams();

  const closeModal = ()=> setModalState(false);
  const handleConfirm = ()=>{
    formRef.current?.requestSubmit();
  }

  useEffect(()=>{
    if(state.message){
      if(state.status)
        toast.success(state.message, { 
          onOpen: ()=>{  
            closeModal();
            router.replace("/clinical/office");
          }
        })
      else
        toast.error(state.message);
    }
  }, [state, router]);

  return(
    <form {...{action}} ref={formRef} className="my-3">
      <input type="hidden" name="officeId" value={params.officeId} />
      <Button
        className='bg-orange-500 flex items-center gap-3'
        onClick={()=>setModalState(true)} 
        type="button">
          <MdOutlineMoreTime className="size-5" />
          Solicitar Remarcação
      </Button>

      <Modal
        title="Solicitar remarcação"
        onClose={closeModal}
        open={modalState}>
        <div>
          <p>Tem certeza que deseja solicitar uma remarcação para esta consulta?</p>
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