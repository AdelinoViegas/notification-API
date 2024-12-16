'use server';

import { 
  userModel,
  userGroupModel, 
  permissionModel,
  accessPermissionModel,
  loginAccessTokensModel
} from "@/app/backend/models/manager";
import type { Route } from "@/app/backend/api/manager/types";
import { cookies, headers } from "next/headers";
import { getUserAccessLimit } from "@/lib/access-limit";
import { 
  encryptPwd, 
  passwordValidator,
  decryptPwd 
} from "@/lib/auth-pwd";
import masterAutoSetup from "@/app/backend/api/manager/setup";
import { 
  authJWT, 
  whoAreYou 
} from "@/lib/web-token";
import { redirect } from "next/navigation";
import { exitFromWorkplace } from "@/app/backend/api/clinical/workplace";
import { 
  userModel as userClinicalModel, 
  unitModel, 
  workplaceModel 
} from "@/app/backend/models/clinical";
import { userCategory } from "@/app/backend/api/clinical/translator";

async function login(prev: unknown, formData: FormData){
  try{
    await masterAutoSetup();

    const username = formData.get('username');
    const password = formData.get('password');
    const user = await userModel.findOne({username});

    if(!user)
      throw new Error("Usuário ou senha inválida!");
    
    if(!await decryptPwd(user.password, String(password)))
      throw new Error("Usuário ou senha inválida!");
    
    if(!user.isActive)
      throw new Error("Conta bloqueada, contacte o seu administrador!");
    
    const userGroupRoute = await userGroupModel.findOne({_id: user.userGroupId});
    
    if(userGroupRoute?.name !== 'administrator'){
      const accessLimit = await getUserAccessLimit(user?._id.toString());
      if(!accessLimit) 
        throw new Error("Sem acesso definido, contacte o seu administrador!");
      
      // verificando as datas do limite de acesso
      if(accessLimit.startAt && accessLimit.endAt){
        if(accessLimit.startAt > new Date()) 
          throw new Error(`Aceder em ${accessLimit.startAt.toLocaleString('pt', {dateStyle: 'full'})}`) 
        if(accessLimit.endAt < new Date())
          throw new Error(`Acesso expirado em ${accessLimit.endAt.toLocaleString('pt', {dateStyle: 'full'})}`)
      }
    }

    const token = await authJWT({
      userId: user?._id.toString(),
      route: userGroupRoute?.route as string,
    });
    
    const loginAccess = new loginAccessTokensModel({
      userId: user?._id,
      token,
      fingerPrint: {
        browser: (await headers()).get("user-agent"),
        ip: (await headers()).get('x-forwarded-for'),
      }
    });

    await loginAccess.save();
    
    (await cookies()).set({
      name: process.env.MASTER_HEADER_AUTH as string,
      value: token,
      httpOnly: true,
      priority: "high"
    });

    return {
      message: 'Credencias verificadas!',
      status: true,
      module: userGroupRoute?.route
    }
  }catch(err: unknown){
    const e = err as { message: string };

    return {
      message: e.message,
      status: false
    }
  }
}

async function endSession(){
  if((await cookies()).has(String(process.env.MASTER_HEADER_AUTH))){
    const userId = await whoAreYou();
    await loginAccessTokensModel.updateOne({ userId, inUse: true }, {  inUse: false });

    await exitFromWorkplace();
    (await cookies()).delete(String(process.env.MASTER_HEADER_AUTH));
  }
  redirect('/');
}

async function signUser(prev: unknown, formData: FormData){
  try{
    const fullname = formData.get('fullname');
    const username = formData.get('username');
    const email = formData.get('email');
    const tel = formData.get('tel');
    const password = formData.get("password") as string; 
    const checkPassword = formData.get("checkPassword") as string; 
    const userGroupId = formData.get('userGroupId');
    
    if(password !== checkPassword)
      throw new Error("As senhas informadas são diferentes!", { cause: 'not_equal'})
    
    if(!passwordValidator(password))
      throw new Error("A senha informada é demasiada fraca!", { cause: "weak_pwd"});
    
    const encPassword = await encryptPwd(password);
    const userGroup = await getUserGroup(String(userGroupId));
    const isAdmin = userGroup?userGroup.name === 'administrator':false;
    
    const user = new userModel({
      fullname,
      username,
      email,
      tel,
      password: encPassword,
      userGroupId,
      isActive: isAdmin,
      isAdmin
    });

    if(userGroup?.name === "clinical"){
      const clinicalUser = new userClinicalModel({
        userId: user._id,
        categoryId: userCategory[2]._id,
      });
      const unitWorkplace = await unitModel.findOne();
      const workplaceAccess = new workplaceModel({
        userId: user._id,
        workplaceId: unitWorkplace?._id,
        actor: await whoAreYou(),
      });

      await workplaceAccess.save();
      await clinicalUser.save();
    }

    await user.save();
   
    return {
      message: 'Usuário registrado com sucesso!',
      status: true
    }
  }catch(e: unknown){
    const err = e as Error & { code: number };

    return {
      message: err.cause ? err.message:err.code?
      "Já existe um usuário com este nome!":"Desculpe, não foi possível realizar o agendamento!",
      status: false,
    };
  }
}

