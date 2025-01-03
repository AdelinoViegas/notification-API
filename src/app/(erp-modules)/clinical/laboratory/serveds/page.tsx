import Header from "@/components/header";
import Table from "@/components/table";
import Alert from "@/components/alert";
import Search from "@/components/ui/search";
import SelectFilter from "@/components/select-filter";
import WsUpdate from "@/components/ws-update";
import { getPatients } from "@/app/backend/api/clinical/unit-api";
import { Services, tableLaboratory } from "@/lib/table-formater";
import Pagination from "@/components/pagination";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    patient: string;
    unitId: string;
    page: number;
  }>
}){
  const { patient, unitId, page } = await searchParams;
  const patientsData = await getPatients({
    served: true, 
    type: "laboratory",
    page,
    filters: {
      fullname: patient,
      unitId
    } 
  });
  
  const patientRows = tableLaboratory(patientsData.patients as Services[]); 
  return (
    <main className="space-y-3">
      <WsUpdate target="laboratory" />
      
      <div className="mt-6">
        <Header title="Atendidos"/>
      </div>

      <div className="lg:flex justify-between items-center">
        <Alert 
          type="info" 
          message="Faça duplo click sobre o utente para seguir com o atendimento!" 
        />
      </div>

      <div className="lg:flex lg:items-center lg:justify-between gap-3 items-center">
        <SelectFilter
          label="Filtrar pelo laboratório"
          unitType="laboratory"
          filterKey="unitId"
        />

        <Search
          className="flex items-center gap-3"
          filterKey="patient"
          label="Filtrar por Nome"
          placeholder="Buscar pelo nome do utente"
        />
      </div>

      <Table
        status
        baseRowLink="/clinical/laboratory/serveds"
        columns={[
          "Data e Hora", 
          "Nome do Utente", 
          "Responsável",
          "Laboratório"
        ]} 
        rows={patientRows}
      />

      <Pagination 
        totalItems={patientsData.total} 
        availablePages={patientsData.availablePages} 
      />
    </main>
  );
}
