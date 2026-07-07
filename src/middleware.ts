import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin') || pathname === '/admin/login' || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const cookie =
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value;

  if (!cookie) {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '';

    const origin = request.nextUrl.origin;
    const userAgent = request.headers.get('user-agent') || '';

    fetch(`${origin}/api/admin/intrusion-log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'user-agent': userAgent },
      body: JSON.stringify({ path: pathname, _forwardedIp: ip }),
    }).catch(() => {});
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
