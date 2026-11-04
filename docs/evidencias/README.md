# Evidências

Prints que comprovam cada etapa. Antes de salvar uma imagem aqui, confira que **nenhum Client ID, secret, access_token ou config preenchido** aparece nela.

## App Control (Etapa 1, dados locais fictícios)

| Arquivo | O que mostra |
| --- | --- |
| [app-01-contas.png](app-01-contas.png) | Saudação, sugestões clicáveis e "Mostrar minhas contas" |
| [app-02-ultimas-transacoes.png](app-02-ultimas-transacoes.png) | Tabela das 4 contas e sugestões de continuação |
| [app-03-tabela-transacoes.png](app-03-tabela-transacoes.png) | 5 transações mais recentes, com a pendente identificada e a nota sobre o sinal da Plaid |
| [app-04-gasto-alimentacao.png](app-04-gasto-alimentacao.png) | "Quanto gastei com alimentação?": US$ 1.016,33 em 4 confirmadas, com a pendente fora do total |

## Servidores MCP

| Arquivo | O que mostra |
| --- | --- |
| [ia-01-mcp-servidores.png](ia-01-mcp-servidores.png) | `/mcp` no Claude Code (VS Code) com `plaid` e `pluggy` conectados, no escopo do projeto. Ao lado, o `.mcp.json` só com `${PLAID_CLIENT_ID}` e `${PLAID_SECRET}`, sem chaves |

## Pluggy Docs (P01–P02)

| Arquivo | O que mostra |
| --- | --- |
| [pluggy-p01-p02.md](pluggy-p01-p02.md) | 4 endpoints do grupo Transaction (com o descontinuado marcado) e Item × conta × transação explicados, com fontes |

## Plaid Sandbox (P05–P07)

| Arquivo | O que mostra |
| --- | --- |
| [plaid-p07.md](plaid-p07.md) | Item criado pelo MCP no First Platypus Bank (`ins_109508`), 14 contas, 48/48 transações em 90 dias e três padrões de gasto |

## Pendentes (a adicionar)

| Arquivo sugerido | O que mostra |
| --- | --- |
| `ia-02-pluggy-item.png` | Resposta do P02 explicando Item, com links das fontes |
| `ia-03-plaid-tabelas.png` | Contas, transações e três padrões de gasto da Plaid Sandbox (P07) |
| `app-05-celular.png` | Conversa no celular |
