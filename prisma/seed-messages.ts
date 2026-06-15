import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const mensagensPadrao = [
  "Saudades eternas de seus familiares e amigos.",
  "Com muito amor e carinho, da família.",
  "Homenagem sincera dos diretores e funcionários.",
  "Descanse em paz. Nossas sinceras condolências.",
  "Que Deus conforte o coração de toda a família.",
  "Uma última homenagem com muito respeito e saudade.",
  "O amor não morre, apenas se transforma em saudade.",
  "Lembranças inesquecíveis. De seus amigos queridos.",
  "Nossos mais profundos sentimentos.",
  "Você viverá para sempre em nossos corações."
]

async function main() {
  console.log('Populando mensagens padrão...')
  for (const texto of mensagensPadrao) {
    await prisma.messageTemplate.create({
      data: { texto }
    })
  }
  console.log('Mensagens inseridas com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
