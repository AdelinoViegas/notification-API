"use client";

import { 
  useCallback,
  useEffect,
  useState,
  useActionState
} from "react";
import Button from "@/components/ui/button";
import Selection, { SelectionOption } from "@/components/ui/selection";
import { updateAccessType } from "@/backend/api/clinical/api";
import { patientAccess as accessType } from "@/backend/api/clinical/translator";
import ExternalUnitForm from "../external-unit-form";
import { getExternalUnits } from "@/backend/api/clinical/urgency-bank-api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import forceRefreshPage from "@/lib/force-refresh";

type AccessType = {
  _id: string;
  type: string;
  externalUnitId: string;
};

export default function AccessForm({ data, eUnitsJson }: { data?: string; eUnitsJson: string }){
  const currentData = data?JSON.parse(data) as AccessType:undefined;
  const eUnits = JSON.parse(eUnitsJson) as SelectionOption[];
  const [ state, action] = useActionState(updateAccessType, { message:"", status:false })
  const [ isEdit, setIsEdit ] = useState(false);
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

  const router = useRouter();

  useEffect(()=>{
    if(state.message){
      if(state.status)
        toast.success(state.message, { 
          onOpen: ()=>{
            router.refresh();
            disableEdit();
          },
          onClose: forceRefreshPage
        });
      else
        toast.error(state.message);
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
    </form>
  );
}