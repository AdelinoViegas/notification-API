import Header from "@/components/header";
import Table from "@/components/table";
import { tableLaboratory } from "@/lib/table-formater";
import Search from "@/components/ui/search";
import WsUpdate from "@/components/ws-update";
import { getPatients } from "@/app/backend/api/clinical/unit-api";
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
    type: "laboratory",
    filters: {
      fullname: name,
    } 
  });

  const rows = tableLaboratory(patientsData.patients);

  return (
    <main className="space-y-3">
      <WsUpdate target="office" />
      
      <div className="mt-6">
        <Header title="Exames Atendidos"/>
      </div>

      <div className="flex items-center justify-between lg:flex-row gap-3 items-center">
        {/*<Alert 
          type="info" 
          message="Faça duplo click sobre a consulta agendado para seguir com o atendimento!" 
        />*/}

        <Search
          className="flex items-center gap-3"
          filterKey="name"
          label="Filtar por Nome"
          placeholder="Buscar pelo nome do utente..."
        />
      </div>

      <Table
        baseRowLink="/clinical/laboratory/serveds"
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
