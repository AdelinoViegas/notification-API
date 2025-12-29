import Link from "next/link";
import { priorityInOperatingRoom } from "@/lib/filters";
import { PiArchiveDuotone } from "react-icons/pi";
import { formater } from "@/lib/table-formater";
import Button from "@/components/ui/button";
import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Search from "@/components/ui/search";
import Refresh from "@/components/refresh";
import TooltipInOperatingRoom from "@/components/operating-room-tooltip";
import { getPatients } from "@/backend/api/clinical/operating-room-api";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name: string;
    priority?: string;
  }>
}){
  const { name, priority } = await searchParams;
  const patients = await getPatients({ name, priority});
  const patientRows = formater(patients, {
    order: [
      "requestingService",
      "patient",
      "sugeryType",
      "doctor",
    ]
  }) ;
  const dataPriority = priorityInOperatingRoom(await getPatients({ name })).summary;
 
  return(
    <main className="space-y-3">
      <Refresh />
      
      <div className="flex lg:flex-row justify-between items-center m-0">
        <Alert 
          type="info" 
          message="Faça duplo click sobre o utente para seguir com o atendimento!" 
        />

        <Link href="/clinical/operating-room/serveds">
          <Button className="flex gap-x-2 bg-slate-700 mt-0">
            <PiArchiveDuotone/>
              Pacientes Atendidos
            </Button>
        </Link>
      </div>
      
      <div className="flex justify-between items-center">
        <TooltipInOperatingRoom data={dataPriority} />

        <Search
          className="flex items-center gap-x-3"
          filterKey="name"
          label="Filtar por nome"
          placeholder="Buscar pelo nome do utente..."
        />
      </div>

      <Table
        baseRowLink="/clinical/operating-room"
        rowLength={4}
        columns={[
          "Serv. Solicitante", 
          "Nome do Utente", 
          "Tipo de cirurgia",
          "Nome do Médico",
        ]}
        rows={patientRows} 
      />
    </main>
  );
}