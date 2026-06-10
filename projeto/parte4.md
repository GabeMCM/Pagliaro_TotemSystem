# MASTER PROMPT — MEMÓRIA & CUIDADO

## Parte 4 — Tela Inicial (/), Ecossistema Vivo Persistente e Arquitetura Ambiental

# Escopo da Tela Inicial

A rota:

```txt
/
```

é um **screensaver contemplativo persistente**.

Ela NÃO faz parte do fluxo do totem.

Ela funciona como:

* acolhimento;
* ambientação emocional;
* pausa contemplativa;
* identidade viva do projeto.

Ao tocar a tela:

```txt
/
→ /inicio
```

A experiência deve parecer:

uma paisagem viva silenciosa.

Não uma landing page.

Não um hero comercial.

Não um wallpaper estático.

---

# Relação com o Projeto

A home compartilha:

* paleta;
* direção emocional;
* ritmo;
* linguagem visual.

com o restante do sistema.

O usuário deve perceber continuidade entre:

```txt
/
```

e

```txt
/inicio
```

como se estivesse entrando em um mesmo espaço.

---

# Estrutura Geral

A home possui:

1.

Ecossistema vivo persistente.

2.

Mensagens contemplativas rotativas.

3.

Convite discreto de interação.

4.

Camadas atmosféricas lentas.

5.

Entrada suave no fluxo.

Nada deve parecer interface tradicional.

A UI é mínima.

O ambiente é protagonista.

---

# Composição da Cena

A paisagem ocupa:

toda a viewport.

```txt
absolute inset-0
```

Layers independentes.

Ordem:

```txt
céu
→ montanhas
→ cachoeira
→ nuvens
→ árvore
→ folhas
→ overlay atmosférico
→ mensagens
→ CTA
```

Cada layer:

independente.

Baixo acoplamento.

---

# Linguagem Visual

A cena deve seguir a mesma direção do sistema.

Características:

* orgânica;
* contemplativa;
* refinada;
* delicada;
* natural.

Não criar:

* cartoon;
* fantasy;
* realismo fotográfico;
* low poly;
* flat rígido;
* visual tecnológico.

A ilustração deve parecer:

desenhada com cuidado e suavidade.

Linhas:

finas.

Formas:

orgânicas.

Volumes:

sutis.

Movimento:

leve.

---

# Paleta

Manter rigorosamente:

os tokens existentes.

Base:

```txt
--background
```

Areia / bege claro.

Primária:

```txt
--primary
```

Dusty rose.

Apoio:

```txt
--secondary
--accent
--sage
--rose
--taupe
```

Nunca introduzir:

* azul saturado;
* verde vibrante;
* cores frias dominantes;
* contraste duro.

Toda a cena deve parecer:

banhada pela mesma luz quente.

---

# Atmosfera

A tela deve transmitir:

* serenidade;
* continuidade;
* passagem do tempo;
* contemplação.

Não deve existir:

pressa.

Nada abrupto.

Nenhum elemento:

pisca;
salta;
ou compete.

O ambiente:

respira.

---

# Arquitetura Ambiental v3

Criar:

```txt
src/lib/environment/
src/components/environment/
```

Motor ambiental:

separado do React declarativo.

React:

composição e lifecycle.

Motor:

animação e estado.

---

# Tick Singleton

1 único:

```txt
requestAnimationFrame
```

global.

Singleton.

Idempotente.

Nunca:

1 tick por componente.

Proteção:

* StrictMode;
* remount;
* HMR;
* múltiplos mounts.

API:

```ts
startEnvironment()
stopEnvironment()
destroyEnvironment()
```

Com:

* running
* mountCount
* rafId

Garantir:

1 único loop.

Sempre.

---

# Filosofia do Estado

Estado ambiental:

não é React state.

Evitar:

```txt
setState por frame
```

Usar:

store mutável.

Refs.

Canvas.

CSS variables.

React:

não reconcilia animação contínua.

