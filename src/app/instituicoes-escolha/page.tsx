import prisma from "../../lib/prisma";
import EscolhaClient from "./EscolhaClient";

export const revalidate = 3600;

export default async function InstituicoesEscolhaPage() {
  const ongs = await prisma.institution.findMany({
    where: { ativo: true },
    orderBy: { nome: 'asc' }
  });

  return <EscolhaClient ongs={ongs} />;
}
