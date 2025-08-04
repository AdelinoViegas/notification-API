"use server";

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const privateKey = new TextEncoder().encode(String(process.env.JWT_SECRET_KEY));
const adminKey = new TextEncoder().encode(process.env.JWT_SECRET_ADMIN_KEY);

interface DecPayload extends JWTPayload {
  id: string;
}

export async function genWebToken(){
  return new SignJWT({ id: "", jti: "test"})
    .setProtectedHeader({ alg: "HS384" })
    .setIssuedAt()
    .setIssuer('urn:master-clinical:issuer')
    .sign(adminKey)
}

async function decAdminJWT(token: string){
  const { payload } = await jwtVerify<DecPayload>(token, adminKey);
  return payload.id;
}

async function authJWT({
  userId,
  route,
}: {
  userId: string;
  route: string;
}){
  try{
    const jwt = new SignJWT({ userId, route })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer('urn:socompser:issuer')
    .setAudience('urn:socompser:audience')
    .setExpirationTime(String(process.env.JWT_EXPIRATION_TIME))
    .sign(privateKey)

    return jwt;
  }catch(err: unknown){
    const error = err as Error;
    console.log('token: ', error.message);
    return "";
  }
}

async function decryptAndVerifyJWT(token: string){
  try{
    const { payload } = await jwtVerify(token, privateKey)   
    
    return {
      data: payload as { 
        userId: string,
        route: string,
      },
      status: true,
    };
  }catch(err: unknown){
    const error = err as Error;

    return {
      message: error.message,
      status: false
    };
  }
}

async function whoIsUser(){
  try{
    const cache = await cookies();
    const token = cache.get(process.env.COOKIE_AUTH_HEADER as string);
    
    if(!token)
      throw new Error("sem cookies");
    
    const userId = await decAdminJWT(token.value);
    return userId;
  }catch { 
    redirect("/clinical");
  }
}

export async function getUserToken(){
  const cache = await cookies();
  const token = cache.get(process.env.COOKIE_AUTH_HEADER as string);
  return token?.value;
}

export {
  decryptAndVerifyJWT,
  authJWT,
  whoIsUser
}