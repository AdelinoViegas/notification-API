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
  decryptPwd 
} from "@/lib/auth-pwd";
import masterAutoSetup from "@/app/backend/api/manager/setup";
import { 
  authJWT, 
  whoIsUser 
} from "@/lib/web-token";
import { redirect } from "next/navigation";
import { exitFromWorkplace } from "@/app/backend/api/clinical/workplace-api";
import { 
  userModel as userClinicalModel, 
  unitModel, 
  workplaceModel, 
  currentLocationModel
} from "@/app/backend/models/clinical";
import { userCategory } from "@/app/backend/api/clinical/translator";

async function login(prev: unknown, formData: FormData){
  try{
    await masterAutoSetup();

    const username = formData.get('username');
    const password = formData.get('password');
    const invalidLogin: [ string, { cause: string }] = ["Credenciais inválidas!", { cause: "invalid_login" }];
    const user = await userModel.findOne({ username });

    if(!user)
      throw new Error(invalidLogin[0], invalidLogin[1]);
    
    if(!await decryptPwd(user.password, String(password)))
      throw new Error(invalidLogin[0], invalidLogin[1]);
    
    if(!user.isActive)
      throw new Error("Conta bloqueada, contacte o seu administrador!", { cause: "account_blocked" });
    
    const userGroupRoute = await userGroupModel.findOne({_id: user.userGroupId});
    
    if(userGroupRoute?.name !== 'administrator'){
      const accessLimit = await getUserAccessLimit(user?._id.toString()); 

      if(!accessLimit) 
        throw new Error("Sem acesso definido, contacte o seu administrador!", { cause: "not_limit_access"});
      
      // verificando as datas do limite de acesso
      if(accessLimit.startAt && accessLimit.endAt){
        if(accessLimit.startAt > new Date()) 
          throw new Error(`Aceder em ${accessLimit.startAt.toLocaleString('pt', {dateStyle: 'full'})}`) 
        if(accessLimit.endAt < new Date())
          throw new Error(`Acesso expirado em ${accessLimit.endAt.toLocaleString('pt', {dateStyle: 'full'})}`)
      }
    }

    await currentLocationModel.create({
      userId: user._id,
      isActive: true
    });
  
    const token = await authJWT({
      userId: user?._id.toString(),
      route: userGroupRoute?.route as string,
    });
    
    const clientFingerPrint = await headers();

    await loginAccessTokensModel.create({
      userId: user?._id,
      token,
      fingerPrint: {
        browser: clientFingerPrint.get("user-agent"),
        ip: clientFingerPrint.get('x-forwarded-for'),
      }
    });
    
    (await cookies()).set({
      name: process.env.MASTER_HEADER_AUTH as string,
      value: token,
      httpOnly: true,
      priority: "high",
      sameSite: "strict"
    });

    return {
      message: 'Login feito com sucesso!',
      status: true,
      module: userGroupRoute?.route as string
    }
  }catch(e){
    const err = e as Error;

    return {
      message: err.cause?err.message:"Falha critica no servidor, contacte o seu administrador!",
      status: false
    }
  }
}

async function logout(){
  if((await cookies()).has(String(process.env.MASTER_HEADER_AUTH))){
    const userId = await whoIsUser();
    await loginAccessTokensModel.updateOne({ userId, inUse: true }, {  inUse: false });

    await exitFromWorkplace();
    (await cookies()).delete(String(process.env.MASTER_HEADER_AUTH));
  }
  redirect('/?exit');
}

