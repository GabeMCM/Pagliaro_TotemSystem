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

    const updatedFrase = await prisma.messageTemplate.update({
      where: { id },
      data: {
        texto: data.texto,
        ativo: data.ativo,
      },
    });

    return NextResponse.json(updatedFrase);
  } catch (error) {
    console.error("Erro ao atualizar frase:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar frase" },
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

    await prisma.messageTemplate.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar frase:", error);
    return NextResponse.json(
      { error: "Erro ao deletar frase" },
      { status: 500 }
    );
  }
}
