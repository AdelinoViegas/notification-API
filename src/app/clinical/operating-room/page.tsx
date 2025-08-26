import Header from "@/components/header";
import Table from "@/components/table";
import { ScheduleSugery, tableSugeries } from "@/lib/table-formater";
import Alert from "@/components/ui/alert";
import {priorityInOperatingRoom } from "@/lib/filters";
import TooltipInOperatingRoom from "@/components/operating-room-tooltip";
import Search from "@/components/ui/search";
import Refresh from "@/components/refresh";
import { getScheduleSugeries } from "@/backend/api/clinical/scheduling-api";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name: string;
    registerNumber: number;
    priority: string;
  }>
}){ 
  const { name, priority } = await searchParams;
  const patientRows = tableSugeries(await getScheduleSugeries({ name, priority }) as ScheduleSugery[]); 
  const priorityData = priorityInOperatingRoom(await getScheduleSugeries({ name })).areasToSchedule;
  
  console.log(patientRows);
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
        <TooltipInOperatingRoom data={priorityData} />
        <Search
          className="flex items-center gap-x-3"
          filterKey="name"
          label="Filtar por nome"
          placeholder="Buscar pelo nome do utente..."
        />
      </div>

      <Table
        rowLength={6}
        priorityCol
        rows={[]}
        columns={[
          "Prioridade",
          "Data Registo", 
          "Nº de Registo", 
          "Nome Completo",
          "Grupo Utente",
          "Tipo de Acesso"
        ]} 
      />
    </main>
  );
}