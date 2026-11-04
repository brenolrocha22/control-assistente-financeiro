# Prompts usados

Os prompts seguem o guia prático da aula (P01–P09). Cole na sua IA com os MCPs carregados.

## Prática 1 — Pluggy (documentação)

**P01 · Testar a conexão**
> Teste o MCP pluggy usando apenas a documentação. Liste os endpoints do grupo Transaction e informe método, caminho e finalidade. Se as ferramentas não estiverem disponíveis nesta conversa, diga isso claramente. Não consulte contas e não execute operações de escrita.

**P02 · Conceitos com fontes**
> Use o MCP da Pluggy para explicar, como se eu não fosse técnico: 1. O que é a Pluggy? 2. O que é um Item? 3. Qual é a diferença entre Item, conta e transação? 4. Dê um exemplo simples mostrando como essas três coisas se relacionam. Consulte a documentação e mostre os links das fontes usadas.

**P03 · Endpoints e paginação**
> Use o MCP da Pluggy para consultar a documentação e explicar: 1. Quais endpoints de transações estão disponíveis e para que serve cada um? 2. Qual é o endpoint atual para listar transações? 3. Quais informações preciso fornecer para consultar as transações de uma conta? 4. O que significa paginação por cursor? Explique com um exemplo simples. Destaque os endpoints marcados como descontinuados e mostre os links das fontes. Consulte apenas a documentação.

**P04 · Aprofundamento (opcional)**
> Use o MCP da Pluggy para detalhar GET /v2/transactions. Mostre método, caminho, autenticação, parâmetro obrigatório e filtros opcionais. Explique como usar results e next para percorrer todas as páginas. Inclua um exemplo com identificadores fictícios e links das fontes. Não execute a chamada de dados.

## Prática 2 — Plaid Sandbox (dados fictícios)

**P05 · Testar o servidor**
> Verifique se o MCP plaid está disponível nesta conversa. Faça uma consulta à documentação explicando o que é um Item de Sandbox e para que servem /accounts/get e /transactions/get. Não crie uma conexão ainda e não mostre credenciais. Informe se a chamada de documentação funcionou.

**P06 · Criar o Item**
> Use o MCP plaid para criar um Item de Sandbox com o produto transactions. Use os dados prontos da Plaid, sem dados personalizados e sem webhook. Se a ferramenta permitir escolher a instituição, use First Platypus Bank, ins_109508. Se não permitir, use o padrão e informe que a instituição ainda precisa ser confirmada. Não exiba Client ID, secret nem access_token. Informe apenas se a criação funcionou e se o token foi obtido.

**P07 · Consultar e apresentar**
> Continue usando o Item e o access_token obtidos. Faça consultas reais apenas em https://sandbox.plaid.com, com um pequeno programa local se precisar. Leia PLAID_CLIENT_ID e PLAID_SECRET da configuração local sem imprimi-los. Consulte /accounts/get e /transactions/get dos últimos 90 dias, percorrendo as páginas com count, offset e total_transactions. Se ocorrer PRODUCT_NOT_READY, tente no máximo 3 vezes. Mostre todas as contas (nome, tipo, saldo atual, disponível, moeda) e as cinco transações mais recentes (data, descrição, valor, conta, situação). Depois apresente até três padrões de gasto fundamentados. Preserve a moeda, separe dinheiro, dívidas e limites, mostre ausentes como "Não informado", separe pendentes e explique que, na Plaid, valor positivo é saída. Deixe claro que os dados são fictícios.

**P08 · Diagnóstico sem expor segredos**
> A etapa falhou. Identifique qual teste funcionou e onde parou. Mostre apenas a mensagem de erro sanitizada. Confira configuração e documentação sem exibir credenciais. Corrija o que for possível dentro desta demonstração de Sandbox e retome a etapa que falhou, sem recriar Items desnecessariamente.

## Lovable

A especificação completa está em [lovable-spec.md](lovable-spec.md). Depois da primeira versão:

**P09 · Revisão da prévia**
> Revise o Control usando a especificação anterior. Teste o envio de mensagens, as sugestões, contas, transações, cálculos, nova conversa e histórico no desktop e no celular. Confira os valores em USD e a separação entre saldo, dívida e limite. Verifique se a interface distingue demonstração local de integração ativa. Corrija problemas encontrados e liste somente o que continua pendente. Não solicite segredos pelo chat e não publique automaticamente.
