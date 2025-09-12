"use server";

import axios from "axios";
import { genWebToken, getUserToken } from "@/lib/web-token";
import { clinicalRoutes } from '@/components/routes';
import type { 
  MyProfile, 
  User, 
  UserRole,
  DefaultResponse
} from "@/backend/api/types";

const instance = axios.create({ 
  baseURL: process.env.ADMIN_SRV_URL
});

const clientInstance = axios.create({ 
  baseURL: process.env.ADMIN_SRV_URL
});

export async function getUsers(): Promise<User[]>{
  instance.defaults.headers.common.Authorization = `Bearer ${await genWebToken()}`;
  const res = await instance.get("/users", {
    params: { g: "clinico" }
  });

  return res.data.data;
}

export async function getUser(id: string){
  instance.defaults.headers.common.Authorization = `Bearer ${await genWebToken()}`;
  const res = await instance.get<User>("/users/user", {
    params: { id }
  });

  return res.data;
}

// chamadas do usuário
export async function getUserRoles(){
  clientInstance.defaults.headers.common["Authorization"] = `Bearer ${await getUserToken()}`
  const res = await clientInstance.get<UserRole[]>("/users/myProfile/roles");
  return res.data;
}

export async function getMyProfile(){
  clientInstance.defaults.headers.common["Authorization"] = `Bearer ${await getUserToken()}`
  const res = await clientInstance.get<MyProfile>("/users/myProfile");
  return res.data;
}

export async function logout(){
  clientInstance.defaults.headers.common["Authorization"] = `Bearer ${await getUserToken()}`
  const res = await clientInstance.delete<DefaultResponse>("/auth/logout");
  return res.data;
}

export async function getGrantedRoles(){
  try{
    const roles = await getUserRoles();
    const navLinks = [];

    for (const role of roles){
      for (const route of clinicalRoutes){
        if(route.route === role.role.path)
          navLinks.push({
            label: role.role.name, // vem da api admin
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