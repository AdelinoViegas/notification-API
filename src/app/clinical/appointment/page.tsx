import Header from "@/components/header";
import Table from "@/components/table";
import { tableAppointments } from "@/lib/table-formater";
import Alert from "@/components/ui/alert";
import { ScheduleAppointment } from "@/lib/table-formater";
import { getScheduleAppointments } from "@/app/backend/api/clinical/scheduling-api";
import Link from "next/link";
import Button from "@/components/ui/button";
import Search from "@/components/ui/search";
import WsUpdate from "@/components/ws-update";
import { PiArchiveDuotone } from "react-icons/pi";
import { TiInputChecked } from "react-icons/ti";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name: string;
  }>
}) {
  const { name } = await searchParams;
  const patientRows = tableAppointments(await getScheduleAppointments({ 
    patientName: name,
  }) as ScheduleAppointment[]);

  return (
    <main className="space-y-3">
      <WsUpdate target="appointment" />
      
      <div className="mt-6">
        <Header title="Consultas Agendadas"/>
      </div>

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
