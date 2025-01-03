"use client";

import { 
  useCallback,
  useEffect,
  useState,
  useActionState
} from "react";
import Button from "@/components/ui/button";
import Alert from '@/components/alert';
import Selection, { SelectionOption } from "@/components/ui/selection";
import forceRefreshPage from "@/lib/force-refresh";
import { updateAccessType } from "@/app/backend/api/clinical/api";
import { patientAccess as accessType } from "@/app/backend/api/clinical/translator";
import ExternalUnitForm from "../external-unit-form";
import { getExternalUnits } from "@/app/backend/api/clinical/urgency-bank-api";

type AccessType = {
  _id: string;
  type: string;
  externalUnitId: string;
};

export default function AcessForm({ data, eUnitsJson }: { data?: string; eUnitsJson: string }){
  const currentData = data?JSON.parse(data) as AccessType:undefined;
  const eUnits = JSON.parse(eUnitsJson) as SelectionOption[];
  const [ state, action] = useActionState(updateAccessType, { message:"", status:false })
  const [ isEdit, setIsEdit ] = useState(false);
  const [ messageState, setMessageState ] = useState(false);
  const [ acessType, setAcessType ] = useState(currentData?.type);
  const [ externalUnits, setExternalUnits ] = useState<SelectionOption[]>(eUnits);
  const loadExternalUnits = useCallback(async()=>{
    const externalUnits = await getExternalUnits({}) as SelectionOption[];
    setExternalUnits(externalUnits);
  }, []);
  const disableEdit = ()=>setIsEdit(false);

  useEffect(()=>{
    loadExternalUnits();
  }, [acessType, loadExternalUnits]);

  useEffect(()=>{
    if(state.message){
      setMessageState(true);

      setTimeout(()=>{
        setMessageState(false);

        if(state.status){
          forceRefreshPage();
        }
      }, 2000);
    }
  }, [state]);
  
  return(
    <form {...{action}}>
      <input 
        type="hidden" 
        name="id" 
        value={currentData?._id} 
      />
        
      <div className="grid lg:grid-cols-3 gap-3">
        <Selection
          name="accessType"
          label="Escolha o tipo de acesso"
          options={accessType}
          required
          onChange={(e)=>setAcessType(e.target.value)}
          disabled={!isEdit}
          defaultValue={currentData?.type}
        />

        {acessType === "transferred" &&   
          <div className="col-span-2 flex gap-3 items-center">
            <Selection
              label="Escolha a unidade externa"
              options={externalUnits}
              name="externalUnitId"
              disabled={!isEdit}
              defaultValue={currentData?.externalUnitId}
              className="grow"
              onClick={loadExternalUnits}
              required
            />

            <ExternalUnitForm />
          </div>    
        }

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