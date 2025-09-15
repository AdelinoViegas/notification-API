import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Search from "@/components/ui/search";
import { getPatients } from "@/backend/api/clinical/internal-services-api";
import { formater } from "@/lib/table-formater";
import SelectFilter from "@/components/select-filter";
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
    page,
    type: "imaging",
    filters: {
      fullname: patient,
      unitId
    } 
  });
  const patientRows = formater(patientsData.patients, {
    order: [
      "patient",
      "markedDataTime",
      "user",
      "mameLaboratory",
    ]
  }); 
  
  return (
    <main className="space-y-3">
      
      
      <div className="lg:flex justify-between items-center">
        <Alert 
          type="info" 
          message="Faça duplo click sobre o utente para seguir com o atendimento!" 
        />
      </div>

      <div className="lg:flex lg:items-center lg:justify-between gap-3 items-center">
        <SelectFilter
          label="Filtrar pelo laboratório"
          unitType="imaging"
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
        baseRowLink="/clinical/imaging/serveds"
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
