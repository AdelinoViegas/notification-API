import Header from "@/components/header";
import { UrgencyServiceForm } from "@/components/forms/urgency-service-form";
import { getUrgencyService } from "@/backend/api/clinical/urgency-bank-api";

export default async function Page({ params }: { params: Promise<{ id: string }>}){
  const { id } = await params;
  const service = await getUrgencyService(id);

  return(
    <main>
      <Header title="Editar Serviço de Urgência"/>
      <UrgencyServiceForm data={JSON.stringify(service)}/>
    </main>
  );
}