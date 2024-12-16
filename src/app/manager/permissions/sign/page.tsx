import PermissionForm from "@/components/forms/permission-form";
import Header from "@/components/header";
import Card from "@/components/card";
import { getUserGroups } from "@/app/backend/api/manager/api";
export const dynamic = "force-dynamic";

export default async function Page(){
  const userGroups = await getUserGroups(true);
  return(
    <main className="px-2 pt-4 w-full">
      <Header title="Cadastrar Permissão" />
      
      <Card>
        <PermissionForm 
          {...{userGroups}}
        />
      </Card>
    </main>
  );
}