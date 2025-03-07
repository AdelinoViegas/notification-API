import RevokeUserPermission from "@/components/forms/revoke-permission";
import { use } from "react";
import { 
  getPermission, 
  getUserPermissions 
} from "@/app/backend/api/manager/api";

export default function GrantedUserPermission({ userId }:{ userId: string }){
  const grantedPermissions = use(getUserPermissions(userId));
  const resolvedGranted = grantedPermissions.map(item => {
   return {
    grantedId: item._id,
    ...use(getPermission(item.permissionId))
   }
  });
  
  return(
    <>
      <h2 className="bg-gray-100">Permissões atribuídas</h2>
      <div className="max-h-48 overflow-auto">
        {resolvedGranted.map((props, index) => (
          <RevokeUserPermission 
            key={index}
            id={props.grantedId} 
            label={props.label} 
          />
        ))}
      </div>
    </>
  )
}