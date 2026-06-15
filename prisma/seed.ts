import { PrismaClient } from '@prisma/client'
import { instituicoes } from '../src/data/instituicoes'
import { homenagens } from '../src/data/homenagens'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando o seeder...')

  // Seed de Instituições
  for (const ong of instituicoes) {
    await prisma.institution.upsert({
      where: { id: ong.id },
      update: {
        nome: ong.nome,
        causa: ong.causa,
        descricao: ong.descricao,
        sobre: ong.sobre,
        telefone: ong.telefone || [],
        website: ong.website || null,
        email: ong.email || null,
        cnpj: ong.cnpj || null,
        cep: ong.cep || null,
        endereco: ong.endereco || null,
        ativo: true,
      },
      create: {
        id: ong.id,
        nome: ong.nome,
        causa: ong.causa,
        descricao: ong.descricao,
        sobre: ong.sobre,
        telefone: ong.telefone || [],
        website: ong.website || null,
        email: ong.email || null,
        cnpj: ong.cnpj || null,
        cep: ong.cep || null,
        endereco: ong.endereco || null,
        ativo: true,
      }
    })
    console.log(`✅ Instituição upserted: ${ong.nome}`)
  }

  // Seed de Catálogo
  for (const homenagem of homenagens) {
    const createdItem = await prisma.catalogItem.upsert({
      where: { id: homenagem.id },
      update: {
        nome: homenagem.nome,
        descricao: homenagem.descricao,
        faixa: homenagem.faixa,
        imagem: homenagem.imagem || '',
        requerFotos: homenagem.requerFotos || false,
        ativo: homenagem.ativo !== false,
      },
      create: {
        id: homenagem.id,
        nome: homenagem.nome,
        descricao: homenagem.descricao,
        faixa: homenagem.faixa,
        valor: 0, // Ajuste manual depois se necessário
        imagem: homenagem.imagem || '',
        requerFotos: homenagem.requerFotos || false,
        ativo: homenagem.ativo !== false,
      }
    })

    // Seed de Modelos da Homenagem
    if (homenagem.modelos) {
      for (const modelo of homenagem.modelos) {
        await prisma.catalogModel.upsert({
          where: { id: modelo.id },
          update: {
            nome: modelo.nome,
            descricao: modelo.descricao,
            imagem: modelo.imagem || '',
          },
          create: {
            id: modelo.id,
            nome: modelo.nome,
            descricao: modelo.descricao,
            imagem: modelo.imagem || '',
            catalogItemId: createdItem.id,
          }
        })
      }
    }
    console.log(`✅ Homenagem upserted: ${homenagem.nome}`)
  }

  console.log('Seed concluído com sucesso! 🎉')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
