import { getDateInSlashFormat } from "@/lib/date-formater";
import { formater } from "@/lib/table-formater";
import Header from "@/components/header";
import Table from "@/components/table";
import Search from "@/components/ui/search";
import Pagination from "@/components/pagination";
import { getSchedulePatientExams } from "@/backend/api/clinical/scheduling-api";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    unitId: string;
    name: string;
    p: string;
  }>
}) {
  const { unitId, name, p:page } = await searchParams;
  const patient = await getSchedulePatientExams({ 
    unitId, 
    name, 
    isCanceled: true, 
    isServed: false,
    page: page?Number(page):1,  
  });
  const rows = formater( patient.scheduleExams, {
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
        <Search
          className="flex items-center gap-3"
          filterKey="name"
          label="Filtar por nome"
          placeholder="Buscar pelo nome do utente..."
        />
      </div>

      <Table
        baseRowLink="/clinical/schedule-exams/archiveds/"
        columns={[
          "Data e Hora", 
          "Nome do Utente", 
          "Laboratorio",
          "Qtd de Exame",
          "Responsável",
          "Estado"
        ]} 
        rows={rows}
        rowLength={6}
      />

      <Pagination
        availablePages={patient.availablePages as number}
        totalItems={patient.totalItems as number} 
      />
    </main>
  );
}