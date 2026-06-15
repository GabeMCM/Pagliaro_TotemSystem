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

    const updatedObito = await prisma.obito.update({
      where: { id },
      data: {
        nome: data.nome,
        dataFalecimento: data.dataFalecimento ? new Date(data.dataFalecimento) : null,
        localVelorio: data.localVelorio,
        ativo: data.ativo,
      },
    });

    return NextResponse.json(updatedObito);
  } catch (error) {
    console.error("Erro ao atualizar óbito:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar óbito" },
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

    await prisma.obito.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar óbito:", error);
    return NextResponse.json(
      { error: "Erro ao deletar óbito" },
      { status: 500 }
    );
  }
}
