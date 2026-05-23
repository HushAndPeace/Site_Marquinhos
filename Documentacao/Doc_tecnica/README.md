# Rodrigues Jr. Advogados — Documentação Técnica

**Projeto:** Site de prospecção de clientes via tráfego pago (Google Ads + Meta Ads)  
**Cliente:** Rodrigues Jr. Advogados  
**Desenvolvedor:** Hush Parallel Solutions  
**Domínio:** [rodriguesjr.adv.br](https://rodriguesjr.adv.br)  
**Data de criação:** 2026-05-23

---

## Visão Geral

Site institucional / landing page de alto desempenho para conversão de leads jurídicos. Possui duas rotas principais, cada uma otimizada para uma vertical de serviços distintos, com pixel de rastreamento, GTM e Google Ads integrados para mensuração de campanhas pagas.

| Rota | Vertical | Objetivo |
|---|---|---|
| `/` | Direito Criminal | Plantão 24h, flagrante, HC, STJ |
| `/familia` | Direito de Família | Divórcio, guarda, pensão, inventário |

---

## Stack Tecnológica

| Camada | Tecnologia | Versão |
|---|---|---|
| Runtime | .NET | 10.0 |
| Framework web | ASP.NET Core Razor Pages | 10.0 |
| Frontend | HTML5 + CSS3 + JS vanilla | — |
| Animações | AOS (Animate on Scroll) | 2.3.4 |
| Tipografia | Cormorant Garamond + Manrope | Google Fonts |
| Tracking | Google Tag Manager | via appsettings |
| Conversão | Meta Pixel + Google Ads | via appsettings |
| SEO | Schema.org LegalService + OG + Twitter Cards | — |
| PaaS | Railway | Nixpacks |
| Container | Docker (alternativo) | SDK 10.0 |

---

## Estrutura de Pastas

```
Site_Marquinhos/
├── Code/                          # MVP histórico — HTML/CSS estático (Sprint 1, arquivado)
│   ├── index.html
│   └── style.css
│
├── RodriguesJr.Web/               # Aplicação atual (Sprint 2+)
│   ├── Pages/
│   │   ├── Index.cshtml           # Landing Criminal
│   │   ├── Index.cshtml.cs        # PageModel Criminal
│   │   ├── Familia.cshtml         # Landing Família
│   │   ├── Familia.cshtml.cs      # PageModel Família
│   │   ├── Shared/
│   │   │   └── _Layout.cshtml     # Layout base: head, meta, GTM, Pixel, acessibilidade
│   │   ├── _ViewImports.cshtml    # Importações globais de Razor
│   │   └── _ViewStart.cshtml      # Define _Layout como layout padrão
│   ├── wwwroot/
│   │   ├── css/site.css           # Estilos globais + temas dark/light/HC
│   │   ├── js/site.js             # Interações: tema, font-size, FAQ, AOS, scroll, ripple
│   │   └── images/                # Assets visuais (logos, fotos, hero)
│   ├── Program.cs                 # Bootstrap da aplicação + leitura de PORT
│   ├── appsettings.json           # Configuração: tracking IDs, contato
│   └── RodriguesJr.Web.csproj     # Projeto .NET 10, Razor Pages
│
├── Documentacao/
│   ├── Doc_tecnica/               # Documentação técnica (este README e afins)
│   └── Doc_executiva/             # Documentação executiva para o cliente
│
├── Dockerfile                     # Build multi-stage (alternativo ao Nixpacks)
├── railway.toml                   # Configuração declarativa do Railway
└── global.json                    # Pins do SDK .NET 10 com rollForward: latestMinor
```

---

## Pré-requisitos

Para rodar o projeto localmente:

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) (versão `10.0.0` ou superior minor)
- Git
- Editor de sua preferência (VS Code, Rider, Visual Studio)

Para fazer deploy:

- Conta no [Railway](https://railway.app)
- Acesso ao repositório Git conectado ao projeto Railway

---

## Configuração — `appsettings.json`

O arquivo `appsettings.json` centraliza todos os IDs sensíveis de tracking e os dados de contato. **Nunca commitar IDs reais** — use variáveis de ambiente do Railway em produção (ver [guia de deploy](./guia-deploy-railway.md)).

```json
{
  "Tracking": {
    "GoogleTagManagerId": "GTM-XXXXXXX",
    "MetaPixelId": "XXXXXXXXXXXXXXXXX",
    "GoogleAdsConversionId": "AW-XXXXXXXXX",
    "GoogleAdsConversionLabel": "XXXXXXXXXXXX"
  },
  "Contact": {
    "WhatsAppNumber": "5511987396154",
    "Email": "contato@rodriguesjr.adv.br"
  }
}
```

Os valores são injetados no `_Layout.cshtml` via `@inject IConfiguration Config`, o que permite sobrescrição por variável de ambiente em produção sem alterar o código.

---

## Como Rodar Localmente

```bash
# 1. Clone o repositório
git clone <url-do-repo>
cd Site_Marquinhos

# 2. Acesse o projeto web
cd RodriguesJr.Web

# 3. Configure os IDs locais (opcional para dev)
# Edite appsettings.json com seus IDs de teste ou deixe os placeholders

# 4. Execute
dotnet run

# 5. Acesse
# http://localhost:8080  (porta padrão via variável PORT=8080)
# ou a porta exibida no terminal
```

> **Nota:** Em desenvolvimento, o HTTPS redirect está desativado propositalmente (ver `Program.cs`). O Railway encerra TLS no proxy — redirecionar HTTPS localmente causaria loop em produção.

---

## Como Fazer Deploy

Consulte o [Guia de Deploy no Railway](./guia-deploy-railway.md) para o passo a passo completo, incluindo a configuração das variáveis de ambiente de produção.

---

## Decisões Arquiteturais

As decisões de design mais relevantes estão documentadas como ADRs:

- [ADR-001 — Migração de HTML estático para ASP.NET Core](./ADR-001-migracao-static-para-aspnet.md)
- [ADR-002 — Deploy via Railway e Nixpacks](./ADR-002-deploy-railway-nixpacks.md)
- [ADR-003 — IDs de tracking via appsettings.json](./ADR-003-tracking-via-appsettings.md)

---

## Contato e Suporte

| | |
|---|---|
| **Desenvolvedor** | Hush Parallel Solutions |
| **E-mail do cliente** | contato@rodriguesjr.adv.br |
| **WhatsApp do cliente** | (11) 98739-6154 |
