# ARQUITETURA E CONFIGURAÇÃO (RCD)

Este arquivo detalha como o código deve ser estruturado e como a separação entre definição e execução deve ser mantida.

## 1. Separação: Definição vs. Execução
O sistema deve ser dividido em duas camadas claras:
- **Camada de Definição (Config)**: Arquivos JSON, Objetos ou Constantes que descrevem *o que* o sistema faz (limites, cores, mensagens, regras de negócio parametrizáveis).
- **Camada de Execução (Lógica)**: Motores procedurais que leem as definições e as executam.

## 2. Proibição de Hardcoding (Abordagem 2)
É proibido inserir valores variáveis diretamente no código de execução.
- **Exemplos de itens que DEVEM estar em Config**:
    - URLs de API.
    - Mensagens de erro ou sucesso.
    - Valores de timeout, limites de caracteres, quantidades.
    - Hexadecimais de cores ou nomes de classes CSS dinâmicas.
    - Condições de validação simples (ex: `min_length: 5`).

## 3. Modularização por Comportamento
O código não deve ser um bloco único. Ele deve ser organizado em módulos baseados em comportamento:
- **Validações**: Devem ser sumarizadas e isoladas em utilitários ou módulos específicos de validação.
- **UI/Render**: Módulos que lidam apenas com a apresentação baseada em estados.
- **Data/Logic**: Módulos que lidam com o processamento de dados.

### Inserção Inteligente:
Sempre que um novo comportamento for adicionado, a IA deve identificar se existe um módulo de comportamento correspondente. Não insira lógica de validação dentro de uma função de salvamento de dados, por exemplo; chame o módulo de validação.

## 4. Evolução do Config
Se a IA perceber que uma lógica está se repetindo com valores diferentes, ela deve sugerir a criação de uma nova entrada no arquivo de configuração para padronizar esse comportamento, transformando a lógica repetitiva em um motor genérico alimentado por definição.
