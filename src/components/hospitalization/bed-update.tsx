"use client";

import { useActionState, useEffect } from "react";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import { updateBed } from "@/backend/api/clinical/hospitalization-api";
import { toast } from "react-toastify";
import Selection, { SelectionOption } from "@/components/ui/selection";
import { useParams, useRouter } from "next/navigation";

interface Props {
  services: SelectionOption[];
  sections: SelectionOption[];
  nursings: SelectionOption[];
  serviceId: string;
  sectionId: string;
  nursingId: string;
  bedName: string;
}
export default function BedUpdate({
  bedName,
  nursingId,
  nursings,
  sectionId,
  sections,
  serviceId,
  services
}: Props){

  const [ state, action ] = useActionState(updateBed, { message: "", status: false }); 
  const router = useRouter();
  const params = useParams<{ id: string }>();

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, { 
          onClose: router.refresh
        });
      else
        toast.error(state.message);

  }, [state]);

  return(
    <div>
      <form action={action}>
        <input type="hidden" name="id" value={params.id} />

        <Selection
          label="Serviço de Internamento"
          options={services} 
          defaultValue={serviceId}
          disabled
        />

        <Selection
          label="Ala"
          options={sections} 
          defaultValue={sectionId}
          required
          disabled
        />

        <Selection
          label="Enfermaria"
          name="nursingId"
          options={nursings} 
          defaultValue={nursingId}
          required
        />

        <InputField
          textLabel="Nº da Cama"
          name="name" 
          defaultValue={bedName}
          placeholder="Nº da cama"
          required
        />

        <Button>Salvar</Button>
      </form>
    </div>
  )
}