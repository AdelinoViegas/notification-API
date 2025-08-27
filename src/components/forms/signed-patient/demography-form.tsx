"use client";

import { 
  useEffect,
  useState,
  useActionState,
} from "react";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import type { Demography } from "@/backend/api/clinical/types";
import { updateDemography } from "@/backend/api/clinical/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import forceRefreshPage from "@/lib/force-refresh";

type InfoProps = {
  id: string;
} & Demography;

export default function DemographicInfoForm({
  id,
  nationality,
  naturality,
  province,
  actualLocation,
  street,
  homeNumber,
}: InfoProps){
  const [ state, action] = useActionState(updateDemography,{ message:"", status:false })
  const router = useRouter();
  const [ isEdit, setIsEdit ] = useState(false);
  const disableEdit = ()=>setIsEdit(false);

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
      <div className="grid md:grid-cols-2 large:grid-cols-3 gap-3">
        <input 
          type="hidden" 
          name="id" 
          value={id} 
        />

        <InputField
          textLabel="Nacionalidade"
          name="nationality" 
          required
          placeholder="Nacionalidade do utente"
          disabled={!isEdit}
          defaultValue={nationality}
        />

        <InputField
          textLabel="Naturalidade"
          name="naturality"
          required 
          placeholder="Naturalidade do utente"
          disabled={!isEdit}
          defaultValue={naturality}
        />

        <InputField
          textLabel="Província"
          name="province"
          required 
          placeholder="Província do utente"
          disabled={!isEdit}
          defaultValue={province}
        />

        <InputField
          textLabel="Morada Actual"
          name="actualLocation"
          required 
          placeholder="Município/bairro/ponto de referência"
          disabled={!isEdit}
          defaultValue={actualLocation}
        />

        <InputField
          textLabel="Rua (Opcional)"
          name="street" 
          placeholder="Digite a rua"
          disabled={!isEdit}
          defaultValue={street}
        />

        <InputField
          textLabel="Nª da casa (Opcional)"
          name="homeNumber" 
          placeholder="Digite o seu município"
          disabled={!isEdit}
          defaultValue={homeNumber}
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