import { getUsers } from "@/app/backend/api/manager/api";
import Header from "@/components/header";
import Table from "@/components/table";
import Search from "@/components/ui/search";
import tableFormater,{ User } from "@/lib/table-formater";
import SignUserModal from "@/components/sign-user-modal";
export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name: string;
  }>
}){
  const { name } = await searchParams;
  const rows = tableFormater(await getUsers({ name }) as User[]);

  return(
    <main className="px-2 pt-4 w-full">

      <Header title="Usuários Cadastrados">
        <SignUserModal />
      </Header>
      
      <Search
        label="Filtrar pelo Nome Completo"
        filterKey="name"
        placeholder="Buscar por nome de usuário" 
      />
      <div>
        <Table
          columns={[
            "Data de Registro",
            "Nome Completo", 
            "Nome de Login", 
            "Telefone",
            "Email", 
            "Grupo", 
            "Estado"
          ]}
          rows={rows} 
          baseRowLink="/manager/users"
        />
      </div>
    </main>
  );
}