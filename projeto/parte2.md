# MASTER PROMPT — MEMÓRIA & CUIDADO

## Parte 2 — Dados, Estado Global e Fluxo Memorial

# Dados Estáticos

Criar:

```txt id="q2kg4j"
src/data/catalogo.ts
```

Exportar:

```ts id="0x7t0r"
ModeloHomenagem
Homenagem
Ong
```

Interfaces:

```ts id="1r6j33"
interface ModeloHomenagem {
  id
  nome
  descricao?
  imagem
}

interface Homenagem {
  id
  nome
  descricao
  faixa
  valor
  imagem
  requerFotos?
  modelos?
}

interface Ong {
  id
  nome
  causa
  descricao
}
```

Nenhuma chamada remota.

Tudo local.

Catálogo é estático.

---

# Homenagens

Quatro homenagens principais.

---

## Coroa memorial

Faixa:

```txt id="u5tk4h"
R$120–280
```

Possui:

4 modelos.

Modelos:

* Clássica
* Elegance
* Jardim
* Premium

Tom:

tradicional e solene.

---

## Arranjo memorial

Faixa:

```txt id="9v3n5m"
R$90–220
```

Possui:

4 modelos.

Modelos:

* Vaso Clássico
* Sereno
* Jardim
* Premium

Tom:

acolhedor e delicado.

---

## Mural da Memória

Faixa:

```txt id="s2j9l2"
R$100–200
```

Configuração:

```ts id="lf4v5e"
requerFotos: true
```

Não possui modelos.

Passa obrigatoriamente:

```txt id="t4cfu5"
/painel
```

---

## Cartão ou mensagem memorial

Faixa:

```txt id="j6nq4k"
R$40–90
```

Sem:

* modelos;
* fotos.

Jornada simples.

---

# Instituições Beneficiadas

Quatro instituições.

---

### Instituto Amparo

Causa:

idosos.

---

### Raízes Vivas

Causa:

reflorestamento.

---

### Casa Semente

Causa:

crianças.

---

### Fundação Luz Serena

Causa:

cuidados paliativos.

---

# Estado Global

Criar:

```txt id="tvl0cq"
src/lib/homenagem-store.tsx
```

Implementar:

```txt id="g3e4li"
HomenagemProvider
```

baseado em:

React Context.

Provider:

montado em:

```txt id="tuyrj8"
__root.tsx
```

envolvendo:

```txt id="55lfrq"
<Outlet />
```

---

# Estado Compartilhado

Limite:

```ts id="p4r2zz"
LIMITE_FOTOS = 20
```

Tipos:

```ts id="q7vttg"
interface FotoMemorial {
  id
  src
  legenda
}
```

Store:

```ts id="eebm4v"
{
 homenagem
 modelo
 fotos
 fotosExistentes
 frase
 ong
}
```

Setters:

* setHomenagem
* setModelo
* setFotos
* setFrase
* setOng

Função:

```ts id="0fdh8f"
reset()
```

Reset:

zera tudo.

Exceto:

```txt id="c3o6j5"
fotosExistentes
```

---

# Memorial Acumulativo Simulado

Implementar:

```ts id="sv9dbf"
fotosExistentes = 12
```

Valor fixo.

Não persistido.

Não dinâmico.

Objetivo:

transmitir sensação de memorial coletivo.

---

# Hook

Criar:

```txt id="1kv1q0"
useHomenagem()
```

Comportamento:

lançar erro se usado fora do Provider.

API clara.

Sem silent fail.

---

# Layout Compartilhado

Criar:

```txt id="tflv7l"
src/components/TotemScreen.tsx
```

Este componente envolve:

TODAS as rotas do fluxo.

Exceto:

```txt id="0j1y4v"
/
```

(tela inicial contemplativa).

---

# Estrutura do TotemScreen

Wrapper:

```txt id="zj4o5h"
min-h-screen
bg-background
```

Atrás:

```txt id="2s4lki"
<Botanical />
```

Elemento decorativo.

Sempre:

* discreto;
* orgânico;
* baixo contraste.

Camada:

```txt id="ykmxw7"
z-0
```

---

# Header

Camada:

```txt id="zrm9x2"
z-10
```

Spacing:

```txt id="4v5x2r"
px-10
pt-8
```

---

# Lado Esquerdo

Se:

