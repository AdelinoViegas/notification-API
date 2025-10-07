import { formater } from "@/lib/table-formater";
import Header from "@/components/header";
import Table from "@/components/table";
import Search from "@/components/ui/search";
import Refresh from "@/components/refresh";
import { getPatients } from "@/backend/api/clinical/operating-room-api";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name: string;
    priority?: string;
  }>
}){
  const { name, priority } = await searchParams;
  const patients = await getPatients({ name, priority, served:true});
  const patientRows = formater(patients, {
    order: [
      "requestingService",
      "patient",
      "sugeryType",
      "doctor",
    ]
  }) ;
 
  return(
    <main className="space-y-3">
      <Refresh />
      <div className="mt-6">
        <Header title="Pacientes Atendidos"/>
      </div>
      
      <div className="flex justify-between items-center">
        <Search
          className="flex items-center gap-x-3"
          filterKey="name"
          label="Filtar por nome"
          placeholder="Buscar pelo nome do utente..."
        />
      </div>

      <Table
        rowLength={4}
        columns={[
          "Serv. Solicitante", 
          "Nome do Utente", 
          "Tipo de cirurgia",
          "Nome do Médico",
        ]}
        rows={patientRows} 
      />
    </main>
  );
}