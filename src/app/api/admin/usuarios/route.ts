import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { verifyAdminAuth } from '../../../../lib/auth-check';
import { logAction } from '../../../../lib/logger';

export async function GET(req: NextRequest) {
  const payload = await verifyAdminAuth();
  if (!payload || payload.role !== 'GESTOR') return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });

  const masterUsername = process.env.ADMIN_MASTER_USERNAME || 'GabeMCM';
  const users = await prisma.user.findMany({
    where: { username: { not: masterUsername } },
    select: { id: true, nome: true, username: true, role: true, ativo: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  });
  
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const payload = await verifyAdminAuth();
  if (!payload || payload.role !== 'GESTOR') return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });

  try {
    const data = await req.json();
    const { nome, username, password, role } = data;

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Usuário já existe com este login.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nome,
        username,
        password: hashedPassword,
        role: role || 'ATENDENTE'
      }
    });

    await logAction(payload.userId as string, payload.nome as string, 'CRIOU', 'USUARIO', `Usuário ${username} criado.`);

    return NextResponse.json({ success: true, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Erro ao criar usuário' }, { status: 500 });
  }
}
