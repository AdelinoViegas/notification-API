"use client";

import { 
  useCallback,
  useEffect,
  useState,
  useActionState
} from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/button";
import Selection, { SelectionOption } from "@/components/ui/selection";
import ExternalUnitForm from "@/components/forms/external-unit-form";

import { updateAccessType } from "@/backend/api/clinical/api";
import { patientAccess as accessType } from "@/backend/api/clinical/translator";
import { getExternalUnits } from "@/backend/api/clinical/urgency-bank-api";

type AccessType = {
  _id: string;
  type: string;
  externalUnitId: string;
};

export default function AccessForm({ data, eUnitsJson }: { data?: string; eUnitsJson: string }){
  const currentData = data?JSON.parse(data) as AccessType:undefined;
  const eUnits = JSON.parse(eUnitsJson) as SelectionOption[];
  const [ state, action] = useActionState(updateAccessType, { message:"", status:false })
  const [ acessType, setAcessType ] = useState(currentData?.type);
  const [type, setType] = useState(currentData?.type);
  const [ externalUnit, setExternalUnit ] = useState(currentData?.externalUnitId);
  const [ externalUnits, setExternalUnits ] = useState<SelectionOption[]>(eUnits);
  const router = useRouter();
  const loadExternalUnits = useCallback(async()=>{
  const externalUnits = await getExternalUnits({}) as SelectionOption[];
    setExternalUnits(externalUnits);
  }, []);

  useEffect(()=>{
    loadExternalUnits();
  }, [acessType, loadExternalUnits]);

  useEffect(()=> {
    setType(currentData?.type);
    setExternalUnit(currentData?.externalUnitId);
  },[currentData?.type, currentData?.externalUnitId]);

  useEffect(()=>{
    if(state.message){
      if(state.status)
        toast.success(state.message, { 
          onOpen: ()=> router.refresh()
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
          key={type}
          name="accessType"
          label="Escolha o tipo de acesso"
          options={accessType}
          required
          onChange={(e)=>setAcessType(e.target.value)}
          defaultValue={type}
        />

        {acessType === "transferred" &&   
          <div className="col-span-2 flex gap-3 items-center">
            <Selection
              key={externalUnit}
              label="Escolha a unidade externa"
              options={externalUnits}
              name="externalUnitId"
              defaultValue={externalUnit}
              className="grow"
              onClick={loadExternalUnits}
              required
            />

            <ExternalUnitForm />
          </div>    
        }
      </div>
 
      <Button type="submit">Actualizar</Button>
    </form>
  );
}