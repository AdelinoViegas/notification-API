"use client";

import { useEffect, useActionState } from "react";
import SpecialtyModal from "./specialty-modal";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import Selection, { SelectionOption } from "./ui/selection";
import { userCategory } from '@/app/backend/api/clinical/translator';
import { updateUser } from "@/app/backend/api/clinical/api";
import { toast } from "react-toastify";

export default function UserClinicalConfig({ 
  userId,
  categoryId,
  serviceId,
  specialtyId,
  orderNumber,
  services,
  specialties
}: { 
  userId: string;
  categoryId: string;
  serviceId: string;
  specialtyId: string;
  orderNumber: number;
  services: SelectionOption[];
  specialties: SelectionOption[];
}){
  const [ state, action ] = useActionState(updateUser, { message: "", status: false });

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
        <input type="hidden" name="userId" value={userId} />
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
          required
        />

        <InputField
          textLabel="Nº de ordem"
          type="number"
          placeholder="Nº de Orgem"
          name="orderNumber"
          defaultValue={orderNumber}
        />

        <div className='flex gap-x-3 items-center'>
          <Selection
            options={specialties}
            label="Especialidade"
            name="specialtyId"
            defaultValue={specialtyId}
            className='w-full'
          />
          <SpecialtyModal />
        </div>

        <Button type="submit">Salvar</Button>
      </form>
    </div>
  )  
}