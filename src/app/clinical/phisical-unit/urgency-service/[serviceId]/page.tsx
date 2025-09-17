import Header from "@/components/header";
import { UrgencyServiceForm } from "@/components/forms/urgency-service-form";
import { getUrgencyService } from "@/backend/api/clinical/urgency-bank-api";

export default async function Page({ params }: {
  params: Promise<{
    serviceId: string;
  }>
}){
  const { serviceId } = await params;
  const service = await getUrgencyService(serviceId);

  return(
    <main>
      <div className="mt-6">
        <Header title="Editar Unidade Externa"/>
      </div>
      
     <UrgencyServiceForm data={JSON.stringify(service)}/>
    </main>
  );
}