import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_HINT_COOKIE } from '@/lib/api/config';

const PUBLIC_ROUTES = ['/', '/login', '/otp'];

/**
 * Garde de routes (proxy Next.js 16, ex-middleware).
 *
 * La session vit désormais côté backend Nest : l'access token n'existe qu'en
 * mémoire du navigateur et le refresh token est un cookie HttpOnly limité au
 * chemin `/v1/auth/refresh` de l'API — donc jamais envoyé ici. Le proxy ne
 * peut voir que le cookie témoin posé au login (voir lib/api/token.ts). Il
 * sert d'indice, pas de preuve : la vraie vérification est faite par le
 * backend sur chaque appel (JWT + rôles), et par AuthProvider qui vide la
 * session si le refresh échoue.
 */
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.get(SESSION_HINT_COOKIE)?.value === '1';

  const { pathname } = request.nextUrl;
  const isPublic = pathname === '/' || PUBLIC_ROUTES.some((route) => route !== '/' && pathname.startsWith(route));

  if (!hasSession && !isPublic) {
    // Prototype mode: bypass redirect
    // const loginUrl = request.nextUrl.clone();
    // loginUrl.pathname = '/login';
    // return NextResponse.redirect(loginUrl);
  }

  if (hasSession && isPublic) {
    // Prototype mode: bypass redirect
    // const dashboardUrl = request.nextUrl.clone();
    // dashboardUrl.pathname = '/dashboard';
    // return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
