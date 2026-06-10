# MASTER PROMPT — MEMÓRIA & CUIDADO

## Parte 3 — Fluxo Final, Pagamento, Conclusão e UX

# /painel — Mural da Memória

Esta etapa existe apenas quando:

```ts id="k2jv2d"
homenagem.requerFotos === true
```

Atualmente:

```txt id="3wjlwm"
Mural da Memória
```

StepBar:

```txt id="9m84eh"
1
```

Back:

```txt id="n0vf7g"
/catalogo
```

Tela deve transmitir:

* lembrança;
* afeto;
* memória compartilhada.

Nunca parecer upload corporativo.

---

# Cálculo do Memorial

Usar:

```ts id="j2t8dq"
restantes =
LIMITE_FOTOS
-
fotosExistentes
-
fotos.length
```

Banner central:

afetuoso e contextual.

Mensagem:

Se houver espaço:

> Este memorial possui {fotosExistentes} lembranças registradas. Ainda é possível adicionar mais {restantes} {foto|fotos}.

Se cheio:

mensagem respeitosa.

Nunca alarmista.

---

# Polaroid Wall

Layout:

```txt id="2xxg1o"
flex
flex-wrap
items-start
justify-center
gap-7
```

Cada foto:

Polaroid.

Visual:

```txt id="x2nq8t"
w-52
bg-card
p-3
pb-4
shadow-card
```

Rotação:

cíclica.

Array:

```ts id="1sbjlwm"
[
"-2.5deg",
"1.8deg",
"-1.2deg",
"2.2deg",
"-2deg",
"1.4deg"
]
```

Aplicada por índice.

Objetivo:

parede de lembranças.

Não grid rígido.

---

# Foto

Imagem:

```txt id="h0jlwm"
aspect-square
object-cover
```

Alt significativo.

Sempre.

---

# Remover Foto

Botão:

canto superior.

Ícone:

X.

Necessário:

```txt id="7xjlwm"
aria-label
```

Feedback:

suave.

Nunca destrutivo.

---

# Legendas

Abaixo da foto.

Input:

centralizado.

Limite:

```ts id="b7qf1e"
40 caracteres
```

Visual:

* serif;
* itálico;
* delicado.

Tom:

lembrança breve.

---

# Reordenação

Hover:

mostra:

* ArrowLeft
* ArrowRight

Com:

transição suave.

Como existe toque:

equivalente acessível também.

Sem dependência exclusiva de hover.

---

# Adicionar Fotos

Tile final:

tracejado.

Texto:

> Adicionar fotos

Abre:

```html id="gm5s86"
<input type="file">
```

invisível.

Configuração:

```txt id="72jlje"
accept="image/*"
multiple
```

Arquivos:

viram:

```ts id="6tjlwm"
FotoMemorial
```

com:

```ts id="9l7wfd"
URL.createObjectURL()
```

---

# Confirmação do Painel

Botão:

```txt id="s7jl8h"
Confirmar mural
```

Desabilitado:

se:

```ts id="xh8w0n"
fotos.length === 0
```

Ao confirmar:

segue:

```txt id="b6jlwm"
/instituicoes-escolha
```

---

# /instituicoes-escolha

StepBar:

```txt id="n1jw4k"
2
```

Back:

```txt id="ukl3f6"
/catalogo
```

Tela:

escolha da causa.

Não ONG como produto.

Mensagem deve transmitir:

destino solidário.

---

# Cabeçalho

Título:

> Para qual causa?

Subtítulo:

explica que:

100%

da contribuição

é destinada à instituição.

Tom:

transparente e sereno.

---

# Lista das Instituições

Layout:

empilhado.

Cada item:

botão-card grande.

Conteúdo:

* nome
* causa
* descrição

Nome:

serif.

Causa:

```txt id="u5jlwm"
text-primary/80
```

---

# Estado Selecionado

Quando:

```ts id="t8p1tf"
ong?.id === o.id
```

Aplicar:

```txt id="xwqjjlwm"
border-primary
ring-2
ring-primary/30
```

Indicador:

check preenchido.

Visual:

círculo com:

```txt id="5txjlwm"
bg-primary
text-primary-foreground
```

---

# Estado Inativo

Check:

transparente.

Hover:

elevação sutil.

Nunca chamativo.

---

# Continuação

