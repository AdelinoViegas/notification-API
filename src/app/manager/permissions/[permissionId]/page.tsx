import PermissionForm from "@/components/forms/permission-form";
import { getPermission, getUserGroups } from "@/app/backend/api/manager/api";
import Header from "@/components/header";
import Card from "@/components/card";

export default async function Page({params}:{ params: Promise<{ permissionId : string}>}){
  const { permissionId } = await params;
  const permission = await getPermission(permissionId);
  const userGroups = await getUserGroups();

  return(
    <main className="px-2 pt-4 w-full">
      <Header title="Editar Permissão" />

      <Card>
        <PermissionForm 
          {...{userGroups}}
          jsonData={JSON.stringify(permission)} 
        />
      </Card>
    </main>
  );
}