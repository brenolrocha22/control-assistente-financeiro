# Especificação do chat (formato SDD, guia pp. 25–28)

Versão adaptada da especificação do guia, com a marca **Control** no lugar do nome desfocado. Copie tudo abaixo da linha como **um único pedido** no Lovable. Mande primeiro no modo chat para tirar dúvidas e só depois peça a construção.

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

Entregar primeiro uma interface funcional com dados locais fictícios, sem pedir credenciais. Identificar o modo de demonstração e a data de referência. Usar uma amostra pequena e coerente, com os cálculos feitos sobre essa mesma amostra.

| Conta de exemplo | Saldo USD | Disponível USD |
| --- | --- | --- |
| Plaid Checking | 110,00 | 100,00 |
| Plaid Saving | 210,00 | 200,00 |
| Plaid Credit Card | 410,00 de dívida | Não informado |
| Plaid Business Credit Card | 5.020,00 de dívida | 4.980,00 de crédito |

Não apresente a amostra como o conjunto completo consultado no ensaio. Se houver respostas simuladas, deixe isso claro.

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
