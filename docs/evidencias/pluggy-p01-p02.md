# P01 e P02 · Pluggy Docs MCP

Consulta só à **documentação**, pelo MCP `pluggy` (`https://mcp.pluggy.ai/mcp`), sem chave, sem consultar contas e sem operações de escrita.

## P01 · Endpoints do grupo Transaction

Ferramenta chamada: `list_endpoints` com `tag = "Transaction"` (no singular; "Transactions" não retorna nada). Resultado: **4 endpoints**.

| Método | Caminho | Finalidade | Observação |
| --- | --- | --- | --- |
| `GET` | `/v2/transactions` | Listar transações de uma conta, com paginação por cursor | **Endpoint atual para listagem** |
| `GET` | `/transactions` | Listar transações por página | **Descontinuado** (*deprecated*) |
| `GET` | `/transactions/{id}` | Recuperar uma transação pelo ID | |
| `PATCH` | `/transactions/{id}` | Atualizar uma transação (ex.: categoria) | Escrita, não executada |

✅ O MCP respondeu com chamada de ferramenta real. A conexão funciona.

## P02 · Conceitos, para quem não é técnico

Ferramenta chamada: `search_docs` (idioma `pt`).

**1. O que é a Pluggy?**
Uma plataforma de *open finance* para a América Latina. Com uma única integração, o app acessa centenas de instituições (contas, cartões, investimentos, empréstimos, identidade e pagamentos) e recebe os dados sempre no mesmo formato. Ela também oferece conectores da **Rede Brasileira de Open Finance**, que seguem o modelo de consentimento regulado. ([Visão geral](https://docs.pluggy.ai/pt/docs/overview), [Conectores Open Finance](https://docs.pluggy.ai/pt/docs/open-finance/overview))

**2. O que é um Item?**
É a **conexão** entre um usuário e uma instituição. Depois de criado, o Item guarda os parâmetros e as credenciais necessários para coletar os dados. As credenciais ficam criptografadas e **nunca** podem ser lidas de volta pela API. Com isso, a Pluggy consegue sincronizar os dados de novo automaticamente. ([Item](https://docs.pluggy.ai/pt/docs/connections/item))

**3. Item, conta e transação: qual a diferença?**

| Conceito | O que é | Analogia |
| --- | --- | --- |
| **Item** | A conexão com **um** banco | A "chave" que abre o seu banco |
| **Conta** (*Account*) | Cada produto dentro dessa conexão: conta corrente ou poupança (`BANK`) e cartão de crédito (`CREDIT`), cada um com saldo e moeda | As "gavetas" atrás da porta |
| **Transação** | Cada movimentação de uma conta: data, descrição, valor, situação (`PENDING` até ser concluída). São até 12 meses de histórico | Os "papéis" dentro de cada gaveta |

Fontes: [Conta](https://docs.pluggy.ai/pt/docs/products/accounts) · [Transação](https://docs.pluggy.ai/pt/docs/products/transactions) · [Considerações e FAQ (pendentes)](https://docs.pluggy.ai/pt/docs/open-finance/considerations-faq)

**4. Exemplo simples (dados fictícios)**

```
Item  "Banco Exemplo de Ana"          ← uma conexão
 ├─ Conta  Conta Corrente (BANK)      saldo R$ 2.150,00
 │   ├─ Transação  05/09  Mercado      saída   R$ 230,40   POSTED
 │   └─ Transação  06/09  Salário      entrada R$ 4.000,00 POSTED
 └─ Conta  Cartão de Crédito (CREDIT) saldo devedor R$ 890,00
     └─ Transação  07/09  Restaurante  +R$ 120,00 (cobrança)  PENDING
```

Um Item tem várias contas, e cada conta tem várias transações. Para listar as transações, o app usa o ID da **conta** em `GET /v2/transactions`.

Atenção aos saldos e sinais:
- Em contas `BANK`, o saldo é o dinheiro disponível. Se ficar negativo, é dívida, como no cheque especial. ([Conta · Saldo](https://docs.pluggy.ai/pt/docs/products/accounts))
- No cartão de crédito, **valor positivo é cobrança**, que aumenta o saldo devedor, e valor negativo é pagamento ou crédito. ([Transação · Convenção de sinal](https://docs.pluggy.ai/pt/docs/products/transactions))
- O Control mantém dinheiro e dívida separados pelo mesmo motivo.
