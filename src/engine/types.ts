export type AccountKind = "depository" | "credit";

export interface Account {
  id: string;
  name: string;
  /** Tipo traduzido para exibição. */
  typeLabel: string;
  kind: AccountKind;
  currency: string;
  /** Na Plaid, em contas de crédito o saldo atual representa dívida. */
  current: number | null;
  /** Em contas de crédito, disponível representa limite, não dinheiro depositado. */
  available: number | null;
}

export interface Transaction {
  id: string;
  accountId: string;
  /** Data ISO (YYYY-MM-DD). */
  date: string;
  description: string;
  /** Convenção da Plaid: positivo = saída, negativo = entrada. */
  amount: number;
  currency: string;
  /** personal_finance_category.primary da Plaid. */
  category: string;
  pending: boolean;
}

export interface Dataset {
  source: string;
  referenceDate: string;
  periodStart: string;
  periodEnd: string;
  accounts: Account[];
  transactions: Transaction[];
}

export type Block =
  | { kind: "text"; text: string }
  | { kind: "note"; text: string }
  | { kind: "cards"; items: { label: string; value: string; hint?: string; tone?: "good" | "debt" | "limit" }[] }
  | { kind: "table"; columns: string[]; rows: string[][]; caption?: string; numericCols?: number[] }
  | { kind: "bars"; items: { label: string; value: number; display: string }[]; caption?: string }
  | { kind: "suggestions"; items: string[] };

export interface Answer {
  intent: string;
  blocks: Block[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  text?: string;
  answer?: Answer;
  error?: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
}
