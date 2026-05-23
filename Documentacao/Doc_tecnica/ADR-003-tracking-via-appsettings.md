# ADR-003 — IDs de Tracking via `appsettings.json` e Variáveis de Ambiente

| Campo | Valor |
|---|---|
| **ID** | ADR-003 |
| **Status** | Aceito |
| **Data** | 2026-05 |
| **Autor** | Hush Parallel Solutions |
| **Decisores** | Time de desenvolvimento |

---

## Contexto

O site integra três plataformas de rastreamento para mensuração de campanhas pagas:

- **Google Tag Manager (GTM)** — container de tags, injetado no `<head>`
- **Meta Pixel** — rastreamento de conversões para Meta Ads (Facebook/Instagram)
- **Google Ads Conversion Tracking** — mensuração de retorno de campanhas Google

Cada plataforma exige um identificador único (ID) que é inserido no HTML da página. Esses IDs não são segredos de segurança críticos (não concedem acesso a dados privados), mas sua gestão precisa seguir boas práticas por três razões:

1. **Separação de ambientes:** IDs de teste (usados em desenvolvimento) não devem disparar eventos em plataformas de produção, contaminando relatórios de campanhas reais.
2. **Manutenibilidade:** IDs podem mudar (troca de conta de anúncios, novo cliente, reestruturação). Uma alteração de ID não deve exigir um commit de código.
3. **Repositório limpo:** IDs hardcoded no HTML ficam expostos no histórico do Git e em qualquer fork ou clone do repositório.

---

## Problema

> Como injetar os IDs de rastreamento no `_Layout.cshtml` de forma que sejam configuráveis por ambiente, sem exigir alterações de código a cada mudança, e sem expô-los diretamente no repositório como strings literais?

---

## Alternativas Consideradas

### 1. Hardcoded no HTML (`_Layout.cshtml`)

Inserir os IDs diretamente como strings literais no template Razor. Simples, sem configuração adicional. Porém os IDs ficam no histórico do Git para sempre, não há separação de ambientes, e qualquer alteração de ID exige um commit.

**Descartado:** viola separação de ambientes e polui o repositório com dados de configuração.

### 2. Variáveis de ambiente lidas diretamente com `Environment.GetEnvironmentVariable()`

Chamar `Environment.GetEnvironmentVariable("GTM_ID")` diretamente no Razor. Funciona, mas bypassa o sistema de configuração nativo do ASP.NET Core (`IConfiguration`), que já unifica `appsettings.json`, variáveis de ambiente, secrets e outros providers em uma única interface.

**Descartado:** vai contra o padrão idiomático do ASP.NET Core sem oferecer vantagens.

### 3. `appsettings.json` + injeção via `IConfiguration` ✅

Centralizar os IDs em `appsettings.json` com valores placeholder e injetá-los no `_Layout.cshtml` via `@inject IConfiguration Config`. Em produção, as variáveis de ambiente do Railway com a convenção `Seção__Chave` sobrescrevem automaticamente os valores do JSON sem nenhum código adicional.

**Aceito.**

---

## Decisão

Usar o sistema de configuração nativo do ASP.NET Core (`IConfiguration`) para gerenciar todos os IDs de tracking. Os valores ficam em `appsettings.json` como placeholders e são sobrescritos por variáveis de ambiente em produção.

---

## Implementação

### `appsettings.json`

```json
{
  "Tracking": {
    "GoogleTagManagerId": "GTM-XXXXXXX",
    "MetaPixelId": "XXXXXXXXXXXXXXXXX",
    "GoogleAdsConversionId": "AW-XXXXXXXXX",
    "GoogleAdsConversionLabel": "XXXXXXXXXXXX"
  }
}
```

### `_Layout.cshtml` — injeção

```csharp
@inject Microsoft.Extensions.Configuration.IConfiguration Config
```

Uso no template:

```html
<!-- GTM -->
j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
// onde i = '@Config["Tracking:GoogleTagManagerId"]'

<!-- Meta Pixel -->
fbq('init','@Config["Tracking:MetaPixelId"]');

<!-- Google Ads -->
gtag('config','@Config["Tracking:GoogleAdsConversionId"]');
```

### Variáveis de ambiente no Railway (produção)

O ASP.NET Core converte automaticamente `__` (duplo sublinhado) em separador de seção hierárquica. Portanto:

| Variável de Ambiente | Sobrescreve |
|---|---|
| `Tracking__GoogleTagManagerId` | `appsettings.json > Tracking > GoogleTagManagerId` |
| `Tracking__MetaPixelId` | `appsettings.json > Tracking > MetaPixelId` |
| `Tracking__GoogleAdsConversionId` | `appsettings.json > Tracking > GoogleAdsConversionId` |
| `Tracking__GoogleAdsConversionLabel` | `appsettings.json > Tracking > GoogleAdsConversionLabel` |

Nenhuma alteração de código é necessária — o Railway injeta as variáveis no processo e o ASP.NET Core as lê automaticamente no startup.

---

## Consequências

### Positivas

- IDs reais nunca aparecem no código-fonte ou no histórico do Git.
- Troca de IDs (novo cliente, nova conta de anúncios) é feita no painel do Railway em segundos, sem commit.
- Ambiente de desenvolvimento usa placeholders — nenhum evento falso contamina relatórios de produção.
- Padrão idiomático do ASP.NET Core: qualquer desenvolvedor .NET reconhece o padrão imediatamente.
- Extensível: adicionar novos IDs (ex.: Hotjar, TikTok Pixel) segue exatamente o mesmo padrão.

### Negativas / Trade-offs

- Requer que os IDs reais sejam configurados manualmente no Railway antes de ativar campanhas (etapa operacional, não técnica).
- `@inject IConfiguration` no Razor é uma dependência de infraestrutura no template de apresentação — aceitável neste contexto dado que o layout é o único lugar onde os IDs precisam ser injetados.

---

## Arquivos Relacionados

- `RodriguesJr.Web/appsettings.json` — Valores de configuração com placeholders
- `RodriguesJr.Web/Pages/Shared/_Layout.cshtml` — Template que injeta e usa os IDs
- [Guia de Deploy — Railway](./guia-deploy-railway.md) — Instruções de como configurar as variáveis em produção
