import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { verifyAdminAuth } from "../../../lib/auth-check";

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!await verifyAdminAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const pedidos = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        catalogItem: true,
        institution: true,
        obito: true,
      }
    });

    return NextResponse.json(pedidos);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar pedidos" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.catalogItemId || !data.institutionId || data.valorPago === undefined || data.valorPago === null) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    const novoPedido = await prisma.order.create({
      data: {
        catalogItemId: data.catalogItemId,
        institutionId: data.institutionId,
        obitoId: data.obitoId || null,
        nomeCliente: data.nomeCliente || null,
        telefoneCliente: data.telefoneCliente || null,
        anonimo: data.anonimo || false,
        modeloNome: data.modeloNome || null,
        valorPago: data.valorPago,
        status: "PENDENTE", // Forçado para evitar injeção
        frase: data.frase || null,
        fotos: data.fotos || [],
        legendaFotos: data.legendaFotos || [],
      }
    });

    // Cadastro Permanente do Doador
    if (data.nomeCliente && data.telefoneCliente && data.anonimo !== true) {
      try {
        await prisma.doador.upsert({
          where: { telefone: data.telefoneCliente },
          update: { nome: data.nomeCliente },
          create: { nome: data.nomeCliente, telefone: data.telefoneCliente }
        });
      } catch (e) {
        console.error("Falha silenciosa ao salvar doador:", e);
      }
    }

    return NextResponse.json(novoPedido, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return NextResponse.json(
      { error: "Erro ao criar pedido" },
      { status: 500 }
    );
  }
}
