# P07 · Consulta real na Plaid Sandbox

> ⚠️ **Dados fictícios** da Plaid Sandbox. Não representam pessoas, contas ou o Open Finance brasileiro.

| Item | Valor |
| --- | --- |
| Etapas | P05 ✅ documentação · P06 ✅ Item criado pelo MCP `plaid` (produto `transactions`, sem webhook, sem dados personalizados) · P07 ✅ consulta |
| Instituição | First Platypus Bank (`ins_109508`), confirmada pela resposta de `/accounts/get` |
| Período | 06/08/2026 a 04/11/2026 (90 dias) |
| Paginação | `/transactions/get` com `count=100` e `offset`, até atingir `total_transactions` = **48** (48/48 lidas) |
| `PRODUCT_NOT_READY` | Não ocorreu (o script tentaria no máximo 3 vezes) |
| Credenciais | Lidas de variáveis de ambiente, nunca impressas. O `access_token` não foi exibido nem versionado |

**Sinal na Plaid:** valor **positivo = saída** de dinheiro; valor negativo = entrada.

## Contas (14)

Valores em USD, como retornados. Ausentes aparecem como "Não informado".

### Dinheiro

| Conta | Tipo | Saldo atual | Disponível |
| --- | --- | ---: | ---: |
| Plaid Checking | depósito · corrente | US$ 110,00 | US$ 100,00 |
| Plaid Saving | depósito · poupança | US$ 210,00 | US$ 200,00 |
| Plaid CD | depósito · CD | US$ 1.000,00 | Não informado |
| Plaid Money Market | depósito · money market | US$ 43.200,00 | US$ 43.200,00 |
| Plaid HSA | depósito · HSA | US$ 6.009,00 | US$ 6.009,00 |
| Plaid Cash Management | depósito · cash management | US$ 12.060,00 | US$ 12.060,00 |
| **Total em depósitos** | | **US$ 62.589,00** | |

### Investimentos

| Conta | Tipo | Saldo atual | Disponível |
| --- | --- | ---: | ---: |
| Plaid IRA | investimento · IRA | US$ 320,76 | Não informado |
| Plaid 401k | investimento · 401k | US$ 23.631,98 | Não informado |

### Dívidas e limites

O saldo destas contas é **valor devido**, não dinheiro disponível.

| Conta | Tipo | Saldo devido | Disponível | Limite |
| --- | --- | ---: | ---: | ---: |
| Plaid Credit Card | crédito · cartão | US$ 410,00 | Não informado | US$ 2.000,00 |
| Plaid Business Credit Card | crédito · cartão | US$ 5.020,00 | US$ 4.980,00 | US$ 10.000,00 |
| Plaid Home Equity Line of Credit | empréstimo · home equity | US$ 13.500,50 | US$ 47.647,50 | US$ 61.148,00 |
| Plaid Student Loan | empréstimo · estudantil | US$ 65.262,00 | Não informado | Não informado |
| Plaid Mortgage | empréstimo · hipoteca | US$ 56.302,06 | Não informado | Não informado |
| Plaid Auto Loan | empréstimo · veículo | US$ 23.211,33 | Não informado | Não informado |

Dívida em cartões: **US$ 5.430,00**. Dívida em empréstimos: **US$ 158.275,89**.

## Cinco transações mais recentes

| Data | Descrição | Valor | Conta | Situação |
| --- | --- | ---: | --- | --- |
| 26/10/2026 | United Airlines | US$ 500,00 (saída) | Plaid Credit Card | Confirmada |
| 24/10/2026 | Uber 072515 SF\*\*POOL\*\* | US$ 6,33 (saída) | Plaid Checking | Confirmada |
| 21/10/2026 | Tectra Inc | US$ 500,00 (saída) | Plaid Credit Card | Confirmada |
| 20/10/2026 | AUTOMATIC PAYMENT - THANK | US$ 2.078,50 (saída) | Plaid Credit Card | Confirmada |
| 20/10/2026 | KFC | US$ 500,00 (saída) | Plaid Credit Card | Confirmada |

Pendentes no período: **nenhuma** (0 de 48).

## Três padrões de gasto

Considerei como consumo só as saídas confirmadas. Ficam de fora transferências (`TRANSFER_OUT`/`TRANSFER_IN`) e pagamentos de dívida (`LOAN_PAYMENTS`), que movem dinheiro mas não são gasto.

1. **O mesmo ciclo se repete todo mês.** As 48 transações são 3 repetições de um bloco de 16, com os mesmos estabelecimentos e valores, em datas próximas (por volta dos dias 6–12 e 20–26). O consumo é de **US$ 2.195,96 por mês** (US$ 6.587,88 em 30 saídas no período).
2. **O cartão concentra as compras grandes e é quitado pelo valor exato.** Todo mês, as compras no Plaid Credit Card (United, Tectra, KFC, Madison Bicycle Shop, Touchstone Climbing) somam **US$ 2.078,50**. Esse é o mesmo valor do "AUTOMATIC PAYMENT". Somar compras e pagamento contaria o mesmo gasto duas vezes.
3. **Alimentação depende de um único estabelecimento.** São **US$ 516,33 por mês** (US$ 1.548,99 no período), e o KFC responde por US$ 500,00 desse valor (≈ 97%). McDonald's e Starbucks somam US$ 16,33. Transporte (Uber + Madison Bicycle Shop) é parecido: US$ 511,73 por mês.

Observações:
- **Movimentações que não são consumo:** saem US$ 6.850,00 por mês em transferências (GUSTO PAY US$ 5.850,00 + depósito em CD US$ 1.000,00), mais do que todo o consumo do mês.
- **Entradas:** US$ 504,22 por mês, sendo US$ 500,00 de crédito da United Airlines na conta corrente e US$ 4,22 de juros da poupança. Não dá para afirmar se o crédito da United é estorno da compra no cartão, porque os dados não ligam uma transação à outra.

## Do Sandbox para o app

A amostra local do app ([src/data/sample.ts](../../src/data/sample.ts)) segue o mesmo formato e usa os mesmos estabelecimentos e categorias deste resultado, mas é **menor** (4 contas e 17 transações). Ela é intencionalmente separada da consulta real. A Etapa 2 trocaria a amostra por esta fonte, através de um backend.
