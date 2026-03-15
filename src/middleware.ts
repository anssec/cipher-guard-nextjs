// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Authentication checking wrapper
  let payload = null;
  const token = request.cookies.get('token')?.value;

  if (token) {
    try {
      const { payload: jwtPayload } = await jwtVerify(token, encodedSecret);
      payload = jwtPayload;
    } catch {
      payload = null;
    }
  }

  // Frontend Route Guards — must match actual Next.js page paths
  const isAuthPage = path === '/login' || path === '/register' || path.startsWith('/register/') || path === '/admin/login';
  const isAdminRoute = path.startsWith('/admin') && !isAuthPage;
  const isUserRoute =
    path === '/vault' ||
    path === '/notes' ||
    path === '/generator' ||
    path === '/settings' ||
    path === '/create-vault-pin';

  // 1. Unauthenticated generic protection
  if ((isAdminRoute || isUserRoute) && !payload) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Prevent logged in users from visiting login/register
  if (isAuthPage && payload) {
    const redirectPath = payload.role === 'admin' ? '/admin/dashboard' : '/vault';
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // 3. User Route but Admin Context
  if (isUserRoute && payload?.role === 'admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // 4. Admin Route but User Context
  if (isAdminRoute && payload?.role === 'user') {
    return NextResponse.redirect(new URL('/vault', request.url));
  }

  return NextResponse.next();
}

// Config to specify which paths the middleware should run on.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
