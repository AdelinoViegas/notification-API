import DeleteUserPermissionForm from "@/components/forms/delete-user-permission-form";
import SubTitle from "@/components/ui/subtitle";
import { 
  getPermission, 
  getUserPermissions 
} from "@/app/backend/api/manager/api";

export const dynamic = 'force-dynamic';

export default async function UserPermissions({userId}: {userId: string}){
  const userPerms = await getUserPermissions(userId);
  return(
    <div>
        <SubTitle className="inline-flex">Permissões Atribuidas</SubTitle>
        <ul className="h-60 overflow-y-auto scroll">
          {userPerms.map(async(props, index)=>{
            const perm = await getPermission(`${props.permissionId}`);
            return <>
               <DeleteUserPermissionForm 
                  key={index} 
                  permId={`${props?._id}`}
                  permLabel={`${perm?.label}`} 
                />
            </>
          })}
          {
            !userPerms.length &&
            <p>Sem permissões atribuidas</p>
          }
        </ul>
    </div>
  )
}