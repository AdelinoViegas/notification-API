import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import { formater } from "@/lib/table-formater";
import { getPatients } from "@/backend/api/clinical/api";
import Search from "@/components/ui/search";
import Pagination from "@/components/pagination";
import { getDateInSlashFormat } from "@/lib/date-formater";

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
    served: true
  });

  const patientRows = formater(patientsData.patients, {
    order: [
      "createdAt",
      "registerNumber",
      "fullname",
      "group",
      "acessType",
    ],
    transform: {
      targetKey: "createdAt",
      fn(e){
        return getDateInSlashFormat(new Date(e));
      }
    }
  });
  
  return(
    <main>
      <div className="flex justify-between lg:flex-row gap-3 items-center">
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
  )
}