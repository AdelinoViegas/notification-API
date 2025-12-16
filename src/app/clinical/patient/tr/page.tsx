import { formater } from "@/lib/table-formater";
import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Search from "@/components/ui/search";
import { getPatients } from "@/backend/api/clinical/api";
import Pagination from "@/components/pagination";
import Refresh from "@/components/refresh";
import { getDateInSlashFormat } from "@/lib/date-formater";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name: string;
    registerNumber: number;
    p: number;
  }>
}){
  const { name, p: page } = await searchParams;
  const patientsData = await getPatients({ 
    fullname: name, 
    page: page?Number(page):1,
    transfered: true,
    served: true
  });

  const patientRows = formater(patientsData.patients, {
    order: [ 
      "createdAt", 
      "registerNumber", 
      "fullname", 
      "group", 
      "accessType" 
    ],
    transform: {
      targetKey: "createdAt",
      fn(e) {
        return getDateInSlashFormat(new Date(e));
      }
    },
  });
  
  return (
    <main className="space-y-3">
      <Refresh />

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