async function getUserGroups(options?: boolean){
  const userGroups = await userGroupModel.find();
  const userGroupFormated = [];

  if(options){
    for(const userGroup of userGroups){
      userGroupFormated.push({
        _id: userGroup._id.toString(),
        label: userGroup.label as string,
      });
    }
  }
  return userGroupFormated;
}

async function getUserGroup(groupId: string){
  return await userGroupModel.findById({_id: groupId});
}

async function getUsers({ name }: { name?: string }){
  const users = await userModel.find().select({password: 0});
  const usersFormated = [];

  for(const user of name?users.filter((user)=>user.fullname.startsWith(name)):users){
    const userGroup = await userGroupModel.findById({_id: user.userGroupId });

    usersFormated.push({
      id: user._id.toString(),
      fullname: user.fullname as string,
      createAt: user.createdAt as Date,
      username: user.username as string,
      tel: user.tel as string,
      email: user.email as string,
      group: userGroup?.label as string,
      status: user.isActive?"Activado":"Desativado",
    });
  }

  return usersFormated;
}

async function getUsersByGroupId(groupId: string){
  const users = await userModel.find({userGroupId: groupId}).select({password: 0});
  
  return {
    users,
    count: users.length
  };
}

async function getUserById(userId: string){
  if(userId)
    return await userModel.findById({_id: userId}).select({password: 0});
}

async function getUser(userId: string){
  const user = await userModel.findById({_id: userId}).select({ password: 0 });
  const userGroup = await userGroupModel.findById({ _id: user?.userGroupId }).select({ label: 1 });

  return {
    fullname: user?.fullname,
    username: user?.username,
    email: user?.email,
    tel: user?.tel,
    userGroup: userGroup?.label,
  };
}

async function changeUserState(_id: string, state: boolean){
  try{
    await userModel.findByIdAndUpdate({_id}, {
      isActive: state,
    });
    
    return {
      message: 'estado actualizado com sucesso!',
      status: true,
    }
  }catch(err: unknown){
    return {
      message: 'erro',
      status: false,
      detail: err,
    }
  }
}

async function updateUser(prev: unknown, formData: FormData){
  try{
    const fullname = formData.get('fullname');
    const username = formData.get('username');
    const email = formData.get('email');
    const tel = formData.get('tel');
    const userId = formData.get('userId');

    await userModel.updateOne({_id: userId}, {
      fullname,
      email,
      tel,
      username
    });

    return {
      message: 'Informações actualizadas com sucesso!',
      status: true,
    }
  }catch(err: unknown){
    return {
      message: 'Erro!',
      status: true,
      detail: err
    }
  }
}

async function signPermission(prev: unknown, formData: FormData){
  try{
    const label = formData.get('label');
    const userGroupId = formData.get('userGroupId');
    const route = formData.get('route');
    const clinicalUserGroupId = formData.get('clinicalUserGroupId');
    const detail = formData.get("detail") as string;
    let permission;

    if(clinicalUserGroupId)
      permission = new permissionModel({
        label, 
        userGroupId,
        route,
        clinicalUserGroupId,
        detail
      });
    else 
      permission = new permissionModel({
        label, 
        userGroupId,
        route,
        detail
      });

    await permission.save();
    
    return {
      message: 'Permissão Registrada com sucesso!',
      status: true,
    }
  }catch(e: unknown){
    const err = e as Error & {code: number}; 
    if(err.code)
      return {
        message: 'Esta permissão já foi cadastrada!',
        status: false
      }
    return {
      message: `Erro, ${err.message}`,
      status: false
    }
  }
}

async function getPermissions(userGroupId?: string, permId?: string, option?:boolean){
  const formatedPermissions = [];
  const permissions = userGroupId?await permissionModel.find({ userGroupId }):await permissionModel.find();
  
  if(option){ 
    for(const permission of permissions)
      formatedPermissions.push({
        _id: permission._id.toString(),
        label: permission.label,
      });

    return formatedPermissions;
  }

  if(permId){
    const permission = await permissionModel.findById({_id: permId});
    return {
      label: permission?.label,
      route: permission?.route,
      userGroupId: permission?.userGroupId,
      detail: permission?.detail,
      _id: permission?._id.toString(),
    }
  }

  for(const permission of permissions)
    formatedPermissions.push({
      _id: permission?._id.toString(),
      label: permission?.label,
      route: permission?.route,
      userGroupId: permission?.userGroupId,
      group: (await userGroupModel.findById({_id: permission?.userGroupId}))?.label,
      detail: permission?.detail,
    });
  
  return formatedPermissions;
}

