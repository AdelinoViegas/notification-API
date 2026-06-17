import { formater } from "@/lib/table-formater";
import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Search from "@/components/ui/search";
import Refresh from "@/components/refresh";
import { getDeathHistories } from "@/backend/api/clinical/urgency-bank-api";

export default async function DeathHistory({ 
  name,
  page,
  registerNumber
}: {
  name?: string;
  page: number;
  registerNumber: number;
}){
  const patients = await getDeathHistories({ 
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
          message="Registos de óbitos serão exibidos nesta secção." 
        />
        
        <Search
          className="flex items-center gap-3"
          filterKey="name"
          label="Filtar por nome"
          placeholder="Buscar pelo nome do utente..."
        />
      </div>

      <Table
        baseRowLink="/clinical/death-history"
        columns={[
          "Nº do processo",
          "Nome do paciente",
        ]} 
        rows={rows}
      />
    </main>
  );
}