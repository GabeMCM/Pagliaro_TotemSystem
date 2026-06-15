import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { verifyAdminAuth } from "../../../../lib/auth-check";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: "Acesso negado. Token ausente ou inválido." }, { status: 401 });
  }
  try {
    const data = await req.json();
    const resolvedParams = await params;
    
    // Validar status
    if (!data.status || !["PENDENTE", "PAGO", "CANCELADO", "FINALIZADO"].includes(data.status)) {
      return NextResponse.json({ error: "Status inválido." }, { status: 400 });
    }

    const pedidoAtualizado = await prisma.order.update({
      where: { id: resolvedParams.id },
      data: { status: data.status },
    });

    return NextResponse.json(pedidoAtualizado, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar status do pedido." },
      { status: 500 }
    );
  }
}
