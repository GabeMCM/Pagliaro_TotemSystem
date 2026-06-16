import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { JWT_SECRET } from '../../../../lib/auth-check';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    // Se o banco estiver vazio, cria o usuário master automaticamente com os dados fornecidos pelo usuário
    const usersCount = await prisma.user.count();
    if (usersCount === 0) {
      const masterUsername = process.env.ADMIN_MASTER_USERNAME || 'GabeMCM';
      const masterPassword = process.env.ADMIN_MASTER_PASSWORD;

      if (!masterPassword) {
        return NextResponse.json(
          { success: false, message: 'ADMIN_MASTER_PASSWORD não configurada no ambiente.' },
          { status: 500 }
        );
      }

      if (username === masterUsername && password === masterPassword) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
          data: {
            nome: 'Administrador Master',
            email: 'admin@totem.com.br',
            username: masterUsername,
            password: hashedPassword,
            role: 'GESTOR',
            ativo: true,
          }
        });
        
        await prisma.systemLog.create({
          data: {
            action: 'SETUP',
            target: 'SYSTEM',
            details: 'Criado o primeiro usuário Gestor (Master)'
          }
        });
      } else {
        return NextResponse.json(
          { success: false, message: 'Sistema não inicializado. Use as credenciais master para o primeiro login.' },
          { status: 401 }
        );
      }
    }

    // Busca o usuário no banco
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user || !user.ativo) {
      return NextResponse.json(
        { success: false, message: 'Credenciais inválidas ou usuário inativo' },
        { status: 401 }
      );
    }

    // Verifica a senha
    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
      // Registra o login
      await prisma.systemLog.create({
        data: {
          userId: user.id,
          userName: user.nome,
          action: 'LOGIN',
          target: 'SYSTEM',
          details: 'Sessão iniciada'
        }
      });

      // Cria o token JWT com role e id
      const token = await new SignJWT({ 
        userId: user.id, 
        role: user.role, 
        nome: user.nome,
        username: user.username
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(JWT_SECRET);

      const response = NextResponse.json({ success: true, user: { nome: user.nome, role: user.role } });

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
      { success: false, message: 'Credenciais inválidas' },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, message: 'Erro no servidor' },
      { status: 500 }
    );
  }
}
