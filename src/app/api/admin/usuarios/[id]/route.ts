import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { verifyAdminAuth } from '../../../../../lib/auth-check';
import { logAction } from '../../../../../lib/logger';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await verifyAdminAuth();
  if (!payload || payload.role !== 'GESTOR') return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });

  const { id } = await params;

  if (id === payload.userId) {
    return NextResponse.json({ success: false, error: 'Não é possível excluir o próprio usuário' }, { status: 400 });
  }

  const targetUser = await prisma.user.findUnique({ where: { id } });
  const masterUsername = process.env.ADMIN_MASTER_USERNAME || 'GabeMCM';
  if (targetUser?.username === masterUsername) {
    return NextResponse.json({ success: false, error: 'Usuário mestre não pode ser excluído' }, { status: 403 });
  }

  await prisma.user.delete({ where: { id } });
  await logAction(payload.userId as string, payload.nome as string, 'EXCLUIU', 'USUARIO', `ID ${id}`);

  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await verifyAdminAuth();
  if (!payload || payload.role !== 'GESTOR') return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });

  const { id } = await params;
  const data = await req.json();

  const targetUser = await prisma.user.findUnique({ where: { id } });
  const masterUsername = process.env.ADMIN_MASTER_USERNAME || 'GabeMCM';
  if (targetUser?.username === masterUsername) {
    return NextResponse.json({ success: false, error: 'Usuário mestre não pode ser alterado' }, { status: 403 });
  }

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const updated = await prisma.user.update({
    where: { id },
    data
  });

  await logAction(payload.userId as string, payload.nome as string, 'ATUALIZOU', 'USUARIO', `Atualizou usuário ${updated.username}`);

  return NextResponse.json({ success: true });
}
