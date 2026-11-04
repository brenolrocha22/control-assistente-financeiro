# Especificação do chat (formato SDD, guia pp. 25–28)

Versão adaptada da especificação do guia, com a marca **Control** no lugar do nome desfocado. Copie tudo abaixo da linha como **um único pedido** no Lovable.

**Como usar (guia, parte 4):**
1. No Lovable, deixe o modo **Chat** ligado (não o de construção) e cole tudo abaixo da linha, precedido de: *"Antes de construir, leia a especificação e me diga as dúvidas e o que você pretende fazer. Não gere código ainda."*
2. Responda às dúvidas. Depois mude para o modo de construção e peça: *"Pode construir a Etapa 1 conforme a especificação."*
3. Confira a prévia com a tabela de **valores esperados** e rode o **P09** ([prompts.md](prompts.md)).
4. Publique (**Publish**) e guarde o link.

---

## Objetivo e contexto

Crie uma aplicação web chamada **Control**, com um chat para consultar contas, saldos e transações e entender gastos em linguagem simples. Será uma demonstração educacional de IA, MCP e APIs financeiras. Todos os registros bancários serão fictícios, inspirados na Plaid Sandbox. **Control** é a marca da interface; a instituição e os dados de origem continuam identificados corretamente.

Antes, já consultamos a documentação da Pluggy por MCP, configuramos o MCP da Plaid, criamos um Item padrão com `transactions` e lemos contas e transações de teste. A Pluggy foi a fonte de documentação; a Plaid forneceu os dados de teste. Os MCPs locais não estarão conectados automaticamente à aplicação web: o frontend precisará de um backend próprio para a integração.

## Identidade e experiência

Nome: Control. Assistente: Control. Idioma: português brasileiro. Estilo de banco digital simples e acolhedor, com verde profundo, branco e cinza claro. Monograma "C", boa legibilidade, espaçamento confortável e layout responsivo. O foco é a conversa, não uma landing page. Manter a indicação "Demonstração · Dados fictícios". Funcionar em desktop e celular.

Saudação inicial: "Olá! Sou o Control, seu assistente. O que você quer entender sobre suas finanças?"
Sugestões clicáveis: Mostrar minhas contas; Consultar meus saldos; Ver minhas últimas transações; Quanto gastei com alimentação?; Resumir minhas movimentações.

O chat deve ter campo de mensagem fixo, botão de envio, indicador de carregamento, erros compreensíveis e histórico. Enter envia; Shift+Enter quebra a linha. As sugestões enviam pedidos de verdade. As respostas podem incluir cartões, tabelas e gráficos simples, com leitura adequada no celular.

## Funcionalidades

1. Listar contas, tipos e moedas.
2. Mostrar saldo atual e disponível por conta.
3. Separar dinheiro disponível, dívidas e limites.
4. Listar transações por período e conta.
5. Mostrar as cinco transações mais recentes.
6. Resumir movimentações por categoria.
7. Responder apenas com base nos dados disponíveis.
8. Iniciar nova conversa e consultar o histórico.

Não incluir pagamentos, transferências, contratação de crédito nem operações bancárias de escrita.

## Regras dos dados e das respostas

Preservar USD quando essa for a moeda recebida, no formato "US$ 110,00". Não converter para reais sem uma conversão explicitamente implementada. Saldo devedor não é dinheiro disponível. Exibir campos ausentes como "Não informado". Na Plaid, valor positivo de transação é saída e negativo é entrada. Separar pendentes das confirmadas nos totais. Não tratar toda transferência como consumo. Informar o período e a quantidade de registros analisados. Não inventar transações, categorias, recorrências ou conclusões. Não simular atualização em tempo real. Perguntas sem suporte recebem uma explicação da limitação e sugestões válidas.

## Etapa 1: frontend demonstrável

Entregar primeiro uma interface funcional com dados locais fictícios, sem pedir credenciais. **Nesta etapa não há integração com a Plaid: não peça `PLAID_CLIENT_ID`, `PLAID_SECRET` nem `access_token`, não crie conexão com Supabase/Edge Functions para a Plaid e não chame `sandbox.plaid.com`.** Todos os dados vêm da amostra abaixo, embutida no código. Identificar o modo de demonstração e a data de referência. Usar uma amostra pequena e coerente, com os cálculos feitos sobre essa mesma amostra.

| Conta de exemplo | Saldo USD | Disponível USD |
| --- | --- | --- |
| Plaid Checking | 110,00 | 100,00 |
| Plaid Saving | 210,00 | 200,00 |
| Plaid Credit Card | 410,00 de dívida | Não informado |
| Plaid Business Credit Card | 5.020,00 de dívida | 4.980,00 de crédito |

Data de referência da amostra: **25/09/2026** ("hoje", "ontem" e "últimos N dias" são calculados a partir dela). Use exatamente estas 17 transações (valor no padrão Plaid: positivo = saída, negativo = entrada):