React:

monta a cena.

Motor:

move a cena.

---

# Propagação Visual

Preferir:

CSS custom properties:

Exemplos:

```txt
--wind-x
--wind-intensity
--branch-sway
--day-phase
```

Transformações:

imperativas.

SVG refs:

quando necessário.

Canvas:

para partículas e folhas.

---

# Source of Truth Temporal

Tempo:

é a verdade principal.

O ambiente deve poder ser reconstruído apenas com:

```txt
seed
+
dayKey
+
hora atual
```

Sem replay.

Sem histórico obrigatório.

Sem dependência de sessão.

---

# Reconcile Determinístico

Quando:

* aba volta;
* visibilitychange;
* dt grande.

Não simular frames perdidos.

Usar:

fast-forward reconciliation.

Fluxo:

1.

calcula delta real.

2.

não integra retroativamente.

3.

deriva estado esperado.

4.

aplica estado final.

Resultado:

* zero replay;
* zero custo proporcional;
* zero glitches.

---

# Persistência

Versionada.

Chaves:

```txt
env.seed.v1
env.day.v1
```

Schema:

versionado.

Mudança futura:

bump.

Regeneração segura.

Sem quebrar UI.

---

# Environment Seed

Criar:

```ts
EnvironmentSeed
```

Persistido.

Imutável após criação.

Contém:

```ts
treeSeed
branchSeed
cloudSeed
mountainSeed
```

Objetivo:

mesma identidade visual.

Mesmo ambiente.

Mesmo reload.

Mesma árvore.

Mesma montanha.

Mesmas nuvens-base.

---

# PRNG

Utilizar:

```txt
mulberry32
```

ou equivalente simples.

Todo procedural:

determinístico.

Mesmo seed:

mesmo resultado.

Sempre.

---

# Céu

Layer:

```txt
SkyLayer
```

Gradiente:

suave.

Warm neutral.

Muito leve.

Pode responder:

ao day phase.

Sem dramatização.

---

# Montanhas

Layer:

```txt
MountainLayer
```

Fundo.

2–3 silhuetas.

Profundidade suave.

Parallax discreto.

Geradas por:

```txt
mountainSeed
```

Formas:

orgânicas.

Sem picos agressivos.

---

# Cachoeira

Layer:

```txt
WaterfallLayer
```

Elemento permanente.

Movimento:

contínuo.

Independente do vento.

Fluxo:

vertical.

Velocidade:

constante.

Sem spray exagerado.

Sem espuma dramática.

Apenas:

presença viva.

---

# Sistema Global de Vento

O vento é:

global.

Único.

Compartilhado.

Define:

* nuvens;
* galhos;
* folhas;
* atmosfera.

Interface:

```ts
Wind
```

Idealmente:

função pura.

Exemplo:

```ts
sample(now, seed)
```

Base:

senos compostos.

Oscilação lenta.

Nunca randômica abrupta.

Intensidade:

0..1.

Direção:

suave.

Turbulência:

leve.

O vento deve parecer:

clima.

Não física caótica.

---

# Nuvens

Layer:

```txt
CloudsLayer
```

Quantidade:

5–8.

Seeded.

Persistentes.

Formas:

orgânicas.

Tamanho:

variável.

Movimento:

segue o vento.

Loop:

reentrada suave.

Sem popping.

Velocidade:

relacionada:

```txt
windIntensity
+
sizeFactor
```

As nuvens ajudam a revelar:

o vento.

---

# Árvore Principal

Layer:

```txt
TreeLayer
```

Elemento emocional central.

Posição:

```txt
bottom-left
```

Ocupa:

aprox.

```txt
2/5
```

da largura.

Árvore:

bem folhada.

Madura.

Acolhedora.

Não seca.

Não dramática.

Não simétrica.

---

# Galhos

Estrutura:

SVG.

Agrupada.

Oscila:

com o vento.

Amplitude:

pequena.

Objetivo:

vida sutil.

