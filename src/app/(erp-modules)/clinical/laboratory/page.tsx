import Link from "next/link";
import Header from "@/components/header";
import Table from "@/components/table";
import Alert from "@/components/alert";
import Button from "@/components/ui/button";
import Search from "@/components/ui/search";
import { TiInputChecked } from "react-icons/ti";
import WsUpdate from "@/components/ws-update";
import { getPatients } from "@/app/backend/api/clinical/unit-api";
import { Services, tableLaboratory } from "@/lib/table-formater";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name: string;    
  }>
}){
  const { name } = await searchParams;
  const patientsData = await getPatients({
    served: false, 
    type: "laboratory",
    filters: {
      fullname: name,
    } 
  });
  const patientRows = tableLaboratory(patientsData.patients as Services[]); 
  return (
    <main className="space-y-3">
      <WsUpdate target="laboratory" />
      
      <div className="mt-6">
        <Header title="Laboratório"/>
      </div>

      <div className="flex gap-3">
        <Link href="/clinical/laboratory/serveds">
          <Button className="flex gap-3">
            <TiInputChecked className="size-5" />
            Atendidos
          </Button>
        </Link>

        {/*<Link href="/clinical/appointment/archiveds">
          <Button className="flex gap-3 bg-slate-700">
            <PiArchiveDuotone className="size-5" />
            Arquivados
          </Button>
        </Link>*/}
      </div>

      <div className="lg:flex lg:items-center lg:justify-between gap-3 items-center">
        <Alert 
          type="info" 
          message="Faça duplo click sobre o utente para seguir com o atendimento!" 
        />

        <Search
          className="flex items-center gap-3"
          filterKey="name"
          label="Filtar por Nome"
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
    </main>
  );
}
