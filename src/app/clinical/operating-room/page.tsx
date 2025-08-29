import Header from "@/components/header";
import Table from "@/components/table";
import { getPatients } from "@/backend/api/clinical/operating-room-api";
import { ScheduleSugery, tableOperatingRoom } from "@/lib/table-formater";
import Alert from "@/components/ui/alert";
//import { priorityInOperatingRoom } from "@/lib/filters";
import Search from "@/components/ui/search";
import Refresh from "@/components/refresh";
//import { getScheduleSugeries } from "@/backend/api/clinical/scheduling-api";

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
  const patientRows = tableOperatingRoom(await getPatients({ name, priority }) as ScheduleSugery[]);
  //const dataPriority = priorityInOperatingRoom(await getScheduleSugeries({ name }));
 
  return(
    <main className="space-y-3">
      <Refresh />
      <div className="mt-6">
        <Header title="Banco de Urgência"/>
      </div>

      <div className="flex lg:flex-row justify-between items-center m-0">
        <Alert 
          type="info" 
          message="Faça duplo click sobre o utente para seguir com o atendimento!" 
        />
      </div>
      
      <div className="flex justify-between items-center">
        {/*<TooltipInOperatingRoom data={dataPriority} />
*/}
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