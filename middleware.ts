import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'hd_session';

const PUBLIC_PATHS = [
  '/login',
  '/api/auth/login',
  '/api/auth/me',
  '/api/auth/logout',
  '/_next',
  '/favicon.ico',
];

const isPublicPath = (pathname: string) => PUBLIC_PATHS.some((path) => pathname.startsWith(path));

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    if (pathname.startsWith('/login') && hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.*\\.(?:png|jpg|jpeg|svg|gif|ico|css|js|map)$).*)'],
};
