"use client";

import { 
  useEffect,
  useState,
  useActionState 
} from "react";
import { toast } from "react-toastify";
import { useRouter, useParams } from "next/navigation";
import InputField from "@/components/ui/input-field";
import Selection, { SelectionOption } from "@/components/ui/selection";
import Button from "@/components/ui/button";
import SpecialtyModal from "@/components/specialty-modal";
import { updateService } from "@/backend/api/clinical/scheduling-api";
import { defaultServiceKinds } from "@/backend/api/clinical/translator";

type Service = {
  _id: string;
  name: string;
  categoryId: string;
  groupId: string;
  classificationId: string;
  price: number;
  specialtyId?: string;
  kind: string;
};

type ServiceProps = {
  service: string;
  groups: string;
  categories: string;
  classifications: string;
  specialties: string;
};

export default function UpdateService({
  service,
  groups,
  categories,
  classifications,
  specialties
}: ServiceProps){
  const [ state, action ] = useActionState(updateService, { message: "", status: false });
  const currentService = JSON.parse(service) as Service;
  const _groups = JSON.parse(groups) as SelectionOption[];
  const _categories = JSON.parse(categories) as SelectionOption[];
  const _classifications = JSON.parse(classifications) as SelectionOption[];
  const _specialties = JSON.parse(specialties) as SelectionOption[];
  const router = useRouter();
  const params = useParams();
  const [ specialtyState, setSpecialtyState ] = useState(currentService?.specialtyId ? true:false);

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, {
          onClose: () => router.replace("/clinical/services")
        });
      else
        toast.error(state.message);
  }, [state, router]);

  return(
    <div className="bg-white border rounded-xl px-8 py-4">
      <form className="w-96" {...{action}}>
        <input type="hidden" name="id" value={params.id} />

        <InputField
          textLabel="Nome do Serviço"
          placeholder="Descreva o nome do serviço" 
          required
          name="name"
          defaultValue={currentService.name}
        />

        <Selection
          options={defaultServiceKinds}
          label="Tipo de Serviço"
          name="kindOfService"
          className="grow"
          onChange={e => setSpecialtyState(e.target.value === "consultation" ? true:false)}
          defaultValue={currentService?.kind}
          required
        />


        { specialtyState && <div className="flex gap-3 items-center">
          <Selection
            options={_specialties}
            label="Especialidade"
            name="specialtyId"
            className="grow"
            defaultValue={currentService.specialtyId}
          />
          
          <SpecialtyModal shortWord />
        </div>}


        <Selection
          label="Categoria"
          name="categoryId"
          required
          options={_categories}
          defaultValue={currentService.categoryId}
        />

        <Selection
          label="Classificação"
          name="classificationId"
          required
          options={_classifications}
          defaultValue={currentService.classificationId}
        />

        <Selection
          label="Grupo"
          name="groupId"
          required
          options={_groups}
          defaultValue={currentService.groupId}
        />

        <InputField
          textLabel="Preço" 
          type="number"
          placeholder="Preço do Exame/Serviço"
          name="price"
          defaultValue={currentService.price}
        />

        <Button>Actualizar</Button>
      </form>
    </div>
  )
}