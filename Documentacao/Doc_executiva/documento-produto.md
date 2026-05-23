# Documento de Produto — Site Rodrigues Jr. Advogados

**Versão:** 1.0  
**Data:** Maio de 2026  
**Desenvolvedor:** Hush Parallel Solutions  
**Cliente:** Rodrigues Jr. Advogados  
**Domínio:** rodriguesjr.adv.br

---

## O que é este produto

O **Site Rodrigues Jr.** é uma plataforma digital de prospecção de clientes desenvolvida sob medida para o escritório Rodrigues Jr. Advogados. Seu propósito central é receber visitantes vindos de anúncios pagos no Google e no Meta (Instagram e Facebook) e convertê-los em contatos qualificados via WhatsApp.

Não se trata de um site institucional convencional — é uma ferramenta de negócios construída para gerar retorno mensurável sobre o investimento em publicidade digital.

---

## Para quem é o produto

**Usuário final:** Pessoas que buscam assistência jurídica em situações de urgência ou delicadeza — desde alguém que recebeu uma intimação criminal até famílias enfrentando um divórcio ou inventário.

**Operador:** O escritório Rodrigues Jr. Advogados, que usa o site como ponto central de captura de leads das campanhas pagas.

**Gestor técnico:** Hush Parallel Solutions, responsável pelo desenvolvimento, manutenção e evolução da plataforma.

---

## Funcionalidades Entregues

### Landing Page — Direito Criminal (`rodriguesjr.adv.br/`)

Voltada para quem enfrenta uma emergência jurídica criminal. O conteúdo é construído em torno da urgência e da disponibilidade 24h do escritório.

**Conteúdo:**

- Hero com copy de alta pressão emocional ("alguém que amas foi preso agora")
- 4 pilares do escritório: plantão 24h, atuação do flagrante ao STJ, atenção 1:1, sigilo absoluto
- Seção "A Banca" com apresentação do Dr. Rodrigues Jr.
- 4 diferenciais com ícones (exclusividade boutique, atuação combativa, plantão 24h, sigilo)
- 6 áreas de atuação: Plantão Criminal, Flagrante, Inquérito Policial, Liberdade (HC), Tribunais Superiores, Tribunal do Júri
- Como funciona em 3 passos
- 6 perguntas frequentes (FAQ accordion)
- Footer com dados de contato e CTAs

**Canais de conversão:**

- Botão WhatsApp principal no hero
- Botão WhatsApp na seção "A Banca"
- Botão WhatsApp nas seções de atuação, como funciona e FAQ
- Botão WhatsApp flutuante sempre visível
- Link de e-mail no footer

---

### Landing Page — Direito de Família (`rodriguesjr.adv.br/familia`)

Voltada para quem enfrenta um processo familiar — divórcio, guarda, pensão, inventário. Tom mais empático e menos urgente, focado em segurança e estratégia.

**Conteúdo:**

- Hero com copy de acolhimento ("Você não está sozinho nessa luta")
- 4 estatísticas do escritório com contadores animados (15+ anos, 500+ famílias, etc.)
- Seção "O Escritório" com proposta de valor para família
- 6 áreas de atuação: Divórcio, Guarda e Convivência, Pensão Alimentícia, Inventário, Dissolução de União Estável, Planejamento Sucessório
- Como funciona em 3 passos (Escuta e Análise → Plano Personalizado → Acompanhamento Completo)
- 6 perguntas frequentes específicas para o contexto familiar
- Footer com dados de contato e CTAs

---

### Sistema de Rastreamento e Mensuração

Todo clique relevante no site dispara um evento para as plataformas de anúncios, permitindo que o escritório saiba exatamente qual campanha, anúncio ou público gerou cada contato.

| Plataforma | O que mensura |
|---|---|
| Google Tag Manager | Container central — gerencia todos os outros rastreadores |
| Meta Pixel | Conversões vindas de anúncios no Instagram e Facebook |
| Google Ads | Retorno direto de cada clique pago no Google |

**Eventos rastreados:** cliques nos botões de WhatsApp (hero, seções internas, footer, botão flutuante) e cliques em e-mail, segmentados por página e posição na jornada do usuário.

---

### Acessibilidade

O site inclui recursos que ampliam o alcance a diferentes perfis de usuários:

- **Modo escuro e modo claro:** adaptáveis à preferência do usuário e do sistema operacional
- **Alto contraste:** para usuários com baixa visão
- **Controle de tamanho de fonte:** 4 níveis ajustáveis
- **Navegação por teclado:** skip link, foco gerenciado no popup de acessibilidade

---

### SEO e Visibilidade Orgânica

Embora o foco seja tráfego pago, o site está configurado para aproveitar tráfego orgânico:

- Metadados individuais por página (título, descrição, URL canônica)
- Schema.org `LegalService` — aumenta chances de aparecer com destaque no Google
- Open Graph e Twitter Cards — otimizado para compartilhamento em redes sociais
- HTML semântico e `lang="pt-BR"` correto

---

## Infraestrutura e Disponibilidade

| Item | Detalhe |
|---|---|
| Hospedagem | Railway (PaaS) |
| Domínio | `rodriguesjr.adv.br` |
| HTTPS | Automático e gratuito via Railway |
| Deploy | Automático a cada atualização do código-fonte |
| Monitoramento | Healthcheck automático a cada deploy |
| Recuperação de falha | Restart automático (até 3 tentativas) |
| Tecnologia | ASP.NET Core .NET 10 |

---

## Como o Escritório Acompanha os Resultados

Os resultados das campanhas são acompanhados diretamente nas plataformas de anúncios — não há um painel separado para o site em si:

- **Google Ads:** acesse o painel de campanhas e veja "Conversões" — cada clique no WhatsApp vindo de um anúncio do Google é registrado como conversão.
- **Meta Ads Manager:** acesse "Eventos" no painel do Pixel para ver cliques no WhatsApp vindos de anúncios no Instagram e Facebook.
- **Google Analytics** (via GTM): comportamento dos usuários dentro do site — quais seções são mais visitadas, tempo na página, taxa de rejeição.

---

## Pendências Operacionais (Antes de Ativar Campanhas)

Antes de iniciar as campanhas pagas, o time técnico precisa inserir os IDs reais de rastreamento no ambiente de produção:

| ID necessário | Onde obter |
|---|---|
| Google Tag Manager ID (`GTM-XXXXX`) | Painel do GTM — conta do cliente |
| Meta Pixel ID | Meta Business Manager — conta de anúncios |
| Google Ads Conversion ID (`AW-XXXXX`) | Google Ads — Ferramentas > Conversões |
| Google Ads Conversion Label | Google Ads — Ferramentas > Conversões |

O processo de inserção leva menos de 5 minutos e não requer alteração de código.

---

## Histórico de Versões

| Versão | Data | Descrição |
|---|---|---|
| 0.1 (MVP) | 2026-05 | HTML/CSS estático — apenas Criminal, sem rastreamento |
| 1.0 (Produção) | 2026-05 | ASP.NET Core, Criminal + Família, rastreamento completo, acessibilidade, Railway |

---

*Documento produzido por **Hush Parallel Solutions***
