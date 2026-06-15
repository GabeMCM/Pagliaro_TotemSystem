import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { JWT_SECRET } from './lib/auth-check';

// Rotas que não precisam de proteção dentro de /admin
const publicPaths = ['/admin/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Se a rota começar com /admin e NÃO for uma das rotas públicas
  if (pathname.startsWith('/admin') && !publicPaths.includes(pathname)) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      // Se não tem token, redireciona pro login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      // Verifica se o token é válido
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      // Token inválido ou expirado
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Se o usuário já estiver logado e tentar acessar /admin/login, manda pro painel
  if (pathname === '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL('/admin', request.url));
      } catch (e) {
        // Ignora se for inválido
      }
    }
  }

  return NextResponse.next();
}

// Configura em quais caminhos o middleware vai rodar
export const config = {
  matcher: ['/admin/:path*'],
};
