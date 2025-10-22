import Link from "next/link";
import { BiPlus as PlusIcon } from "react-icons/bi";
import { IoPerson } from "react-icons/io5";
import { FaHospital, FaUserMd } from "react-icons/fa";
import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Search from "@/components/ui/search";
import Button from "@/components/ui/button";
import { formater } from "@/lib/table-formater";
import { getDateInSlashFormat } from "@/lib/date-formater";
import { RiHospitalFill } from "react-icons/ri";
import { getUnits } from "@/backend/api/clinical/urgency-bank-api";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name: string;
  }>
}) {
  const { name } = await searchParams;
  const unitsData = await getUnits({ searchByName: name });
  const patientRows = formater(unitsData, {
    order:[
      "createdAt",
      "unitName",
      "type",
      "user",
      "status",
    ],
    transform: {
      targetKey: "createdAt",
      fn(e){
        return getDateInSlashFormat(new Date(e));
      }
    },
    filterKey: [
      "id",
      "createdAt", 
      "unitName", 
      "type",
      "user",
      "status",
    ], 
  });

  return (
    <main className="space-y-3">
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

        <Link href="/clinical/phisical-unit/specialty">
          <Button className="flex gap-x-2">
            <FaUserMd/>
            Especialidade
          </Button>
        </Link>

        <Link href="/clinical/phisical-unit/urgency-service">
          <Button className="flex gap-x-2">
            <RiHospitalFill /> 
            Novo Serviço
          </Button>
        </Link>
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