async function deletePermission(permId: string){
  try{
    await permissionModel.deleteOne({_id: permId});
    return true;
  }catch(e: unknown){
    const err = e as Error;
    console.log(err.message);
    return false;
  }
}

async function getPermission(permId: string){
  return await permissionModel.findOne({_id: permId});
}

async function grantPermission(prev: unknown, formData:FormData){
  try{
    const userId = String(formData.get('userId'));
    const permissionId = String(formData.get('permissionId'));
    
    const perm = await accessPermissionModel.findOne({
      permissionId,
      userId,
    });

    if(perm)
      return{
        message: 'Esta permissão já foi atribuida!',
        status: false
      }

    const userPerm = new accessPermissionModel({userId, permissionId})

    await userPerm.save();

    return {
      message: 'Adicionado permissão ao usuario!',
      status: true,
    }
  }catch(err: unknown){

    return {
      message: 'Falha!',
      status: false,
      detail: err
    }
  }
}

async function getUserPermissions(userId: string){
  return await accessPermissionModel.find({userId});
}

async function deleteUserPermission(prev: unknown, formData: FormData){
  const permId = String(formData.get('permId'));
  await accessPermissionModel.deleteOne({_id: permId});
  return true;
}

async function updatePermission(prev: unknown, formData: FormData){
  try{
    const permissionId = formData.get('permissionId');
    const label = formData.get('label');
    const route = formData.get('route');
    const userGroupId = formData.get('userGroupId');
    const detail = formData.get("detail") as string;
    
    await permissionModel.updateOne({
      _id: permissionId
    },{
      label,
      route,
      userGroupId,
      detail
    });

    return {
      message: 'Permissão actualizada com sucesso!',
      status: true,
    }
  }catch(err: unknown){
    return {
      message: 'Falha!',
      status: false,
      detail: err,
    }
  }
}

async function getGrantedPermission(routes: Route[]){
  try{
    const user = await whoAreYou();
    const grantedPermissions = await accessPermissionModel.find({userId: user});
    const grantedAccessPermissions = [];
    
    for(const grantedPermission of grantedPermissions){
      const permission = await permissionModel.findById({_id: grantedPermission.permissionId });
      const hasAccessPermission = routes.find((route)=>{
        if(route.route === permission?.route){
          route.label = permission?.label as string; // usa o label do banco
          return route;
        }
      });

      if(hasAccessPermission)
        grantedAccessPermissions.push({
          href: hasAccessPermission.href,
          label: hasAccessPermission.label,
          route: hasAccessPermission.route,
        });
    }

    return grantedAccessPermissions;
  }catch(err: unknown){
    const e = err as Error;
    console.log(e);
    return [];
  }
}

async function resetUserPassword(prev: unknown, formData:FormData){
  try{
    const userId = formData.get('userId');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if(password !== confirmPassword)
      return{
        message: 'As senhas são diferentes!',
        status: false,
      }
    const encPassword = await encryptPwd(String(password));
    const user = await userModel.findById({_id: userId}).select({fullname: 1});

    await userModel.updateOne({_id: userId}, {
      password: encPassword
    });

    return {
      message: `Senha do usuário ${user?.fullname} foi actualizada com sucesso!`,
      status: true
    }
  }catch(err: unknown){

    return {
      message: 'Falha na actualização da senha',
      status: false,
      detail: err
    }
  }
}

//checkAccessPermission()
async function verifyRouteUserPermission(targetUrl: string){
  try{
    const userId = await whoAreYou(); 
    const requestedUrl = targetUrl.split('/')[2];

    if(userId){
      const grantedPermissions = await accessPermissionModel.find({userId});

      for(const granted of grantedPermissions){
        const permission = await permissionModel.findById({_id: granted.permissionId});
        if(permission?.route === requestedUrl)
          return true;
      }
    }
    throw new Error("Acesso negado");
  }catch(e: unknown){
    const err = e as Error;
    console.log(err.message);
    return false;
  }
}

export {
  login,
  signUser,
  getUserGroups,
  getUserGroup,
  getUsers,
  getUsersByGroupId,
  getUserById,
  getUser,
  changeUserState,
  updateUser,
  signPermission,
  getPermissions,
  deletePermission,
  getPermission,
  grantPermission,
  getUserPermissions,
  deleteUserPermission,
  updatePermission,
  getGrantedPermission,
  resetUserPassword,
  verifyRouteUserPermission,
  endSession
};

