import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_COOKIE_KEY } from '@/api/endpoints';

function decodeJwtRole(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payload)?.role ?? null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE_KEY)?.value;

  const isPublic = pathname === '/';
  const isFacilityRoute = pathname.startsWith('/dashboard');
  const isAdminRoute = pathname.startsWith('/admin');
  const isVendorRoute = pathname.startsWith('/vendor');

  // Unauthenticated user trying to access protected routes → back to login
  if (!token && (isFacilityRoute || isAdminRoute || isVendorRoute)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (token) {
    const role = decodeJwtRole(token);

    // Authenticated user on login page → redirect to their dashboard
    if (isPublic) {
      if (role === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
      if (role === 'vendor') return NextResponse.redirect(new URL('/vendor', request.url));
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Facility member trying to access admin or vendor routes
    if (isAdminRoute && role !== 'admin') return NextResponse.redirect(new URL('/dashboard', request.url));
    if (isVendorRoute && role !== 'vendor') {
      return NextResponse.redirect(new URL(role === 'admin' ? '/admin' : '/dashboard', request.url));
    }
    if (isFacilityRoute && role === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
    if (isFacilityRoute && role === 'vendor') return NextResponse.redirect(new URL('/vendor', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/admin/:path*', '/vendor/:path*'],
};
