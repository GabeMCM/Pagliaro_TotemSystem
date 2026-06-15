import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { verifyAdminAuth } from "../../../lib/auth-check";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const ongs = await prisma.institution.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(ongs);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar as instituições" },
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
    
    const newOng = await prisma.institution.create({
      data: {
        nome: data.nome,
        causa: data.causa,
        descricao: data.descricao,
        sobre: data.sobre || null,
        chavePix: data.chavePix || null,
        telefone: data.telefone || [],
        email: data.email || null,
        website: data.website || null,
        cnpj: data.cnpj || null,
        cep: data.cep || null,
        endereco: data.endereco || null,
        pixTitular: data.pixTitular || null,
        pixCidade: data.pixCidade || null,
        qrCodeImagem: data.qrCodeImagem || null,
        ativo: data.ativo !== undefined ? data.ativo : true,
      },
    });

    return NextResponse.json(newOng, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar ONG:", error);
    return NextResponse.json(
      { error: "Erro ao criar instituição" },
      { status: 500 }
    );
  }
}
