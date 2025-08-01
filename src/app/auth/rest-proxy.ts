"use server";

import axios from "axios";
import { cookies } from "next/headers";

const instance = axios.create({ 
  baseURL: process.env.ADMIN_SRV_URL
});

export async function userState(token: string){
  console.log(token.length);
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const res = await instance.get("/users/myProfile/status");
  return res.status === 200;
}

export async function RESTproxy(extToken?: string, set = false){
  try{
    const cache = await cookies();
    const token = extToken || cache.get(process.env.COOKIE_AUTH_HEADER as string)?.value;

    if(!token)
      throw new Error("Impossivel de autenticar!");

    if(set){
      cache.set({
        name: process.env.COOKIE_AUTH_HEADER as string,
        value: token,
        httpOnly: true
      });
    }

    return await userState(token);
  }catch {
    return false;
  }
}