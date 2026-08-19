"use client";

import { useEffect, useActionState, useState } from "react";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import Selection, { SelectionOption } from "./ui/selection";
import { userCategory, historicalAccess } from '@/backend/api/clinical/translator';
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
  internalServices,
  historicalAccessId,
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
  historicalAccessId: string[];
}){
  const [ state, action, pending ] = useActionState(registerUser, {
    message: "",
    status: false,
    saved: undefined,
  });

  // Estado controlado — inicializado com as props do servidor
  const [form, setForm] = useState({
    categoryId: categoryId ?? "",
    serviceId: serviceId ?? "",
    orderNumber: orderNumber ?? 0,
    specialtyId: specialtyId ?? "",
    internalServiceId: internalServiceId ?? "",
    historicalAccessId: historicalAccessId ?? [],
  });

  useEffect(() => {
    if (!state.message) return;

    if (state.status) {
      toast.success(state.message);
      // Sincroniza o estado do form com os valores realmente guardados,
      // evitando reset após o Next.js re-renderizar o Server Component
      if (state.saved) {
        setForm(state.saved);
      }
    } else {
      toast.error(state.message);
    }
  }, [state]);

  function handleCheckbox(id: string, checked: boolean){
    setForm(prev => ({
      ...prev,
      historicalAccessId: checked
        ? [...prev.historicalAccessId, id]
        : prev.historicalAccessId.filter(v => v !== id),
    }));
  }

  return(
    <div>
      <form action={action}>
        <input type="hidden" name="id" value={userId} />

        <Selection
          label="Categoria"
          name="categoryId"
          options={userCategory} 
          value={form.categoryId}
          onChange={e => setForm(prev => ({ ...prev, categoryId: e.target.value }))}
          required
        />
        
        <Selection
          label="Serviço"
          name="serviceId"
          options={services} 
          value={form.serviceId}
          onChange={e => setForm(prev => ({ ...prev, serviceId: e.target.value }))}
        />

        <InputField
          textLabel="Nº de ordem"
          type="number"
          placeholder="Nº de Orgem"
          name="orderNumber"
          value={form.orderNumber}
          onChange={e => setForm(prev => ({ ...prev, orderNumber: Number(e.target.value) }))}
          required
        />

        <Selection
          options={specialties}
          label="Especialidade"
          name="specialtyId"
          value={form.specialtyId}
          onChange={e => setForm(prev => ({ ...prev, specialtyId: e.target.value }))}
          className='w-full'
        />

        <Selection
          options={internalServices}
          label="Serviço de Internamento"
          name="internalServiceId"
          value={form.internalServiceId}
          onChange={e => setForm(prev => ({ ...prev, internalServiceId: e.target.value }))}
          className='w-full'
        />

        <fieldset className="mt-4">
          <legend className="text-sm font-medium text-gray-700 mb-2">Acesso ao Histórico</legend>
          <div className="flex flex-col gap-2">
            {historicalAccess.map((option) => (
              <label key={option._id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="historicalAccessId"
                  value={option._id}
                  checked={form.historicalAccessId.includes(option._id)}
                  onChange={e => handleCheckbox(option._id, e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Button className="mt-6" type="submit" disabled={pending}>Salvar</Button>
      </form>
    </div>
  )  
}