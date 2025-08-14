import Header from "@/components/header";
import Table from "@/components/table";
import tableFormater from "@/lib/table-formater";
import Search from "@/components/ui/search";
import { ScheduleExam } from "@/lib/table-formater";
// import SelectFilter from "@/components/select-filter";
import { getSchedulePatientExams } from "@/backend/api/clinical/scheduling-api";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    unitId: string;
    name: string;
  }>
}) {
  const { unitId, name } = await searchParams;
  const patient = await getSchedulePatientExams({ unitId, name, isCanceled: true, isServed: false });
  const patientRows = tableFormater( patient.scheduleExams as ScheduleExam[]);
  
  return (
    <main className="space-y-3">
      <div className="mt-6">
        <Header title="Exames Arquivados"/>
      </div>

      <div className="flex">
        {/*<SelectFilter
          label="Filtrar por Tipo de Unidades"
          unitType="laboratory" 
        />*/}

        <Search
          className="flex items-center gap-3"
          filterKey="name"
          label="Filtar por nome"
          placeholder="Buscar pelo nome do utente..."
        />
      </div>

      <Table
        baseRowLink="/clinical/schedule-exams-services/archiveds/"
        columns={[
          "Data e Hora", 
          "Nome do Utente", 
          "Laboratorio",
          "Qtd de Exame",
          "Responsável",
          "Estado"
        ]} 
        rows={patientRows}
      />
    </main>
  );
}
