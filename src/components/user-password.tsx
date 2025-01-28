'use client';

import { 
  useState,
  useEffect,
  useActionState
} from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import Alert from "@/components/ui/alert";
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
    <form action={formAction} className="flex flex-col justify-between bg-white px-3 py-2 rounded-xl border">
      <input type="hidden" name="userId" value={userId} />
      <div>
        <SubTitle className="inline-flex">Repor senha da conta do usuário</SubTitle>
        <div className="flex flex-col">
          <InputField
            textLabel="Nova"
            placeholder="Informe a nova senha do usuário"
            className="flex-grow"
            type="password"
            name="password"
            required
            disabled={!editState}
            defaultValue={!editState?"Defina uma senha forte":undefined}
          />

          <InputField
            textLabel="Confirmação"
            placeholder="Confirme a senha do usuário"
            type="password"
            name="confirmPassword"
            required
            disabled={!editState}
            defaultValue={!editState?"Defina uma senha forte":undefined}
          />
        </div>
      </div>

      <div className="flex gap-3">
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