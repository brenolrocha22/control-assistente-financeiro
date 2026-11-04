import type { Conversation } from "./engine/types";

const KEY = "control.conversations.v1";

// O histórico fica só neste navegador. Nunca guardamos credenciais aqui.
export function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(conversations.slice(0, 30)));
  } catch {
    // Armazenamento indisponível (aba anônima, cota): o chat segue funcionando sem histórico persistido.
  }
}

export function newConversation(): Conversation {
  return { id: crypto.randomUUID(), title: "Nova conversa", createdAt: Date.now(), messages: [] };
}
