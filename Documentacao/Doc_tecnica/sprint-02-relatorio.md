# Relatório de Sprint 02 — Migração e Produção

| Campo | Valor |
|---|---|
| **Sprint** | 02 |
| **Período** | Maio de 2026 |
| **Status** | Concluída ✅ |
| **Equipe** | Hush Parallel Solutions |

---

## Objetivo da Sprint

Elevar o site de um MVP estático (Sprint 01) a um produto de produção completo: multi-página, rastreamento de campanhas integrado, acessibilidade, SEO avançado e infraestrutura de deploy automatizado.

---

## Contexto de Partida

Ao início desta sprint, o projeto possuía:

- Único arquivo `index.html` + `style.css` (pasta `Code/`)
- Apenas a landing de Direito Criminal
- Sem rastreamento
- Sem deploy automatizado
- Sem sistema de temas ou acessibilidade
- Servido como site estático puro

---

## Entregas

### 1. Migração para ASP.NET Core Razor Pages (.NET 10)

A decisão e o racional completo estão em [ADR-001](./ADR-001-migracao-static-para-aspnet.md). Em termos de execução:

- Criação do projeto `RodriguesJr.Web` com `dotnet new razor`
- Portagem do HTML/CSS existente para `_Layout.cshtml` + `Index.cshtml`
- Configuração do `Program.cs` com leitura de `PORT` e desativação condicional do HTTPS redirect
- Adição do `appsettings.json` com estrutura de tracking e contato
- Injeção de `IConfiguration` no layout via `@inject`

### 2. Nova Landing Page — Direito de Família (`/familia`)

- Criação de `Familia.cshtml` + `Familia.cshtml.cs`
- Copy e posicionamento distintos da landing Criminal
- Hero com overlay de cor diferenciada (`.familia-hero-overlay`)
- Stats bar com contadores animados (`data-target`, ativados via `IntersectionObserver`)
- 6 áreas de atuação: Divórcio, Guarda e Convivência, Pensão Alimentícia, Inventário, Dissolução de União Estável, Planejamento Sucessório
- 6 FAQs específicos para o contexto familiar
- Navegação cruzada entre as duas verticais no menu lateral

### 3. Sistema de Rastreamento

- **Google Tag Manager:** container injetado no `<head>` e `<body>` (noscript fallback)
- **Meta Pixel:** `fbq('init', ...)` e `fbq('track', 'PageView')` em todas as páginas
- **Google Ads:** `gtag('config', ...)` para mensuração de conversões
- **GTM Events:** atributos `data-gtm-event` nos principais CTAs de ambas as páginas, com push automático para `window.dataLayer` via `site.js`
- IDs externalizados para `appsettings.json` (ver [ADR-003](./ADR-003-tracking-via-appsettings.md))

### 4. Acessibilidade e Experiência do Usuário

- **Sistema de temas:** dark (padrão), light e high-contrast (`data-theme` no `<html>`)
- **Controle de font-size:** 4 níveis (sm, md, lg, xl) via `data-font`
- **Popup de acessibilidade:** ativado por botão fixo, com trap de foco e backdrop
- **Anti-flash script:** aplica tema antes do render para evitar flash de tema errado
- **Skip link:** `<a href="#main-content">` para navegação por teclado
- **Barra de progresso de scroll:** indicador visual de posição na página
- **Botão WhatsApp flutuante:** presente em todas as páginas com label visível
- **aria-* completo:** `aria-expanded`, `aria-label`, `aria-hidden` em todos os elementos interativos

### 5. SEO e Dados Estruturados

- Meta `<title>` e `<description>` individuais por página via `ViewData`
- `<link rel="canonical">` por página
- Open Graph (`og:title`, `og:description`, `og:image`, `og:url`) em todas as páginas
- Twitter Cards (`twitter:card`, `twitter:title`, etc.)
- Schema.org `LegalService` (JSON-LD) no `_Layout.cshtml`
- `lang="pt-BR"` no `<html>`
- `<meta name="robots" content="index, follow">`

### 6. Frontend — Animações e Interações

- **AOS (Animate on Scroll) v2.3.4:** animações `fade-right`, `fade-left`, `fade-up` com delays escalonados nos grids
- **FAQ Accordion:** abertura/fechamento com animação CSS e atualização de `aria-expanded`
- **Menu mobile:** toggle com backdrop, fecha ao clicar fora do painel
- **Ripple effect:** feedback visual em botões `.btn` ao clique
- **Contadores animados:** `IntersectionObserver` ativa a contagem ao entrar na viewport (página Família)
- **Scroll progress bar:** largura calculada em função de `scrollTop / scrollHeight`

### 7. Infraestrutura de Deploy

- `railway.toml` com builder Nixpacks, healthcheck em `/`, restart policy
- `global.json` pinando SDK 10.0.x com `rollForward: latestMinor`
- `Dockerfile` multi-stage como alternativa de ejeção
- Deploy automático a partir de push no Git
- Domínio customizado `rodriguesjr.adv.br` com TLS automático

---

## Issues Identificadas e Contornos

| Issue | Contorno Aplicado |
|---|---|
| Railway encerra TLS no proxy — `UseHttpsRedirection` causaria loop | Desativado em produção com `if (app.Environment.IsDevelopment())` |
| IDs de tracking não devem estar no repositório | Externalizados para `appsettings.json` + env vars do Railway |
| Flash de tema errado no carregamento | Script anti-flash inline no `<head>` antes de qualquer CSS |
| Cache de CSS/JS em browsers | Cache busting manual via query string `?v=3` |

---

## Métricas da Sprint

| Item | Valor |
|---|---|
| Páginas entregues | 2 (`/` e `/familia`) |
| Arquivos de código criados | 7 (Pages + Layout + Program + csproj + appsettings + CSS + JS) |
| Arquivos de infraestrutura | 3 (railway.toml + global.json + Dockerfile) |
| GTM events mapeados | 14 (7 por página) |
| FAQs documentados | 12 (6 por página) |
| Áreas de atuação documentadas | 10 (4 Criminal + 6 Família) |

---

## Estado Final da Sprint

O site está em produção, acessível em `rodriguesjr.adv.br`, com ambas as landing pages no ar. A única etapa operacional pendente antes de ativar campanhas é a inserção dos IDs reais de rastreamento nas variáveis de ambiente do Railway.

---

## Referências

- [ADR-001 — Migração ASP.NET](./ADR-001-migracao-static-para-aspnet.md)
- [ADR-002 — Railway](./ADR-002-deploy-railway-nixpacks.md)
- [ADR-003 — Tracking](./ADR-003-tracking-via-appsettings.md)
- [Sprint 01](./sprint-01-relatorio.md) — contexto do MVP anterior
