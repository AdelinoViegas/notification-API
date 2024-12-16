import { NextResponse, NextRequest } from 'next/server'
import { cookies } from 'next/headers';
import { decryptAndVerifyJWT } from '@/lib/web-token';

export async function middleware(request: NextRequest) {
  try{
    if((await cookies()).has(String(process.env.MASTER_HEADER_AUTH))){ 
      const response = await decryptAndVerifyJWT(String((await cookies()).get(String(process.env.MASTER_HEADER_AUTH))?.value));
      if(!!!response?.status)
        throw new Error(response?.message);
      
      if(!request.nextUrl.pathname.startsWith(String(response.data?.route)))
        throw new Error('Access danied!');
      return NextResponse.next();
    }else
      return NextResponse.redirect(new URL('/?nologin', request.url))
  }catch(e: unknown){
    const err = e as Error & {code: number};
    console.log("[-] Token espirado: ", err.message);
    return NextResponse.redirect(new URL('/?access-danied', request.url));
  }
}
 
export const config = {
  matcher: [
    '/manager/:path*',
    '/clinical/:path*',
  ],
}