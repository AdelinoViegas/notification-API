'use client';

import { 
  useState,
  useEffect,
  useActionState,
  useCallback
} from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import Alert from '@/components/alert';
import SubTitle from '@/components/ui/subtitle';
import Selection, { SimpleSelectionType } from '@/components/ui/selection';
import { 
  getPermissions,
  grantPermission,
} from "@/app/backend/api/manager/api";
import { triggerUpdate } from '@/lib/ws-trigger';

export default function AddUserPermissionForm({
  userId, 
  userGroupId
}: {
  userId: string, 
  userGroupId: string
}){

  const [ messageState, setMessageState ] = useState(false);
  const [ state, action ] = useActionState(grantPermission, { message: '',status: false});
  const router = useRouter();
  const [ permissions, setPermissions ] = useState<SimpleSelectionType[]>([]);

  const handlePermission = useCallback(async ()=>{
    const perms = await getPermissions(userGroupId, undefined, true) as SimpleSelectionType[];
    setPermissions(perms);
  }, [userGroupId]);

  useEffect(()=>{
    router.refresh();
   
    if(state.message){
      setMessageState(true);
      setTimeout(()=>{
        setMessageState(false);
        if(state.status)
          triggerUpdate({ target: "permissions" });
      }, 3000);
    }
  }, [state, router]);

  useEffect(()=>{
    handlePermission();
  }, [handlePermission]);
  
  return(
    <form {...{action}} className='flex flex-col gap-3'>
      <SubTitle className='inline-flex'>Atribuição de Permissão</SubTitle>
      <div>
        <Selection
          label='Permissões'
          options={permissions}
          name="permissionId" 
          required
          onChange={handlePermission}
        />

        <input type='hidden' name='userId' value={userId} />
        <Button>Adicionar</Button>
      </div>

      {
        state.message && messageState &&
        <div>
          <Alert 
            type={state.status?'success': 'error'}
            message={state.message}
          />
        </div>
      }
    </form>
  )
}