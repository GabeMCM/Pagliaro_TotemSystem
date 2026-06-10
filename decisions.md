# Registro de Decisões Técnicas (Architecture Decision Records - ADR)

Este documento registra as principais escolhas arquiteturais e de design feitas ao longo do projeto **Memória & Cuidado**, garantindo um histórico do "por que" cada caminho foi escolhido.

## 1. Runtime e Ecossistema Base
**Decisão**: Utilização do **Deno** em vez do Node.js puro.
**Contexto**: O Deno provê uma DX mais robusta e nativa (TypeScript out-of-the-box, linter nativo) e suporta adequadamente ecossistemas npm via `npm:` specifiers.
**Consequência**: O projeto é executado com comandos como `deno install` e `deno run -A npm:vite`, e as configurações de tooling podem ser unificadas em `deno.json`.

## 2. Framework de UI e Roteamento
**Decisão**: **TanStack Start v1**, **React 19** e **Vite 7** (ou versão equivalente latest).
**Contexto**: Embora o projeto seja local e simulado (sem chamadas a um servidor externo remoto), o TanStack Start foi exigido no prompt (`parte1.md`) para gerenciar as rotas baseadas em arquivo de forma estruturada (`src/routes/`), aproveitando sua forte tipagem de rotas e o ecossistema do TanStack Router.
**Consequência**: Inicializamos a estrutura com `app.config.ts`, `server.tsx` e `client.tsx`, usando `@tanstack/start` em vez de criar um SPA puramente no React Vanilla Router. 

## 3. Arquitetura de Dados (Preparação para NoSQL)
**Decisão**: O catálogo estático e os estados simulados serão fundamentados em formato de objeto JSON/documento, apontando os caminhos de imagens e textos estaticamente via strings.
**Contexto**: O usuário requereu que o sistema possua "uma ponta aberta para um banco NoSQL local, na verdade pode ser até um json", focando em escalabilidade.
**Consequência**: Em vez de codar a lógica dependendo massivamente de imports estáticos (`import img from './img.png'`) ou arrays TS fixos, as homenagens e ONGs serão geradas através de uma estrutura de dicionário simples lida de um `.json` local. No futuro, isso permite plugar um RxDB, PouchDB ou Deno KV sem reescrever a UI.

## 4. Estilização e UI
**Decisão**: **Tailwind CSS v4**.
**Contexto**: O design system exige o uso de utility classes com estrito controle sobre a paleta cromática de "Memória & Cuidado".
**Consequência**: O Tailwind foi configurado em modo v4 via `@import "tailwindcss"` no `styles.css`. O uso de cores hardcoded (ex: `#hex` ou `rgb`) no meio dos componentes está proibido; toda cor provém dos tokens (`--background`, `--primary`, `--taupe`, etc).

## 5. Rastreamento de Desenvolvimento
**Decisão**: Sistema de logs rotativos mensais e tracking passivo via Artifacts.
**Contexto**: Introdução da regra `PROGRESS_TRACKING.md`.
**Consequência**: Decisões diárias menores e status de andamento vão para `.history/log_YYYY_MM.md`, enquanto a "Lei" macro do projeto reside em `implementation_plan.md` e aqui neste `decisions.md`.
