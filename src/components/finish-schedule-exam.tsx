"use client";

import { 
  useState, 
  useActionState,
  useEffect
} from 'react';
import { 
  usePathname,
  useRouter,  
} from 'next/navigation';
import Button from "@/components/ui/button";
import Modal from '@/components/modal';
import { TiInputChecked } from 'react-icons/ti';
import { finishScheduledExam } from '@/backend/api/clinical/unit-api';
import { toast } from 'react-toastify';

export default function FinishScheduledExam({ id }: { id: string }){
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