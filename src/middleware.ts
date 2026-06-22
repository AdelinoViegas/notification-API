import { NextResponse } from 'next/server'
import { RESTproxy } from '@/app/auth/rest-proxy' 
import { NextConfig } from 'next';

export const config: NextConfig = {
  matcher: [
    "/clinical:path*",
    "/wp:path*"
  ],
  runtime: "nodejs"
}

export async function middleware() {
  if(await RESTproxy())
    return NextResponse.next();

  return NextResponse.redirect(new URL('/', process.env.NEXT_LOGIN_PAGE_URL));
}
 
