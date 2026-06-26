import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { verifyAdminAuth } from "../../../lib/auth-check";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const payload = await verifyAdminAuth();
    
    const obitos = await prisma.obito.findMany({
      where: payload ? undefined : { ativo: true },
      orderBy: { createdAt: "desc" },
      take: 100, // Previne sobrecarga se houver muitos registros históricos
    });
    return NextResponse.json(obitos);
  } catch (error) {
    console.error("Erro offline-first ao buscar óbitos:", error);
    return NextResponse.json(
      { error: "Serviço Indisponível - Possível falha de rede" },
      { status: 503 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!await verifyAdminAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const data = await req.json();
    
    const novoObito = await prisma.obito.create({
      data: {
        nome: data.nome,
        dataFalecimento: data.dataFalecimento ? new Date(data.dataFalecimento) : null,
        localVelorio: data.localVelorio,
        ativo: data.ativo !== undefined ? data.ativo : true,
      },
    });

    return NextResponse.json(novoObito, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar óbito:", error);
    return NextResponse.json(
      { error: "Erro ao criar óbito" },
      { status: 500 }
    );
  }
}
