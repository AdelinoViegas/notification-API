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
export const dynamic = "force-dynamic";

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
    type: "imaging",
    filters: {
      fullname: name,
    } 
  });
  const patientRows = tableLaboratory(patientsData.patients as Services[]); 
  return (
    <main className="space-y-3">
      <WsUpdate target="imaging" />
      
      <div className="mt-6">
        <Header title="Imagiologia"/>
      </div>

      <Link href="/clinical/imaging/serveds">
        <Button className="flex gap-3">
          <TiInputChecked className="size-5" />
          Atendidos
        </Button>
      </Link>

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
        baseRowLink="/clinical/imaging"
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
