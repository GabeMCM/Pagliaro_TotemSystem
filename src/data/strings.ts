/**
 * Strings de Interface do Sistema Totem (RCD - Config Layer)
 * 
 * Todas as mensagens, labels e textos exibidos ao usuário devem residir aqui.
 * Isso permite manutenção centralizada e futura internacionalização.
 */

export const STRINGS = {
  splash: {
    messages: [
      "Beleza, respeito e consciência em cada homenagem.",
      "Toda memória merece um gesto de carinho.",
      "Homenagear também é preservar.",
    ],
    cta: "Toque para iniciar",
  },

  steps: ["Homenagem", "Detalhes", "Instituição", "Conclusão"],

  errors: {
    notFound: "Não encontrado",
    pageError: "Erro na página",
    providerMissing: "useHomenagem deve ser usado dentro de um HomenagemProvider",
    colecaoIndisponivel: "Coleção indisponível.",
    instituicaoNotFound: "Instituição não encontrada",
  },

  inicio: {
    bemVindo: "Bem-vindo",
    titulo: "Deseja participar do Culto da Saudade?",
    opcoes: {
      homenagens: "Conhecer homenagens",
      historia: "A Origem do Culto da Saudade",
      comoFunciona: "Como funciona",
      instituicoes: "Instituições beneficiadas",
    },
  },

  catalogo: {
    titulo: "Conhecer homenagens",
    subtitulo: "Escolha um gesto de carinho e lembrança.",
    verModelos: "Ver modelos →",
    selecionar: "Selecionar homenagem →",
  },

  colecao: {
    tituloPrefix: "Modelos de",
    subtitulo: "Escolha a opção que mais transmite o seu carinho.",
    selecionar: "Selecionar modelo →",
  },

  painel: {
    titulo: "Mural da Memória",
    completo: "Este memorial está completo com amor e lembranças.",
    botao: "Confirmar mural",
    adicionarFotos: "Adicionar fotos",
    placeholderLegenda: "Adicione uma lembrança...",
    removerFoto: "Remover foto",
    /** Template: recebe fotosExistentes e restantes como parâmetros */
    contagem: (existentes: number, restantes: number) =>
      `Este memorial possui ${existentes} lembranças registradas. Ainda é possível adicionar mais ${restantes} ${restantes === 1 ? 'foto' : 'fotos'}.`,
  },

  instituicoes: {
    titulo: "Instituições Beneficiadas",
    subtitulo: "Conheça as causas que recebem as contribuições das homenagens.",
    saberMais: "Saber mais",
    nossaHistoria: "Nossa História",
    deslize: "← Deslize para ver mais →",
  },

  escolha: {
    titulo: "Para qual causa?",
    subtitulo: "100% da contribuição é destinada à instituição.",
    continuar: "Continuar",
  },

  pagamento: {
    titulo: "Conclua sua homenagem",
    subtitulo: "Aponte a câmera do seu celular para o código abaixo.",
    metodo: "Pagamento via PIX",
    resumo: "Resumo",
    gesto: "Gesto",
    destino: "Destino",
    botao: "Já realizei a contribuição",
  },

  confirmacao: {
    titulo: "Sua homenagem foi registrada com carinho.",
    comFotos: "Seu painel memorial será preparado com carinho.",
    semFotos: "Agradecemos por transformar memória em cuidado.",
    resumo: "Resumo",
    homenagem: "Homenagem",
    lembrancas: "Lembranças",
    destinoSolidario: "Destino Solidário",
    concluir: "Concluir",
    /** Template: recebe quantidade de fotos */
    fotosAdicionadas: (n: number) => `${n} fotos adicionadas`,
  },

  header: {
    titulo: "Culto da Saudade",
    voltar: "Voltar",
    inicioLink: "Início",
  },

  placeholder: {
    espacoReservado: "Espaço Reservado",
    imagemPrefix: "Imagem:",
  },
} as const;
