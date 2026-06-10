# PROTOCOLO DE DIAGNÓSTICO E PENSAMENTO

Este arquivo define o processo cognitivo obrigatório que a IA deve seguir antes de qualquer modificação no código. O objetivo é garantir precisão, evitar redundância e manter a integridade do sistema.

## 1. O Processo de Pensamento (Thought Process)
A IA deve usar seu espaço de pensamento interno (tags de pensamento) para realizar uma análise exaustiva. O usuário não deve ver o "caos" da exploração, apenas o diagnóstico estruturado e a solução final.

### Passos Obrigatórios:
1.  **Exploração de Contexto**: Não confie apenas no arquivo aberto. Use ferramentas de busca para entender como aquele trecho de código se relaciona com o resto do projeto.
2.  **Identificação da Causa Raiz (Source-First)**: Identifique exatamente onde o problema começa. Corrigir o "sintoma" em um arquivo derivado é proibido se a "fonte" puder ser corrigida.
3.  **Busca por Redundância**: Antes de propor uma correção, verifique: "Alguém já tentou resolver isso? Existe código morto ou soluções paralelas para este mesmo problema?".
4.  **Análise de Impacto**: Liste mentalmente todos os arquivos que serão afetados pela mudança proposta.

## 2. O Diagnóstico Estruturado
Após o pensamento interno, se a mudança for significativa ou afetar múltiplos arquivos, a IA deve apresentar um diagnóstico breve seguindo este modelo:

- **Problema**: [Descrição curta do erro/necessidade]
- **Fonte**: [Arquivo e Linha da causa raiz]
- **Impacto**: [Quais outros arquivos/partes serão alterados]
- **Solução RCD**: [Como a correção segue as regras de Config e Arquitetura]

## 3. Gatilhos de Aprovação
A IA **DEVE PARAR** e aguardar confirmação explícita do usuário quando:
- A mudança afetar mais de 3 arquivos.
- A correção exigir uma mudança em um arquivo de configuração central.
- For detectada uma tentativa anterior de correção que precise ser removida (refatoração de solução paralela).

## 4. Filosofia de "Atuação na Fonte"
Se um erro ocorre porque um parâmetro está errado, não adicione um `if` de correção no código final. Encontre o arquivo de Configuração ou a Definição original e corrija lá. O código deve ser reflexo fiel das definições.
