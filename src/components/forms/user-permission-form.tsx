'use client';

import { 
  useState,
  useEffect,
  useActionState,
  useCallback
} from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alert';
import SubTitle from '@/components/ui/subtitle';
import Selection, { SelectionOption } from '@/components/ui/selection';
import { 
  getPermissions,
  grantPermission,
} from "@/app/backend/api/manager/api";
import { triggerUpdate } from '@/lib/ws-trigger';
import { toast } from 'react-toastify';

export default function AddUserPermissionForm({
  userId, 
  userGroupId
}: {
  userId: string, 
  userGroupId: string
}){
  const [ state, action ] = useActionState(grantPermission, { message: '', status: false});
  const router = useRouter();
  const [ permissions, setPermissions ] = useState<SelectionOption[]>([]);

  const handlePermission = useCallback(async ()=>{
    const perms = await getPermissions(userGroupId);
    setPermissions(perms);
  }, [userGroupId]);

  useEffect(()=>{
    if(state.message){
      if(state.status)
        toast.success(state.message, {
          autoClose: 1500,
          onOpen: ()=>{
            triggerUpdate({ target: "permissions" });
            router.refresh();
          }
        })
      else 
        toast.error(state.message);
    }
  }, [state, router]);

  useEffect(()=>{
    handlePermission();
  }, [handlePermission]);
  
  return(
    <form {...{action}} className='flex flex-col gap-3'>
      <SubTitle className='inline-flex'>Todas as permissões</SubTitle>
      <div>
        <input type='hidden' name='userId' value={userId} />
        <Selection
          label='Permissões'
          options={permissions}
          name="permissionId" 
          required
          onChange={handlePermission}
        />

        <Button>Atribuir</Button>
      </div>
    </form>
  )
}