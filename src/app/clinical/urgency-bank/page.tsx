import { orderByPriority } from "@/lib/filters";
import { formater } from "@/lib/table-formater";
import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Tooltip from "@/components/urgency-bank-tooltip";
import Search from "@/components/ui/search";
import Refresh from "@/components/refresh";
import { getPatients } from "@/backend/api/clinical/urgency-bank-api";
import { getDateInSlashFormat } from "@/lib/date-formater";
import Pagination from "@/components/pagination";

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
  const patients = await getPatients({
    name: name, 
    priority: priority
  });

  const patientRows = formater(patients.patients, {
    order: [
      "priorityType",
      "createdAt",
      "registerNumber",
      "fullname",
      "group",
      "accessType",
    ],
    transform: {
      targetKey: "createdAt",
      fn: e => getDateInSlashFormat(new Date(e))
    }
  });

  const summary = orderByPriority((await getPatients({ name })).patients).summary;

  return(
    <main className="space-y-3">
      <Refresh />

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

      <Pagination
        availablePages={patients.availablePages}
        totalItems={patients.totalItems} 
      />
    </main>
  );
}