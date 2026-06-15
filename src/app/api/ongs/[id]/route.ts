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

    const updatedOng = await prisma.institution.update({
      where: { id },
      data: {
        nome: data.nome,
        causa: data.causa,
        descricao: data.descricao,
        sobre: data.sobre,
        chavePix: data.chavePix,
        telefone: data.telefone,
        email: data.email,
        website: data.website,
        cnpj: data.cnpj,
        cep: data.cep,
        endereco: data.endereco,
        pixTitular: data.pixTitular,
        pixCidade: data.pixCidade,
        qrCodeImagem: data.qrCodeImagem,
        ativo: data.ativo,
      },
    });

    return NextResponse.json(updatedOng);
  } catch (error) {
    console.error("Erro ao atualizar ONG:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar instituição" },
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

    await prisma.institution.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar ONG:", error);
    return NextResponse.json(
      { error: "Erro ao deletar instituição" },
      { status: 500 }
    );
  }
}
