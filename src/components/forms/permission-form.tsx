'use client';

import React, { 
  useEffect, 
  useState, 
  useActionState
} from 'react';
import InputField from "@/components/ui/input-field";
import Selection, { SelectionOption } from "@/components/ui/selection";
import Button from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { 
  signPermission, 
  updatePermission,
} from "@/app/backend/api/manager/api";
import Alert from '@/components/alert';
import { useParams } from 'next/navigation';

type Permission = {
  label: string;
  detail: string;
  route: string;
  userGroupId: string;
};

export default function PermissionForm({ jsonData,  userGroups }:{ jsonData?: string, userGroups: SelectionOption[] }){
  const currentData = jsonData?JSON.parse(jsonData) as Permission:undefined; 
  const [ state, action ] = useActionState(!!jsonData?updatePermission:signPermission,{
    message: '',
    status: false
  });
  const [ messageState, setMessageState ] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(()=>{
    if(state.message){
      setMessageState(true);
      
      setTimeout(()=>{
        setMessageState(false);
        if(state.status)
          router.back();
      }, state.status?1000:3000);
    }
  }, [state, router]);

  return(
    <form action={action}>
      <InputField
        textLabel="Nome"
        placeholder="Informe o nome a permissão"
        name="label" 
        required
        defaultValue={currentData?.label}
      />

      <InputField
        textLabel="Detalhe"
        placeholder="Descreva..."
        name="detail" 
        required
        defaultValue={currentData?.detail}
      />

      <InputField
        textLabel="Rota *"
        placeholder="Informe a rota da permissão"
        name="route" 
        required
        defaultValue={currentData?.route}
        title="Contacte o desevolvedor da aplicação para mais informações"
      />

      <input type="hidden" name="permissionId" value={params?.permissionId} />

      <Selection 
        label="Módulo do Sistema"
        name='userGroupId'
        required
        defaultValue={currentData?.userGroupId}
        options={userGroups}
      />

      <div className="flex gap-3 mb-3">
        <Button type="submit" id='submit'>Concluir</Button>
        <Button cancel type="reset">Limpar</Button>
      </div>

      { messageState &&
        <Alert
          type={state.status?'success':'error'}
          message={state.message}
        />
      }
    </form>
  );
}