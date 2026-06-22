import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

import { verifyAdminAuth } from '../../../lib/auth-check';
import { logAction } from '../../../lib/logger';

export async function GET() {
  try {
    const payload = await verifyAdminAuth();
    
    const messages = await prisma.splashMessage.findMany({
      where: payload ? undefined : { ativo: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Erro ao buscar mensagens iniciais:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const payload = await verifyAdminAuth();
  if (!payload) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
  }

  try {
    const { texto, ativo } = await request.json();
    
    if (!texto || texto.trim() === '') {
      return NextResponse.json({ error: "Texto da mensagem é obrigatório" }, { status: 400 });
    }

    const message = await prisma.splashMessage.create({
      data: {
        texto,
        ativo: ativo ?? true,
      },
    });

    await logAction(String(payload.id), String(payload.nome), 'CRIOU', 'SplashMessage', `Criou mensagem: ${texto.substring(0, 30)}...`);

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar mensagem inicial:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
