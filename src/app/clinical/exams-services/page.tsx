import Table from "@/components/table";
import { formater } from "@/lib/table-formater";
import Alert from "@/components/ui/alert";
import SignExam from "@/components/sign-exam";
import CCG from "@/components/CCG";
import Refresh from "@/components/refresh";
import { getExams } from "@/backend/api/clinical/scheduling-api";

export const dynamic = "force-dynamic";

export default async function Page() {
  const examsData = await getExams();
  const rows = formater(examsData, {
    order:[
      "examCode",
      "name",
      "category",
      "classification",
      "group",
      "price",
    ],
    filterKey: [
      "id",
      "examCode",
      "name",
      "category",
      "classification",
      "group",
      "price",
    ]
  });

  return (
    <main className="space-y-3">
      <Refresh />

      <div className="flex flex-col lg:flex-row gap-x-2 gap-3 pb-4 justify-between">
        <SignExam />

        <Alert 
          type="info" 
          message="Cadastrar Categoria, Classificação e Grupos de Exames!" 
        />
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-3 lg:items-end">
        <Alert 
          type="info" 
          message="Faça duplo click sobre o exame para editar!" 
        />

        <CCG />
      </div>
  
      <Table
        baseRowLink="/clinical/exams-services/"
        rowLength={6}
        columns={[
          "Código", 
          "Descrição", 
          "Categoria",
          "Classifição",
          "Grupo",
          "Preço",
        ]} 
        {...{rows}}
      />
    </main>
  );
}
