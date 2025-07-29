'use client';

import { 
  useEffect,
  useActionState, 
  Suspense
} from 'react';
import Button from '@/components/ui/button';
import Image from 'next/image';
import InputField from '@/components/ui/input-field';
import { login } from '@/app/backend/api/manager/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

function Login(){
  const [ state, action, isPending ] = useActionState(login, { message: '', status: false });
  const router = useRouter();
  const searchParams = useSearchParams();

  // useEffect(()=>{
  //   if(state.message)
  //     if(state.status)
  //       toast.success(state.message, { 
  //         onClose: ()=>{
  //           router.replace(state?.module === "/clinical"?"/workplace":state?.module as string)
  //       },
  //       autoClose: 1500
  //     });
  //     else
  //       toast.error(state.message);
  // }, [state, router]);

  useEffect(()=>{
    // if(searchParams.has('danied')){
    //   toast.warn("Sua sessão expirou, faça login novamente!");
    //   return;
    // }
      
    if(searchParams.has('exit')){
      toast.warn("Sessão terminada!");
      return;
    }
  }, [searchParams, router]);

  return(
    <main className="h-screen bg-[url(/background.webp)] bg-no-repeat bg-cover bg-center flex justify-center items-center">
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
              disabled={isPending || state.status} 
              required
            />

            <InputField
              textLabel='Senha'
              type='password'
              placeholder='Informe sua senha'
              name="password"
              disabled={isPending || state.status} 
              required
            />
          
          </div>
          <Button 
            disabled={isPending || state.status} 
            type='submit' 
            className='w-full'
          >
            {isPending || state.status? "Aguarde...": "Entrar"}
          </Button>
        </div>
      </div>
    </form>
  </main>
  )
}
export default function Page(){
  return(
    <main>
      <Suspense>
        <Login />
      </Suspense>
    </main>
  );
}

