import { formater } from "@/lib/table-formater";
import Header from "@/components/header";
import Table from "@/components/table";
import Search from "@/components/ui/search";
import { getSchedulePatientExams } from "@/backend/api/clinical/scheduling-api";
import { getDateInSlashFormat } from "@/lib/date-formater";

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
  const patientRows = formater( patient.scheduleExams, {
    order: [
      "createdAt",
      "patientName",
      "laboratory",
      "examQty",
      "user",
      "status",
    ],
    transform: {
      targetKey: "createdAt",
      fn(e) {
        return getDateInSlashFormat(new Date(e));
      },
    }
  });
  
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
