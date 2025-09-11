import { ClinicalUser } from "@/lib/table-formater";
import { tableClinicalUser } from "@/lib/table-formater";
import Header from "@/components/header";
import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import { getUsers } from "@/backend/api/clinical/api";

export const dynamic = "force-dynamic";

export default async function Page() {
  
  const userRows = tableClinicalUser(await getUsers() as ClinicalUser[]);

  return (
    <main className="space-y-3">
      <div className="mt-6">
        <Header title="Funcionários"/>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 items-center">
        <Alert 
          type="info" 
          message="Faça duplo click para configurar!" 
        />
      </div>
  
      <Table
        baseRowLink="/clinical/phisical-unit/user"
        columns={[
          "Data de Registo", 
          "Nome da Completo", 
          "Categoria",
          "Especialidade",
          "Nº de Areas de Trabalho"
        ]} 
        rows={userRows}
      />
    </main>
  );
}
