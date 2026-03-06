"use client";

import { 
  useEffect, 
  useState, 
  useActionState,
} from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import Selection from "@/components/ui/selection";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";

import type { Patient } from "@/backend/api/clinical/types";
import { updatePersonalInfo } from "@/backend/api/clinical/api";
import { 
  civilState as civilStateValues, 
  gender as genderValues
} from "@/backend/api/clinical/translator";

type Personal = { id: string } & Patient;

export default function PersonalInfoForm({
  id,
  age,
  birthDate,
  civilState,
  documentation,
  fullname,
  gender,
  tel,
  lang
}: Personal){
  const [ state, action ] = useActionState(updatePersonalInfo, { message: "", status: false });
  const router = useRouter();
  const [ isEdit, setIsEdit ] = useState(false);
  const [ civilStatus, setCivilStatus ] = useState(civilState);
  const [ _gender, setGender ] = useState(gender);
  const disableEdit = ()=>setIsEdit(false);
  
  useEffect( ()=> {
    setCivilStatus(civilState);
    setGender(gender);
  }, [civilState, gender]);
  
  useEffect(()=>{
    if(state.message){
      if(state.status)
        toast.success(state.message, { 
          onOpen: ()=>{
            router.refresh();
            disableEdit();
          }        
        });
      else
        toast.error(state.message);
    }
  }, [state]);

  return(
    <form {...{action}}>
      <div className="grid md:grid-cols-2 large:grid-cols-3 gap-3">
        <input type="hidden" name="id" value={id} />

        <InputField
          textLabel="Nome Completo"
          name="fullname"
          required
          placeholder="Nome completo do utentes"
          disabled={!isEdit}
          defaultValue={fullname}
        />
        
        <InputField
          textLabel="Data de Nascimento"
          name="birthDate"
          required 
          type="date"
          disabled={!isEdit}
          defaultValue={birthDate?.toISOString().split('T')[0]}
        />

        <InputField
          textLabel="Idade"
          required 
          type="number"
          maxLength={3}
          placeholder="Digite a idade" 
          defaultValue={age}        
          disabled
        />
        
        <Selection
          options={civilStateValues}
          label="Estado Civil"
          name="civilState"
          disabled={!isEdit}
          required
          defaultValue={civilStatus}
        />
        
        <Selection
          options={genderValues}
          label="Gênero" 
          name="gender"
          required
          disabled={!isEdit}
          defaultValue={_gender}
        />
        
        <InputField
          textLabel="Nº de Telefone"
          name="tel" 
          type="Tel"
          required
          maxLength={9}
          placeholder="Digite o Número de Telefone"
          defaultValue={tel}
          disabled={!isEdit}
        />

        <InputField
          textLabel="Documentação (BI | Passaporte |Cédula)"
          name="documentation" 
          required
          placeholder="Nº de BI / Nº de Cédula / Nº de Passaporte"
          disabled={!isEdit}
          defaultValue={documentation}
        />
        
        <InputField
          textLabel="Idioma (Opcional)"
          name="language" 
          placeholder="idioma de comunicação habitual"
          disabled={!isEdit}
          defaultValue={lang}
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
    </form>
  );
}