import { categoryLabel, date, money, round2 } from "./format";
import type { Account, Answer, Block, Dataset, Transaction } from "./types";

export const SUGGESTIONS = [
  "Mostrar minhas contas",
  "Consultar meus saldos",
  "Ver minhas últimas transações",
  "Quanto gastei com alimentação?",
  "Resumir minhas movimentações",
];

export const MORE_SUGGESTIONS = [
  "Quanto gastei com Uber?",
  "Transações do cartão nos últimos 7 dias",
  "Gastos por categoria na conta corrente",
  "Quanto eu devo nos cartões?",
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ---------- Filtros: conta e período ----------

interface Period {
  start: string;
  end: string;
  label: string;
}

interface Filters {
  account?: Account;
  period?: Period;
}

const MONTHS = ["janeiro", "fevereiro", "marco", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

function shiftDays(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function lastDayOfMonth(year: number, month: number): string {
  const d = new Date(Date.UTC(year, month, 0));
  return d.toISOString().slice(0, 10);
}

function parsePeriod(q: string, ref: string): Period | undefined {
  const year = Number(ref.slice(0, 4));
  if (/\bhoje\b/.test(q)) return { start: ref, end: ref, label: `hoje (${date(ref)})` };
  if (/\bontem\b/.test(q)) {
    const d = shiftDays(ref, -1);
    return { start: d, end: d, label: `ontem (${date(d)})` };
  }
  const lastN = q.match(/ultim[oa]s? (\d{1,3}) (dias?|semanas?)/);
  if (lastN) {
    const n = Number(lastN[1]) * (lastN[2].startsWith("semana") ? 7 : 1);
    const start = shiftDays(ref, -(n - 1));
    return { start, end: ref, label: `últimos ${n} dias (${date(start)} a ${date(ref)})` };
  }
  if (/(esta|essa|ultima) semana/.test(q)) {
    const start = shiftDays(ref, -6);
    return { start, end: ref, label: `últimos 7 dias (${date(start)} a ${date(ref)})` };
  }
  const range = q.match(/(?:de|entre) (\d{1,2})\/(\d{1,2}) (?:a|ate|e) (\d{1,2})\/(\d{1,2})/);
  if (range) {
    const p = (n: string) => n.padStart(2, "0");
    const start = `${year}-${p(range[2])}-${p(range[1])}`;
    const end = `${year}-${p(range[4])}-${p(range[3])}`;
    return { start, end, label: `${date(start)} a ${date(end)}` };
  }
  if (/(este|esse) mes/.test(q)) {
    const start = `${ref.slice(0, 7)}-01`;
    return { start, end: ref, label: `este mês (${date(start)} a ${date(ref)})` };
  }
  for (let i = 0; i < MONTHS.length; i++) {
    if (new RegExp(`\\b${MONTHS[i]}\\b`).test(q)) {
      const m = String(i + 1).padStart(2, "0");
      return { start: `${year}-${m}-01`, end: lastDayOfMonth(year, i + 1), label: `${MONTHS[i] === "marco" ? "março" : MONTHS[i]} de ${year}` };
    }
  }
  return undefined;
}

function parseAccount(q: string, accounts: Account[]): Account | undefined {
  const byId = (id: string) => accounts.find((a) => a.id === id);
  if (/empresarial|business/.test(q)) return byId("bcc");
  if (/cartao|cartoes|credit card|credito/.test(q) && !/cartoes/.test(q)) return byId("cc");
  if (/corrente|checking/.test(q)) return byId("chk");
  if (/poupanca|saving/.test(q)) return byId("sav");
  return undefined;
}

function applyFilters(txs: Transaction[], f: Filters): Transaction[] {
  return txs.filter(
    (t) =>
      (!f.account || t.accountId === f.account.id) &&
      (!f.period || (t.date >= f.period.start && t.date <= f.period.end)),
  );
}

function scopeText(ds: Dataset, f: Filters): string {
  const period = f.period ? f.period.label : `${date(ds.periodStart)} a ${date(ds.periodEnd)}`;
  const account = f.account ? ` · conta ${f.account.name}` : " · todas as contas";
  return `Período: ${period}${account}`;
}

// ---------- Categorias e estabelecimentos ----------

const CATEGORY_KEYWORDS: [string, RegExp][] = [
  ["FOOD_AND_DRINK", /aliment|comida|restaurante|lanche|cafe|bebida|refeic/],
  ["TRANSPORTATION", /transporte|corrida|taxi|mobilidade/],
  ["TRAVEL", /viage|passage|aere|voo/],
  ["GENERAL_MERCHANDISE", /mercadoria|loja|bicicleta|eletronic/],
  ["PERSONAL_CARE", /cuidado|academia|escalada|bem-estar|bem estar/],
  ["LOAN_PAYMENTS", /emprestimo|fatura|pagamento(s)? de (divida|cartao)|dividas pagas/],
  ["TRANSFER_OUT", /transferencia/],
  ["INCOME", /renda|salario|entrada|juros|receb/],
];

const MERCHANT_STOP = new Set(["credit", "automatic", "intrst", "deposit"]);

function merchantKey(description: string): string {
  return normalize(description).split(" ")[0].replace(/[^a-z]/g, "");
}

function parseMerchant(q: string, txs: Transaction[]): string | undefined {
  const words = new Set(q.replace(/[^a-z0-9 ]/g, "").split(" "));
  for (const t of txs) {
    const key = merchantKey(t.description);
    if (key.length >= 3 && !MERCHANT_STOP.has(key) && words.has(key)) return key;
  }
  return undefined;
}

// ---------- Blocos reutilizáveis ----------

const SIGN_NOTE =
  "Na Plaid, valor positivo é saída e negativo é entrada. Aqui mostramos o valor absoluto com a indicação “saída” ou “entrada”.";

function accountName(ds: Dataset, id: string): string {
  return ds.accounts.find((a) => a.id === id)?.name ?? "Não informado";
}

function signed(t: Transaction): string {
  return `${money(Math.abs(t.amount), t.currency)} (${t.amount >= 0 ? "saída" : "entrada"})`;
}

function txTable(ds: Dataset, txs: Transaction[], caption?: string): Block {
  return {
    kind: "table",
    caption,
    columns: ["Data", "Descrição", "Valor", "Conta", "Situação"],
    numericCols: [2],
    rows: txs.map((t) => [date(t.date), t.description, signed(t), accountName(ds, t.accountId), t.pending ? "Pendente" : "Confirmada"]),
  };
}

function byDateDesc(a: Transaction, b: Transaction) {
  return b.date.localeCompare(a.date) || b.id.localeCompare(a.id);
}

function sum(txs: Transaction[]): number {
  return round2(txs.reduce((acc, t) => acc + t.amount, 0));
}

function emptyResult(ds: Dataset, f: Filters, what: string): Answer {
  return {
    intent: "empty",
    blocks: [
      { kind: "text", text: `Não encontrei ${what} para esse filtro.` },
      { kind: "note", text: `${scopeText(ds, f)}. A amostra local cobre ${date(ds.periodStart)} a ${date(ds.periodEnd)}; não há registros fora dela e eu não invento movimentações.` },
      { kind: "suggestions", items: ["Ver minhas últimas transações", "Resumir minhas movimentações"] },
    ],
  };
}

// ---------- Intenções ----------

function greeting(): Answer {
  return {
    intent: "help",
    blocks: [
      {
        kind: "text",
        text:
          "Posso mostrar suas contas e saldos, listar transações por período ou conta, somar gastos por categoria ou estabelecimento e resumir suas movimentações. Tudo é calculado sobre uma amostra local de dados fictícios.",
      },
      { kind: "note", text: "Não faço pagamentos, transferências nem contratação de crédito: este assistente só lê dados." },
      { kind: "suggestions", items: [...SUGGESTIONS.slice(0, 3), ...MORE_SUGGESTIONS.slice(0, 2)] },
    ],
  };
}

function refuseWrite(): Answer {
  return {
    intent: "write_refused",
    blocks: [
      { kind: "text", text: "Não consigo fazer pagamentos, transferências, Pix ou contratar crédito. Este assistente é somente de leitura e usa dados fictícios." },
      { kind: "suggestions", items: ["Consultar meus saldos", "Ver minhas últimas transações"] },
    ],
  };
}

function conversion(): Answer {
  return {
    intent: "conversion_unsupported",
    blocks: [
      {
        kind: "text",
        text: "Os dados chegam em dólar (USD) e eu preservo a moeda original, como “US$ 110,00”. Ainda não existe uma conversão para reais implementada, então não vou inventar uma cotação.",
      },
      { kind: "suggestions", items: ["Consultar meus saldos", "Resumir minhas movimentações"] },
    ],
  };
}

function listAccounts(ds: Dataset): Answer {
  return {
    intent: "accounts",
    blocks: [
      { kind: "text", text: `Você tem ${ds.accounts.length} contas nesta amostra:` },
      {
        kind: "table",
        columns: ["Conta", "Tipo", "Natureza", "Moeda"],
        rows: ds.accounts.map((a) => [a.name, a.typeLabel, a.kind === "credit" ? "Crédito" : "Depósito", a.currency]),
      },
      { kind: "suggestions", items: ["Consultar meus saldos", "Ver minhas últimas transações"] },
    ],
  };
}

function balances(ds: Dataset, f: Filters): Answer {
  const accounts = f.account ? [f.account] : ds.accounts;
  const deposit = accounts.filter((a) => a.kind === "depository");
  const credit = accounts.filter((a) => a.kind === "credit");
  const cash = round2(deposit.reduce((s, a) => s + (a.available ?? 0), 0));
  const debt = round2(credit.reduce((s, a) => s + (a.current ?? 0), 0));
  const limitAccounts = credit.filter((a) => a.available !== null);
  const limit = round2(limitAccounts.reduce((s, a) => s + (a.available ?? 0), 0));
  const missingLimit = credit.length - limitAccounts.length;

  const cards: Extract<Block, { kind: "cards" }>["items"] = [];
  if (deposit.length)
    cards.push({ label: "Dinheiro disponível", value: money(cash), hint: `Campo “disponível” de ${deposit.map((a) => a.name).join(" + ")}`, tone: "good" });
  if (credit.length) {
    cards.push({ label: "Dívida nos cartões", value: money(debt), hint: "Saldo atual de contas de crédito", tone: "debt" });
    cards.push({
      label: "Limite disponível",
      value: limitAccounts.length ? money(limit) : "Não informado",
      hint: missingLimit ? `${missingLimit} cartão(ões) sem limite informado` : "Crédito, não é dinheiro depositado",
      tone: "limit",
    });
  }

  return {
    intent: "balances",
    blocks: [
      { kind: "cards", items: cards },
      {
        kind: "table",
        columns: ["Conta", "Tipo", "Saldo atual", "Disponível", "Moeda"],
        numericCols: [2, 3],
        rows: accounts.map((a) => [
          a.name,
          a.typeLabel,
          a.kind === "credit" ? `${money(a.current, a.currency)} de dívida` : money(a.current, a.currency),
          a.kind === "credit" && a.available !== null ? `${money(a.available, a.currency)} de crédito` : money(a.available, a.currency),
          a.currency,
        ]),
      },
      {
        kind: "note",
        text: `Em cartões, saldo atual é dívida e disponível é limite: não some tudo como patrimônio. Saldos da amostra com referência em ${date(ds.referenceDate)}; não há atualização em tempo real.`,
      },
    ],
  };
}

function listTransactions(ds: Dataset, f: Filters): Answer {
  const filtered = applyFilters(ds.transactions, f).sort(byDateDesc);
  if (!filtered.length) return emptyResult(ds, f, "transações");
  const hasFilter = Boolean(f.account || f.period);
  const shown = hasFilter ? filtered.slice(0, 20) : filtered.slice(0, 5);
  const intro = hasFilter
    ? `Encontrei ${filtered.length} transação(ões)${filtered.length > shown.length ? `; mostrando as ${shown.length} mais recentes` : ""}:`
    : "Estas são as 5 transações mais recentes:";
  return {
    intent: "transactions",
    blocks: [
      { kind: "text", text: intro },
      txTable(ds, shown),
      { kind: "note", text: `${scopeText(ds, f)}. ${SIGN_NOTE}` },
    ],
  };
}

function spendIn(ds: Dataset, f: Filters, match: (t: Transaction) => boolean, label: string): Answer {
  const scoped = applyFilters(ds.transactions, f).filter(match);
  if (!scoped.length) return emptyResult(ds, f, `registros de ${label}`);
  const confirmedOut = scoped.filter((t) => !t.pending && t.amount > 0);
  const pending = scoped.filter((t) => t.pending);
  const confirmedIn = scoped.filter((t) => !t.pending && t.amount < 0);
  const total = sum(confirmedOut);

  const received = money(Math.abs(sum(confirmedIn)));
  const blocks: Block[] = [];
  if (confirmedOut.length) {
    blocks.push({ kind: "text", text: `Você gastou ${money(total)} com ${label} em ${confirmedOut.length} transação(ões) confirmada(s).` });
    if (confirmedIn.length) blocks.push({ kind: "text", text: `Também houve ${received} de entradas nesse grupo.` });
  } else if (confirmedIn.length) {
    blocks.push({ kind: "text", text: `Você recebeu ${received} em ${confirmedIn.length} entrada(s) confirmada(s) de ${label}.` });
  } else {
    blocks.push({ kind: "text", text: `Não há movimentações confirmadas de ${label} nesse filtro.` });
  }
  if (pending.length) blocks.push({ kind: "text", text: `Fora do total: ${pending.length} pendente(s) somando ${money(Math.abs(sum(pending)))}.` });
  blocks.push(txTable(ds, [...scoped].sort(byDateDesc)));
  blocks.push({ kind: "note", text: `${scopeText(ds, f)} · ${scoped.length} registro(s) analisado(s). ${SIGN_NOTE}` });
  return { intent: "spend", blocks };
}

function summary(ds: Dataset, f: Filters): Answer {
  const scoped = applyFilters(ds.transactions, f);
  if (!scoped.length) return emptyResult(ds, f, "movimentações");
  const confirmed = scoped.filter((t) => !t.pending);
  const pending = scoped.filter((t) => t.pending);
  const outflow = round2(confirmed.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0));
  const inflow = round2(confirmed.filter((t) => t.amount < 0).reduce((s, t) => s - t.amount, 0));

  const byCat = new Map<string, number>();
  for (const t of confirmed) if (t.amount > 0) byCat.set(t.category, round2((byCat.get(t.category) ?? 0) + t.amount));
  const bars = [...byCat.entries()].sort((a, b) => b[1] - a[1]).map(([code, v]) => ({ label: categoryLabel(code), value: v, display: money(v) }));

  const top = bars[0];
  const blocks: Block[] = [
    {
      kind: "cards",
      items: [
        { label: "Saídas confirmadas", value: money(outflow), tone: "debt" },
        { label: "Entradas confirmadas", value: money(inflow), tone: "good" },
        { label: "Pendentes (fora dos totais)", value: pending.length ? `${pending.length} · ${money(Math.abs(sum(pending)))}` : "Nenhuma", tone: "limit" },
      ],
    },
    { kind: "bars", items: bars, caption: "Saídas confirmadas por categoria" },
  ];
  if (top) blocks.push({ kind: "text", text: `A maior saída foi em ${top.label} (${top.display}).` });
  if (byCat.has("LOAN_PAYMENTS") || byCat.has("TRANSFER_OUT"))
    blocks.push({ kind: "text", text: "Pagamentos de dívidas e transferências entram nas saídas, mas não são consumo: podem ser só dinheiro mudando de lugar." });
  blocks.push({ kind: "note", text: `${scopeText(ds, f)} · ${scoped.length} registro(s) (${confirmed.length} confirmados, ${pending.length} pendentes). ${SIGN_NOTE}` });
  return { intent: "summary", blocks };
}

function unsupported(): Answer {
  return {
    intent: "unsupported",
    blocks: [
      {
        kind: "text",
        text: "Não entendi essa pergunta ou ela não é respondida pelos dados disponíveis. Posso falar sobre contas, saldos, transações, gastos por categoria, estabelecimento, conta ou período.",
      },
      { kind: "suggestions", items: [...SUGGESTIONS.slice(1, 4), MORE_SUGGESTIONS[1]] },
    ],
  };
}

// ---------- Roteador ----------

export function answer(question: string, ds: Dataset): Answer {
  const q = normalize(question);
  if (!q) return unsupported();

  if (/\b(pague|pagar|transfira|transferir|envie|enviar|fazer um pix|faca um pix|mande um pix|contratar|contrate|solicitar emprestimo|pedir emprestimo|empreste)\b/.test(q))
    return refuseWrite();
  if (/\b(reais|brl|converter|conversao|cotacao)\b/.test(q)) return conversion();
  if (/^(oi|ola|bom dia|boa tarde|boa noite)\b|ajuda|o que voce (faz|sabe)|como funciona/.test(q)) return greeting();

  const filters: Filters = { account: parseAccount(q, ds.accounts), period: parsePeriod(q, ds.referenceDate) };

  const merchant = parseMerchant(q, ds.transactions);
  if (merchant) {
    const name = ds.transactions.find((t) => merchantKey(t.description) === merchant)!.description.split(" ")[0];
    return spendIn(ds, filters, (t) => merchantKey(t.description) === merchant, name);
  }

  const wantsSpend = /gast|quanto|soma|total/.test(q);
  for (const [code, re] of CATEGORY_KEYWORDS) {
    if (re.test(q) && (wantsSpend || code !== "INCOME")) return spendIn(ds, filters, (t) => t.category === code, categoryLabel(code).toLowerCase());
  }

  if (/resum|categoria|onde (eu )?gast|padr|analis|visao geral|entradas e saidas|gastei|gastos/.test(q)) return summary(ds, filters);
  if (/transac|movimenta|extrato|ultimas|recentes|lancamento|compras/.test(q)) return listTransactions(ds, filters);
  if (/saldo|disponivel|quanto tenho|dinheiro|divida|devo|limite/.test(q)) return balances(ds, filters);
  if (/\bcontas?\b|cartoes|cartao/.test(q)) return listAccounts(ds);
  if (filters.account || filters.period) return listTransactions(ds, filters);
  return unsupported();
}
