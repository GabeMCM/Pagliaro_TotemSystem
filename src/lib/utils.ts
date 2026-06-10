/**
 * Utilitários Genéricos (RCD - Utility Layer)
 */

/**
 * Formata um valor numérico para a moeda brasileira (Real)
 */
export function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

/**
 * Calcula a quantidade de fotos restantes que ainda podem ser adicionadas
 */
export function calcFotosRestantes(limite: number, existentes: number, atuais: number): number {
  return Math.max(0, limite - existentes - atuais);
}
