import { formater } from "@/lib/table-formater";
import { getDateInSlashFormat } from "@/lib/date-formater";
import Header from "@/components/header";
import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import { getUsers } from "@/backend/api/clinical/api";

export const dynamic = "force-dynamic";

export default async function Page() {
  const userData = await getUsers();
  //console.log(userData);
  const userRows = formater(userData, {
    order: [
      "createdAt",
      "fullname",
      "category",
      "role",
      "workplaces",
    ], 
    transform: {
      targetKey: "createdAt",
      fn(e){
        return getDateInSlashFormat(new Date(e));
      }
    }
  });

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
