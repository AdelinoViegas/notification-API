"use server";

import axios from "axios";
import { getServiceToken, getUserToken } from "@/lib/web-token";
import { clinicalRoutes } from '@/components/routes';
import type { 
  MyProfile, 
  User, 
  UserRole,
  DefaultResponse
} from "@/backend/api/types";

const systemService = axios.create({ baseURL: `${process.env.API_URL}/ath` });

const service = axios.create({ baseURL: `${process.env.API_URL}/ath`});

export async function getUsers(): Promise<User[]>{
  systemService.defaults.headers.common.Authorization = `Bearer ${await getServiceToken()}`;
  const res = await systemService.get("/users", {
    params: { g: "clinico" }
  });

  return res.data.data;
}

export async function getUser(id: string){
  systemService.defaults.headers.common.Authorization = `Bearer ${await getServiceToken()}`;
  const res = await systemService.get<User>(`/users/${id}`);
  return res.data;
}

// chamadas do usuário
async function getUserRoles(){
  service.defaults.headers.common["Authorization"] = `Bearer ${await getUserToken()}`
  const res = await service.get<UserRole[]>("/me/roles");
  return res.data;
}

export async function getMyProfile(){
  service.defaults.headers.common["Authorization"] = `Bearer ${await getUserToken()}`
  const res = await service.get<MyProfile>("/me");
  return res.data;
}

export async function logout(){
  service.defaults.headers.common["Authorization"] = `Bearer ${await getUserToken()}`
  const res = await service.post<DefaultResponse>("/auth/logout");
  return res.data;
}

export async function validator(token: string){
  service.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const res = await service.get("/validate");
  return res.status === 200;
}

// export async function rbacValidator(resource: string){

// }

export async function getGrantedRoles(){
  try{
    const roles = await getUserRoles();
    const navLinks = [];

    for (const role of roles){
      for (const route of clinicalRoutes){
        if(route.route === role.resource)
          navLinks.push({
            label: role.name, // vem da api admin
            href: route.href,
            route: route.route
          });
      }
    }
    
    return navLinks;
  }catch(e){
    const err = e as Error;
    console.log("Error: ", err)
    return [];
  }
}