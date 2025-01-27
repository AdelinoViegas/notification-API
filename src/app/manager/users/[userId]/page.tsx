import { 
  getUserById, 
  getUserGroup 
} from "@/app/backend/api/manager/api";
import UserStatusButton from "@/components/user-status-button";
import AddUserPermissionForm from "@/components/forms/user-permission-form";
import UserPermissions from "@/components/user-permissions";
import UserPassword from "@/components/user-password";
import Link from "next/link";
import Button from "@/components/ui/button";
import AccessLimitContainer from "@/components/access-limit-container";
import Header from "@/components/header";
import { redirect } from "next/navigation";
import { MdOutlineModeEdit } from "react-icons/md";
export const dynamic = 'force-dynamic';
import TitleAndSubtitle from "@/components/title-subtitle";
import Card from "@/components/card";

export default async function Page({ params }: { params: Promise<{ userId: string }>}){
  const { userId } = await params;
  const user = await getUserById(userId);
  if(!user)
    redirect('/?invalid-user');

  const userGroup = await getUserGroup(user.userGroupId?.toString() as string);
  
  return(
    <main className="px-2 pt-4 w-full">
      <Header title="Ajustes da conta de Usuário" />
      <div className="mt-3 space-y-3 overflow-y-auto max-h-[82vh]">
        <div className="grid lg:grid-cols-2 gap-3">
          <Card className="flex flex-col justify-between">
            <div className="grid lg:grid-cols-2">
              <TitleAndSubtitle
                label="Nome Completo"
                value={user.fullname}
              />

              <TitleAndSubtitle
                label="Nome de Login"
                value={user.username}
              />

              <TitleAndSubtitle
                label="Nome Completo"
                value={user.tel}
              />

              <TitleAndSubtitle
                label="Nome Completo"
                value={user.email}
              />

              <TitleAndSubtitle
                label="Nome Completo"
                value={userGroup?.label}
              />
              
              <TitleAndSubtitle
                label="Estado de Acesso"
                value={user.isActive?"Activado":"Bloqueado"}
              />
            </div>

            <div className="flex items-end gap-3">
              <Link href={`${userId}/edit`}>
                <Button className="flex gap-x-2">
                  <MdOutlineModeEdit/>
                  Editar
                </Button>
              </Link>

              {/* <UserStatusButton
                isAdmin={user.isAdmin}
                status={user.isActive}
                userId={userId}
              /> */}
            </div>
          </Card>

          <div className="p-3 md:flex-col lg:flex-row flex gap-9 bg-white border rounded-xl">
            <div className="lg:w-full">
              <AddUserPermissionForm 
                {...{userId}} 
                userGroupId={user.userGroupId?.toString() as string} 
              />
            </div>

            <div className="lg:w-full">
              <UserPermissions {...{userId}} />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-3">
          <UserPassword {...{userId}} />
          <AccessLimitContainer {...{userId}} />
        </div>
      </div>
    </main>
  );
}