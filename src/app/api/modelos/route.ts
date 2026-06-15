import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { verifyAdminAuth } from "../../../lib/auth-check";

export async function POST(req: NextRequest) {
  if (!await verifyAdminAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const data = await req.json();

    if (!data.catalogItemId || !data.nome || !data.imagem) {
      return NextResponse.json(
        { error: "catalogItemId, nome e imagem são obrigatórios" },
        { status: 400 }
      );
    }

    const newModel = await prisma.catalogModel.create({
      data: {
        nome: data.nome,
        descricao: data.descricao || null,
        imagem: data.imagem,
        valor: data.valor ? parseFloat(data.valor) : null,
        catalogItemId: data.catalogItemId,
      },
    });

    return NextResponse.json(newModel, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar modelo:", error);
    return NextResponse.json(
      { error: "Erro ao criar modelo" },
      { status: 500 }
    );
  }
}
