"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import { updateUrgencyServices } from "@/backend/api/clinical/urgency-bank-api";

export function UrgencyServiceForm({ data }: {data: string}){
  const urgencyServicesData = JSON.parse(data);
  const [ state, action ] = useActionState(updateUrgencyServices, { message: "", status: false });
  const router = useRouter();
  
  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, {
          autoClose: 1500,
          onClose: ()=>{
            router.replace('/clinical/phisical-unit/urgency-service');            
          }
        });
      else 
        toast.error(state.message);
  }, [state, router]);
  
  
  return(
    <div className="px-8 py-4 pb-8 mt-3 border rounded-xl bg-white">
      <div className="w-96">
        <form {...{action}}>
          <input 
            type="hidden" 
            name="serviceId" 
            value={urgencyServicesData._id} 
          />

          <InputField
            textLabel="Serviço de urgência" 
            placeholder="Insira o novo serviço"
            name="serviceName"
            defaultValue={urgencyServicesData.label}
          />

          <Button>Salvar</Button>
        </form>
      </div>
    </div>
  )
}