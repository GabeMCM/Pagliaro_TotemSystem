# MASTER PROMPT — MEMÓRIA & CUIDADO

## Parte 1 — Visão do Produto, Arquitetura e Design System

# Visão Geral do Produto

Construa um sistema web de autoatendimento chamado **Memória & Cuidado**, destinado a homenagens póstumas solidárias em funerárias.

O projeto funciona como um **totem memorial contemplativo**, permitindo que visitantes realizem um gesto de homenagem enquanto destinam integralmente a contribuição financeira para instituições beneficentes.

O sistema nunca deve transmitir sensação de e-commerce ou venda.

O tom emocional é:

* delicado;
* respeitoso;
* contemplativo;
* acolhedor;
* silencioso;
* afetivo.

Evitar:

* urgência;
* linguagem comercial;
* gatilhos promocionais;
* excesso visual;
* animações agressivas.

Palavras preferidas:

* homenagem
* lembrança
* gesto
* carinho
* memória
* cuidado
* preservação

O sistema deve transmitir:

> beleza, respeito e consciência em cada homenagem.

O projeto possui **duas experiências integradas**:

1.

**Tela inicial contemplativa (/)**

Um screensaver vivo e persistente que funciona como espaço emocional de acolhimento.

2.

**Fluxo do memorial (/inicio → confirmação)**

Jornada guiada de homenagem, escolha da instituição e conclusão via PIX simbólico.

Essas duas experiências compartilham:

* identidade visual;
* direção emocional;
* linguagem;
* ritmo;
* paleta.

O usuário não deve perceber ruptura entre elas.

---

# Stack e Arquitetura

Framework principal:

* TanStack Start v1
* React 19
* Vite 7

Roteamento:

* file-based routing
* `src/routes/`

Sem backend.

Sem chamadas externas.

Sem persistência remota.

Toda experiência é local e simulada.

Arquitetura baseada em:

* composição;
* simplicidade;
* determinismo;
* baixo acoplamento.

Evitar:

* dependências desnecessárias;
* soluções pesadas;
* abstrações excessivas.

Preferir:

* React Context;
* composição de componentes;
* utilitários pequenos;
* separação clara de responsabilidades.

---

# Estrutura Geral do Projeto

Organização esperada:

```txt
src/
  routes/
  components/
  lib/
  data/
  styles.css
```

Separação clara:

```txt
routes
→ navegação

components
→ UI reutilizável

lib
→ lógica e estado

data
→ catálogo e modelos
```

---

# Estilo e CSS

Utilizar:

Tailwind CSS v4

via:

```txt
@import
```

em:

```txt
src/styles.css
```

Não usar CSS inline arbitrário.

Preferir:

* utility classes;
* tokens semânticos;
* composição via Tailwind.

Nunca usar:

* cores hardcoded;
* hex;
* rgb;
* hsl literal em componentes.

Toda cor vem do design system.

---

# Tipografia

Importar via Google Fonts em:

```txt
styles.css
```

Famílias:

### Serif

Cormorant Garamond

Uso:

* h1
* h2
* h3
* títulos emocionais
* frases contemplativas

Personalidade:

* elegante;
* memorial;
* clássica;
* humana.

### Sans

Mulish

Uso:

* corpo;
* botões;
* explicações;
* navegação.

Personalidade:

* leve;
* legível;
* contemporânea.

Combinação deve transmitir:

tradição + clareza.

---

# Direção Visual

O projeto inteiro compartilha uma linguagem visual única.

Não criar:

* visual corporativo;
* dashboard;
* material design rígido;
* e-commerce;
* UI tecnológica.

A linguagem deve parecer:

uma ilustração delicada transformada em interface.

Características:

* orgânica;
* refinada;
* silenciosa;
* contemplativa.

Elementos:

* sombras suaves;
* linhas finas;
* bordas generosas;
* profundidade sutil;
* transparências delicadas.

Nada excessivamente geométrico ou duro.

---

# Paleta

Baseada em neutros quentes.

Tokens definidos em:

```txt
:root
```

Usar:

### Base

```txt
--background
```

bege / areia claro.

### Primária

```txt
--primary
```

dusty rose.

Rosé empoeirado e suave.

### Secundária

```txt
--secondary
```

areia quente.

### Accent

```txt
--accent
```

rosé claro.

### Apoio

```txt
--sage
--rose
--taupe
```

Todos suaves.

Evitar:

* saturação alta;
* azul vibrante;
* verde forte;
* contraste agressivo.

A cena inteira deve compartilhar a mesma temperatura cromática.

---

# Tokens Visuais

Sombras:

```txt
--shadow-soft
--shadow-card
```

Baseadas em:

```txt
--taupe
```

Raio global:

```txt
--radius: 1rem
```

Preferir:

* rounded-3xl
* rounded-full

Interface deve parecer:

tocável e gentil.

---

# Botões

Primários:

```txt
rounded-full
bg-primary
py-6
text-2xl
text-primary-foreground
shadow-soft
```

Interação:

```txt
hover:brightness-105
active:scale-[0.99]
transition-all
duration-500
```

Sensação:

resposta tátil suave.

Nunca agressiva.

---

# Cards

Padrão:

```txt
rounded-3xl
border border-border/70
bg-card/80
shadow-soft
backdrop-blur
```

Hover:

```txt
hover:-translate-y-1.5
hover:shadow-card
transition-all
duration-500
```

Movimento sutil.

Nunca parecer botão tecnológico.

---

# Padrões de Movimento

Animação é parte da identidade emocional.

Sempre:

* lenta;
* suave;
* respirando.

Utilitários:

```txt
animate-rise
animate-gentle-fade
animate-float-slow
```

Evitar:

* bounce;
* elastic;
* overshoot;
* movimentos abruptos.

O sistema deve parecer:

calmo.

---

# Filosofia das Transições

Duração padrão:

```txt
500–700ms
```

Em elementos contemplativos:

```txt
800–1200ms
```

Easing:

suave.

Transições devem sugerir:

* passagem;
* continuidade;
* cuidado.

Nunca pressa.

---

# Root e Providers

Root:

```txt
src/routes/__root.tsx
```

Usar:

```ts
createRootRouteWithContext<{ queryClient }>()
```

Shell:

```txt
RootShell
```

Estrutura:

```html
<html>
<head>
<HeadContent />
</head>
<body>
{children}
<Scripts />
</body>
</html>
```

Providers:

```txt
QueryClientProvider
→ HomenagemProvider
→ Outlet
```

Também implementar:

* notFoundComponent
* errorComponent

Error component:

* mensagem suave;
* botão "Tentar novamente";
* `router.invalidate()`
* `reset()`.

O sistema deve falhar com elegância.

---

# Filosofia da Experiência

O projeto não é apenas um formulário.

É uma experiência memorial.

Cada tela deve parecer:

um gesto sendo construído.

O usuário deve sentir:

* calma;
* acolhimento;
* significado.

A interface nunca deve disputar atenção com a intenção emocional do gesto.
