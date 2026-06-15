import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { verifyAdminAuth } from "../../../lib/auth-check";

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!await verifyAdminAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const doadores = await prisma.doador.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(doadores);
  } catch (error) {
    console.error("Erro ao buscar doadores:", error);
    return NextResponse.json(
      { error: "Erro ao buscar doadores" },
      { status: 500 }
    );
  }
}
