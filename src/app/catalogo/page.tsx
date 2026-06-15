import prisma from "../../lib/prisma";
import CatalogoClient from "./CatalogoClient";
import { Homenagem } from "../../data/catalogo";

export const revalidate = 3600; // Cache estático regenerado a cada 1 hora (ISR)

export default async function CatalogoPage() {
  // Busca homenagens ativas do banco de dados (Offline-First cache via ISR)
  const items = await prisma.catalogItem.findMany({
    where: { ativo: true },
    include: {
      modelos: true
    },
    orderBy: { createdAt: 'asc' }
  });

  // Mapear o tipo do Prisma para o formato esperado pelo Frontend
  const homenagens: Homenagem[] = items.map(item => ({
    id: item.id,
    nome: item.nome,
    descricao: item.descricao,
    faixa: item.faixa,
    valor: item.valor,
    imagem: item.imagem,
    requerFotos: item.requerFotos,
    ativo: item.ativo,
    modelos: item.modelos.map(m => ({
      id: m.id,
      nome: m.nome,
      descricao: m.descricao || undefined,
      imagem: m.imagem,
      valor: m.valor
    }))
  }));

  return <CatalogoClient homenagens={homenagens} />;
}
