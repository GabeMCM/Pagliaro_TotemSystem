import prisma from "../../../lib/prisma";
import ColecaoClient from "./ColecaoClient";
import { Homenagem } from "../../../data/catalogo";
import { CatalogModel } from "@prisma/client";

export const revalidate = 3600;

export default async function ColecaoPage({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params;

  const item = await prisma.catalogItem.findFirst({
    where: { id: categoria, ativo: true },
    include: { modelos: true }
  });

  const homenagem: Homenagem | null = item ? {
    id: item.id,
    nome: item.nome,
    descricao: item.descricao,
    faixa: item.faixa,
    valor: item.valor,
    imagem: item.imagem,
    requerFotos: item.requerFotos,
    ativo: item.ativo,
    modelos: item.modelos.map((m: CatalogModel) => ({
      id: m.id,
      nome: m.nome,
      descricao: m.descricao || undefined,
      imagem: m.imagem,
      valor: m.valor
    }))
  } : null;

  return <ColecaoClient homenagem={homenagem} />;
}
