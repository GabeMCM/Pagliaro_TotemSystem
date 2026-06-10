# COMPONENTES BASEADOS EM COMPORTAMENTO (UI RCD)

Este arquivo define como os componentes de interface devem ser concebidos e reutilizados com base no seu comportamento, não apenas em sua aparência.

## 1. Identidade Comportamental
A identidade de um componente é definida pelo que ele **faz** e como o usuário **interage** com ele. 
- Se dois componentes possuem comportamentos de interação iguais (ex: um modal de confirmação e um modal de aviso), eles **devem** ser o mesmo componente ou herdar exatamente a mesma estrutura e estilização.

## 2. Reutilização Obrigatória
- Antes de criar um novo componente UI, a IA deve verificar se já existe um componente com comportamento similar.
- É proibido reescrever classes Tailwind para um comportamento que já foi estilizado anteriormente.
- **Variação por Conteúdo, não por Estilo**: O componente deve ser flexível para receber diferentes conteúdos (children/props), mas a "casca" comportamental (animações, bordas, sombras, layout base) deve ser idêntica.

## 3. Padronização via Tailwind
- Toda a estilização deve ser baseada em padrões definidos no config.
- Componentes de mesmo comportamento devem utilizar o mesmo conjunto de utilitários Tailwind. Se uma mudança for feita em um "Modal de Resposta", ela deve se refletir automaticamente em todos os modais de mesmo comportamento.

## 4. Exemplos de Categorização por Comportamento:
- **Input de Coleta**: Todos os campos de texto que coletam dados do usuário.
- **Trigger de Ação**: Botões, links ou ícones que iniciam um processo.
- **Feedback de Sistema**: Alertas, Toasts ou Modais que informam o estado do sistema.
- **Overlay de Decisão**: Modais que bloqueiam a tela esperando uma resposta (Sim/Não, OK/Cancelar).

## 5. Implementação
Ao codificar, a IA deve priorizar a criação de **Componentes Genéricos de Comportamento** que são então consumidos pelas páginas, injetando apenas a lógica de dados específica.
