# RASTREAMENTO DE PROGRESSO (PROGRESS TRACKING)

Este arquivo define como a IA deve registrar o histórico de execução e decisões técnicas para garantir continuidade e evitar retrabalho.

## 1. O Arquivo de Log (LOGBOOK)
O registro não deve ser um arquivo único e infinito. Ele deve ser organizado na pasta `.history/` seguindo esta estrutura:
- **Nome do arquivo**: `log_YYYY_MM.md` (Mensal) ou `milestone_[nome].md` (Por objetivo).
- **Localização**: `.history/` na raiz do projeto.

## 2. Momento do Registro
A IA deve realizar o log em dois momentos específicos:
1. **Ao finalizar uma tarefa complexa**: Logo após a confirmação de que o código funciona.
2. **Ao final de uma sessão**: Resumindo o estado atual antes de "parar".

## 3. Formato do Registro
O log deve ser extremamente conciso e técnico. Use o formato de lista:

```markdown
### [YYYY-MM-DD] - [Breve Nome da Tarefa]
- **O que foi feito**: [Resumo em 1 frase]
- **Decisão Técnica**: [Por que foi feito desse jeito, se houve escolha]
- **Estado Atual**: [Concluído / Pendente / Bloqueado]
```

## 4. O que NÃO registrar
- Não registre tentativas falhas de correção (a menos que a falha ensine algo crucial).
- Não copie blocos de código (cite apenas os arquivos afetados).
- Não use linguagem prolixa; seja telegráfico.

## 5. Consulta Obrigatória
Ao iniciar uma nova tarefa, a IA deve consultar o último registro no `.history/` para entender o contexto imediato, complementando a leitura do `PROJECT_MAPPING.md`.