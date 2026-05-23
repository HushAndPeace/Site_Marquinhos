# ADR-001 — Migração de HTML Estático para ASP.NET Core Razor Pages

| Campo | Valor |
|---|---|
| **ID** | ADR-001 |
| **Status** | Aceito |
| **Data** | 2026-05 |
| **Autor** | Hush Parallel Solutions |
| **Decisores** | Time de desenvolvimento |

---

## Contexto

O projeto foi iniciado como uma prova de conceito rápida: um único arquivo `index.html` com `style.css` correspondente, servido como site estático. Essa abordagem (arquivada em `Code/`) cumpriu o papel de validar o layout e o posicionamento da marca antes da virada para produção.

À medida que os requisitos cresceram, surgiram limitações claras do modelo estático:

- **Rastreamento:** Era necessário injetar IDs do GTM, Meta Pixel e Google Ads de forma segura — sem expô-los hardcoded no repositório público.
- **Múltiplas verticais:** O cliente opera em Direito Criminal e Direito de Família. Uma segunda landing page (`/familia`) precisava ser criada com layout e conteúdo distintos, mas compartilhando o mesmo shell visual (`_Layout.cshtml`).
- **SEO dinâmico:** Cada página precisa de `<title>`, `<meta description>` e `<link rel="canonical">` próprios — impraticável de manter sem templating.
- **Manutenibilidade:** Duplicar HTML inteiro a cada nova landing seria insustentável.

---

## Problema

> Como estruturar o site para suportar múltiplas landing pages com SEO individual, rastreamento configurável por ambiente e compartilhamento de layout sem duplicação de código?

---

## Alternativas Consideradas

### 1. Continuar com HTML estático + includes via JavaScript

Usar `fetch` para carregar partes comuns (header, footer) em JavaScript. Rápido de implementar, mas prejudica rastreamento (o GTM/Pixel precisa estar no `<head>` antes do render), quebra SEO em crawlers que não executam JS plenamente, e cria dependência de rede para montar o próprio layout.

**Descartado:** impacto direto em conversão e rastreamento, que são os objetivos primários do site.

### 2. Gerador de site estático (Eleventy, Hugo, Jekyll)

Permite templating sem servidor. Boa performance. Porém exige pipeline de build e publicação de artefatos estáticos, sem suporte nativo a leitura de variáveis de ambiente em runtime — os IDs de tracking precisariam estar no repositório ou em etapa de build, comprometendo segurança.

**Descartado:** não resolve o requisito de configuração segura de IDs sensíveis por ambiente.

### 3. ASP.NET Core Razor Pages (.NET 10) ✅

Framework nativo da plataforma Microsoft, com suporte a `IConfiguration` para leitura de variáveis de ambiente em runtime. Razor Pages é o modelo mais simples do ecossistema ASP.NET para sites orientados a conteúdo (uma página = um arquivo `.cshtml` + um PageModel `.cshtml.cs`). Permite `_Layout.cshtml` compartilhado com `ViewData` para injeção de metadados por página.

**Aceito.**

---

## Decisão

Migrar o site para **ASP.NET Core Razor Pages com .NET 10**, mantendo o HTML/CSS/JS existente como camada de apresentação (sem mudança no frontend visual) e adicionando o servidor como camada de composição e configuração.

---

## Consequências

### Positivas

- IDs de tracking (GTM, Meta Pixel, Google Ads) lidos via `IConfiguration` e injetados no `_Layout.cshtml` em runtime — nunca expostos em código-fonte.
- Layout compartilhado em `_Layout.cshtml` com `ViewData["Title"]`, `ViewData["MetaDescription"]` e `ViewData["Canonical"]` definidos por página.
- Adição de novas verticais (ex.: `/trabalhista`, `/empresarial`) é tão simples quanto criar um novo par `.cshtml` + `.cshtml.cs`.
- Suporte nativo a ambientes (`Development` vs `Production`), permitindo comportamentos diferentes (ex.: HTTPS redirect apenas em dev).
- Ecossistema maduro com suporte LTS da Microsoft.

### Negativas / Trade-offs

- Requer runtime .NET no servidor (não é mais um arquivo HTML). Resolvido pela escolha do Railway com Nixpacks, que detecta e provisiona o runtime automaticamente (ver [ADR-002](./ADR-002-deploy-railway-nixpacks.md)).
- Maior complexidade de setup local (requer .NET SDK instalado).
- Custo de hospedagem levemente superior ao de um CDN de site estático — justificado pela criticidade do rastreamento para o modelo de negócio (tráfego pago).

---

## Arquivos Relacionados

- `RodriguesJr.Web/Program.cs` — Bootstrap, leitura de `PORT`, configuração de middleware
- `RodriguesJr.Web/Pages/Shared/_Layout.cshtml` — Layout compartilhado com injeção de `IConfiguration`
- `RodriguesJr.Web/appsettings.json` — Valores de configuração (substituídos por env vars em produção)
- `Code/` — MVP estático original, mantido como referência histórica
