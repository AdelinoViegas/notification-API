import { NextResponse } from 'next/server'
import { RESTproxy } from './app/auth/rest-proxy' 
import { NextConfig } from 'next';

export async function middleware() {
  if(await RESTproxy())
    return NextResponse.next();

  return NextResponse.redirect(new URL('/', process.env.LOGIN_URL));
}
 
export const config: NextConfig = {
  matcher: '/clinical/:path*',
}