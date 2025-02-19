"use client";

import { useEffect, useState } from "react";
import SpecialtyModal from "./specialty-modal";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import Selection, { SelectionOption } from "./ui/selection";
import { getUrgencyServices } from "@/app/backend/api/clinical/urgency-bank-api";
import { userCategory } from '@/app/backend/api/clinical/translator';
import { getSpecialties } from "@/app/backend/api/clinical/api";

export default function UserClinicalConfig({ userId }: { userId: string }){
  const [ services, setServices ] = useState<SelectionOption[]>([]);
  const [ specialties, setSpecialties ] = useState<SelectionOption[]>([]);

  useEffect(()=>{
    getUrgencyServices()
    .then(setServices)

    getSpecialties()
    .then(setSpecialties)
  }, [])
  return(
    <div>
      <form>
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
            className='w-full'
          />
          <SpecialtyModal />
        </div>

        <div className="flex gap-x-3">
          <Button cancel>Cancelar</Button>
          <Button>Salvar</Button>
        </div>
      </form>
    </div>
  )  
}