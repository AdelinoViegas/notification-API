'use client';

import { 
  useState,
  useEffect,
  useActionState
} from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import Alert from "@/components/alert";
import SubTitle from "@/components/ui/subtitle";
import { resetUserPassword } from "@/app/backend/api/manager/api";

export default function UserPassword({userId}: {
  userId: string;
}){
  const [ messageState, setMessageState ] = useState(false);
  const [ state, formAction ] = useActionState(resetUserPassword, {
    message: '',
    status: false
  });
  const [ editState, setEditState ] = useState(false);
  const router = useRouter();

  useEffect(()=>{
    if(state.message){
      setMessageState(true);
      setTimeout(()=>{
        setMessageState(false);
        if(state.status){
          setEditState(false);
          router.refresh();
        }
      }, 3000);
    }
  }, [state, router]);

  return(
    <form action={formAction} className="bg-white px-3 py-2 rounded-xl border">
      <SubTitle className="inline-flex">Repor senha da conta do usuário</SubTitle>
      <div>
        <InputField
          textLabel="Nova Senha"
          placeholder="Informe a nova senha do usuário"
          className="flex-grow"
          name="password"
          required
          disabled={!editState}
          type={!editState?"password":"text"}
          defaultValue={!editState?"Defina uma senha forte":undefined}
        />

        <InputField
          textLabel="Confirme a senha"
          placeholder="Confirme a senha do usuário"
          type="password"
          name="confirmPassword"
          required
          disabled={!editState}
          defaultValue={!editState?"Defina uma senha forte":undefined}
        />
      </div>

      <input type="hidden" name="userId" value={userId} />
      
      <div className="mb-3 flex gap-3">
        <Button 
          type="button" 
          cancel={editState}
          onClick={()=>setEditState(!editState)}>
            {editState?"Cancelar":"Repor"}
        </Button>
        {editState && <Button>Confirmar</Button>}
      </div>

      {
        state.message && messageState &&
        <Alert
          type={state.status?'success':'warn'}
          message={state.message}
        />
      }
    </form>
  )
}