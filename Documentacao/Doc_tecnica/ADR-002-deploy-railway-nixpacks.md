# ADR-002 — Deploy via Railway e Nixpacks

| Campo | Valor |
|---|---|
| **ID** | ADR-002 |
| **Status** | Aceito |
| **Data** | 2026-05 |
| **Autor** | Hush Parallel Solutions |
| **Decisores** | Time de desenvolvimento |

---

## Contexto

Com a migração para ASP.NET Core (ver [ADR-001](./ADR-001-migracao-static-para-aspnet.md)), o site passou a exigir um servidor com runtime .NET 10 disponível. Era necessário escolher uma plataforma de hospedagem que equilibrasse:

- **Baixa fricção de operação** — o projeto é desenvolvido e mantido por uma equipe enxuta.
- **Deploy contínuo a partir do Git** — cada push na branch principal deve refletir em produção automaticamente.
- **Suporte a .NET 10** — a plataforma precisava provisionar o SDK e runtime corretos sem configuração manual de servidor.
- **Custo proporcional** — o tráfego é direcionado por campanhas pagas; o site não precisa de infraestrutura de grande porte.
- **Variáveis de ambiente nativas** — os IDs de tracking precisam ser injetados em runtime sem estarem no repositório.

---

## Problema

> Qual plataforma de hospedagem e estratégia de build adotar para um site ASP.NET Core .NET 10, priorizando simplicidade operacional, deploy automático por Git e suporte nativo a variáveis de ambiente?

---

## Alternativas Consideradas

### 1. VPS (Linode, DigitalOcean, Contabo)

Máximo controle, mínimo custo por CPU/RAM. Porém exige configuração manual de: runtime .NET, systemd service, Nginx como proxy reverso, certificado SSL, renovação automática (Certbot), e monitoramento. Para um projeto de uma landing page, a carga operacional é desproporcional ao benefício.

**Descartado:** overhead operacional incompatível com o tamanho e velocidade do projeto.

### 2. Azure App Service

Integração nativa com .NET, suporte a .NET 10, variáveis de ambiente via portal. Porém a camada gratuita tem limitações severas (sem domínio customizado, instância compartilhada, sleep após inatividade) e o tier pago tem custo mais elevado que alternativas PaaS modernas para este volume de tráfego.

**Descartado:** custo/benefício desfavorável para o estágio atual do projeto.

### 3. Vercel / Netlify

Excelente para sites estáticos e frameworks JavaScript (Next.js, Nuxt, SvelteKit). Não suportam aplicações ASP.NET Core de forma nativa — exigiriam contornar com serverless functions, o que recria a complexidade que se queria evitar.

**Descartado:** incompatibilidade com o stack escolhido.

### 4. Railway com Nixpacks ✅

Railway é uma PaaS moderna que detecta automaticamente o tipo de projeto a partir do repositório (via Nixpacks) e provisiona build + runtime sem Dockerfile. Para .NET, o Nixpacks detecta o arquivo `.csproj`, instala o SDK correto (fixado via `global.json`), executa `dotnet publish` e inicia o processo. Deploy é disparado a cada push na branch vinculada. Variáveis de ambiente são gerenciadas pela interface do Railway e injetadas em runtime.

**Aceito.**

---

## Decisão

Usar **Railway** como plataforma de deploy com **Nixpacks** como builder primário, com um `Dockerfile` mantido como alternativa de ejeção caso seja necessário migrar de plataforma no futuro.

---

## Implementação

### `railway.toml`

```toml
[build]
builder = "nixpacks"

[deploy]
healthcheckPath = "/"
healthcheckTimeout = 30
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3
```

### `global.json`

```json
{
  "sdk": {
    "version": "10.0.0",
    "rollForward": "latestMinor"
  }
}
```

Pina o SDK em `10.0.x`, permitindo patches mas não saltos de minor. O Nixpacks lê este arquivo para provisionar a versão correta.

### `Program.cs` — leitura de `PORT`

```csharp
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
```

O Railway injeta a porta via variável de ambiente `PORT`. O bind em `0.0.0.0` é necessário para que o proxy do Railway consiga rotear tráfego para o container.

### HTTPS

O Railway encerra TLS no seu proxy reverso antes de repassar a requisição ao container. Por isso, o redirect HTTPS está **desativado em produção** (`UseHttpsRedirection` só ativo em `Development`). Ativá-lo em produção causaria loop de redirecionamento.

---

## Consequências

### Positivas

- Zero configuração de servidor — o Nixpacks lida com build, runtime e dependências.
- Deploy automático a partir de push no Git.
- Variáveis de ambiente gerenciadas fora do repositório.
- Healthcheck configurado — o Railway só encaminha tráfego após o endpoint `/` responder com sucesso.
- Política de restart automática em caso de falha (`on_failure`, máx. 3 tentativas).
- `Dockerfile` disponível como plano de saída para qualquer outro provedor que suporte containers.

### Negativas / Trade-offs

- Dependência de plataforma (vendor lock-in moderado). Mitigado pelo `Dockerfile` alternativo.
- Custo mensal proporcional ao uso — monitorar se o tráfego das campanhas pagas escalar significativamente.
- Nixpacks pode ter comportamento inesperado em versões muito novas do .NET — o `global.json` e testes de deploy após cada atualização de SDK são a salvaguarda.

---

## Arquivos Relacionados

- `railway.toml` — Configuração declarativa de build e deploy
- `global.json` — Pin de versão do SDK .NET
- `Dockerfile` — Build multi-stage alternativo (SDK 10.0 → Runtime 10.0)
- `RodriguesJr.Web/Program.cs` — Leitura de `PORT` e desativação condicional do HTTPS redirect
