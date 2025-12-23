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

const privInstance = axios.create({ 
  baseURL: `${process.env.API_URL}/ath`
});

const clientprivInstance = axios.create({ 
  baseURL: `${process.env.API_URL}/ath`
});

export async function getUsers(): Promise<User[]>{
  privInstance.defaults.headers.common.Authorization = `Bearer ${await getServiceToken()}`;
  const res = await privInstance.get("/users", {
    params: { g: "clinico" }
  });

  return res.data.data;
}

export async function getUser(id: string){
  privInstance.defaults.headers.common.Authorization = `Bearer ${await getServiceToken()}`;
  const res = await privInstance.get<User>("/users/user", {
    params: { id }
  });

  return res.data;
}

// chamadas do usuário
export async function getUserRoles(){
  clientprivInstance.defaults.headers.common["Authorization"] = `Bearer ${await getUserToken()}`
  const res = await clientprivInstance.get<UserRole[]>("/users/myProfile/roles");
  return res.data;
}

export async function getMyProfile(){
  clientprivInstance.defaults.headers.common["Authorization"] = `Bearer ${await getUserToken()}`
  const res = await clientprivInstance.get<MyProfile>("/users/myProfile");
  return res.data;
}

export async function logout(){
  clientprivInstance.defaults.headers.common["Authorization"] = `Bearer ${await getUserToken()}`
  const res = await clientprivInstance.delete<DefaultResponse>("/auth/logout");
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