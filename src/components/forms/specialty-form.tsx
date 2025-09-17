"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import { updateSpecialty } from "@/backend/api/clinical/api";

export function SpecialtyForm({ data }: {data: string}){
  const specialtyData = JSON.parse(data);
  const [ state, action ] = useActionState(updateSpecialty, { message: "", status: false });
  const router = useRouter();
  
  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, {
          autoClose: 1500,
          onClose: ()=>{
            router.replace('/clinical/phisical-unit/specialty');            
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
            name="specialtyId" 
            value={specialtyData._id} 
          />

          <InputField
            textLabel="Especialidade" 
            placeholder="Insira a especialidade"
            name="specialtyName"
            defaultValue={specialtyData.name}
          />

          <Button>Salvar</Button>
        </form>
      </div>
    </div>
  )
}