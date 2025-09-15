import { orderByPriority } from "@/lib/filters";
import { formater } from "@/lib/table-formater";
import Header from "@/components/header";
import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Tooltip from "@/components/urgency-bank-tooltip";
import Search from "@/components/ui/search";
import Refresh from "@/components/refresh";
import { getPatients } from "@/backend/api/clinical/urgency-bank-api";

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
  const patientData = await getPatients({
    name: name, 
    priority: priority
  });
  const patientRows = formater(patientData, {
    order: [
      "priorityType",
      "createdAt",
      "registerNumber",
      "fullname",
      "group",
      "accessType",
    ]
  });

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