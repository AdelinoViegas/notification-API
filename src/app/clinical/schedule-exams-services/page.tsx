import { formater } from "@/lib/table-formater";
import Link from "next/link";
import Header from "@/components/header";
import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import Search from "@/components/ui/search";
import { TiInputChecked } from "react-icons/ti";
import { PiArchiveDuotone } from "react-icons/pi";
import Refresh from "@/components/refresh";
import { getDateInSlashFormat } from "@/lib/date-formater";
import { getSchedulePatientExams } from "@/backend/api/clinical/scheduling-api";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name:string;
  }>
}){
  const { name } = await searchParams;
  const scheduleds =  await getSchedulePatientExams({ name });

  const rows = formater(scheduleds.scheduleExams, {
    order: [
      "createdAt",
      "patientName",
      "laboratory",
      "examQty",
      "user",
      "status"
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
      <Refresh />

      <div className="flex gap-x-3">
        <Link href="/clinical/schedule-exams-services/serveds">
          <Button className="flex gap-x-2">
            <TiInputChecked className="size-5" />
            Atendidos
          </Button>
        </Link>

        <Link href="/clinical/schedule-exams-services/archiveds">
          <Button className="flex gap-x-2 bg-slate-700">
            <PiArchiveDuotone className="size-5" />
            Arquivados
          </Button>
        </Link>
      </div>

      <div className="flex justify-between lg:flex-row items-center">
        <Alert 
          type="info" 
          message="Faça duplo click sobre o exame agendado para seguir com o atendimento!" 
        />

        <Search
          className="flex items-center gapx--3"
          filterKey="name"
          label="Filtar por nome"
          placeholder="Buscar pelo nome do utente..."
        />
      </div>
  
      <Table
        baseRowLink="/clinical/schedule-exams-services"
        columns={[
          "Data e Hora", 
          "Nome do Utente", 
          "Local",
          "Qtd de Exames",
          "Responsavel",
          "Estado"
        ]} 
        rows={rows}
      />
    </main>
  );
}
