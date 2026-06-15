import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { verifyAdminAuth } from "../../../../lib/auth-check";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const item = await prisma.catalogItem.findUnique({
      where: { id },
      include: {
        modelos: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!item) {
      return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Erro ao buscar item do catálogo:", error);
    return NextResponse.json(
      { error: "Erro ao buscar item" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await verifyAdminAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const data = await req.json();

    const updatedItem = await prisma.catalogItem.update({
      where: { id },
      data: {
        nome: data.nome,
        descricao: data.descricao,
        faixa: data.faixa,
        valor: parseFloat(data.valor) || 0,
        imagem: data.imagem || "",
        requerFotos: data.requerFotos,
        ativo: data.ativo,
        caminhoUrl: data.caminhoUrl || null,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Erro ao atualizar homenagem:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar homenagem" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await verifyAdminAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const { id } = await params;

    await prisma.catalogItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar homenagem:", error);
    return NextResponse.json(
      { error: "Erro ao deletar homenagem" },
      { status: 500 }
    );
  }
}
