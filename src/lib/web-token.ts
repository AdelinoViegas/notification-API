"use server";
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function getServiceToken(){
  return new SignJWT()
    .setProtectedHeader({ alg: "HS384" })
    .setIssuedAt()
    .setIssuer('urn:master-clinical:issuer')
    .sign(secret)
}

export async function getUserId(){
  try{
    const cache = await cookies();
    const token = cache.get(process.env.COOKIE_AUTH_HEADER as string);
    
    if(!token) throw new Error("falta de cookie de autenticação!");

    const { payload } = await jwtVerify<{ __hello: string }>(token.value, secret);
    return payload.__hello;
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