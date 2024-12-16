"use client";

import { 
  useEffect,
  useState,
  useActionState,
  useCallback
} from "react";
import Selection from "@/components/ui/selection";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import Alert from '@/components/alert';
import forceRefreshPage from "@/lib/force-refresh";
import { updatePersonalInfo } from "@/app/backend/api/clinical/api";

import { gender as genderValues
} from "@/app/backend/api/clinical/translator";

type InfoProps = {
  _id: string;
  fullname:string;
  age:number;
  gender:string;
} 

export default function PersonalOfficeForm({
  _id,
  age,
  fullname,
  gender,
}: InfoProps){
  const [ state, action ] = useActionState(updatePersonalInfo, { message: "", status: false })
  const [ messageState, setMessageState ] = useState(false);
  const [ isEdit, setIsEdit ] = useState(false);
  const toggleEdit = useCallback(()=>setIsEdit(!isEdit), [isEdit]);

  useEffect(()=>{
    if(state.message){
      setMessageState(true);
      toggleEdit();

      setTimeout(()=>{
        setMessageState(false);
        forceRefreshPage();
      }, 2000);
    }
  }, [state, toggleEdit]);

  return(
    <form {...{action}}>
      <div className="grid md:grid-cols-[50%,20%,auto] large:grid-[50%,20%,auto] gap-3">
        <input 
          type="hidden" 
          name="id" 
          value={_id} 
        />
        <input 
          type="hidden" 
          name="anamnese" 
          value="anamnese" 
        />

        <InputField
          textLabel="Nome Completo"
          name="fullname"
          required
          placeholder="Nome completo do utentes"
          disabled={!isEdit}
          defaultValue={fullname}
        />

        <InputField
          textLabel="Idade"
          name="age"
          required 
          type="number"
          maxLength={3}
          placeholder="Digite a idade" 
          defaultValue={age}        
          disabled={!isEdit}
        />
        
        <Selection
          options={genderValues}
          label="Gênero" 
          name="gender"
          required
          disabled={!isEdit}
          defaultValue={gender}
        />
      </div>
      
      <div className="flex gap-3">
        {
          !isEdit && 
          <Button 
            type={"button"}
            onClick={toggleEdit}>
              Editar
          </Button>
        }
        {
          isEdit && <>
          <Button cancel 
            onClick={toggleEdit}>
            Cancelar
          </Button>
          <Button type="submit">Actualizar</Button>
          </>
        }
      </div>
      {
        state.message && messageState &&
        <div className="flex mt-3">
          <Alert
            type={state.status?'success':'error'}
            message={state.message}
          />
        </div>
      }
    </form>
  );
}