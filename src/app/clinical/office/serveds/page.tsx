import Header from "@/components/header";
import Table from "@/components/table";
import { type DoctorOffice, tableOffice } from "@/lib/table-formater";
import Alert from "@/components/ui/alert";
import Search from "@/components/ui/search";
import { getPatients } from "@/app/backend/api/clinical/office-api";

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
  const rows = tableOffice(scheduleOffices.patients as DoctorOffice[]);

  return (
    <main className="space-y-3">
      
      
      <div className="mt-6">
        <Header title="Consultas Realizadas"/>
      </div>

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
