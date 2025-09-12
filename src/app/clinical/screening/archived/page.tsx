import { formater } from "@/lib/table-formater";
import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Search from "@/components/ui/search";
import { getPatientsInScreening } from "@/backend/api/clinical/api";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name: string;
    registerNumber: number;
    page: number;
  }>
}) {
  const { name, page } = await searchParams;
  const patientsData = await getPatientsInScreening({ 
    fullname: name, 
    isArchived: true,
    served: false,
    page: page?Number(page):1,
  });

  const patientRows = formater(patientsData.patients, {
    order: [
      "createdAt",
      "registerNumber",
      "fullname",
      "group",
      "accessType",
    ]
  });
  
  return (
    <main className="space-y-3">
      <div className="flex flex-col lg:flex-row gap-3 items-center">
        <Alert 
          type="info" 
          message="Faça duplo clique sobre o Utente para Desarquivar!" 
        />
      </div>

      <Search
        filterKey="name"
        label="Filtar por nome"
        placeholder="Buscar pelo nome do utente..."
      />
  
      <Table
        baseRowLink="/clinical/screening/archived"
        columns={[
          "Data Registo", 
          "Nº de Registo", 
          "Nome Completo",
          "Grupo Utente",
          "Tipo de Acesso"
        ]} 
        rows={patientRows}
      />
    </main>
  );
}