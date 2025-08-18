import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Link from "next/link";
import Button from "@/components/ui/button";
import Search from "@/components/ui/search";
import { PiArchiveDuotone } from "react-icons/pi";
import { TiInputChecked } from "react-icons/ti";
import Refresh from "@/components/refresh";
import Header from "@/components/header";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name: string;
  }>
}) {
  const { name } = await searchParams;
 /* const patientRows = tableAppointments(await getScheduleAppointments({ 
    patientName: name,
  }) as ScheduleAppointment[]);*/
  const patientRows = new Array();

  patientRows.push({
    id:"#",
    row: [
      "12-08-2025 18:24",
      "Adelino da Trindade Afonso Viegas",
      "Urologia",
      "300",
      "sala kk07",
      "450",
      "Filipe Duarte Rodrigues dos Santos",
    ]
  },{
    id:"#",
    row: [
      "12-08-2025 18:24",
      "Salvador Luis Muzinga Duarte",
      "Pediatria",
      "405",
      "sala k754",
      "780",
      "Samuel Manuel de Souza Figueiredo",
    ]
  })
  return (
    <main className="space-y-3">
      <Refresh />

      <div className="mt-6">
          <Header title="Pedido de agendamento de cirurgia"/>
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
        columns={[
          "Data e Hora", 
          "Nome do Utente", 
          "Serviço",
          "Cirur.",
          "EnFerm.",
          "Cama",
          "Médico"
        ]} 
        rows={patientRows}
      />
    </main>
  );
}