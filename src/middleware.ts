import { NextResponse, NextRequest } from 'next/server'
import { cookies } from 'next/headers';
import { decryptAndVerifyJWT } from '@/lib/web-token';

type RESTfulResponse = {
  message: string;
  status: false;
  cause: string;
};

export async function middleware(request: NextRequest) {
  try{
    if((await cookies()).has(String(process.env.MASTER_HEADER_AUTH))){ 
      const jwtToken = await decryptAndVerifyJWT(String((await cookies()).get(String(process.env.MASTER_HEADER_AUTH))?.value));
      if(jwtToken.data && !("userId" in jwtToken?.data))
        throw new Error(JSON.stringify(jwtToken));
      
      const apiData = await (await fetch(`http://localhost:${process.env.REST_PORT}/api?userId=${jwtToken.data?.userId}&dest=${request.nextUrl.pathname}`)).json() as RESTfulResponse;
      
      if(!apiData.status){
        if(apiData.cause === "session_ended_by_user")
          return NextResponse.redirect(new URL('/?closedSession', request.url));
        return NextResponse.redirect(new URL('/?nologin', request.url))
      }
      
      if(!jwtToken.status){
        console.warn('[warn] ', jwtToken?.message);
        return NextResponse.redirect(new URL('/?danied', request.url));
      }

      if(!request.nextUrl.pathname.startsWith(String(jwtToken.data?.route))){
        console.error('[error] ', jwtToken);
        return NextResponse.redirect(new URL('/?danied', request.url));
      }
      
      return NextResponse.next();
    }else
      return NextResponse.redirect(new URL('/?nologin', request.url))
  }catch(e: unknown){
    console.log('error: ', e);
  }
}
 
export const config = {
  matcher: [
    '/manager/:path*',
    '/clinical/:path*',
    // '/workplace/:path*'
  ],
}