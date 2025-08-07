"use client";

import { applyDischarge } from "@/app/backend/api/clinical/urgency-bank-api";
import Button from "@/components/ui/button";
import InputDetails from "@/components/ui/input-details";
import InputField from "@/components/ui/input-field";
import Selection from "@/components/ui/selection";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";

export default function Page(){
  const discharges = [
    { _id: "hospital", label: "Alta Hopitalar" },
    { _id: "medical", label: "Alta Médica" },
  ]; 

  const [ state, action ] = useActionState(applyDischarge, { message: "", status: false})
  const router = useRouter();

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, { 
          onClose: () => router.replace("/clinical/urgency-bank")
        });
      else
        toast.error(state.message);
  }, [state, router]);

  return(
    <div>
      <form action={action}>
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