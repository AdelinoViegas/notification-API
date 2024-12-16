'use client';

import { 
  useEffect,
  useState,
  useActionState, 
  useCallback
} from 'react';
import { useParams } from 'next/navigation';
import InputField from '@/components/ui/input-field';
import Button from '@/components/ui/button';
import { signUser, updateUser } from '@/app/backend/api/clinical/api';
import Alert from '@/components/alert';
import Selection from '@/components/ui/selection';
import SpecialtyModal from "@/components/specialty-modal";
import forceRefreshPage from '@/lib/force-refresh';
import { urgencyServices, userCategory } from '@/app/backend/api/clinical/translator';

type User = {
  orderNumber: number;
  roleId: string;
  categoryId: string;
  officeId: string;
};

export default function UserClinicalForm({ 
  jsonData,
  specialties 
}: { 
  jsonData?: string;
  specialties: Array<{ _id: string; label: string }>;
}){
  const currentData = jsonData?JSON.parse(jsonData) as User:undefined;
  const [ state, action ] = useActionState(!!jsonData?updateUser:signUser,{ message: '', status: false });
  const [ messageState, setMessageState ] = useState(false);
  const [ isEdit, setIsEdit ] = useState(!!jsonData);
  const toggleEdit = useCallback(()=> setIsEdit(!isEdit), [isEdit]);
  const { userId }: { userId: string } = useParams();

  useEffect(()=>{
    setMessageState(true)
    setTimeout(()=>{
      setMessageState(false);
      if(state.status){
        setIsEdit(true);
        forceRefreshPage();
      }
    }, 3000);
  }, [state]);

  return(
    <form {...{action}} className='space-y-3'>
      <input type="hidden" name="userId" value={userId} />

      <Selection
        options={userCategory}
        label="Categoria"
        defaultValue={currentData?.categoryId}
        disabled={isEdit}
        name="categoryId"
        required
      />

      <Selection
        options={urgencyServices}
        label="Consultório"
        name="officeId"
        disabled={isEdit}
        defaultValue={currentData?.officeId}
      />

      <InputField
        textLabel='Número de ordem'
        name="orderNumber"
        placeholder='Número de ordem'
        type="number"
        disabled={isEdit}
        defaultValue={currentData?.orderNumber}
      />
      
      <div className='flex gap-3 items-center'>
        <Selection
          options={specialties}
          label="Especialidade"
          defaultValue={currentData?.roleId}
          disabled={isEdit}
          name="roleId"
          className='w-full'
        />
        <SpecialtyModal />
      </div>

      <div className='flex gap-3'>
        {
          !!jsonData?
          <>
            <Button
              onClick={toggleEdit} 
              cancel={!isEdit}
              type="button">
                {!isEdit?"Cancelar":"Editar"}
            </Button>
            { !isEdit && <Button>Actualizar</Button> }
          </>:
          <Button>Salvar</Button>
        }
      </div>

      {
        state.message && messageState &&
        <Alert 
          type={state.status?'success':'error'}
          message={state.message}
        />
      }
    </form>
  );
}