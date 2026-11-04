# Evidências

Prints que comprovam cada etapa. Antes de salvar uma imagem aqui, confira que **nenhum Client ID, secret, access_token ou config preenchido** aparece nela.

## App Control (Etapa 1, dados locais fictícios)

| Arquivo | O que mostra |
| --- | --- |
| [app-01-contas.png](app-01-contas.png) | Saudação, sugestões clicáveis e "Mostrar minhas contas" |
| [app-02-ultimas-transacoes.png](app-02-ultimas-transacoes.png) | Tabela das 4 contas e sugestões de continuação |
| [app-03-tabela-transacoes.png](app-03-tabela-transacoes.png) | 5 transações mais recentes, com a pendente identificada e a nota sobre o sinal da Plaid |
| [app-04-gasto-alimentacao.png](app-04-gasto-alimentacao.png) | "Quanto gastei com alimentação?": US$ 516,33 em 3 transações confirmadas, com a pendente fora do total (Tectra Inc é aluguel e contas, como na Plaid real) |
| [app-05-celular-1-pergunta.jpg](app-05-celular-1-pergunta.jpg) | App publicado no Android: saudação, sugestões e a pergunta enviada |
| [app-05-celular-2-total.jpg](app-05-celular-2-total.jpg) | Celular: pendente de US$ 4,33 fora da soma e tabela em cartões. *Print anterior à correção da categoria da Tectra Inc (o total exibido, US$ 1.016,33, incluía a Tectra); o valor atual é US$ 516,33, ver app-04* |
| [app-05-celular-3-cartoes.jpg](app-05-celular-3-cartoes.jpg) | Celular: restante das transações empilhadas em cartões |
| [app-06-resumo-consumo.png](app-06-resumo-consumo.png) | Resumo com **consumo** (US$ 2.202,29) separado de **dívidas pagas e transferências** (US$ 3.103,50) |
| [app-07-termo-desconhecido.png](app-07-termo-desconhecido.png) | "Quanto gastei com mercado?": avisa que o termo não existe e lista categorias e estabelecimentos válidos |

## Chat no Lovable (parte 4)

Publicado em <https://screenshot-to-pixel-perfect-1667.lovable.app>. Só a Etapa 1: nenhuma chave da Plaid foi fornecida ao Lovable.

| Arquivo | O que mostra |
| --- | --- |
| [lovable-01-inicio.png](lovable-01-inicio.png) | Saudação, sugestões e "Modo local, sem conexão bancária" |
| [lovable-02-saldos.png](lovable-02-saldos.png) | Dinheiro (US$ 300,00), dívida (US$ 5.430,00) e limite (US$ 4.980,00) separados |
| [lovable-03-transacoes.png](lovable-03-transacoes.png) | 5 transações mais recentes, com a pendente marcada e a nota "números calculados por código" |

## Servidores MCP

| Arquivo | O que mostra |
| --- | --- |
| [ia-01-mcp-servidores.png](ia-01-mcp-servidores.png) | `/mcp` no Claude Code (VS Code) com `plaid` e `pluggy` conectados, no escopo do projeto. Ao lado, o `.mcp.json` só com `${PLAID_CLIENT_ID}` e `${PLAID_SECRET}`, sem chaves |

## Pluggy Docs (P01–P02)

| Arquivo | O que mostra |
| --- | --- |
| [pluggy-p01-p02.md](pluggy-p01-p02.md) | 4 endpoints do grupo Transaction (com o descontinuado marcado) e Item × conta × transação explicados, com fontes |
| [ia-02-pluggy-1-endpoints.png](ia-02-pluggy-1-endpoints.png) | P01: tabela dos 4 endpoints |
| [ia-02-pluggy-2-conceitos.png](ia-02-pluggy-2-conceitos.png) | P02: Pluggy, Item e a tabela Item × conta × transação |
| [ia-02-pluggy-3-exemplo.png](ia-02-pluggy-3-exemplo.png) | P02: exemplo fictício e convenção de sinais |

## Plaid Sandbox (P05–P07)

| Arquivo | O que mostra |
| --- | --- |
| [plaid-p07.md](plaid-p07.md) | Item criado pelo MCP no First Platypus Bank (`ins_109508`), 14 contas, 48/48 transações em 90 dias e três padrões de gasto |
| [ia-03-plaid-1-resumo.png](ia-03-plaid-1-resumo.png) | Etapas P05–P07, instituição, período e paginação |
| [ia-03-plaid-2-dinheiro.png](ia-03-plaid-2-dinheiro.png) | Contas de depósito (dinheiro) |
| [ia-03-plaid-3-dividas.png](ia-03-plaid-3-dividas.png) | Investimentos, dívidas e limites |
| [ia-03-plaid-4-transacoes.png](ia-03-plaid-4-transacoes.png) | Cinco transações mais recentes, sem pendentes |
| [ia-03-plaid-5-padroes.png](ia-03-plaid-5-padroes.png) | Três padrões de gasto |
| [ia-03-plaid-6-observacoes.png](ia-03-plaid-6-observacoes.png) | Transferências, entradas e relação com o app |
