"use client";

import React, { 
  useEffect,
  useState,
  useActionState
} from 'react';
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import Card from '@/components/card';
import Selection, { SelectionOption } from '@/components/ui/selection';
import { 
  signUser, 
  getUserGroups, 
  updateUser 
} from '@/app/backend/api/manager/api';
import { useParams, useRouter } from 'next/navigation';
import Alert from '@/components/alert';

type User = {
  fullname: string;
  username: string;
  email: string;
  tel: string;
  userGroup: string;
}

export default function UserForm({
  jsonData,
}:{
  jsonData?: string;
}){
  const [ state, action ] = useActionState(jsonData?updateUser:signUser, { message: "", status: false})
  const user = jsonData?JSON.parse(jsonData) as User:undefined;
  const [ userGroups, setUserGroups ] = useState<SelectionOption[]>([]);
  const [ messageState, setMessageState ] = useState(false);
  const router = useRouter();
  const params = useParams();

  const handleGroup = async()=>{
    const groups = await getUserGroups();
    setUserGroups(groups);
  }

  useEffect(()=>{
    handleGroup();
  }, []);


  useEffect(()=>{
    setMessageState(true)
    setTimeout(()=>{
      setMessageState(false);
      if(state.status)
        router.push('/manager/users');
    }, 3000);
  }, [state, router]);

  return(
    <Card>
      <form className='w-auto' {...{action}}>
        <input 
          type="hidden" 
          name="userId" 
          value={params.userId} 
        />
        
        <InputField
          textLabel='Nome Completo'
          placeholder='Informe o nome completo'
          name="fullname"
          required
          defaultValue={user?.fullname} 
        />

        <InputField
          textLabel='Nome de Login'
          placeholder='Neme de acesso ao sistema'
          name="username"
          required
          defaultValue={user?.username} 
        />

        <InputField
          type="email"
          placeholder='Endereço de E-mail'
          textLabel='E-mail'
          name="email"
          defaultValue={user?.email} 
        />

        <InputField
          type="tel"
          placeholder='Número de Telefone'
          textLabel='Nº de Telefone'
          name="tel"
          maxLength={9}
          required
          defaultValue={user?.tel} 
        />
        
        { !jsonData &&      
          <>
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
            
            <Selection 
              label='Grupo de Usuário'
              options={userGroups}
              onChange={handleGroup}
              required
              name="userGroupId"
              defaultValue={""}
            />
          </>
        }
        <div className='flex gap-3'>
          <Button cancel type="reset">Limpar</Button>
          <Button>{jsonData?"Actualizar":"Salvar"}</Button>
        </div>
      </form>
      {
        state.message && messageState &&
        <div className="flex mt-3">
          <Alert
            type={state.status?'success':'error'}
            message={state.message}
          />
        </div>
      }
    </Card>
  )
}