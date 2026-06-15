import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { verifyAdminAuth } from "../../../lib/auth-check";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const itens = await prisma.catalogItem.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        modelos: true,
      }
    });
    return NextResponse.json(itens);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar homenagens" },
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
    
    const newItem = await prisma.catalogItem.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        faixa: data.faixa,
        valor: parseFloat(data.valor) || 0,
        imagem: data.imagem || "",
        requerFotos: data.requerFotos || false,
        ativo: data.ativo !== undefined ? data.ativo : true,
        caminhoUrl: data.caminhoUrl || null,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar homenagem:", error);
    return NextResponse.json(
      { error: "Erro ao criar homenagem" },
      { status: 500 }
    );
  }
}
