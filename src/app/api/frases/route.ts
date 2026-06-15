import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { verifyAdminAuth } from "../../../lib/auth-check";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const frases = await prisma.messageTemplate.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(frases);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar frases" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!await verifyAdminAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const data = await req.json();
    
    const novaFrase = await prisma.messageTemplate.create({
      data: {
        texto: data.texto,
        ativo: data.ativo !== undefined ? data.ativo : true,
      },
    });

    return NextResponse.json(novaFrase, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar frase:", error);
    return NextResponse.json(
      { error: "Erro ao criar frase" },
      { status: 500 }
    );
  }
}
