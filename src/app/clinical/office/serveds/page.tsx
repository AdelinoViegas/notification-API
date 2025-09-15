import { formater } from "@/lib/table-formater";
import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Search from "@/components/ui/search";
import { getPatients } from "@/backend/api/clinical/office-api";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name: string;
  }>
}) {
  const { name } = await searchParams;
  const scheduleOffices = await getPatients({ fullname: name, served: true });
  const rows = formater(scheduleOffices.patients, {
    order: [      
      "markedDataTime",
      "patient",
      "user",
      "room",
    ],
    filterKey: [
      "id",
      "markedDataTime",
      "patient",
      "user",
      "room",
    ]
  });

  return (
    <main className="space-y-3">
      
      
      <div className="flex items-center justify-between lg:flex-row gap-3 items-center">
        <Alert 
          type="info" 
          message="Faça duplo click sobre a consulta agendado para seguir com o atendimento!" 
        />

      <Search
        className="flex items-center gap-3"
        filterKey="name"
        label="Filtar por Nome"
        placeholder="Buscar pelo nome do utente..."
      />
      </div>

      <Table
        baseRowLink="/clinical/office/serveds"
        columns={[
          "Antendido", 
          "Nome do Utente", 
          "Responsável",
          "Sala"
        ]} 
        rows={rows}
      />
    </main>
  );
}
