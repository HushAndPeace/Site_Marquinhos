# Guia de Desenvolvimento Local

**Tipo:** How-To  
**Público:** Desenvolvedor  
**Pré-requisito:** Git instalado

---

## Visão Geral

Este guia cobre como configurar o ambiente local para desenvolver e testar o site antes de enviar para produção no Railway.

---

## 1. Pré-requisitos

### .NET 10 SDK

O projeto usa .NET 10 (conforme `global.json`). Instale a versão correta:

- **Download:** [dotnet.microsoft.com/download/dotnet/10.0](https://dotnet.microsoft.com/download/dotnet/10.0)
- Instale o **SDK** (não apenas o Runtime) — o SDK inclui o compilador e o CLI.

Verifique após instalar:

```bash
dotnet --version
# Esperado: 10.0.x
```

### Editor recomendado

Qualquer um dos abaixo funciona sem configuração adicional:

- **Visual Studio Code** + extensão C# Dev Kit
- **JetBrains Rider**
- **Visual Studio 2022** (Community ou superior)

---

## 2. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd Site_Marquinhos
```

---

## 3. Configurar `appsettings.json` Local

O arquivo `RodriguesJr.Web/appsettings.json` já vem com valores placeholder (`XXXXXXX`) para os IDs de tracking. **Para desenvolvimento local, você não precisa alterar nada** — o site funciona normalmente sem IDs reais (o tracking simplesmente não dispara eventos).

Se quiser testar com IDs reais de desenvolvimento (ex.: pixel de teste do Meta), edite o arquivo diretamente. **Nunca commite IDs reais** — use o arquivo `appsettings.Development.json` (ignorado pelo `.gitignore`) para valores locais sensíveis:

```bash
# Crie o arquivo de override local (não será versionado)
cp RodriguesJr.Web/appsettings.json RodriguesJr.Web/appsettings.Development.json
# Edite appsettings.Development.json com seus IDs de teste
```

O ASP.NET Core carrega automaticamente `appsettings.Development.json` quando `ASPNETCORE_ENVIRONMENT=Development`.

---

## 4. Executar o Projeto

```bash
cd RodriguesJr.Web
dotnet run
```

Saída esperada:

```
Building...
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://0.0.0.0:8080
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

Acesse no browser: **http://localhost:8080**

Para a segunda landing: **http://localhost:8080/familia**

> **Porta:** O projeto lê a variável de ambiente `PORT`. Localmente, se `PORT` não estiver definida, usa `8080` (conforme `Program.cs`). Para rodar em outra porta:
> ```bash
> PORT=5000 dotnet run   # Linux/macOS
> $env:PORT=5000; dotnet run  # PowerShell (Windows)
> ```

---

## 5. Hot Reload (Watch Mode)

Para que as alterações em `.cshtml` e `.cs` sejam aplicadas sem reiniciar o servidor:

```bash
dotnet watch run
```

> **Nota:** Alterações em `site.css` e `site.js` (arquivos estáticos em `wwwroot/`) são servidas diretamente — basta recarregar o browser. Não há step de build para o frontend.

---

## 6. Estrutura do Ambiente de Desenvolvimento

Em desenvolvimento (`ASPNETCORE_ENVIRONMENT=Development`), os seguintes comportamentos diferem da produção:

| Comportamento | Desenvolvimento | Produção |
|---|---|---|
| HTTPS redirect | Ativo | Desativado (Railway encerra TLS no proxy) |
| Exception handler | Stack trace detalhado | Página `/Error` genérica |
| Logging | `Information` | `Warning` (menos verboso) |

---

## 7. Atualizar os Assets Estáticos (CSS/JS)

Os arquivos `site.css` e `site.js` usam cache busting manual via query string (`?v=3`). Após qualquer alteração nesses arquivos que você queira garantir que os usuários recebam:

1. Edite o número de versão em `_Layout.cshtml`:

```html
<!-- De: -->
<link rel="stylesheet" href="/css/site.css?v=3">
<script src="/js/site.js?v=3"></script>

<!-- Para: -->
<link rel="stylesheet" href="/css/site.css?v=4">
<script src="/js/site.js?v=4"></script>
```

2. Incremente o número a cada release que altere esses arquivos.

---

## 8. Build de Release (Verificação Local)

Para simular exatamente o que o Nixpacks executa em produção:

```bash
cd Site_Marquinhos
dotnet publish RodriguesJr.Web/RodriguesJr.Web.csproj -c Release -o ./publish-test
dotnet ./publish-test/RodriguesJr.Web.dll
```

Isso garante que nenhum erro de compilação em modo Release seja surpresa no deploy.

---

## 9. Limpeza de Build Artifacts

Os diretórios `bin/` e `obj/` são gerados automaticamente e não são versionados:

```bash
cd RodriguesJr.Web
dotnet clean
```

---

## Referências

- [README — visão geral técnica](./README.md)
- [Guia de Deploy no Railway](./guia-deploy-railway.md)
- [Estrutura e Componentes](./estrutura-e-componentes.md)
- [Documentação oficial dotnet watch](https://learn.microsoft.com/dotnet/core/tools/dotnet-watch)
