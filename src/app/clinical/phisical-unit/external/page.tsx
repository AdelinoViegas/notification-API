import { formater } from "@/lib/table-formater";
import Header from "@/components/header";
import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Search from "@/components/ui/search";
import ExternalUnitForm from "@/components/forms/external-unit-form";
import { getExternalUnits } from "@/backend/api/clinical/urgency-bank-api";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name: string;
  }>
}) {
  const { name } = await searchParams;
  const unitsData = await getExternalUnits({ name });
  const patientRows = formater(unitsData, {
    order:[
      "name",
      "street",
      "municipality",
      "province",
      "user"
    ],
    filterKey: [
      "id",
      "name",
      "street",
      "municipality",
      "province",
      "user"
    ]
  });
  
  return (
    <main className="space-y-3">

      <div className="mt-6">
        <Header title="Unidades Externas"/>
      </div>

      <div className="flex gap-x-2 pb-4">
        <ExternalUnitForm />
      </div>

      <div className="flex lg:flex-row justify-between gap-3 items-center">
        <Alert 
          type="info" 
          message="Faça duplo click sobre a unidade para editar!" 
        />

        <Search
          className="flex items-center gap-3"
          filterKey="name"
          label="Filtar pela descrição do Hospital"
          placeholder="Buscar pelo nome da unidade externa"
        />
      </div>
  
      <Table
        baseRowLink="/clinical/phisical-unit/external"
        columns={[
          "Descrição", 
          "Rua", 
          "Município",
          "Província",
          "Responsável"
        ]} 
        rows={patientRows}
      />
    </main>
  );
}
