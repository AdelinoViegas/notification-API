import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Search from "@/components/ui/search";
import { formater } from "@/lib/table-formater";
import Pagination from "@/components/pagination";
import Refresh from "@/components/refresh";
import { getTransferHistories } from "@/backend/api/clinical/urgency-bank-api";

export default async function TransferHistory({ 
  name,
  page,
  registerNumber
}: {
  name?: string;
  page?: number;
  registerNumber?: number;
}){
  const patients = await getTransferHistories({ 
    page: page?Number(page):1,
    name,
    registerNumber
  });
  const rows = formater(patients.patients);
  
  return (
    <main className="space-y-3">
      <Refresh />

      <div className="flex flex-col lg:flex-row justify-between lg:items-center">
        <Alert 
          type="info" 
          message="Faça duplo click sobre o utente para seguir com o atendimento!" 
        />

        <Search
          className="flex items-center gap-3"
          filterKey="registerNumber"
          label="Filtro por nº processo"
          placeholder="Buscar pelo nº processo..."
        />

        <Search
          className="flex items-center gap-3"
          filterKey="name"
          label="Filtar por nome"
          placeholder="Buscar pelo nome do utente..."
        />
      </div>

      <Table
        baseRowLink="/clinical/historical"
        columns={[
          "Nº do processo", 
          "Nome do paciente",
        ]} 
        rows={rows}
        rowLength={8}
      />

      <Pagination
        availablePages={patients.availablePages as number}
        totalItems={patients.totalItems as number} 
      />
    </main>
  );
}
