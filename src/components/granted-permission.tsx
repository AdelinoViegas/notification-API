import RevokeUserPermission from "./forms/revoke-permission";
import { use } from "react";
import { 
  getPermission, 
  getUserPermissions 
} from "@/app/backend/api/manager/api";

export default function GrantedUserPermission({ userId }:{ userId: string }){
  const grantedPermissions = use(getUserPermissions(userId));
  const resolvedGranted = grantedPermissions.map(item => use(getPermission(item.permissionId)));
  
  return(
    <>
      <h2>Permissões atribuídas</h2>

      {resolvedGranted.map((props, index) => (
        <RevokeUserPermission 
          key={index}
          id={props._id} 
          label={props.label} 
        />
        ))}
    </>
  )
}