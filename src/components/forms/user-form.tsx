"use client";

import React, { 
  useEffect,
  useState,
  useActionState
} from 'react';
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import Selection, { SelectionOption } from '@/components/ui/selection';
import { signUser, getUserGroups } from '@/app/backend/api/manager/api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function UserForm({}: { userId?: string }){
  const [ state, action ] = useActionState(signUser, { message: "", status: false})
  const [ userGroups, setUserGroups ] = useState<SelectionOption[]>([]);
  const router = useRouter();

  useEffect(()=>{
    getUserGroups()
    .then(setUserGroups)
  }, []);

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, { 
          autoClose: 1500,
          onClose: router.refresh 
        });
      else
        toast.error(state.message);
  }, [state, router]);

  return(
    <form className='w-auto px-3' {...{action}}>      
      <InputField
        textLabel='Nome Completo'
        placeholder='Informe o nome completo do usuário'
        name="fullname"
        required
      />

      <div className='flex gap-x-3'>
        <InputField
          textLabel='Nome de Login'
          placeholder='Nome de acesso ao sistema'
          name="username"
          required
        />

        <InputField
          type="tel"
          placeholder='Número de Telefone'
          textLabel='Nº de Telefone'
          name="tel"
          maxLength={9}
          required
        />
      </div>

      <InputField
        type="email"
        placeholder='Endereço de E-mail'
        textLabel='E-mail'
        name="email"
      />
      
      <div>
        <InputField
          textLabel='Senha'
          type="password"
          name="password"
          placeholder='Informe a senha'
          required
          defaultValue={""} 
        />

        <InputField
          textLabel='Confirmação da Senha'
          type="password"
          name="checkPassword"
          placeholder='Confirme a senha'
          required
          defaultValue={""} 
        />
      </div>

      <Selection 
        label='Grupo de Usuário'
        options={userGroups}
        required
        name="userGroupId"
      />

      <Button>Salvar</Button>
    </form>
  )
}