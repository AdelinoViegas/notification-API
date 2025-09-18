import Table from "@/components/table";
import Search from "@/components/ui/search";
import { formater } from "@/lib/table-formater";
import Pagination from "@/components/pagination";
import Refresh from "@/components/refresh";
import RegisterNursing from "./register-nursings";
import { getBeds } from "@/backend/api/clinical/hospitalization-api";
import { getDateInSlashFormat } from "@/lib/date-formater";

export default async function Nursings({ page }: {
  fullname?: string;
  page?: number;
}){
  // const { name, page } = await searchParams;

  const beds = await getBeds();

  const rows = formater(beds.beds, {
    transform: {
      targetKey: "createdAt",
      fn: e => getDateInSlashFormat(new Date(e))
    }
  });
  
  return (
    <main className="space-y-3">
      <Refresh />

      <div className="flex flex-col lg:flex-row justify-between lg:items-center">
        <div>
          <RegisterNursing />
        </div>
        
        <Search
          className="flex items-center gap-3"
          filterKey="name"
          label="Filtar por nome"
          placeholder="Buscar pelo nome do utente..."
        />
      </div>

      <Table
        baseRowLink="/clinical/hospitalization"
        columns={[
          "Data de Registro",
          "Serviço de Internamento",
          "Ala", 
          "Enfermaria", 
          "Cama"
        ]} 
        rows={rows}
      />

      <Pagination
        availablePages={beds.availablePages as number}
        totalItems={beds.totalItems as number} 
      />
    </main>
  );
}