import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Search from "@/components/ui/search";
//import { formater } from "@/lib/table-formater";
import Pagination from "@/components/pagination";
import Refresh from "@/components/refresh";
import { getPatients } from "@/backend/api/clinical/hospitalization-api";
//import { getDataAndHoursFormat } from "@/lib/date-formater";

export default async function DeathHistory({ 
  name,
  page,
}: {
  name?: string;
  page?: number;
}){
  const patients = await getPatients({ 
    page: page?Number(page):1,
    filterByUserId: true,
    strictQuery: true,
    name,
  });

  /*const rows = formater(patients.patients, {
    transform: {
      targetKey: "createdAt",
      fn: e => getDataAndHoursFormat(new Date(e))
    }
  });*/
  
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
          filterKey="name"
          label="Filtar por nome"
          placeholder="Buscar pelo nome do utente..."
        />
      </div>

      <Table
        baseRowLink="/clinical/hospitalization"
        columns={["teste"]} 
        rows={[]}
      />

      <Pagination
        availablePages={patients.availablePages as number}
        totalItems={patients.totalItems as number} 
      />
    </main>
  );
}