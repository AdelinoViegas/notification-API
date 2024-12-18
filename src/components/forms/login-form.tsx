'use client';

import { 
  useEffect,
  useState,
  useActionState 
} from 'react';
import Button from '@/components/ui/button';
import Image from 'next/image';
import Alert from '@/components/alert';
import InputField from '@/components/ui/input-field';
import { login } from '@/app/backend/api/manager/api';
import { useRouter } from 'next/navigation';

export default function LoginForm(){
  const [ state, action ] = useActionState(login, { message: '', status: false });
  const [ messageState, setMessageState ] = useState(false);
  const router = useRouter();

  useEffect(()=>{
    setMessageState(true);
    if(state.message)
      setTimeout(()=>{
        if(state.status){
          if(state?.module === "/clinical"){
            router.replace('/workplace');
            return;
          }
          router.push(`${state?.module}`);
        }else
          setMessageState(false);
      }, state.status?3000:5000);
  }, [state, router]);

  return(
    <form action={action} className="rounded-xl px-10 py-6 md:bg-white/90 md:border md:w-96">
      <div className="flex flex-col">
        <div className='flex justify-center mb-6'>
          <Image 
            src="/logo_name.webp" 
            alt="Master Logo"
            priority={true} 
            width={300}
            height={300}
            className='w-48'
          />
        </div>
      
        <div className="w-full">
          <div>
            <InputField 
              textLabel='Nome de usuário'
              placeholder='Informe o seu nome de usuário'
              name='username'
              required
            />

            <InputField
              textLabel='Senha'
              type='password'
              placeholder='Informe sua senha'
              name="password"
              required
            />
           
          </div>
          <Button type='submit' className='w-full'>Entrar</Button>
        </div>
      </div>

      <div className='mt-3'>
        {
          state.message && messageState &&
          <Alert 
            type={state.status?'success': 'error'} 
            message={state.message} 
          />
        }
      </div>
    </form>
  );
}