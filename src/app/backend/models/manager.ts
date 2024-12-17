import { kernel } from "@/app/backend/models/con";
import { userSchema, loginAccessTokensSchema} from "@/app/backend/schemas/manager/users";
import userGroupSchema from "@/app/backend/schemas/manager/user-groups";
import accessLimitSchema from "@/app/backend/schemas/manager/access-limit";
import { permissionSchema, accessPermissionSchema } from "@/app/backend/schemas/manager/permissions";

const userModel = kernel.model('Users', userSchema);
const userGroupModel = kernel.model('UserGroup', userGroupSchema);
const accessLimitModel = kernel.model('AccessLimit', accessLimitSchema);
const permissionModel = kernel.model('Permission', permissionSchema);
const accessPermissionModel = kernel.model('AccessPermission', accessPermissionSchema);
const loginAccessTokensModel = kernel.model('LoginAcessTokens', loginAccessTokensSchema);

export {
  userModel,
  userGroupModel,
  accessLimitModel,
  accessPermissionModel,
  permissionModel,
  loginAccessTokensModel,
}
