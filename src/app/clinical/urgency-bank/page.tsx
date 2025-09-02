import Header from "@/components/header";
import Table from "@/components/table";
import { getPatients } from "@/backend/api/clinical/urgency-bank-api";
import tableFormater from "@/lib/table-formater";
import Alert from "@/components/ui/alert";
import { orderByPriority } from "@/lib/filters";
import Tooltip from "@/components/urgency-bank-tooltip";
import Search from "@/components/ui/search";
import Refresh from "@/components/refresh";

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
  const patientRows = tableFormater(await getPatients({
    name: name, 
    priority: priority
  }));

  const summary = orderByPriority(await getPatients({ name })).summary;

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
        <Tooltip data={summary} />
        <Search
          className="flex items-center gap-x-3"
          filterKey="name"
          label="Filtar por nome"
          placeholder="Buscar pelo nome do utente..."
        />
      </div>

      <Table
        baseRowLink="/clinical/urgency-bank"
        rowLength={6}
        priorityCol
        rows={patientRows}
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