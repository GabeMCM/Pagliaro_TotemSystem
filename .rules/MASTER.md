# MASTER RULES - Sistema de Desenvolvimento RCD

Este arquivo é a autoridade suprema para a operação da IA neste projeto. Toda e qualquer ação deve ser filtrada pelas diretrizes aqui estabelecidas e detalhadas nos arquivos complementares.

## 1. O Princípio Fundamental: RCD (Rule & Config Driven)
O desenvolvimento é guiado por **Regras** (como a IA deve agir) e **Configurações** (como o sistema deve se comportar). A IA não deve "inventar" lógica procedural se ela puder ser parametrizada em um arquivo de configuração.

## 2. Hierarquia de Operação
Sempre que uma tarefa for iniciada, a IA deve seguir esta ordem de consulta:
0. **`PROJECT_MAPPING.md`**: Se for um novo projeto, garantir que o mapa existe e foi aprovado.
1. **`MASTER.md`**: Entender a filosofia e as restrições globais.
2. **`DIAGNOSTIC_AND_THOUGHT.md`**: Executar o protocolo de análise antes de escrever qualquer linha de código.
3. **`ARCHITECTURE_AND_CONFIG.md`**: Verificar como a lógica deve ser separada da definição.
4. **`COMMUNICATION_STYLE.md`**: Adequar a resposta final aos padrões de brevidade e objetividade.
5. **`UI_COMPONENTS.md`**: Garantir padronização baseada em comportamento e evitar redundância visual.
6. **`PROGRESS_TRACKING.md`**: Registrar o histórico de evolução e decisões técnicas.

## 3. Diretrizes Inegociáveis
- **Manutenção > Criação**: Atue como um mantenedor disciplinado. Não crie novos caminhos se a infraestrutura existente puder ser corrigida ou expandida.
- **Unicidade de Solução**: É proibido ter mais de uma solução para o mesmo problema. Identifique tentativas anteriores e refatore-as.
- **Tolerância Zero para Código Morto**: Se não é usado ou foi substituído por uma solução melhor, deve ser removido imediatamente.
- **Config-First**: Hardcoding de parâmetros, mensagens ou regras de negócio simples é considerado um erro grave. Extraia para arquivos de configuração (Abordagem 2).
- **Aprovação de Impacto**: Mudanças que afetem a estrutura ou múltiplos arquivos exigem que o diagnóstico seja apresentado e aprovado pelo usuário antes da execução.

## 4. Instrução de Inicialização
Em cada nova sessão ou tarefa complexa, a IA deve confirmar mentalmente (ou no seu `thought process`) que leu e está aplicando estas regras. Se houver conflito entre uma instrução do usuário e estas regras, a IA deve apontar o conflito e sugerir a solução que respeite o sistema RCD.