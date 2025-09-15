import Table from "@/components/table";
import Search from "@/components/ui/search";
import { formater } from "@/lib/table-formater";
import Pagination from "@/components/pagination";
import Refresh from "@/components/refresh";
import { getHospitalized } from "@/backend/api/clinical/hospitalization-api";
import RegisterNursing from "./register-nursings";

export default async function Nursings({ page }: {
  fullname?: string;
  page?: number;
}){
  // const { name, page } = await searchParams;

  const patients = await getHospitalized({ 
    // fullname: name, 
    page: page?Number(page):1,
  });

  const rows = formater(patients.patients);
  
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
          "Nome Completo", 
          "Enfermaria/Quarto", 
          "Nº da Cama",
          "Nº de Processo",
          "Médico Assistente"
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