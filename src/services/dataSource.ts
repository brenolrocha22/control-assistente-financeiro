import { sampleDataset } from "../data/sample";
import type { Dataset } from "../engine/types";

/**
 * Camada de serviços substituível (especificação, Etapa 2).
 * O chat só conhece esta interface; trocar a fonte não muda a interface.
 */
export interface FinanceDataSource {
  mode: "local" | "backend";
  label: string;
  getDataset(): Promise<Dataset>;
}

/** Etapa 1: dados locais e fictícios, sem credenciais e sem rede. */
export const localDataSource: FinanceDataSource = {
  mode: "local",
  label: "Modo demonstração · dados locais",
  async getDataset() {
    return sampleDataset;
  },
};

/*
 * Etapa 2 (não implementada): um backend próprio chamaria a Plaid Sandbox
 * (POST /accounts/get e POST /transactions/get em https://sandbox.plaid.com)
 * com PLAID_CLIENT_ID, PLAID_SECRET e PLAID_ACCESS_TOKEN guardados só no servidor,
 * e devolveria um Dataset para este frontend. Nenhum segredo entra no navegador.
 */
