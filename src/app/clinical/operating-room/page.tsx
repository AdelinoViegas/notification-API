import { priorityInOperatingRoom } from "@/lib/filters";
import { formater } from "@/lib/table-formater";
import Header from "@/components/header";
import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Search from "@/components/ui/search";
import Refresh from "@/components/refresh";
import TooltipInOperatingRoom from "@/components/operating-room-tooltip";
import { getPatients } from "@/backend/api/clinical/operating-room-api";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name: string;
    priority?: string;
  }>
}){ 
  const { name, priority } = await searchParams;
  const patients = await getPatients({ name, priority});
  const patientRows = formater(patients, {
    order: [
      "requestingService",
      "date",
      "patient",
      "sugeryType",
      "infirmary",
      "bed",
      "doctor",
    ]
  }) ;
  const dataPriority = priorityInOperatingRoom(patients);
 
  return(
    <main className="space-y-3">
      <Refresh />
      <div className="mt-6">
        <Header title="Bloco Operatório"/>
      </div>

      <div className="flex lg:flex-row justify-between items-center m-0">
        <Alert 
          type="info" 
          message="Faça duplo click sobre o utente para seguir com o atendimento!" 
        />
      </div>
      
      <div className="flex justify-between items-center">
        <TooltipInOperatingRoom data={dataPriority.areasToSchedule} />

        <Search
          className="flex items-center gap-x-3"
          filterKey="name"
          label="Filtar por nome"
          placeholder="Buscar pelo nome do utente..."
        />
      </div>

      <Table
        baseRowLink="/clinical/operating-room"
        rowLength={6}
        priorityCol
        columns={[
          "Serv. Solicitante",
          "Data e Hora", 
          "Nome do Utente", 
          "Tipo de cirurgia",
          "Efermaria",
          "Cama",
          "Nome do Médico",
        ]}
        rows={patientRows} 
      />
    </main>
  );
}