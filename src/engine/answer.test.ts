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
    expect(t).toContain("US$ 516,33");
    expect(t).toContain("3 transações confirmadas");
    expect(t).toContain("1 pendente somando US$ 4,33");
  });

  it("concorda singular e plural com a quantidade", () => {
    const t = text(answer("Quanto gastei com Uber?", ds));
    expect(t).not.toMatch(/\((s|ões|es)\)/);
    const all = SUGGESTIONS.map((q) => text(answer(q, ds))).join(" ");
    expect(all).not.toMatch(/\((s|ões|es)\)/);
  });

  it("resume separando consumo de dívidas pagas e transferências", () => {
    const a = answer("Resumir minhas movimentações", ds);
    const cards = a.blocks.find((b) => b.kind === "cards");
    // Saídas confirmadas: 5.305,79 = consumo 2.202,29 + fatura/dívidas 2.103,50 + depósito em CD 1.000,00
    expect(cards && cards.kind === "cards" && cards.items.map((i) => i.value)).toEqual([
      "US$ 2.202,29",
      "US$ 3.103,50",
      "US$ 5.854,22",
      "1 · US$ 4,33",
    ]);
  });

  it("não conta o pagamento da fatura como gasto da semana", () => {
    const a = answer("Quanto gastei na última semana?", ds);
    const cards = a.blocks.find((b) => b.kind === "cards");
    // 19 a 25/09: Uber 6,33 + Tectra 500 + KFC 500 + Madison 500; a fatura de 2.078,50 fica separada
    expect(cards && cards.kind === "cards" && cards.items[0].value).toBe("US$ 1.506,33");
    expect(cards && cards.kind === "cards" && cards.items[1].value).toBe("US$ 2.078,50");
  });

  it("usa o verbo certo para dívidas pagas", () => {
    expect(text(answer("Quanto paguei de fatura?", ds))).toContain("Você pagou US$ 2.103,50 em pagamentos");
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
  it("avisa quando o termo não existe nos dados em vez de responder outra coisa", () => {
    const a = answer("Quanto gastei com mercado?", ds);
    expect(a.intent).toBe("unknown_term");
    expect(text(a)).toContain("Não encontrei “mercado”");
  });
  it.each(["Quanto gastei na última semana?", "Quanto gastei com o cartão?", "Quanto gastei em setembro?", "Quanto gastei com café?", "Quanto gastei com KFC?"])(
    "não confunde período, conta, categoria ou estabelecimento com termo desconhecido: %s",
    (q) => {
      expect(answer(q, ds).intent).not.toBe("unknown_term");
    },
  );
  it("pergunta sem suporte recebe explicação", () => {
    expect(answer("Qual a previsão do tempo?", ds).intent).toBe("unsupported");
  });
});
