import axios from "axios";
import { genWebToken, getUserToken } from "@/lib/web-token";
import { clinicalRoutes } from '@/components/routes';

interface User {
  _id: string;
  fullname: string;
  username: string;
  group: { name: string }
}

interface UserRole {
  _id: string;
  role: {
    name: string;
    path: string;
  }
}

const instance = axios.create({ 
  baseURL: process.env.ADMIN_SRV_URL,
  headers: {
    Authorization: `Bearer ${await genWebToken()}`
  } 
});

const clientInstance = axios.create({ 
  baseURL: process.env.ADMIN_SRV_URL
});

export async function getUsers(): Promise<User[]>{
  const res = await instance.get("/users", {
    params: { g: "clinico" }
  });

  return res.data.data;
}

export async function getUser(id: string){
  const res = await instance.get<User>("/users/user", {
    params: { id }
  });

  return res.data;
}

export async function getUserRoles(){
  clientInstance.defaults.headers.common["Authorization"] = `Bearer ${await getUserToken()}`
  const res = await clientInstance.get<UserRole[]>("/users/myProfile/roles");
  return res.data;
}

export async function getGrantedRoles(){
  try{
    const roles = await getUserRoles();
    const navLinks = [];

    for (const role of roles){
      for (const route of clinicalRoutes){
        if(route.route === role.role.path)
          navLinks.push(route);
      }
    }
    
    return navLinks;
  }catch(e){
    const err = e as Error;
    console.log("Error: ", err)
    return [];
  }
}