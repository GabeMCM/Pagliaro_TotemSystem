# MAPEAMENTO DE PROJETO (PROJECT MAPPING)

Este arquivo define a fase de planejamento obrigatória que deve preceder o desenvolvimento de qualquer novo projeto ou grande funcionalidade.

## 1. O Mapa do Projeto é Obrigatório
Nenhuma linha de código procedural deve ser escrita para um novo projeto antes que o **Mapa do Projeto** seja concluído e aprovado pelo usuário.

## 2. Conteúdo do Mapa
O mapa deve ser uma pasta ou um conjunto de documentos que detalhem:
- **Ideia Central**: O propósito do projeto e o que ele resolve.
- **Estrutura de Pastas**: A hierarquia de arquivos planejada.
- **Tech Stack**: Linguagens, frameworks, bibliotecas e ferramentas de banco de dados.
- **Regras Específicas do Projeto**: Regras que complementam o sistema RCD global, adaptadas para este contexto específico.
- **Esquema de Configuração Inicial**: Definição de quais parâmetros serão extraídos para os arquivos de Config desde o início.

## 3. Fluxo de Trabalho
1. **Briefing**: O usuário apresenta a ideia.
2. **Criação do Mapa**: A IA propõe a estrutura, stack e regras específicas baseadas no sistema RCD.
3. **Refinamento**: Usuário e IA ajustam o mapa até que não existam furos de lógica.
4. **Congelamento do Mapa**: Após aprovação, o mapa se torna a "Lei" do projeto.
5. **Início do Desenvolvimento**: Só então a IA começa a criar os arquivos de código.

## 4. O Papel do Mapa
O mapa serve como a "Fonte da Verdade". Qualquer divergência futura entre o código e o mapa deve ser tratada como um erro de diagnóstico, seguindo o protocolo de `DIAGNOSTIC_AND_THOUGHT.md`.
