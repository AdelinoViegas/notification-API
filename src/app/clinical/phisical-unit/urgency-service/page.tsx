import { formater } from "@/lib/table-formater";
import Header from "@/components/header";
import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Search from "@/components/ui/search";
import SignUrgencyService from "@/components/forms/sign-urgency-services";
import { getUrgencyServices } from "@/backend/api/clinical/urgency-bank-api";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name: string;
  }>
}) {
  const { name } = await searchParams;
  const urgencyServicies = await getUrgencyServices(name );
  const patientRows = formater(urgencyServicies, {
    order:[
      "label",
    ],
    filterKey: [
      "id",
      "label",
    ]
  });

  return (
    <main className="space-y-3">
      <div className="flex gap-x-2 pb-4">
        <SignUrgencyService />
      </div>

      <div className="flex lg:flex-row justify-between gap-3 items-center">
        <Alert 
          type="info" 
          message="Faça duplo click sobre a unidade para editar!" 
        />

        <Search
          className="flex items-center gap-3"
          filterKey="name"
          label="Filtar pelo nome do serviço de urgência"
          placeholder="Buscar pelo nome..."
        />
      </div>
  
      <Table
        baseRowLink="/clinical/phisical-unit/urgency-service"
        columns={[
          "Serviço de urgência", 
        ]} 
        rows={patientRows}
      />
    </main>
  );
}