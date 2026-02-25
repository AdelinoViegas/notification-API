"use server";

import { cookies } from "next/headers";
import { validator } from "@/backend/api/admin";

export async function RESTproxy(extToken?: string, set = false){
  try{
    const cache = await cookies();
    const token = extToken || cache.get(process.env.COOKIE_AUTH_HEADER as string)?.value;

    if(!token){
      console.error("token não encontrado!");
      return false
    }

    if(set){
      cache.set({
        name: process.env.COOKIE_AUTH_HEADER as string,
        value: token,
        httpOnly: true
      });
    }

    return await validator(token);
  }catch (e) {
    const err = e as Error;
    console.error("by-middleware: ", err.message);
    return false;
  }
}