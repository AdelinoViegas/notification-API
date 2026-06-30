import { formater } from "@/lib/table-formater";
import Header from "@/components/header";
import Table from "@/components/table";
import Search from "@/components/ui/search";
import Pagination from "@/components/pagination";
import { getPatientScheduledServeds } from "@/backend/api/clinical/scheduling-api";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name: string;
    p: string;
  }>
}){
  const { name, p: page } = await searchParams;
  const patientsData = await getPatientScheduledServeds({
    isServed: true, 
    name: name,
    page: page?Number(page):1,
 
  });

  const rows = formater(patientsData.patients, {
    order: [
      "markedDataTime",
      "patient",
      "user",
      "nameLaboratory"
    ]
  });

  return (
    <main className="space-y-3">
      <div className="mt-6">
        <Header title="Exames Atendidos"/>
      </div>

      <Search
        className="flex items-center gap-3"
        filterKey="name"
        label="Filtar por Nome"
        placeholder="Buscar pelo nome do utente..."
      /> 

      <Table
        columns={[
          "Data e Hora", 
          "Nome do Utente", 
          "Responsável",
          "Laboratório"
        ]} 
        rows={rows}
      />

      <Pagination
        availablePages={patientsData.availablePages as number}
        totalItems={patientsData.totalItems as number} 
      />
    </main>
  );
}

