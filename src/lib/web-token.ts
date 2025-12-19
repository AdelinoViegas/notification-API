"use server";

import { createSigner, createVerifier } from "fast-jwt";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type DecPayload = { id: string }

const jwtConfig = {
  key: process.env.SHARED_KEY,
  iss: "urn:master-clinical:issuer"
}

export async function getServiceToken(){
  const signToken = createSigner(jwtConfig);

  const tk = signToken({
    jti: null,
    id: null
  });
  
  console.log(tk);
  return tk;
}

export async function getUserId(){
  try{
    const cache = await cookies();
    const token = cache.get(process.env.COOKIE_AUTH_HEADER as string);
    
    if(!token)
      throw new Error("falta de cookie de autenticação!");

    const verifyTK = createVerifier(jwtConfig);
    const tk = verifyTK(token.value) as DecPayload;
    
    console.log(tk.id)
    return tk.id;
  } catch (e) {
    console.error("get-user-id: ", e); 
    redirect("/clinical");
  }
}

export async function getUserToken(){
  const cache = await cookies();
  const token = cache.get(process.env.COOKIE_AUTH_HEADER as string);
  return token?.value;
}