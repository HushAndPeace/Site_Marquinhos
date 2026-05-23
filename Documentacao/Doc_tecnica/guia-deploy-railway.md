# Guia de Deploy — Railway

**Tipo:** How-To  
**Público:** Desenvolvedor responsável pela manutenção do site  
**Pré-requisito:** Conta no Railway com projeto já vinculado ao repositório Git

---

## Visão Geral

O deploy é **automático**: cada push na branch de produção dispara um novo build via Nixpacks. Este guia cobre os cenários adicionais: configuração inicial das variáveis de ambiente, como verificar um deploy, como forçar um redeploy manual e como agir em caso de falha.

---

## 1. Configurar Variáveis de Ambiente em Produção

Os IDs de tracking e dados de contato ficam no `appsettings.json` com valores placeholder (`XXXXXXX`). Em produção, esses valores são sobrescritos por variáveis de ambiente injetadas pelo Railway.

O ASP.NET Core converte automaticamente variáveis de ambiente com `__` (duplo sublinhado) em chaves de configuração aninhadas. Portanto, a variável `Tracking__GoogleTagManagerId` sobrescreve `appsettings.json > Tracking > GoogleTagManagerId`.

### Variáveis a configurar no painel do Railway

Acesse: **Projeto → Service → Variables → Add Variable**

| Nome da Variável | Descrição | Exemplo |
|---|---|---|
| `Tracking__GoogleTagManagerId` | ID do container GTM | `GTM-ABCDE12` |
| `Tracking__MetaPixelId` | ID do Meta Pixel (Facebook/Instagram) | `1234567890123456` |
| `Tracking__GoogleAdsConversionId` | ID da conta Google Ads | `AW-123456789` |
| `Tracking__GoogleAdsConversionLabel` | Label da conversão Google Ads | `AbCdEfGhIj` |
| `Contact__WhatsAppNumber` | Número WhatsApp sem formatação | `5511987396154` |
| `Contact__Email` | E-mail de contato | `contato@rodriguesjr.adv.br` |

> **Atenção:** Após adicionar ou alterar variáveis, o Railway realiza um redeploy automático para aplicar as mudanças.

---

## 2. Fluxo de Deploy Automático (Git Push)

```
git add .
git commit -m "feat: descrição da mudança"
git push origin main
```

O Railway detecta o push, inicia o build via Nixpacks e, após o healthcheck em `/` retornar `200 OK`, substitui a instância anterior pelo novo container.

### O que acontece internamente

1. Nixpacks detecta o `global.json` e provisiona o SDK .NET 10.
2. Executa `dotnet publish RodriguesJr.Web/RodriguesJr.Web.csproj -c Release`.
3. Inicia o processo publicado.
4. Railway aguarda `GET /` retornar `200` dentro de 30 segundos (configurado em `railway.toml`).
5. Em caso de sucesso, o tráfego é roteado para o novo container.

---

## 3. Verificar Status de um Deploy

No painel do Railway:

1. Acesse o projeto → aba **Deployments**.
2. Localize o deploy mais recente — status `Building`, `Deploying` ou `Active`.
3. Clique no deploy para ver os **logs de build e runtime** em tempo real.

Sinais de deploy saudável nos logs:

```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://0.0.0.0:XXXX
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

---

## 4. Forçar Redeploy Manual

Útil quando uma variável de ambiente foi alterada no painel ou quando se quer re-executar o build sem alterar o código.

No painel do Railway: **Deployments → Deploy → Redeploy**

Ou via Railway CLI (se instalado):

```bash
railway redeploy
```

---

## 5. Rollback para Deploy Anterior

Se o novo deploy introduzir uma regressão:

1. Acesse **Deployments** no painel.
2. Localize o último deploy estável (status `Active` anterior).
3. Clique em **Rollback** — o Railway reativa aquele container imediatamente.

> O rollback não reverte o código no Git — apenas a instância em execução no Railway.

---

## 6. Monitorar Logs em Runtime

Para acompanhar erros em produção em tempo real:

**Painel:** Projeto → Service → **Logs**

Via CLI:

```bash
railway logs
```

Os logs incluem toda a saída do processo .NET, incluindo exceções não tratadas e avisos do ASP.NET Core.

---

## 7. Política de Restart Automático

Configurada em `railway.toml`:

```toml
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3
```

O Railway reinicia o container automaticamente em caso de crash, até 3 vezes. Após o limite, o serviço fica inativo e um alerta é emitido no painel. Verifique os logs para identificar a causa raiz antes de um redeploy manual.

---

## 8. Domínio Customizado

O domínio `rodriguesjr.adv.br` está configurado no Railway via **Settings → Networking → Custom Domain**. O TLS é gerenciado automaticamente pelo Railway (Let's Encrypt). Não é necessário nenhum certificado manual.

> Lembre-se: o redirect HTTPS está **desabilitado no código** (`Program.cs`) porque o Railway encerra TLS no proxy antes de repassar ao container. Não habilite `UseHttpsRedirection` em produção.

---

## Referências

- [railway.toml — documentação oficial](https://docs.railway.app/reference/config-as-code)
- [Nixpacks .NET](https://nixpacks.com/docs/providers/csharp)
- [ADR-002 — Decisão de uso do Railway](./ADR-002-deploy-railway-nixpacks.md)
- [ADR-003 — Configuração de tracking por variável de ambiente](./ADR-003-tracking-via-appsettings.md)
