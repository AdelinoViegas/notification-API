"use client";

import { 
  useEffect,
  useState,
  useActionState
} from "react";
import { useRouter, useParams } from "next/navigation";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import Alert from "@/components/ui/alert";
import Selection from "@/components/ui/selection";
import { unitTypes } from "@/backend/api/clinical/translator";
import { signUnit, updateExternalUnit, updateUnit } from "@/backend/api/clinical/urgency-bank-api";

type UnitProps = {
  jsonData?: string;
}

type Unit = {
  name: string;
  unitTypeId: string;
  wing: string;
  nursing: string;
  bed: number;
};

type ExteralUnit = {
  name: string;
  street: string;
  municipality: string;
  province: string;
  user: string;
};

function InternmentInputs({
  wing,
  nursing,
  bed,
}: {
  wing?: string;
  nursing?: string;
  bed?: number;
}){
  return(
    <div>
      <InputField
        title="De acordo com a estrutura de organização da unidade"
        textLabel="Ala"
        placeholder="Informe a seccão do internamento"
        name="wing"
        required 
        defaultValue={wing}
      />

      <InputField
        title="De acordo com a estrutura de organização da unidade"
        textLabel="Entermagem"
        placeholder="Informe a seccão do internamento"
        name="nursing"
        defaultValue={nursing}
      />

      <InputField
        title="De acordo com a estrutura de organização da unidade"
        textLabel="Nº da Cama"
        placeholder="Informe a seccão do internamento"
        name="bed"
        defaultValue={bed}
      />
    </div>
  )
}

export default function UnitForm({ jsonData }: UnitProps){
  const currentUnitData = jsonData?JSON.parse(jsonData) as Unit:undefined;
  const [ state, action ] = useActionState(jsonData?updateUnit:signUnit, { message: "", status: false });
  const [ messageState, setMessageState ] = useState(false);
  const [ isInternment, setIsInternment ] = useState(false);
  const router = useRouter();
  const param = useParams();
  
  const handleUnitType = (data: unknown)=>{
    const param = data as { target: { value: string } };

    if(param.target.value === "internment"){
      setIsInternment(true);
    }else{
      setIsInternment(false);
    }
  }
  
  useEffect(()=>{
    setMessageState(true)
    setTimeout(()=>{
      setMessageState(false);
    }, 3000);
  }, [state, router]);
  
  return(
    <div className="px-8 py-4 pb-8 mt-3 border rounded-xl bg-white">
      <div className="w-96">
        <form {...{action}}>
          <input 
            type="hidden" 
            name="unitId" 
            value={param.unitId} 
          />
          <InputField
            textLabel="Nome da Unidade"
            placeholder="Nome da Unidade..."
            required
            name="name" 
            defaultValue={currentUnitData?.name}
          />

          <Selection
            options={unitTypes} 
            label="Tipo de Unidade"
            name="unitTypeId"
            required
            onClick={(data)=>handleUnitType(data)}
            defaultValue={currentUnitData?.unitTypeId}
          />

          { isInternment && 
            <InternmentInputs
              wing={currentUnitData?.wing}
              nursing={currentUnitData?.nursing}
              bed={currentUnitData?.bed}  
            /> 
          }

          <Button>Salvar</Button>

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
      </div>
    </div>
  )
}

export function ExternalUnitForm({ jsonData }: UnitProps){
  const currentUnitData = jsonData?JSON.parse(jsonData) as ExteralUnit:undefined;
  const [ state, action ] = useActionState(updateExternalUnit, { message: "", status: false });
  const [ messageState, setMessageState ] = useState(false);
  const router = useRouter();
  const param = useParams();
  
  useEffect(()=>{
    setMessageState(true)
    setTimeout(()=>{
      setMessageState(false);
      
      if(state.status)
        router.replace('/clinical/phisical-unit/external');
    }, 3000);
  }, [state, router]);
  
  
  return(
    <div className="px-8 py-4 pb-8 mt-3 border rounded-xl bg-white">
      <div className="w-96">
        <form {...{action}}>
          <input 
            type="hidden" 
            name="unitId" 
            value={param.unitId} 
          />

          <InputField
            textLabel="Nome da Unidade"
            placeholder="Nome da Unidade..."
            required
            name="name" 
            defaultValue={currentUnitData?.name}
          />

          <InputField
            textLabel="Rua" 
            placeholder="Rua"
            name="street"
            defaultValue={currentUnitData?.street}
          />

          <InputField
            textLabel="Município" 
            placeholder="Município"
            name="municipality"
            defaultValue={currentUnitData?.municipality}
          />

          <InputField
            textLabel="Província" 
            placeholder="Província"
            name="province"
            defaultValue={currentUnitData?.province}
          />

          <Button>Salvar</Button>

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
      </div>
    </div>
  )
}