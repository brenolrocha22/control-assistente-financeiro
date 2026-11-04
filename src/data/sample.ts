import type { Dataset } from "../engine/types";

/**
 * Amostra local e fictícia para a Etapa 1.
 *
 * As quatro contas reproduzem a amostra da especificação (guia, p. 26).
 * As descrições das transações seguem o padrão dos dados prontos da Plaid Sandbox,
 * mas este NÃO é o conjunto de 14 contas e 48 transações consultado no ensaio:
 * é uma amostra pequena, e todos os cálculos do chat usam exatamente estes registros.
 */
export const sampleDataset: Dataset = {
  source: "Amostra local inspirada na Plaid Sandbox (dados fictícios)",
  referenceDate: "2026-09-25",
  periodStart: "2026-09-01",
  periodEnd: "2026-09-25",
  accounts: [
    { id: "chk", name: "Plaid Checking", typeLabel: "Conta corrente", kind: "depository", currency: "USD", current: 110, available: 100 },
    { id: "sav", name: "Plaid Saving", typeLabel: "Poupança", kind: "depository", currency: "USD", current: 210, available: 200 },
    { id: "cc", name: "Plaid Credit Card", typeLabel: "Cartão de crédito", kind: "credit", currency: "USD", current: 410, available: null },
    { id: "bcc", name: "Plaid Business Credit Card", typeLabel: "Cartão empresarial", kind: "credit", currency: "USD", current: 5020, available: 4980 },
  ],
  transactions: [
    { id: "t17", accountId: "cc", date: "2026-09-25", description: "Starbucks", amount: 4.33, currency: "USD", category: "FOOD_AND_DRINK", pending: true },
    { id: "t01", accountId: "chk", date: "2026-09-24", description: "Uber 072515 SF**POOL**", amount: 6.33, currency: "USD", category: "TRANSPORTATION", pending: false },
    { id: "t02", accountId: "cc", date: "2026-09-21", description: "Tectra Inc", amount: 500, currency: "USD", category: "RENT_AND_UTILITIES", pending: false },
    { id: "t03", accountId: "cc", date: "2026-09-20", description: "AUTOMATIC PAYMENT - THANK", amount: 2078.5, currency: "USD", category: "LOAN_PAYMENTS", pending: false },
    { id: "t04", accountId: "cc", date: "2026-09-20", description: "KFC", amount: 500, currency: "USD", category: "FOOD_AND_DRINK", pending: false },
    { id: "t05", accountId: "cc", date: "2026-09-20", description: "Madison Bicycle Shop", amount: 500, currency: "USD", category: "GENERAL_MERCHANDISE", pending: false },
    { id: "t06", accountId: "chk", date: "2026-09-15", description: "Uber 063015 SF**POOL**", amount: 5.4, currency: "USD", category: "TRANSPORTATION", pending: false },
    { id: "t07", accountId: "cc", date: "2026-09-14", description: "United Airlines", amount: 500, currency: "USD", category: "TRAVEL", pending: false },
    { id: "t08", accountId: "cc", date: "2026-09-12", description: "McDonald's", amount: 12, currency: "USD", category: "FOOD_AND_DRINK", pending: false },
    { id: "t09", accountId: "cc", date: "2026-09-12", description: "Starbucks", amount: 4.33, currency: "USD", category: "FOOD_AND_DRINK", pending: false },
    { id: "t10", accountId: "cc", date: "2026-09-11", description: "SparkFun", amount: 89.4, currency: "USD", category: "GENERAL_MERCHANDISE", pending: false },
    { id: "t11", accountId: "sav", date: "2026-09-10", description: "INTRST PYMNT", amount: -4.22, currency: "USD", category: "INCOME", pending: false },
    { id: "t12", accountId: "bcc", date: "2026-09-09", description: "Touchstone Climbing", amount: 78.5, currency: "USD", category: "PERSONAL_CARE", pending: false },
    { id: "t13", accountId: "chk", date: "2026-09-08", description: "CREDIT CARD 3333 PAYMENT *//", amount: 25, currency: "USD", category: "LOAN_PAYMENTS", pending: false },
    { id: "t14", accountId: "chk", date: "2026-09-05", description: "ACH Electronic CreditGUSTO PAY 123456", amount: -5850, currency: "USD", category: "INCOME", pending: false },
    { id: "t15", accountId: "chk", date: "2026-09-04", description: "Uber 072515 SF**POOL**", amount: 6.33, currency: "USD", category: "TRANSPORTATION", pending: false },
    { id: "t16", accountId: "sav", date: "2026-09-03", description: "CD DEPOSIT .INITIAL.", amount: 1000, currency: "USD", category: "TRANSFER_OUT", pending: false },
  ],
};
