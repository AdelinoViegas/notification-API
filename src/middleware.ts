import { NextResponse, NextRequest } from 'next/server'
import { cookies } from 'next/headers';
import { decryptAndVerifyJWT } from '@/lib/web-token';

type RESTfulResponse = {
  message: string;
  status: false;
  cause: string;
};

export async function middleware(request: NextRequest) {
  if((await cookies()).has(String(process.env.MASTER_HEADER_AUTH))){ 
    const response = await decryptAndVerifyJWT(String((await cookies()).get(String(process.env.MASTER_HEADER_AUTH))?.value));
    const apiData = await (await fetch(`http://localhost:3000/api?userId=${response.data?.userId}&dest=${request.nextUrl.pathname}`)).json() as RESTfulResponse;
    
    if(!apiData.status){
      if(apiData.cause === "session_ended_by_user")
        return NextResponse.redirect(new URL('/?closedSession', request.url));
      return NextResponse.redirect(new URL('/?nologin', request.url))
    }
    
    if(!response.status){
      console.warn('[warn] ', response?.message);
      return NextResponse.redirect(new URL('/?danied', request.url));
    }

    if(!request.nextUrl.pathname.startsWith(String(response.data?.route))){
      console.error('[error] ', response?.message);
      return NextResponse.redirect(new URL('/?danied', request.url));
    }
    
    return NextResponse.next();
  }else
    return NextResponse.redirect(new URL('/?nologin', request.url))
}
 
export const config = {
  matcher: [
    '/manager/:path*',
    '/clinical/:path*',
    // '/workplace/:path*'
  ],
}