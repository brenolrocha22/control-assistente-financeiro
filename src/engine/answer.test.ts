import { describe, expect, it } from "vitest";
import { sampleDataset as ds } from "../data/sample";
import { answer, SUGGESTIONS } from "./answer";
import type { Answer } from "./types";

const text = (a: Answer) => a.blocks.map((b) => ("text" in b ? b.text : "")).join(" ");

describe("roteamento das sugestões iniciais", () => {
  it.each([
    [SUGGESTIONS[0], "accounts"],
    [SUGGESTIONS[1], "balances"],
    [SUGGESTIONS[2], "transactions"],
    [SUGGESTIONS[3], "spend"],
    [SUGGESTIONS[4], "summary"],
  ])("%s → %s", (q, intent) => {
    expect(answer(q, ds).intent).toBe(intent);
  });
});

describe("cálculos coerentes com a amostra", () => {
  it("separa dinheiro, dívida e limite", () => {
    const a = answer("Consultar meus saldos", ds);
    const cards = a.blocks.find((b) => b.kind === "cards");
    expect(cards && cards.kind === "cards" && cards.items.map((i) => i.value)).toEqual(["US$ 300,00", "US$ 5.430,00", "US$ 4.980,00"]);
  });

  it("soma alimentação só com confirmadas e deixa a pendente fora", () => {
    const t = text(answer("Quanto gastei com alimentação?", ds));
    expect(t).toContain("US$ 1.016,33");
    expect(t).toContain("4 transação(ões)");
    expect(t).toContain("1 pendente(s) somando US$ 4,33");
  });

  it("resume entradas e saídas com o sinal da Plaid", () => {
    const a = answer("Resumir minhas movimentações", ds);
    const cards = a.blocks.find((b) => b.kind === "cards");
    expect(cards && cards.kind === "cards" && cards.items[0].value).toBe("US$ 5.305,79");
    expect(cards && cards.kind === "cards" && cards.items[1].value).toBe("US$ 5.854,22");
  });

  it("mostra as 5 mais recentes", () => {
    const a = answer("Ver minhas últimas transações", ds);
    const table = a.blocks.find((b) => b.kind === "table");
    expect(table && table.kind === "table" && table.rows.length).toBe(5);
  });

  it("filtra por estabelecimento", () => {
    expect(text(answer("Quanto gastei com Uber?", ds))).toContain("US$ 18,06");
  });

  it("filtra por conta e período", () => {
    const a = answer("Transações do cartão nos últimos 7 dias", ds);
    const table = a.blocks.find((b) => b.kind === "table");
    expect(table && table.kind === "table" && table.rows.length).toBe(5);
  });
});

describe("limites honestos", () => {
  it("recusa operações de escrita", () => {
    expect(answer("Faça um pix de 50 para a Ana", ds).intent).toBe("write_refused");
  });
  it("não converte para reais", () => {
    expect(answer("Quanto tenho em reais?", ds).intent).toBe("conversion_unsupported");
  });
  it("não inventa dados fora do período", () => {
    expect(answer("Transações de março", ds).intent).toBe("empty");
  });
  it("pergunta sem suporte recebe explicação", () => {
    expect(answer("Qual a previsão do tempo?", ds).intent).toBe("unsupported");
  });
});
