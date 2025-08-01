"use server";

import axios from "axios";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const instance = axios.create({ 
  baseURL: process.env.ADMIN_SRV_URL
});

export async function userState(token: string){
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const res = await instance.get("/users/myProfile/status");
  return res.status === 200;
}

export async function middleware(extToken?: string){
  try{
    const token = extToken ?? (await cookies()).get(process.env.MASTER_HEADER_AUTH as string)?.value;

    if(!token)
      throw new Error("Impossivel de autenticar!");

    if(!(await cookies()).has(process.env.MASTER_HEADER_AUTH as string))
      (await cookies()).set({
        name: process.env.MASTER_HEADER_AUTH as string,
        value: token,
        priority: "high",
        sameSite: "strict"
      });

    const res = await userState(token);
    return res;
  }catch{
    return false;
  }
}