Não balanço forte.

---

# Sistema de Folhas

As folhas são:

objetos reais do dia.

Não partículas descartáveis.

Cada folha:

identidade própria.

Determinística.

---

# Quantidade Diária

Utilizar:

```txt
1440 folhas
```

1 folha:

por minuto.

Cada folha:

representa um instante do dia.

---

# Geração

À:

```txt
00:00
```

executar:

```ts
generateDaySchedule(dayKey, seed)
```

Resultado:

```txt
Leaf[1440]
```

Determinístico.

Mesmo:

dayKey + seed

→ mesmo conjunto.

---

# Estrutura da Folha

Cada folha:

```ts
{
 id
 scheduledMinute
 anchorBranchId
 anchorOffset
 fallSeed
}
```

---

# Identidade Temporal

ID:

```txt
${dayKey}-${minute}
```

Exemplo:

```txt
2025-03-08-1410
```

Folha:

14:10

sempre:

mesma folha.

Mesmo galho.

Mesmo destino.

---

# Estados

Derivados do tempo.

Não persistidos individualmente.

Estados:

```txt
attached
falling
grounded
drifting
removed
```

Função:

```ts
leafStateAt()
```

Pura.

---

# Queda

Duração:

aprox.

30s.

Queda:

orgânica.

Com:

* gravidade;
* drift leve;
* rotação suave.

Nunca caótica.

---

# Solo

Folha:

não desaparece.

Ao cair:

permanece.

Acumula.

Forma:

camada orgânica.

Solo vivo.

---

# Drift

Após lifetime:

vento pode retirar.

Drift:

lento.

Natural.

Folha:

sai pela borda.

Sem fade artificial.

---

# Tempo como Verdade

Ao voltar à home:

não restaurar sessão.

Não reanimar.

Apenas:

derivar.

Se:

```txt
10:02
```

Então:

todas folhas anteriores:

já caíram.

Renderizar:

estado correspondente.

Isso garante:

* consistência;
* performance;
* persistência implícita.

---

# Regrowth Diário

Virada do dia:

não instantânea.

Executar:

renascimento progressivo.

Config:

```txt
REGROWTH_DURATION_MS
```

Folhas:

retornam lentamente.

Sensação:

novo ciclo.

---

# Mensagens Contemplativas

Centro da tela.

Camada acima do ambiente.

Mensagens:

```ts
[
"Beleza, respeito e consciência em cada homenagem.",
"Toda memória merece um gesto de carinho.",
"Homenagear também é preservar."
]
```

Tipografia:

Cormorant.

Grande.

Elegante.

Leve.

---

# Rotação das Mensagens

Loop automático.

Contínuo.

Nunca manual.

Ciclo:

aprox.

6–10s por mensagem.

Troca:

crossfade.

Muito suave.

Fluxo:

1.

frase atual esmaece.

2.

nova frase surge.

3.

sobreposição leve.

4.

sem corte abrupto.

Sensação:

respiração.

Não slideshow.

---

# CTA

Discreto.

Não comercial.

Exemplo:

> Toque para iniciar

Baixo contraste.

Presença silenciosa.

O ambiente:

continua protagonista.

---

# Interação

Touch:

não interrompe ecossistema.

Entrada:

suave.

Navegação:

```txt
/inicio
```

Transição:

gentil.

Sem ruptura emocional.

---

# Integração com Legado

Implementação gradual.

Flags:

```ts
LEGACY_BG_VISIBLE
NEW_ENV_VISIBLE
NEW_ENV_OPACITY
```

Novo ambiente:

pode coexistir.

Validação segura.

Remoção do legado:

somente após aprovação.

---

# Filosofia Final da Home

A tela inicial não é um menu.

É um espaço.

Ela existe para:

acolher;

silenciar;

preparar.

Quando o visitante tocar a tela, a sensação deve ser:

não de abrir um sistema,

mas de atravessar um ambiente construído com memória e cuidado.
