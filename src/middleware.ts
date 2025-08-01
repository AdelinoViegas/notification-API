import { NextResponse, NextRequest } from 'next/server'
import { RESTproxy } from './app/auth/rest-proxy' 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  if(await RESTproxy())
    return NextResponse.next();

  return NextResponse.redirect(new URL('/', process.env.LOGIN_URL));
}
 
export const config = {
  matcher: '/clinical/:path*',
}