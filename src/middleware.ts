// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Tenta pegar o token do cookie
  const token = request.cookies.get('smartmenu.token')?.value;

  // 2. Define os caminhos que você quer proteger
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith('/waiter') || 
    request.nextUrl.pathname.startsWith('/pagamento');

  // 3. Se tentar acessar rota protegida SEM token, manda pro login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. Se já estiver logado e tentar ir pro login, manda pro dashboard
  if (request.nextUrl.pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/waiter/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configura em quais URLs o middleware deve "vigiar"
export const config = {
  matcher: [
    '/waiter/:path*', 
    '/pagamento/:path*', 
    '/login'
  ],
};