```txt id="tz7gn8"
back
```

for fornecido:

mostrar:

* ArrowLeft
* texto "Voltar"

Grande área de toque.

Senão:

mostrar:

```txt id="44ay7x"
Memória & Cuidado
```

em serif.

---

# Lado Direito

Link:

```txt id="h9o1n2"
Início
```

para:

```txt id="o7qv6w"
/inicio
```

Controlado por:

```ts id="7vjlwm"
showHome
```

---

# Main

Estrutura:

```txt id="uh9l0m"
flex
flex-col
flex-1
px-10
py-8
z-10
```

Renderiza:

children.

---

# StepBar

Exportar:

```txt id="i7mqqz"
<StepBar />
```

Uso:

fluxo principal.

Etapas:

```txt id="ewdaz9"
[
"Homenagem",
"Detalhes",
"Instituição",
"Conclusão"
]
```

Visual:

barra horizontal.

Cada segmento:

```txt id="s3z5ei"
h-1.5
rounded-full
```

Inativo:

```txt id="76jzpx"
bg-border
```

Ativo:

```txt id="5qknm6"
bg-primary/70
```

Transição:

suave.

---

# SEO e Head

Todas as rotas:

definem:

```txt id="j2n9hz"
head()
```

Padrão:

```txt id="0y9o4m"
<Página> — Memória & Cuidado
```

Cada rota:

* title
* description

próprios.

---

# Fluxo Geral

Fluxo:

```txt id="o9nm6u"
/inicio
→ /catalogo
→ /colecao/$categoria? (opcional)
→ /painel? (opcional)
→ /instituicoes-escolha
→ /pagamento
→ /confirmacao
```

Fluxo deve parecer:

uma jornada.

Não um checkout.

---

# /inicio

Usa:

```txt id="aj6jhj"
TotemScreen
```

Configuração:

```txt id="4h1qk5"
back="/"
showHome={false}
```

---

# Conteúdo

Kicker:

```txt id="a4x92n"
Bem-vindo
```

Visual:

* uppercase
* tracking amplo
* text-primary/70

Título:

grande.

Serif.

Texto:

> Deseja realizar uma homenagem em memória de alguém?

---

# Opções

Três cards grandes.

Empilhados.

Animação:

```txt id="jlwmnk"
animate-rise
```

em cascata.

Estrutura:

ícone em quadrado arredondado:

```txt id="2w5qq0"
bg-accent/60
```

---

### Conhecer homenagens

Ícone:

```txt id="9lsq5s"
Flower2
```

Vai para:

```txt id="61lj2q"
/catalogo
```

---

### Como funciona

Ícone:

```txt id="uwvjlwm"
HelpCircle
```

---

### Instituições beneficiadas

Ícone:

```txt id="3v8o0f"
HeartHandshake
```

---

# /catalogo

StepBar:

```txt id="d5fbic"
0
```

Back:

```txt id="wgjd38"
/inicio
```

Grid:

```txt id="7l3hww"
grid-cols-1
md:grid-cols-2
gap-8
```

Cards:

imagem:

```txt id="axxum6"
aspect-[4/3]
```

Hover:

zoom suave.

Conteúdo:

* nome
* descrição
* faixa
* badge

Badge:

```txt id="xfivwo"
bg-accent/60
rounded-full
```

Se houver modelos:

mostrar:

> Ver modelos →

---

# Navegação do Catálogo

Ao clicar:

Se:

```ts id="lg3m4v"
h.modelos?.length
```

vai:

```txt id="epmby6"
/colecao/$categoria
```

Senão:

```ts id="1l4t4v"
setHomenagem(h)
```

e segue:

```txt id="gjhh2k"
/painel
```

ou:

```txt id="bn8dxn"
/instituicoes-escolha
```

---

# /colecao/$categoria

Step:

```txt id="6sy1f9"
0
```

Back:

```txt id="r8n3qj"
/catalogo
```

Usar:

```ts id="q5k8s0"
useParams()
```

Busca:

```ts id="m8l7zx"
homenagens.find()
```

Erro:

"coleção indisponível".

Grid:

```txt id="e2n1ur"
md:grid-cols-2
```

Imagem:

```txt id="7mk88x"
aspect-square
```

Ao escolher:

```ts id="3gwz0v"
setHomenagem()
setModelo()
```

e segue fluxo.
