import Header from "@/components/header";
import Button from "@/components/ui/button";
import Link from "next/link";
import Table from "@/components/table";
import Alert from "@/components/alert";
import Search from "@/components/ui/search";
import tableFormater from "@/lib/table-formater";
import { getPatients } from "@/app/backend/api/clinical/api";
import WsUpdate from "@/components/ws-update";
import Pagination from "@/components/pagination";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name: string;
    registerNumber: number;
    page: number;
  }>
}){
  const { name, page } = await searchParams;
  const patientsData = await getPatients({ 
    fullname: name, 
    page: page?Number(page):1,
  });

  const patientRows = tableFormater(patientsData.patients);
  
  return (
    <main className="space-y-3">
      <WsUpdate target="patient" />
      <div className="mt-6">
        <Header title="Utentes"/>
      </div>
      
      <div className="flex gap-x-2">
        <Link href="patient/sign" >
          <Button>Novo Utente</Button>
        </Link>
        <Link href="patient/serveds">
          <Button className="bg-slate-700">Utentes Atendidos</Button>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row justify-between lg:items-center">
        <Alert 
          type="info" 
          message="Faça duplo click sobre o utente para seguir com o atendimento!" 
        />
        
        <Search
          className="flex items-center gap-3"
          filterKey="name"
          label="Filtar por nome"
          placeholder="Buscar pelo nome do utente..."
        />
      </div>

      <Table
        baseRowLink="/clinical/patient"
        columns={[
          "Data Registo", 
          "Nº de Registo", 
          "Nome Completo",
          "Grupo Utente",
          "Tipo de Acesso"
        ]} 
        rows={patientRows}
      />

      <Pagination
        availablePages={patientsData.availablePages as number}
        totalItems={patientsData.totalItems as number} 
      />
    </main>
  );
}