| Data | Descrição | Valor USD | Conta | Categoria | Situação |
| --- | --- | ---: | --- | --- | --- |
| 25/09/2026 | Starbucks | 4,33 | Plaid Credit Card | FOOD_AND_DRINK | Pendente |
| 24/09/2026 | Uber 072515 SF\*\*POOL\*\* | 6,33 | Plaid Checking | TRANSPORTATION | Confirmada |
| 21/09/2026 | Tectra Inc | 500,00 | Plaid Credit Card | RENT_AND_UTILITIES | Confirmada |
| 20/09/2026 | AUTOMATIC PAYMENT - THANK | 2.078,50 | Plaid Credit Card | LOAN_PAYMENTS | Confirmada |
| 20/09/2026 | KFC | 500,00 | Plaid Credit Card | FOOD_AND_DRINK | Confirmada |
| 20/09/2026 | Madison Bicycle Shop | 500,00 | Plaid Credit Card | GENERAL_MERCHANDISE | Confirmada |
| 15/09/2026 | Uber 063015 SF\*\*POOL\*\* | 5,40 | Plaid Checking | TRANSPORTATION | Confirmada |
| 14/09/2026 | United Airlines | 500,00 | Plaid Credit Card | TRAVEL | Confirmada |
| 12/09/2026 | McDonald's | 12,00 | Plaid Credit Card | FOOD_AND_DRINK | Confirmada |
| 12/09/2026 | Starbucks | 4,33 | Plaid Credit Card | FOOD_AND_DRINK | Confirmada |
| 11/09/2026 | SparkFun | 89,40 | Plaid Credit Card | GENERAL_MERCHANDISE | Confirmada |
| 10/09/2026 | INTRST PYMNT | -4,22 | Plaid Saving | INCOME | Confirmada |
| 09/09/2026 | Touchstone Climbing | 78,50 | Plaid Business Credit Card | PERSONAL_CARE | Confirmada |
| 08/09/2026 | CREDIT CARD 3333 PAYMENT \*// | 25,00 | Plaid Checking | LOAN_PAYMENTS | Confirmada |
| 05/09/2026 | ACH Electronic CreditGUSTO PAY 123456 | -5.850,00 | Plaid Checking | INCOME | Confirmada |
| 04/09/2026 | Uber 072515 SF\*\*POOL\*\* | 6,33 | Plaid Checking | TRANSPORTATION | Confirmada |
| 03/09/2026 | CD DEPOSIT .INITIAL. | 1.000,00 | Plaid Saving | TRANSFER_OUT | Confirmada |

Não apresente a amostra como o conjunto completo consultado no ensaio (a consulta real teve 14 contas e 48 transações). Se houver respostas simuladas, deixe isso claro.

**Os números devem ser calculados por código sobre esta amostra, nunca gerados por um modelo de linguagem.** Valores esperados, para conferência:

| Pergunta | Resposta esperada |
| --- | --- |
| Consultar meus saldos | Dinheiro disponível US$ 300,00 · Dívida nos cartões US$ 5.430,00 · Limite disponível US$ 4.980,00 |
| Quanto gastei com alimentação? | US$ 516,33 em 3 transações confirmadas; fora do total: 1 pendente somando US$ 4,33 |
| Resumir minhas movimentações | Consumo US$ 2.202,29 · Dívidas pagas e transferências US$ 3.103,50 · Entradas US$ 5.854,22 · Pendentes 1 (US$ 4,33) |
| Quanto gastei com Uber? | US$ 18,06 em 3 transações confirmadas |
| Quanto gastei na última semana? | Consumo US$ 1.506,33 (19 a 25/09); fatura de US$ 2.078,50 mostrada à parte |

## Melhoria escolhida: perguntas novas

Responder combinações de **categoria, estabelecimento, período e conta**, por exemplo: "Quanto gastei com Uber?", "Transações do cartão nos últimos 7 dias", "Gastos por categoria na conta corrente", "Quanto gastei de 10/09 a 20/09?". Se o período pedido estiver fora da amostra, dizer isso sem inventar movimentações.

Regras adicionais:
- **Consumo ≠ saídas.** Pagamento de fatura/dívida (`LOAN_PAYMENTS`) e transferências (`TRANSFER_OUT`) aparecem separados do consumo: pagar a fatura só quita compras do cartão que já foram contadas, e somar os dois contaria o mesmo gasto duas vezes.
- **Termo desconhecido.** Se a pessoa perguntar por algo que não existe nos dados (ex.: "Quanto gastei com mercado?"), dizer que não encontrou e listar as categorias e estabelecimentos válidos, em vez de responder outra pergunta.
- **Concordância.** Escrever "1 transação confirmada" / "4 transações confirmadas", nunca "transação(ões)".
- Pedidos de Pix, pagamento ou transferência são recusados com explicação; pedidos de conversão para reais também.

## Etapa 2: backend e integração (depois)

Separar os dados locais da interface por uma camada de serviços substituível. Fluxo: usuário pergunta › backend interpreta a intenção › consulta a Plaid › calcula resultados › assistente explica › frontend apresenta. Usar `POST /accounts/get` e `POST /transactions/get` (percorrendo todas as páginas), somente em `https://sandbox.plaid.com`. Tratar `PRODUCT_NOT_READY`, autenticação inválida e indisponibilidade com mensagens claras e tentativas limitadas. Segredos apenas no backend: `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ACCESS_TOKEN`. Nada em variáveis públicas, no armazenamento do navegador ou no chat. Sem webhook nesta versão. A interface não deve indicar "Conectado" a uma API que ainda não foi integrada.

## Critérios de aceite

- [ ] Marca Control e chat como foco
- [ ] Desktop e celular utilizáveis
- [ ] Envio por botão e Enter funcionando
- [ ] Sugestões clicáveis e mensagens vazias bloqueadas
- [ ] Contas, saldos e transações claros
- [ ] Totais coerentes com os dados usados
- [ ] Perguntas sem resposta tratadas sem inventar números
- [ ] Carregamento, erro e conjunto vazio previstos
- [ ] Nova conversa e histórico funcionando
- [ ] Modo local diferente de integração ativa
- [ ] Nenhuma credencial exposta ao navegador
- [ ] Nenhuma operação bancária de escrita

**Instrução final:** comece pela Etapa 1. Ao entregar a prévia, explique objetivamente o que já funciona e o que falta para ativar a Etapa 2.
