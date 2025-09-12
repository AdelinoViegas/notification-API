import Link from "next/link";
import { PiArchiveDuotone } from "react-icons/pi";
import { TiInputChecked } from "react-icons/ti";
import { formater } from "@/lib/table-formater";
import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import Search from "@/components/ui/search";
import Refresh from "@/components/refresh";
import Header from "@/components/header";
import SelectionFilter from "@/components/ui/selection-filter";
import { getScheduleSugeries } from "@/backend/api/clinical/scheduling-api";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name: string;
    area: string;
  }>
}) {
  const { name, area } = await searchParams;
  const scheduleData = await getScheduleSugeries({ name, area })
  const patientRows = formater(scheduleData, {
    order: [
      "requestingService",
      "date",
      "patient",
      "sugeryType",
      "infirmary",
      "bed",
      "doctor",
      "status",
    ]
  });

  return (
    <main className="space-y-3">
      <Refresh />

      <div className="mt-6">
          <Header title="Pedido de agendamento de cirurgia"/>
      </div>

       <div className="flex gap-x-3">
        {/*<Link href="/clinical/appointment/serveds">*/}
          <Button className="flex gap-3">
            <TiInputChecked className="size-5" />
            Atendidos
          </Button>
        {/*</Link>*/}

        <Link href="/clinical/schedule-sugery/archiveds">
          <Button className="flex gap-3 bg-slate-700">
            <PiArchiveDuotone className="size-5" />
            Arquivados
          </Button>
        </Link>
      </div>

      <div className="lg:flex justify-between items-center my-4">
        <Alert 
          type="info" 
          message="Faça duplo click sobre o utente para seguir com o atendimento!" 
        />
      </div>

      <div className="lg:flex justify-between items-center">
        <SelectionFilter
          filterKey="area"
          className="m-0" 
          label="Selecione o serviço solicitante"
          options={[
            {_id:"Consultório de urgência", label:"Consultório de urgência"},
            {_id:"Internamento", label:"Internamento"},
            {_id:"Consultório", label:"Consultório"},
            {_id:"Utentes", label:"Utentes"},
          ]} 
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
        baseRowLink="/clinical/schedule-sugery/"
        columns={[
          "Serv. Solicitante",
          "Data e Hora", 
          "Nome do Utente", 
          "Tipo de cirurgia",
          "Efermaria",
          "Cama",
          "Nome do Médico",
          "Estado"
        ]} 
        rows={patientRows}
      />
    </main>
  );
}