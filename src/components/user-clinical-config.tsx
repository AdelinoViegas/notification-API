"use client";

import { useEffect, useState, useActionState } from "react";
import SpecialtyModal from "./specialty-modal";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import Selection, { SelectionOption } from "./ui/selection";
import { getUrgencyServices } from "@/app/backend/api/clinical/urgency-bank-api";
import { userCategory } from '@/app/backend/api/clinical/translator';
import { getSpecialties, updateUser } from "@/app/backend/api/clinical/api";
import { toast } from "react-toastify";

export default function UserClinicalConfig({ userId }: { userId: string }){
  const [ state, action ] = useActionState(updateUser, { message: "", status: false });
  const [ services, setServices ] = useState<SelectionOption[]>([]);
  const [ specialties, setSpecialties ] = useState<SelectionOption[]>([]);

  useEffect(()=>{
    getUrgencyServices()
    .then(setServices)

    getSpecialties()
    .then(setSpecialties)
  }, []);

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
          required
        />

        <Selection
          label="Serviço"
          name="serviceId"
          options={services} 
          required
        />

        <InputField
          textLabel="Nº de ordem"
          type="number"
          placeholder="Nº de Orgem"
          name="orderNumber"
        />

         <div className='flex gap-3 items-center'>
          <Selection
            options={specialties}
            label="Especialidade"
            name="specialtyId"
            className='w-full'
          />
          <SpecialtyModal />
        </div>

        <div className="flex gap-x-3">
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </div>
  )  
}