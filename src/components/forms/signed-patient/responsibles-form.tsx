"use client";

import { 
  useEffect,
  useState,
  useActionState, 
} from "react";
import InputField from "@/components/ui/input-field";
import Selection from "@/components/ui/selection";
import Button from "@/components/ui/button";
import Alert from '@/components/alert';
import forceRefreshPage from "@/lib/force-refresh";
import { kinshipDegree } from "@/app/backend/api/clinical/translator";
import type { Responsable } from "@/app/backend/api/clinical/types";
import { updateResposible } from "@/app/backend/api/clinical/api";


type InfoProps = {
  id: string;
  first: Responsable;
  second?: Responsable;
};

export default function ResposiblesForm({
  id,
  first,
  second,
}: InfoProps){
  const [ state, action ] = useActionState(updateResposible, { message: "", status: false })
  const [ isEdit, setIsEdit ] = useState(false);
  const [ messageState, setMessageState ] = useState(false);
  const disableEdit = ()=>setIsEdit(false);

  useEffect(()=>{
    if(state.message){
      setMessageState(true);

      setTimeout(()=>{
        setMessageState(false);

        if(state.status){
          disableEdit();
          forceRefreshPage();
        }
      }, 2000);
    }
  }, [state]);

  return(
    <form {...{action}}>
      <div className="grid md:grid-cols-2 large:grid-cols-3 gap-3">
        <input 
          type="hidden" 
          name="id" 
          value={id} 
        />

        <InputField
          textLabel="Nome 1ª responsável"
          required
          name="name"
          placeholder="Nome Completo do Responsável"
          disabled={!isEdit}
          defaultValue={first.name}
        />

        <Selection
          options={kinshipDegree}
          label="Grau de Parentesco"
          name="kinship"
          required
          disabled={!isEdit}
          defaultValue={first.kinship}
        />
        
        <InputField
          textLabel="Telefone"
          type="Tel"
          maxLength={9}
          required
          name="tel"
          placeholder="Nº de Telefone do Responsável"
          disabled={!isEdit}
          defaultValue={first.tel}
        />

        <InputField
          textLabel="Nome 2ª responsável (opcional)"
          name="name1"
          placeholder="Nome Completo do Responsável"
          disabled={!isEdit}
          defaultValue={second?.name}
        />

        <Selection
          options={kinshipDegree}
          label="Grau de Parentesco (opcional)"
          name="kinship1"
          disabled={!isEdit}
          defaultValue={second?.kinship}
        />

        <InputField
          textLabel="Telefone (Opcional)"
          type="Tel"
          maxLength={9}
          name="tel1"
          placeholder="Nº de Telefone do Responsável"
          disabled={!isEdit}
          defaultValue={second?.tel}
        />
      </div>
      
      <div className="flex gap-3">
        {
          !isEdit && 
          <Button 
            type={"button"}
            onClick={()=>setIsEdit(true)}>
              Editar
          </Button>
        }
        {
          isEdit && <>
          <Button 
            cancel 
            onClick={disableEdit}>
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