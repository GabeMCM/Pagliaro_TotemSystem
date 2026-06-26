import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Validar a Chave de API (Header x-api-key)
    const apiKey = req.headers.get("x-api-key");
    const validKey = process.env.INTEGRATION_API_KEY;

    if (!validKey || apiKey !== validKey) {
      return NextResponse.json(
        { error: "Acesso não autorizado. Chave de API (x-api-key) inválida ou não fornecida." },
        { status: 401 }
      );
    }

    // 2. Extrair dados da requisição
    const data = await req.json();

    if (!data.nome || typeof data.nome !== "string") {
      return NextResponse.json(
        { error: "O campo 'nome' é obrigatório e deve ser uma string." },
        { status: 400 }
      );
    }

    // 3. Processar Datas (Convertendo string "YYYY-MM-DD" para Date)
    let dataNascimentoDate: Date | null = null;
    if (data.dataNascimento) {
      dataNascimentoDate = new Date(data.dataNascimento);
      if (isNaN(dataNascimentoDate.getTime())) {
        return NextResponse.json({ error: "Formato de 'dataNascimento' inválido. Use ISO-8601 (ex: YYYY-MM-DD)." }, { status: 400 });
      }
    }

    let dataFalecimentoDate: Date | null = null;
    if (data.dataFalecimento) {
      dataFalecimentoDate = new Date(data.dataFalecimento);
      if (isNaN(dataFalecimentoDate.getTime())) {
        return NextResponse.json({ error: "Formato de 'dataFalecimento' inválido. Use ISO-8601 (ex: YYYY-MM-DD)." }, { status: 400 });
      }
    }

    // 4. Inserir no Banco de Dados
    const novoObito = await prisma.obito.create({
      data: {
        nome: data.nome,
        dataNascimento: dataNascimentoDate,
        dataFalecimento: dataFalecimentoDate,
        ativo: true, // Sempre entra como ativo para aparecer no totem
      }
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Óbito registrado com sucesso.",
        obito: novoObito 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[INTEGRACAO OBITOS] Erro ao registrar óbito:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao tentar registrar o óbito." },
      { status: 500 }
    );
  }
}
