import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { verifyAdminAuth } from "../../../../lib/auth-check";

export const dynamic = 'force-dynamic';

export async function DELETE() {
  const payload = await verifyAdminAuth();
  if (!payload || payload.role !== 'GESTOR') {
    return NextResponse.json({ error: "Acesso negado. Apenas gestores podem apagar o banco de dados." }, { status: 403 });
  }
  try {
    const deletedOrders = await prisma.order.deleteMany({
      where: {
        status: "FINALIZADO"
      }
    });

    return NextResponse.json(
      { message: "Registros finalizados foram apagados.", count: deletedOrders.count },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao apagar registros:", error);
    return NextResponse.json(
      { error: "Erro interno ao tentar limpar o banco de dados." },
      { status: 500 }
    );
  }
}
