'use server';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const privateKey = new TextEncoder().encode(String(process.env.JWT_SECRET_KEY));

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
    if((await cookies()).has(String(process.env.MASTER_HEADER_AUTH))){
      const token = (await cookies()).get(String(process.env.MASTER_HEADER_AUTH))?.value;
      const { data } = await decryptAndVerifyJWT(String(token));
      return data?.userId;
    }
    throw new Error('sem login valido');
  }catch(err: unknown){
    const error = err as Error;
    console.log(error.message);
    redirect('/?exit');
  }
}

export {
  decryptAndVerifyJWT,
  authJWT,
  whoIsUser
}