Botão:

```txt id="s9jlwm"
Continuar
```

Desabilitado:

até ONG escolhida.

Segue:

```txt id="5jlwm1"
/pagamento
```

---

# /pagamento

StepBar:

continua:

```txt id="1jlwm7"
2
```

Back:

```txt id="0jlwm3"
/instituicoes-escolha
```

Tela:

conclusão do gesto.

Não parecer checkout.

Não parecer gateway financeiro.

---

# Conteúdo

Centralizado.

Título:

> Conclua sua homenagem

Texto:

> Aponte a câmera do seu celular para o código abaixo.

Tom:

simples.

---

# PIX Simulado

Sem backend.

Sem pagamento real.

QR:

decorativo.

Card:

```txt id="jlwm9p"
shadow-card
```

Grid:

```txt id="0mjlwm"
8×8
```

Fórmula:

determinística.

Exemplo:

```ts id="a2njlwm"
(i*7 + i%5 + i%3) % 3 === 0
```

Célula:

preenchida ou transparente.

Nunca aleatória.

---

# Valor

Rótulo:

> Pagamento via PIX

Valor:

serif grande.

Cor:

```txt id="jlwm8r"
--primary
```

Formato:

BRL.

Sempre:

```txt id="jlwm2x"
R$ 120,00
```

Nunca:

```txt id="jlwm7s"
120.00
```

---

# Resumo

Card:

```txt id="q1jlwm"
bg-muted/60
```

Mostrar:

* homenagem
* instituição

Resumo silencioso.

---

# Confirmação

Botão:

> Já realizei a contribuição

Segue:

```txt id="jlwm4v"
/confirmacao
```

Sem validação.

Sem backend.

---

# /confirmacao

Tela final.

Sem:

* voltar;
* início.

Configuração:

```tsx id="jlwm0n"
showHome={false}
```

Atmosfera:

agradecimento.

Encerramento gentil.

---

# Ícone Principal

Usar:

```txt id="8jlwmk"
Flower
```

Dentro:

círculo.

Visual:

```txt id="6jlwmq"
bg-accent/60
```

Movimento:

```txt id="2jlwmw"
animate-float-slow
```

9s.

Ease-in-out.

Infinito.

---

# Texto Principal

h1:

> Sua homenagem foi registrada com carinho.

Parágrafo:

Condicional.

Se:

```ts id="7jlwmm"
requerFotos && fotos.length > 0
```

Mostrar:

> Seu painel memorial será preparado com carinho.

Senão:

> Agradecemos por transformar memória em cuidado.

---

# Card Resumo

Título:

> Resumo

Listar:

* homenagem
* modelo
* lembranças
* instituição
* mensagem

Mensagem:

itálico.

Aspas tipográficas.

Exemplo:

> “Com carinho e saudade.”

---

# Encerramento

Botão:

> Concluir

Executa:

```ts id="9jlwmr"
reset()
navigate("/")
```

---

# Auto Reset

Implementar:

```ts id="1jlwmc"
useEffect
+
setTimeout
```

Tempo:

```txt id="3jlwmz"
20s
```

Executa:

```ts id="5jlwmn"
reset()
navigate("/")
```

Cleanup:

obrigatório.

Evitar:

memory leak.

---

# Responsividade

Projeto pensado para:

totem touch.

Mas:

funcional em:

* mobile
* tablet
* desktop

---

# Área de Toque

Targets:

mínimo:

```txt id="2jlwmu"
56px
```

Botões:

grandes.

Confortáveis.

---

# Foco

Manter:

focus visible.

Nunca remover.

---

# Hover

Nunca obrigatório.

Toda ação importante:

equivalente tocável.

---

# Imagens

Sempre:

```txt id="0jlwmf"
loading="lazy"
```

e:

```txt id="7jlwmx"
alt
```

significativo.

---

# Padrões de Feedback

Hover:

```txt id="1jlwmv"
translate-y
shadow
```

Sutil.

Active:

```txt id="4jlwmh"
scale
```

Leve.

Nada abrupto.

---

# Filosofia do Fluxo

O usuário não está:

comprando.

Está:

prestando homenagem.

A interface deve acompanhar isso.

Cada etapa:

parece um gesto sendo cuidadosamente conduzido.

O sistema deve desaparecer atrás da intenção emocional.
