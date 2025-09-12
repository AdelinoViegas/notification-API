import { formater } from "@/lib/table-formater";
import Table from "@/components/table";
import Search from "@/components/ui/search";
import { getScheduleAppointments } from "@/backend/api/clinical/scheduling-api";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name:string;
  }>
}) {
  const { name } = await searchParams;
  const appointmentData = await getScheduleAppointments({ 
    served: false, 
    canceled: true,
    patientName: name,
  });
  const patientRows = formater(appointmentData, {
    order: [
      "dateTime",
      "patient",
      "doctor",
      "room",
      "status",
    ]
  });
  
  return (
    <main className="space-y-3">

      <Search
        className="flex items-center gap-3"
        filterKey="name"
        label="Filtar por nome"
        placeholder="Buscar pelo nome do utente..."
      />

      <Table
        status
        baseRowLink="/clinical/appointment/archiveds"
        columns={[
          "Data e Hora", 
          "Nome do Utente", 
          "Nome do Médico",
          "Sala",
          "Estado"
        ]} 
        rows={patientRows}
      />
    </main>
  );
}
