import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

import { verifyAdminAuth } from '../../../../lib/auth-check';
import { logAction } from '../../../../lib/logger';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = await verifyAdminAuth();
  if (!payload) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    
    const message = await prisma.splashMessage.update({
      where: { id },
      data: {
        texto: body.texto,
        ativo: body.ativo,
      },
    });

    await logAction(payload.id, payload.nome, 'ATUALIZOU', 'SplashMessage', `Atualizou mensagem: ${message.texto.substring(0, 30)}...`);

    return NextResponse.json(message);
  } catch (error) {
    console.error("Erro ao atualizar mensagem inicial:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = await verifyAdminAuth();
  if (!payload) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    
    const message = await prisma.splashMessage.findUnique({ where: { id } });
    if (message) {
      await logAction(payload.id, payload.nome, 'EXCLUIU', 'SplashMessage', `Excluiu mensagem: ${message.texto.substring(0, 30)}...`);
    }

    await prisma.splashMessage.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Erro ao deletar mensagem inicial:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
