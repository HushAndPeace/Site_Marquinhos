# Estrutura e Componentes — Referência Técnica

**Tipo:** Referência  
**Público:** Desenvolvedor  
**Última atualização:** Maio de 2026

---

## Árvore de Diretórios

```
Site_Marquinhos/
│
├── Code/                                  # ① MVP histórico — arquivado
│   ├── index.html
│   └── style.css
│
├── RodriguesJr.Web/                       # ② Aplicação atual
│   ├── Pages/
│   │   ├── Index.cshtml                   # Landing — Direito Criminal
│   │   ├── Index.cshtml.cs                # PageModel — Criminal
│   │   ├── Familia.cshtml                 # Landing — Direito de Família
│   │   ├── Familia.cshtml.cs              # PageModel — Família
│   │   ├── Shared/
│   │   │   └── _Layout.cshtml             # Shell HTML global
│   │   ├── _ViewImports.cshtml            # Namespaces e tag helpers globais
│   │   └── _ViewStart.cshtml              # Define _Layout como layout padrão
│   ├── wwwroot/
│   │   ├── css/
│   │   │   └── site.css                   # Estilos + sistema de temas
│   │   ├── js/
│   │   │   └── site.js                    # Interações e acessibilidade
│   │   └── images/                        # Assets visuais
│   │       ├── logo.jpeg
│   │       ├── logo.png
│   │       ├── logo-transparente.png      # Logo para header fixo
│   │       ├── hero-bg.png                # Background do hero
│   │       ├── advogado-mesa.png          # Foto principal (mesa)
│   │       └── advogado-tel.png           # Foto secundária (telefone)
│   ├── Program.cs                         # Entrada da aplicação
│   ├── appsettings.json                   # Configurações (tracking, contato)
│   └── RodriguesJr.Web.csproj             # Definição do projeto .NET
│
├── Documentacao/
│   ├── Doc_tecnica/                       # Documentação técnica
│   └── Doc_executiva/                     # Documentação executiva
│
├── Dockerfile                             # Build multi-stage alternativo
├── railway.toml                           # Configuração declarativa Railway
└── global.json                            # Pin de versão do SDK .NET
```

---

## Componentes — Responsabilidades

### `_Layout.cshtml` — Shell global

É o único arquivo que gera o HTML completo. Todos os Razor Pages renderizam apenas o corpo (`@RenderBody()`) dentro deste shell.

**Responsabilidades:**

- Injetar `IConfiguration` para leitura dos IDs de tracking
- Renderizar `<head>` com metadados dinâmicos (`ViewData["Title"]`, `ViewData["MetaDescription"]`, `ViewData["Canonical"]`)
- Incluir Google Fonts (Cormorant Garamond + Manrope)
- Incluir AOS CSS e JS
- Script anti-flash (aplica tema antes do render para evitar flash de tema errado)
- Google Tag Manager (head + body noscript)
- Meta Pixel
- Google Ads Conversion script
- Estrutura acessível: skip link, barra de progresso de scroll
- Popup de acessibilidade (tema + tamanho de fonte)
- Botão WhatsApp flutuante
- Schema.org `LegalService` (JSON-LD)
- Referência ao `site.css?v=3` e `site.js?v=3` com cache busting manual

**ViewData esperado por cada página:**

| Chave | Obrigatório | Exemplo |
|---|---|---|
| `ViewData["Title"]` | Sim | `"Rodrigues Jr. | Advocacia Criminal..."` |
| `ViewData["MetaDescription"]` | Sim | `"Defesa criminal técnica..."` |
| `ViewData["Canonical"]` | Sim | `"https://rodriguesjr.adv.br/"` |

---

### `Index.cshtml` — Landing Direito Criminal

**Seções (em ordem vertical):**

| Seção | ID / Classe | Conteúdo |
|---|---|---|
| Cabeçalho | `.logo-fixed`, `.side-nav` | Logo, menu lateral, toggle mobile |
| Hero | `.hero` | H1 NLP, CTA WhatsApp, foto do advogado |
| Pilares | `.stats-bar` | 4 diferenciais (24h, STJ, 1:1, §) |
| Sobre | `#sobre` | Texto da banca + foto secundária |
| Diferenciais | `.dark-section` | Grid 4 cards com ícones SVG |
| Atuação | `#atuacao` | Grid 6 cards de especialidades |
| Como Funciona | `#como-funciona` | 3 steps com conectores |
| FAQ | `#faq` | 6 perguntas accordion |
| Contato/Footer | `#contato` | Dados de contato + copyright |

**GTM events configurados:**
`hero_whatsapp_criminal`, `sobre_cta_criminal`, `atuacao_cta_criminal`, `como_funciona_cta`, `faq_cta_criminal`, `footer_whatsapp_criminal`, `footer_email_criminal`, `wa_float_click`

---

### `Familia.cshtml` — Landing Direito de Família

Estrutura idêntica à Criminal com conteúdo adaptado à vertical de Família. Diferenciais visuais:

