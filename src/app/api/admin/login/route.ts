import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { JWT_SECRET } from '../../../../lib/auth-check';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const masterPassword = process.env.ADMIN_MASTER_PASSWORD || 'saudade-admin';

    if (password === masterPassword) {
      // Cria o token JWT válido por 1 dia
      const token = await new SignJWT({ admin: true })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(JWT_SECRET);

      const response = NextResponse.json({ success: true });

      // Define o cookie httpOnly para segurança
      response.cookies.set({
        name: 'admin_token',
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 dia
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Senha incorreta' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erro no servidor' },
      { status: 500 }
    );
  }
}
