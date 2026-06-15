import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { verifyAdminAuth } from "../../../../lib/auth-check";

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

    const updatedModel = await prisma.catalogModel.update({
      where: { id: id },
      data: {
        nome: data.nome,
        descricao: data.descricao || null,
        imagem: data.imagem,
        valor: data.valor ? parseFloat(data.valor) : null,
      },
    });

    return NextResponse.json(updatedModel);
  } catch (error) {
    console.error("Erro ao atualizar modelo:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar modelo" },
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

    await prisma.catalogModel.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar modelo:", error);
    return NextResponse.json(
      { error: "Erro ao deletar modelo" },
      { status: 500 }
    );
  }
}
