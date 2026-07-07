"use client";

import { 
  useEffect,
  useState,
  useActionState,
} from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import Selection from "@/components/ui/selection";

import type { Demography } from "@/backend/api/clinical/types";
import { updateDemography } from "@/backend/api/clinical/api";
import { AngolaProvices } from "@/backend/api/clinical/translator";

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
  const [ isExternal, setIsExternal ] = useState(false);
  const [ _naturality, setNaturality ] = useState(naturality);
  const [ _province, setProvince ] = useState(province);

  useEffect(() => {
    setProvince(province);
  }, [province]);

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
      <div className="grid md:grid-cols-2 large:grid-cols-3 gap-3">
        <input type="hidden" name="id" value={id} />

        {!isExternal && <Selection
          label="Nacionalidade"
          name="nationality"
          options={[
            { _id: "Angolana", label: "Angolana" },
            { _id: "outros", label: "Outra" }
          ]}
          onChange={(e)=>{
            if(e.target.value === "outros"){
              setIsExternal(true);
            }else {
              setIsExternal(false);
              setNaturality("Angola");
            }
          }}
          defaultValue={nationality}
          required
        />}

        { isExternal && 
          <InputField
            textLabel="Nacionalidade"
            name="nationality" 
            required
            placeholder="Nacionalidade do utente"
            onChange={(e) => {
              if(/\wngo/ig.test(e.target.value)){
                setIsExternal(false);
                setNaturality("Angola");
              }
            }}
          />
        }

        <InputField
          textLabel="Naturalidade"
          name="naturality"
          required 
          placeholder="Naturalidade do utente"
          value={_naturality}
          onChange={(e) => setNaturality(e.target.value)}
        />

        {isExternal && 
        <InputField
          textLabel="Província"
          name="province" 
          placeholder="Província do utente"
          defaultValue={province}
        />}

        { !isExternal &&
          <Selection
            key={_province}
            label="Província"
            options={AngolaProvices}
            name="province"
            required
            defaultValue={_province}
          />
        }

        <InputField
          textLabel="Morada Actual"
          name="actualLocation"
          required 
          placeholder="Município/bairro/ponto de referência"
          defaultValue={actualLocation}
        />

        <InputField
          textLabel="Rua (Opcional)"
          name="street" 
          placeholder="Digite a rua"
          defaultValue={street}
        />

        <InputField
          textLabel="Nª da casa (Opcional)"
          name="homeNumber" 
          placeholder="Digite o seu município"
          defaultValue={homeNumber}
        />
      </div>
      
      <Button type="submit">Actualizar</Button>
    </form>
  );
}