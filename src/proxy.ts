import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CURRENCY_COOKIE } from '@/lib/currency-constants';

function redirectWithoutCurrencyPrefix(request: NextRequest, currency: 'USD' | 'EUR') {
  const prefix = currency === 'EUR' ? '/eur' : '/usd';
  const destination = request.nextUrl.clone();
  destination.pathname = request.nextUrl.pathname.slice(prefix.length) || '/';
  const response = NextResponse.redirect(destination, 308);
  response.cookies.set(CURRENCY_COOKIE, currency, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/usd' || pathname.startsWith('/usd/')) {
    return redirectWithoutCurrencyPrefix(request, 'USD');
  }

  if (pathname.startsWith('/eur/calculator/')) {
    return NextResponse.next();
  }

  if (pathname === '/eur' || pathname.startsWith('/eur/')) {
    return redirectWithoutCurrencyPrefix(request, 'EUR');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/usd/:path*', '/eur/:path*'],
};
