"use server";
import { getMyProfile } from '@/backend/api/admin';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function getServiceToken(){
  const data = await new SignJWT()
    .setProtectedHeader({ alg: "HS384" })
    .setIssuedAt()
    .setSubject("urn:master-clinical:sub")
    .setIssuer("urn:master-admin:issuer")
    .setAudience('urn:master-clinical:aud')
    .sign(secret)

  return data;
}

export async function getUserId(){
  const data = await getMyProfile();
  return data.id
}

// export async function getSessionId(){
//   try{
//     const cache = await cookies();
//     const token = cache.get(process.env.COOKIE_AUTH_HEADER as string);
    
//     if(!token) throw new Error("falta de cookie de autenticação!");

//     const { payload } = await jwtVerify<{ __hello: string }>(token.value, secret);

//     return payload.jti;
//   } catch (e) {
//     console.error("ss-id: ", e); 
//     redirect("/clinical");
//   }
// }
export async function getUserToken(){
  const cache = await cookies();
  const token = cache.get(process.env.COOKIE_AUTH_HEADER as string);
  return token?.value;
}