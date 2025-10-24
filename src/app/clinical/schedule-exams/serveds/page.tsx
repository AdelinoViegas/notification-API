import { formater } from "@/lib/table-formater";
import Header from "@/components/header";
import Table from "@/components/table";
import Search from "@/components/ui/search";
import { getPatients } from "@/backend/api/clinical/internal-services-api";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name: string;
  }>
}){
  const { name } = await searchParams;
  const patientsData = await getPatients({
    served: true, 
    page: 1,
    type: "laboratory",
    filters: {
      fullname: name,
    } 
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
    </main>
  );
}

