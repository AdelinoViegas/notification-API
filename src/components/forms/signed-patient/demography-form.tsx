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
import Selection from "@/components/ui/selection";
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
  const [ isEdit, setIsEdit ] = useState(false);
  const [ isExternal, setIsExternal ] = useState(false);
  const [ _naturality, setNaturality ] = useState(naturality);

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
          disabled={!isEdit}
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
          disabled={!isEdit}
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
            label="Província"
            options={AngolaProvices}
            name="province"
            required
            defaultValue={province}
            disabled={!isEdit}
          />
        }

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