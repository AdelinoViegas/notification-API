import Header from "@/components/header";
import Table from "@/components/table";
import Link from "next/link";
import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import Search from "@/components/ui/search";
import tableFormater from "@/lib/table-formater";
import { getPatientsInScreening } from "@/app/backend/api/clinical/api";
import Pagination from "@/components/pagination";
import { PiArchiveDuotone } from "react-icons/pi";

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
  const patientsData = await getPatientsInScreening({ 
    fullname: name, 
    page: page?Number(page):1,
  });

  const patientRows = tableFormater(patientsData.patients);
  
  return (
    <main className="space-y-3">
      
      <div className="mt-6">
        <Header title="Triagem"/>
      </div>

      <div className="flex gap-x-2">
        <Link href="screening/archived" >
          <Button className="flex gap-x-2">
            <PiArchiveDuotone className="size-5" />
            Utentes Arquivados
          </Button>
        </Link>
      </div>

      <div className="lg:flex justify-between lg:flex-row items-center">
        <Alert 
          type="info" 
          message="Faça duplo click sobre o utente para seguir com o atendimento!" 
        />

        <Search
          className="flex items-center gap-x-3"
          filterKey="name"
          label="Filtar por nome"
          placeholder="Buscar pelo nome do utente..."
        />
      </div>

      <Table
        baseRowLink="/clinical/screening"
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
