import prisma from "../../../lib/prisma";
import InstituicaoClient from "./InstituicaoClient";

export const revalidate = 3600;

export default async function InstituicaoDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const ong = await prisma.institution.findUnique({
    where: { id }
  });

  return <InstituicaoClient ong={ong} />;
}
