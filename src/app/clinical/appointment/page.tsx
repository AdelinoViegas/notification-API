import { PiArchiveDuotone } from "react-icons/pi";
import { TiInputChecked } from "react-icons/ti";
import Link from "next/link";
import { formater } from "@/lib/table-formater";
import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import Search from "@/components/ui/search";
import Refresh from "@/components/refresh";
import { getScheduleAppointments } from "@/backend/api/clinical/scheduling-api";
import CountIndicator from "@/components/count-indicator";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name: string;
  }>
}) {
  const { name } = await searchParams;
  const appointmentData = await getScheduleAppointments({ patientName: name }); 
  const patientRows = formater(appointmentData, {
    order: [
      "dateTime",
      "patient",
      "doctor",
      "room",
      "status",
    ]
  });

  return (
    <main className="space-y-3">
      <Refresh />

       <div className="flex gap-x-3">
        <Link href="/clinical/appointment/serveds">
          <Button className="flex gap-3">
            <TiInputChecked className="size-5" />
            Atendidos
          </Button>
        </Link>

        <Link href="/clinical/appointment/archiveds">
          <Button className="flex gap-3 bg-slate-700">
            <PiArchiveDuotone className="size-5" />
            Arquivados
          </Button>
        </Link>

        <Link href="/clinical/appointment/requests">
          <CountIndicator from="req-surgery" />
          <Button className="flex gap-3">Solicitações</Button>
        </Link>
      </div>

      <div className="lg:flex justify-between items-center">
        <Alert 
          type="info" 
          message="Faça duplo click sobre o utente para seguir com o atendimento!" 
        />

        <Search
          className="flex items-center gap-x-3"
          filterKey="name"
          label="Filtar por Nome"
          placeholder="Buscar pelo nome do utente"
        />
      </div>

      <Table
        status
        baseRowLink="/clinical/appointment/"
        columns={[
          "Data e Hora", 
          "Nome do Utente", 
          "Nome do Médico",
          "Sala",
          "Estado"
        ]} 
        rows={patientRows}
      />
    </main>
  );
}
