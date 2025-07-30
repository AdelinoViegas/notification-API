import Header from "@/components/header";
import Table from "@/components/table";
import tableFormater from "@/lib/table-formater";
import Alert from "@/components/ui/alert";
import SignExam from "@/components/sign-exam";
import { PatientExam } from "@/lib/table-formater";
import { getExams } from "@/app/backend/api/clinical/scheduling-api";
import CCG from "@/components/CCG";
import Refresh from "@/components/refresh";

export const dynamic = "force-dynamic";

export default async function Page() {
  const rows = tableFormater(await getExams() as PatientExam[]);

  return (
    <main className="space-y-3">
      <Refresh />
      <div className="mt-6">
        <Header title="Exames/Serviços Cadastradas"/>
      </div>

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
