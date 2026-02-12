"use client";

import { useActionState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import Button from "@/components/ui/button";
import InputDetails from "@/components/ui/input-details";
import InputField from "@/components/ui/input-field";
import Selection from "@/components/ui/selection";
import { applyDischarge } from "@/backend/api/clinical/urgency-bank-api";

export default function Page(){
  const discharges = [
    { _id: "hospital", label: "Alta Hopitalar" },
    { _id: "medical", label: "Alta Médica" },
  ]; 

  const [ state, action ] = useActionState(applyDischarge, { message: "", status: false})
  const router = useRouter();
  const params = useParams();

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, { 
          onOpen: () => router.replace("/clinical/hospitalization?r=h")
        });
      else
        toast.error(state.message);
  }, [state, router]);

  return(
    <div>
      <form action={action}>
        <input type="hidden" name="patientId" value={params.patientId} />

        <div className="grid md:grid-cols-2 gap-x-3">
          <Selection
            label="Tipo de Alta"
            options={discharges} 
            name="kind"
          />

          <InputField 
            textLabel="Data da Alta"
            type="datetime-local"
            name="makedAt"
          />
        </div>

        <InputDetails
          textLabel="Motivo"
          placeholder="Descreva o motivo da alta ..."
          name="reason" 
        />

        <Button>Concluir</Button>
      </form>
    </div>
  )
}