- Hero overlay: `.familia-hero-overlay` (cor distinta da Criminal)
- Stats bar: contadores animados (`data-target`) em vez dos badges estáticos
- Cards: classe `.card-familia` para estilo diferenciado
- 6 áreas de atuação: Divórcio, Guarda, Pensão, Inventário, União Estável, Planejamento Sucessório

**GTM events configurados:**
`hero_whatsapp_familia`, `sobre_cta_familia`, `areas_cta_familia`, `como_funciona_cta_familia`, `faq_cta_familia`, `footer_whatsapp_familia`, `footer_email_familia`

---

### `site.js` — Interações e Acessibilidade

**Módulos internos (IIFE auto-invocada):**

| Módulo | Função |
|---|---|
| Tema | Lê/salva `rj_theme` no `localStorage`. Aplica `data-theme` ao `<html>`. Escuta mudança de tema do SO. |
| Font size | Lê/salva `rj_font` no `localStorage`. Aplica `data-font` ao `<html>`. |
| Popup a11y | Abre/fecha modal de acessibilidade. Captura foco (trap focus). |
| Scroll progress | Atualiza largura da barra `#scrollProgress` em função do scroll. |
| Side nav | Toggle do menu mobile com backdrop. Fecha ao clicar fora. |
| FAQ accordion | Abre/fecha itens `.faq-item`, atualiza `aria-expanded`. |
| AOS | Inicializa `AOS.init()` com configuração padrão. |
| Contadores | Anima `data-target` nos `.stat-number` da página Família via `IntersectionObserver`. |
| Ripple | Efeito de onda em botões `.btn` ao clique. |
| GTM Push | Empurra eventos para `window.dataLayer` ao clicar em elementos com `data-gtm-event`. |

---

### `site.css` — Estilos e Temas

Organização por camadas:

1. **CSS Custom Properties** — variáveis de cor, tipografia e espaçamento para cada tema (`[data-theme="dark"]`, `[data-theme="light"]`, `[data-theme="hc"]`)
2. **Reset e base** — box-sizing, body, tipografia base
3. **Layout** — `.container`, `.split-layout`, `.grid-cards`, `.steps-grid`
4. **Componentes** — `.btn`, `.card`, `.faq-item`, `.stat-item`, `.step-item`
5. **Seções** — `.hero`, `.stats-bar`, `.sobre-section`, `.footer`, etc.
6. **Acessibilidade** — `.a11y-modal`, `.a11y-trigger`, `.skip-link`
7. **Utilitários** — `.shadow-lg`, `.gold-text`, `.relative-z`
8. **Media queries** — breakpoints para mobile (max-width: 768px e 480px)

Cache busting manual: `site.css?v=3` e `site.js?v=3` — incrementar o número a cada atualização de asset para forçar recarga nos browsers dos visitantes.

---

### `Program.cs` — Bootstrap

```csharp
// Lê PORT injetada pelo Railway (padrão: 8080)
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// HTTPS redirect apenas em Development (Railway encerra TLS no proxy)
if (app.Environment.IsDevelopment())
    app.UseHttpsRedirection();
```

Pipeline de middleware: `ExceptionHandler → StaticFiles → Routing → Authorization → MapRazorPages`

---

### `appsettings.json` — Configuração

Duas seções principais:

- `Tracking` — IDs das plataformas de anúncios (sobrescritos por env vars em produção)
- `Contact` — WhatsApp e e-mail do escritório

Ver [ADR-003](./ADR-003-tracking-via-appsettings.md) para o racional desta estrutura.

---

### `Dockerfile` — Build Alternativo

Build multi-stage:

1. `mcr.microsoft.com/dotnet/sdk:10.0` — compila e publica
2. `mcr.microsoft.com/dotnet/aspnet:10.0` — apenas runtime, imagem final menor

Usado como plano de ejeção do Railway ou para containers locais. A variável `PORT` é lida via `ENV ASPNETCORE_URLS=http://+:${PORT:-8080}`.

---

### `railway.toml` — Deploy Declarativo

```toml
[build]
builder = "nixpacks"          # Detecta .NET automaticamente via .csproj

[deploy]
healthcheckPath = "/"         # Verifica GET / antes de ativar o container
healthcheckTimeout = 30       # 30 segundos para responder
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3
```

---

### `global.json` — Pin de SDK

```json
{ "sdk": { "version": "10.0.0", "rollForward": "latestMinor" } }
```

Garante que o Nixpacks instale exatamente o SDK 10.0.x, permitindo patches mas não saltos de versão minor.

---

## Referências Cruzadas

- [README](./README.md) — visão geral e como rodar localmente
- [ADR-001](./ADR-001-migracao-static-para-aspnet.md) — por que ASP.NET Core
- [ADR-002](./ADR-002-deploy-railway-nixpacks.md) — por que Railway
- [ADR-003](./ADR-003-tracking-via-appsettings.md) — por que IConfiguration para tracking
- [Guia de Deploy](./guia-deploy-railway.md) — passo a passo de produção
