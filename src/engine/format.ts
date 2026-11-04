const formatters = new Map<string, Intl.NumberFormat>();

/** Preserva a moeda recebida: USD aparece como "US$ 110,00". Não converte para reais. */
export function money(value: number | null, currency = "USD"): string {
  if (value === null || Number.isNaN(value)) return "Não informado";
  let f = formatters.get(currency);
  if (!f) {
    f = new Intl.NumberFormat("pt-BR", { style: "currency", currency });
    formatters.set(currency, f);
  }
  // Normaliza o espaço inseparável para facilitar testes e cópia.
  return f.format(value).replace(/ /g, " ");
}

export function date(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export const CATEGORY_LABELS: Record<string, string> = {
  FOOD_AND_DRINK: "Alimentação e bebidas",
  TRANSPORTATION: "Transporte",
  TRAVEL: "Viagens",
  GENERAL_MERCHANDISE: "Mercadorias em geral",
  PERSONAL_CARE: "Cuidados pessoais",
  LOAN_PAYMENTS: "Pagamentos de empréstimos/dívidas",
  TRANSFER_OUT: "Transferências de saída",
  TRANSFER_IN: "Transferências de entrada",
  INCOME: "Entradas (renda e juros)",
  RENT_AND_UTILITIES: "Aluguel e contas",
};

export function categoryLabel(code: string): string {
  return CATEGORY_LABELS[code] ?? code;
}
