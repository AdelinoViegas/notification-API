import Link from "next/link";
import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import Search from "@/components/ui/search";
import SelectFilter from "@/components/select-filter";
import { TiInputChecked } from "react-icons/ti";
import { getPatients } from "@/backend/api/clinical/unit-api";
import { Services, tableLaboratory } from "@/lib/table-formater";
import Pagination from "@/components/pagination";
import Refresh from "@/components/refresh";
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
    served: false, 
    page,
    type: "laboratory",
    filters: {
      fullname: patient,
      unitId
    } 
  });
  
  const patientRows = tableLaboratory(patientsData.patients as Services[]); 
  return (
    <main className="space-y-3">
      <Refresh />
      
      <div className="flex gap-3">
        <Link href="/clinical/laboratory/serveds">
          <Button className="flex gap-3">
            <TiInputChecked className="size-5" />
            Atendidos
          </Button>
        </Link>
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
        baseRowLink="/clinical/laboratory"
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
