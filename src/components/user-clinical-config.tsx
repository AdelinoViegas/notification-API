"use client";

import { useEffect, useActionState } from "react";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import Selection, { SelectionOption } from "./ui/selection";
import { userCategory } from '@/backend/api/clinical/translator';
import { registerUser } from "@/backend/api/clinical/api";
import { toast } from "react-toastify";

export default function UserClinicalConfig({ 
  userId,
  categoryId,
  serviceId,
  specialtyId,
  orderNumber,
  services,
  specialties,
  internalServiceId,
  internalServices
}: { 
  userId: string;
  categoryId: string;
  serviceId: string;
  specialtyId: string;
  orderNumber: number;
  services: SelectionOption[];
  specialties: SelectionOption[];
  internalServices: SelectionOption[];
  internalServiceId: string;
}){
  const [ state, action ] = useActionState(registerUser, { message: "", status: false });

  useEffect(()=>{
    if(state.message){
      if(state.status)
        toast.success(state.message);
      else
        toast.error(state.message);
    }
  }, [state]);
  

  return(
    <div>
      <form action={action}>
        <input type="hidden" name="id" value={userId} />
        <Selection
          label="Categoria"
          name="categoryId"
          options={userCategory} 
          defaultValue={categoryId}
          required
        />
        
        <Selection
          label="Serviço"
          name="serviceId"
          options={services} 
          defaultValue={serviceId}
        />

        <InputField
          textLabel="Nº de ordem"
          type="number"
          placeholder="Nº de Orgem"
          name="orderNumber"
          defaultValue={orderNumber}
          required
        />

        <Selection
          options={specialties}
          label="Especialidade"
          name="specialtyId"
          defaultValue={specialtyId}
          className='w-full'
        />

        <Selection
          options={internalServices}
          label="Serviço de Internamento"
          name="internalServiceId"
          defaultValue={internalServiceId}
          className='w-full'
        />

        <Button className="mt-6" type="submit">Salvar</Button>
      </form>
    </div>
  )  
}