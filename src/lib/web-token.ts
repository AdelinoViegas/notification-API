"use server";

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const adminKey = new TextEncoder().encode(process.env.JWT_SECRET_ADMIN_KEY);

interface DecPayload extends JWTPayload {
  id: string;
}

export async function getServiceToken(){
  return new SignJWT()
    .setProtectedHeader({ alg: "HS384" })
    .setIssuedAt()
    .setIssuer('urn:master-clinical:issuer')
    .sign(adminKey)
}

async function decAdminJWT(token: string){
  const { payload } = await jwtVerify<DecPayload>(token, adminKey);
  return payload.id;
}

export async function getUserId(){
  try{
    const cache = await cookies();
    const token = cache.get(process.env.COOKIE_AUTH_HEADER as string);
    
    if(!token)
      throw new Error("falta de cookie de autenticação!");
    
    const userId = await decAdminJWT(token.value);
    return userId;
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