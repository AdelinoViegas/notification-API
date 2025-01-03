import Header from "@/components/header";
import Table from "@/components/table";
import { ScheduleAppointment, tableAppointments } from "@/lib/table-formater";
import Search from "@/components/ui/search";
import WsUpdate from "@/components/ws-update";
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
  const scheduleOffices = await getPatients({ 
    fullname: name, 
    served: true,
    inAppointment: true, 
  });

  const rows = tableAppointments(scheduleOffices.patients as ScheduleAppointment[]);

  return (
    <main className="space-y-3">
      <WsUpdate target="office" />
      
      <div className="mt-6">
        <Header title="Consultas Atendidas"/>
      </div>

      <Search
        className="flex items-center gap-3"
        filterKey="name"
        label="Filtar por Nome"
        placeholder="Buscar pelo nome do utente..."
      />

      <Table
        columns={[
          "Data e Hora", 
          "Nome do Utente", 
          "Nome do Médico",
          "Responsável",
          "Estado"
        ]} 
        rows={rows}
      />
    </main>
  );
}
