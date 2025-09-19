import { formater } from "@/lib/table-formater";
import Header from "@/components/header";
import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Search from "@/components/ui/search";
import SpecialtyModal from "@/components/specialty-modal";
import { getSpecialties } from "@/backend/api/clinical/api";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name: string;
  }>
}) {
  const { name } = await searchParams;
  const specialtiesData = await getSpecialties( name );
  const patientRows = formater(specialtiesData, {
    order:[
      "name",
    ],
    filterKey: [
      "id",
      "name",
    ]
  });

  return (
    <main className="space-y-3">

      <div className="mt-6">
        <Header title="Unidades Externas"/>
      </div>

      <div className="flex gap-x-2 pb-4">
        <SpecialtyModal />
      </div>

      <div className="flex lg:flex-row justify-between gap-3 items-center">
        <Alert 
          type="info" 
          message="Faça duplo click sobre a unidade para editar!" 
        />

        <Search
          className="flex items-center gap-3"
          filterKey="name"
          label="Filtar pelo nome da especialidade"
          placeholder="Buscar pelo nome..."
        />
      </div>
  
      <Table
        baseRowLink="/clinical/phisical-unit/specialty"
        columns={[
          "Especialidade", 
        ]} 
        rows={patientRows}
      />
    </main>
  );
}