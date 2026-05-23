# Relatório de Sprint 01 — MVP Estático

| Campo | Valor |
|---|---|
| **Sprint** | 01 |
| **Período** | 2026 (anterior a maio) |
| **Status** | Concluída ✅ — Arquivada (substituída pela Sprint 02) |
| **Equipe** | Hush Parallel Solutions |
| **Artefatos** | `Code/index.html`, `Code/style.css` |

---

## Objetivo da Sprint

Construir um MVP rápido para validar o layout, a identidade visual e o posicionamento de marca do escritório Rodrigues Jr. Advogados antes de investir em infraestrutura e rastreamento.

O critério de sucesso era simples: **o cliente aprova o visual e o copy?**

---

## Contexto

O projeto partiu do zero. Não havia nenhum ativo digital anterior. As premissas iniciais eram:

- Entregar algo navegável e representativo rapidamente
- Validar paleta de cores (dourado + dark), tipografia e tom de voz
- Mapear as seções necessárias para uma landing page de advocacia criminal
- Não investir em infraestrutura de servidor antes de validar o conceito

---

## O Que Foi Construído

### Tecnologia

Site estático puro — um único arquivo `index.html` com `style.css` correspondente. Sem servidor, sem build pipeline, sem dependências.

### Conteúdo entregue

**Header fixo** com logo, navegação (A Banca, Atuação, Contato) e botão CTA.

**Hero section:**

- Tagline: "DEFESA TÉCNICA E ESTRATÉGICA"
- H1: "Excelência em Direito Criminal"
- Subtítulo e CTA "Falar com Advogado Agora"
- Background com overlay

**Seção "Sobre" (A Banca):**

- Texto sobre o modelo boutique
- Foto do advogado

**Áreas de Atuação:**

- Inquérito Policial
- Liberdade (HC)
- Direito Penal Econômico
- Tribunais Superiores
- Tribunal do Júri

**Contato/Footer** com dados de contato.

### Identidade Visual Estabelecida

A Sprint 01 definiu os elementos visuais que foram preservados integralmente na Sprint 02:

- **Paleta:** fundo dark (`#0a0a0a` / `#111`), dourado (`#C5A059`) para destaques
- **Tipografia:** Cormorant Garamond (títulos, serifada, elegância) + Manrope (corpo, sans-serif, legibilidade)
- **Tom de voz:** direto, técnico, combativo — sem eufemismos

---

## O Que Estava Ausente (Gap para Produção)

Esta sprint intencionalmente deixou de fora tudo que não fosse necessário para a validação visual:

| Item ausente | Motivo da ausência | Resolvido em |
|---|---|---|
| Rastreamento (GTM, Pixel, Google Ads) | Não havia campanhas ativas | Sprint 02 |
| Segunda landing (Família) | Validação focada em Criminal | Sprint 02 |
| SEO avançado (canonical, OG, Schema.org) | MVP apenas | Sprint 02 |
| Acessibilidade (temas, font-size) | Fora do escopo do MVP | Sprint 02 |
| Menu mobile responsivo | Layout desktop-first | Sprint 02 |
| Animações (AOS) | MVP estático | Sprint 02 |
| Deploy automatizado | Servido localmente / manualmente | Sprint 02 |
| FAQ accordion | Sem perguntas mapeadas ainda | Sprint 02 |
| Botão WhatsApp flutuante | MVP simplificado | Sprint 02 |

---

## Resultado e Decisão

O layout e o posicionamento foram **aprovados pelo cliente**. A Sprint 01 cumpriu seu objetivo: validar sem sobrecarga de infraestrutura.

A decisão de migrar para ASP.NET Core na Sprint 02 foi tomada a partir desta validação, com os requisitos técnicos já claros. Ver [ADR-001](./ADR-001-migracao-static-para-aspnet.md) para o racional completo da migração.

---

## Preservação Histórica

Os arquivos da Sprint 01 estão preservados integralmente na pasta `Code/` do repositório. Eles **não são mais servidos em produção** — existem apenas como registro histórico do ponto de partida do projeto.

```
Code/
├── index.html    # Landing Criminal — versão MVP
└── style.css     # Estilos da versão estática
```

---

## Referências

- [Sprint 02](./sprint-02-relatorio.md) — continuação e versão de produção
- [ADR-001](./ADR-001-migracao-static-para-aspnet.md) — decisão de migrar do MVP para ASP.NET Core
