import Link from "next/link";
import Header from "@/components/header";
import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Search from "@/components/ui/search";
import Button from "@/components/ui/button";
import { PhisicalUnit } from "@/lib/table-formater";
import tableFormater from "@/lib/table-formater";
import { getUnits } from "@/app/backend/api/clinical/urgency-bank-api";
import { BiPlus as PlusIcon } from "react-icons/bi";
import { IoPerson } from "react-icons/io5";
import { FaHospital } from "react-icons/fa";
import SignUrgencyService from "@/components/forms/sign-urgency-services";
export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name: string;
  }>
}) {
  const { name } = await searchParams;
  const patientRows = tableFormater(await getUnits(undefined, undefined, true, name) as PhisicalUnit[]);
  
  return (
    <main className="space-y-3">

      <div className="mt-6">
        <Header title="Unidades Físicas"/>
      </div>

      <div className="flex gap-x-2">
        <Link href="/clinical/phisical-unit/sign">
          <Button className="flex gap-x-2">
            <PlusIcon className="w-5" />
            Nova Unidade
          </Button>
        </Link>

        <Link href="/clinical/phisical-unit/external">
          <Button className="flex gap-x-2">
            <FaHospital/>
            Unidades Externas
          </Button>
        </Link>
        
        <Link href="/clinical/phisical-unit/user">
          <Button className="flex gap-x-2 bg-slate-500">
            <IoPerson/>
            Funcionários
          </Button>
        </Link>

        <SignUrgencyService />
      </div>

      <div className="lg:flex justify-between items-center">
        <Alert 
          type="info" 
          message="Faça duplo click sobre a unidade para editar!" 
        />

        <Search
          className="flex items-center gap-x-3"
          filterKey="name"
          label="Filtar pelo nome da unidade"
          placeholder="Pesquise a unidade"
        />
      </div>
  
      <Table
        baseRowLink="/clinical/phisical-unit/"
        columns={[
          "Data de Registo", 
          "Nome da Unidade", 
          "Tipo",
          "Responsável",
          "Estado"
        ]} 
        rows={patientRows}
      />
    </main>
  );
}
