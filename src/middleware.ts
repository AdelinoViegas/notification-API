import { NextResponse, NextRequest } from 'next/server'
import { middleware as RESTMiddle } from './app/auth/middleware' 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  if(await RESTMiddle())
    return NextResponse.next();
  return NextResponse.redirect(new URL('/', process.env.LOGIN_URL));
}
 
export const config = {
  matcher: '/clinical/:path*',
}