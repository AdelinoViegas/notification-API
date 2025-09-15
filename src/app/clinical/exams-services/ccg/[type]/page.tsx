import { formater } from "@/lib/table-formater";
import Alert from "@/components/ui/alert";
import Header from "@/components/header";
import Table from "@/components/table";
import { ccgTypes } from "@/backend/api/clinical/translator";
import { getCCGs } from "@/backend/api/clinical/scheduling-api";

export const dynamic = "force-dynamic";

export default async function Page({
  params
}: {
  params: Promise<{
    type: "category" | "classification" | "group";
  }>
}){
  const { type } = await params;
  const ccg = await getCCGs(type);
  const rows = formater(ccg,{
    order: [
      "name",
    ]
  } );

  return (
    <main className="space-y-3">
      <div className="mt-6">
        <Header title={ccgTypes[type].plural} />
      </div>

      <div className="flex flex-col lg:flex-row gap-x-2 items-center pb-4 justify-between">
        <Alert 
          type="info" 
          message="Editar Categoria, Classificação e Grupos de Exames!" 
        />
      </div>

      <Table
        baseRowLink="/clinical/exams-services/update"
        columns={[ "Descrição" ]} 
        rows={rows}
      />
    </main>
  );;
}