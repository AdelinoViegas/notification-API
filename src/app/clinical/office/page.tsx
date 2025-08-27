import Table from "@/components/table";
import { type DoctorOffice, tableOffice } from "@/lib/table-formater";
import Alert from "@/components/ui/alert";
import Link from "next/link";
import Button from "@/components/ui/button";
import Search from "@/components/ui/search";
import { getPatients } from "@/backend/api/clinical/office-api";
import { TiInputChecked } from "react-icons/ti";
import Refresh from "@/components/refresh";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name: string;
  }>
}) {
  const { name } = await searchParams; 
  const scheduleOffices = await getPatients({ fullname: name });
  const rows = tableOffice(scheduleOffices.patients as DoctorOffice[]);
  
  return (
    <main className="space-y-3">
      <Refresh />
      
      <div className="flex gap-3">
        <Link href="/clinical/office/serveds">
          <Button className="flex gap-x-2">
            <TiInputChecked className="size-5" />
            Atendidos
          </Button>
        </Link>
      </div>

      <div className="lg:flex items-center justify-between lg:flex-row items-center">
        <Alert 
          type="info" 
          message="Faça duplo click sobre o utente para seguir com o atendimento!" 
        />

        <Search
          className="flex items-center gap-x-3"
          filterKey="name"
          label="Filtar por Nome"
          placeholder="Buscar pelo nome do utente..."
        />
      </div>

      <Table
        baseRowLink="/clinical/office"
        columns={[
          "Data/Hora da Marcação", 
          "Nome do Utente", 
          "Responsável",
          "Sala"
        ]} 
        rows={rows}
      />
    </main>
  );
}
