import { formater } from "@/lib/table-formater";
import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Search from "@/components/ui/search";
import Pagination from "@/components/pagination";
import Refresh from "@/components/refresh";
import PeriodFilter from "@/components/discharge-history/period-filter";
import { getTransferHistories } from "@/backend/api/clinical/urgency-bank-api";

export default async function TransferHistory({ 
  name,
  page,
  processNumber,
  fromDate,
  toDate
}: {
  name?: string;
  page?: number;
  processNumber?: string,
  fromDate?: string,
  toDate?: string,
}){
  const patients = await getTransferHistories({ 
    page: page?Number(page):1,
    name,
    processNumber,
    fromDate,
    toDate
  });
  const rows = formater(patients.patients);
  
  return (
    <main className="space-y-3">
      <Refresh />

      <Alert
        type="info"
        message="Duplo clique sobre o registo para visualizar o processo completo em modo bloqueado."
      />

      <div className="flex flex-wrap items-end gap-3">
        <PeriodFilter />

        <Search
          className="flex items-end gap-3"
          filterKey="processNumber"
          label="Nº Processo"
          placeholder="Buscar por nº processo..."
        />

        <Search
          className="flex items-end gap-3"
          filterKey="name"
          label="Nome do Paciente"
          placeholder="Buscar pelo nome..."
        />
      </div>

      <Table
        baseRowLink="/clinical/historical"
        columns={[
          "Nº do Processo",
          "Data da Tranferência",
          "Nome do Paciente",
          "Médico Responsável",
        ]} 
        rows={rows}
      />

      <Pagination
        availablePages={patients.availablePages as number}
        totalItems={patients.totalItems as number} 
      />
    </main>
  );
}