async function signUser(prev: unknown, formData: FormData){
  try{
    const fullname = formData.get('fullname');
    const username = formData.get('username');
    const email = formData.get('email');
    const tel = formData.get('tel');
    const password = formData.get("password") as string; 
    const checkPassword = formData.get("checkPassword") as string; 
    const userGroupId = formData.get('userGroupId') as string;
    
    if(password !== checkPassword)
      throw new Error("As senhas informadas são diferentes!", { cause: 'ne_pwd'})

    const userGroup = await getUserGroup(userGroupId);

    if(userGroup?.message)
      throw new Error(userGroup.message, { cause: "not_found_user_group"});
    
    const user = new userModel({
      fullname,
      username,
      email,
      tel,
      password: await encryptPwd(password),
      userGroupId: userGroup._id
    });

    await user.save();

    if(userGroup.name === "clinical"){
      await userClinicalModel.create({
        userId: user._id,
        categoryId: userCategory[2]._id, // por padrão "outros"
      });

      const unitWorkplace = await unitModel.findOne(); // primeira unidade fisica existente
      await workplaceModel.create({
        userId: user._id,
        workplaceId: unitWorkplace?._id,
        actor: await whoIsUser(),
      });
    }
   
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

async function getUserGroups(){
  const userGroups = await userGroupModel.find();

  return userGroups.map(item => {
    return {
      _id: item._id.toString() as string,
      name: item.name as string,
      label: item.label as string,
      route: item.route as string
    }
  });
}

async function getUserGroup(groupId: string){
  try{
    const userGroup = await userGroupModel.findById({ _id: groupId }); 
    if(!userGroup)
      throw new Error("Este grupo de usuário não existe!", { cause: "group_not_found"});

    return {
      _id: userGroup._id.toString() as string,
      label: userGroup.label as string,
      route: userGroup.route as string,
      name: userGroup.name as string
    };
  }catch(e){
    const err = e as Error;
    return {
      message: err.cause==="group_not_found"?err.message:"Falha no servidor!"
    }
  }
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

async function getUser(userId: string, adminCall?: boolean){
  try{
    const user = await userModel.findById({ _id: userId }).select({ password: 0 });
    if(!user)
      throw new Error("Usuário inexistente!", { cause: "user_not_found"});

    const userGroup = await userGroupModel.findById({ _id: user?.userGroupId }).select({ label: 1 });

    if(!userGroup)
      throw new Error("Grupo de usuário inexistente!", { cause: "usergroup_not_found"});
    
    const userSession = await currentLocationModel.findOne({ userId: user.id, isActive: true });
    
    if(!userSession && !adminCall)
      throw new Error("Sem sessão definida", { cause: "no_session"});

    return {
      _id: user._id.toString(),
      fullname: user.fullname as string,
      username: user.username as string,
      email: user.email as string,
      tel: user.tel as string,
      userGroup: userGroup.label as string,
      userGroupId: userGroup._id.toString(),
      isActive: user.isActive,
      session: {
        isActive: userSession?.isActive as boolean,
        locationId: userSession?.locationId?.toString() as string,
        createdAt: userSession?.createdAt as Date
      }
    };
  }catch(e: unknown){
    const err = e as Error;

    return {
      message: err.cause?err.message:"Falha crítica!",
      status: false
    };
  }
}

async function updateUserState(id: string, state: boolean){
  try{
    await userModel.updateOne({ _id: id }, {
      isActive: state,
    });
  }catch(err: unknown){
    console.log(err);
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
      message: 'Falha na actualização',
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
    return {
      message: err.code?'Esta permissão já foi cadastrada!':`Erro, ${err.message}`,
      status: false
    }
  }
}

async function getPermissions(userGroupId?: string){
  try{
    const permissions = await (
      userGroupId
      ? permissionModel.find({ userGroupId })
      : permissionModel.find()
    );

    const permissionList = [];

    for(const permission of permissions){
      const userGroup = await getUserGroup(permission?.userGroupId?.toString() as string);
      permissionList.push({
        _id: permission._id.toString(),
        label: permission.label as string,
        route: permission.route as string,
        userGroupId: userGroup._id as string,
        userGroupLabel: userGroup.label as string,
        detail: permission.detail as string,
      });
    }

    return permissionList;
  }catch(e){
    return [];
  }
}

async function getPermission(permId: string){
  const permission = await permissionModel.findOne({ _id: permId });

  return {
    _id: permission?._id.toString() as string,
    label: permission?.label as string,
    userGroupId: permission?.userGroupId?.toString() as string,
    detail: permission?.detail as string,
    route: permission?.route as string,
  }
}

async function grantPermission(prev: unknown, formData:FormData){
  try{
    const userId = formData.get('userId');
    const permissionId = formData.get('permissionId');
    
    const perm = await accessPermissionModel.findOne({
      permissionId,
      userId
    });

    if(perm)
      throw new Error("Esta permissão já atribuída ao usuário!", { cause: "granted"});

    await accessPermissionModel.create({userId, permissionId})

    return {
      message: 'Permissão atribuída com sucesso!',
      status: true
    }
  }catch(e: unknown){
    const err = e as Error;

    return {
      message: err.cause?err.message:"Falha crítica!",
      status: false
    }
  }
}

async function getUserPermissions(userId: string){
  try{
    return (await accessPermissionModel.find({ userId })).map(item => {
      return {
        _id: item._id.toString(),
        userId: item.userId?.toString() as string,
        permissionId: item.permissionId?.toString() as string
      }
    })
  }catch(e){
    return [];
  }
}

async function deleteUserPermission(prev: unknown, formData: FormData){
  try{
    const permissionId = formData.get('permId');
    if(!permissionId)
      throw new Error("Preecha todos os campos!", { cause: "empty" });

    await accessPermissionModel.deleteOne({ _id: permissionId });

    return {
      message: "Permissão removida com sucesso!",
      status: true
    }
  }catch(e){
    const err = e as Error;
    return {
      message: err.cause?err.message:"Falha ao remover a permissão!",
      status: false
    }
  }
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
    const user = await whoIsUser();
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

async function verifyRouteUserPermission(targetUrl: string){
  try{
    const userId = await whoIsUser(); 
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
  getUser,
  updateUserState,
  updateUser,
  signPermission,
  getPermissions,
  getPermission,
  grantPermission,
  getUserPermissions,
  deleteUserPermission,
  updatePermission,
  getGrantedPermission,
  resetUserPassword,
  verifyRouteUserPermission,
  logout
};

