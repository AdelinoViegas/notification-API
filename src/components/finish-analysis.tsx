"use client";

import { 
  useState, 
  useActionState,
  useRef, 
  useEffect
} from 'react';
import { 
  usePathname,
  useRouter,  
} from 'next/navigation';
import Button from "@/components/ui/button";
import Modal from '@/components/modal';
import { TiInputChecked } from 'react-icons/ti';
import { finishExam, finishScheduledExam } from '@/backend/api/clinical/unit-api';
import Alert from '@/components/ui/alert';
import { toast } from 'react-toastify';


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
        title="Concluir o Exame"
        onClose={closeModal}
        open={modalState}>
        <div>
          <p>Tem certeza que deseja concluir o exames?</p>
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

export function FinishScheduledExam({ id }: { id: string }){
  const [ modal, setModal ] = useState(false);
  const [ state, action ] = useActionState(finishScheduledExam, { message: "", status: false });
  const router = useRouter();
  const pathname = usePathname().split('/').slice(0, 3).join("/");

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, { 
          onOpen: ()=>router.replace(pathname)
        });
      else
        toast.warn(state.message);
  }, [state]);


  return(
     <div className="my-3">
      <input type="hidden" name="serviceId" value={id} />

      <Button
        disabled={false}
        className='bg-orange-500 flex items-center gap-3'
        onClick={()=>setModal(true)} 
        type="button">
          <TiInputChecked className="size-5" />
          Concluir
      </Button>

      <Modal
        title="Finalizar Exame"
        onClose={()=>setModal(false)}
        asWindow
        open={modal}
      >
        <form action={action}>
          <p>Deseja concluir com o exame?</p>
          <input type="hidden" name="serviceId" value={id} />
          <div className="flex gap-3 justify-end">
            <Button 
              type="button" 
              cancel 
              onClick={()=>setModal(false)}
            >
              Cancelar
            </Button>

            <Button>Sim</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}