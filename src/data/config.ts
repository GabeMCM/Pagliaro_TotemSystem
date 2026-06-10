/**
 * Configuração Central do Sistema Totem (RCD - Config Layer)
 * 
 * Todos os valores numéricos parametrizáveis do projeto devem residir aqui.
 * Nenhum "número mágico" deve existir diretamente no código de execução.
 */

export const CONFIG = {
  totem: {
    /** Tempo em ms antes do auto-reset na tela de confirmação */
    autoResetMs: 20_000,
    /** Intervalo em ms entre rotações de mensagem no splash */
    splashRotationMs: 9_000,
  },
  memorial: {
    /** Quantidade máxima de fotos permitidas por memorial */
    limiteFotos: 20,
    /** Quantidade de fotos já existentes no memorial simulado */
    fotosExistentes: 12,
    /** Limite de caracteres para a legenda de cada foto */
    legendaMaxLength: 40,
  },
  ambiente: {
    /** Seed base do PRNG para a árvore */
    treeSeed: 42,
    /** Intervalo em segundos entre cada folha que cai */
    intervaloFolhaSeg: 30,
    /** Minuto da hora em que a tempestade de varredura inicia */
    sweepMinuto: 59,
    /** Segundo dentro do minuto de sweep em que a tempestade começa */
    sweepSegundoInicio: 50,
  },
} as const;
