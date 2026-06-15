import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();

    const novoModelo = await prisma.catalogModel.create({
      data: {
        nome: data.nome || "",
        imagem: data.imagem,
        catalogItemId: id,
      },
    });

    return NextResponse.json(novoModelo, { status: 201 });
  } catch (error) {
    console.error("Erro ao adicionar modelo:", error);
    return NextResponse.json(
      { error: "Erro ao adicionar modelo" },
      { status: 500 }
    );
  }
}
