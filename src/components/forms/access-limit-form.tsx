'use client';

import React,{ 
  useEffect,
  useState,
  useActionState
} from 'react';
import { useRouter } from 'next/navigation';
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import Alert from '@/components/alert';
import { addOrUpdateAccessLimit } from "@/lib/access-limit";

export default function AccessLimitForm({
  startAt,
  endAt,
  userId,
  isAdmin
}:{
  startAt?: string;
  endAt?: string;
  userId?: string;
  isAdmin?: boolean;
}){
  const [ state, action ] = useActionState(addOrUpdateAccessLimit, 
    { message: '', status: false });
  const [ messageState, setMessageState ] = useState(false);
  const router = useRouter();

  useEffect(()=>{
    if(state.message){
      setMessageState(true);

      setTimeout(()=>{
        setMessageState(false);
        router.refresh();
      }, 3000);
    }
    
  }, [state, router]);

  return(
    <form {...{action}} className='flex flex-col'>
      {
        isAdmin?
        <Alert
          type="warn"
          message="Limites de acesso são aplicados apenas para usuários não administrativos!"
        />:
        !startAt && !endAt &&
        <Alert
          type='warn'
          message='Este usuário não tem Limite de Acesso definido!'
        />
      }
      <input type="hidden" name="update" value={startAt && endAt?'true':'false'} />
      <input type="hidden" name="userId" value={userId} />
      
      <div className="grid-cols-2 grid gap-3">
        <InputField
          textLabel="Data de Início" 
          type="date"
          defaultValue={new Date(startAt?startAt:Date.now()).toISOString().split('T')[0]}
          name="startAt"
          min={new Date().toISOString().split('T')[0]}
          required
          disabled={isAdmin}
        />

        <InputField
          textLabel="Data de Fim" 
          type="date"
          defaultValue={new Date(endAt?endAt:Date.now()).toISOString().split('T')[0]}
          name="endAt"
          min={new Date(startAt?startAt:Date.now()).toISOString().split('T')[0]}
          required
          disabled={isAdmin}
        />
      </div>

      <div className='flex'>
        <Button 
          type="submit"
          disabled={isAdmin}>
          {startAt?'Actualizar':'Salvar'}
        </Button>
      </div>
    
      {
        state.message && messageState &&
        <div className='mt-3'>
          <Alert
            type={state.status?'success':'error'}
            message={state.message}
          />
        </div>
      }
    </form>
  )
}