import { useEffect, useRef, useState } from "react";
import { Blocks } from "./components/Blocks";
import { Composer } from "./components/Composer";
import { Sidebar } from "./components/Sidebar";
import { BRAND } from "./config";
import { answer, SUGGESTIONS } from "./engine/answer";
import { date } from "./engine/format";
import type { Conversation, Message } from "./engine/types";
import { sampleDataset } from "./data/sample";
import { localDataSource as source } from "./services/dataSource";
import { loadConversations, newConversation, saveConversations } from "./storage";

function makeMessage(partial: Omit<Message, "id" | "createdAt">): Message {
  return { id: crypto.randomUUID(), createdAt: Date.now(), ...partial };
}

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = loadConversations();
    return saved.length ? saved : [newConversation()];
  });
  const [activeId, setActiveId] = useState(() => conversations[0].id);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];

  useEffect(() => {
    saveConversations(conversations.filter((c) => c.messages.length > 0));
  }, [conversations]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [active.messages.length, loading]);

  function append(convId: string, msg: Message, title?: string) {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, title: title ?? c.title, messages: [...c.messages, msg] } : c)),
    );
  }

  async function send(text: string) {
    const question = text.trim();
    if (!question || loading) return;
    const convId = active.id;
    const isFirst = active.messages.length === 0;
    append(convId, makeMessage({ role: "user", text: question }), isFirst ? question.slice(0, 48) : undefined);
    setLoading(true);
    try {
      const dataset = await source.getDataset();
      // Pequena pausa só para o indicador de carregamento ser perceptível; o cálculo é local.
      await new Promise((r) => setTimeout(r, 350));
      append(convId, makeMessage({ role: "assistant", answer: answer(question, dataset) }));
    } catch {
      append(convId, makeMessage({ role: "assistant", error: "Não consegui consultar os dados agora. Tente novamente em instantes.", text: question }));
    } finally {
      setLoading(false);
    }
  }

  function startNew() {
    setSidebarOpen(false);
    if (active.messages.length === 0) return;
    const conv = newConversation();
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
  }

  function select(id: string) {
    setActiveId(id);
    setSidebarOpen(false);
  }

  return (
    <div className="app">
      <Sidebar
        conversations={conversations}
        activeId={active.id}
        open={sidebarOpen}
        onSelect={select}
        onNew={startNew}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main">
        <header className="topbar">
          <button type="button" className="menu" onClick={() => setSidebarOpen(true)} aria-label="Abrir histórico">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className="brand">
            <span className="monogram" aria-hidden="true">
              {BRAND.monogram}
            </span>
            <span>
              <strong>{BRAND.name}</strong>
              <small>{BRAND.tagline}</small>
            </span>
          </div>
          <span className="badge">Demonstração · Dados fictícios</span>
        </header>

        <div className="mode-bar" role="status">
          <span className="dot" aria-hidden="true" />
          {source.label} · referência {date(sampleDataset.referenceDate)} · sem integração ativa com APIs
        </div>

        <main className="chat" aria-live="polite">
          <div className="thread">
            <div className="msg assistant">
              <div className="bubble">
                <p>{BRAND.greeting}</p>
                <Blocks blocks={[{ kind: "suggestions", items: SUGGESTIONS }]} onSuggestion={send} disabled={loading} />
              </div>
            </div>

            {active.messages.map((m) => (
              <div key={m.id} className={`msg ${m.role}`}>
                <div className={`bubble ${m.error ? "error" : ""}`}>
                  {m.role === "user" && <p>{m.text}</p>}
                  {m.answer && <Blocks blocks={m.answer.blocks} onSuggestion={send} disabled={loading} />}
                  {m.error && (
                    <>
                      <p>{m.error}</p>
                      <button type="button" className="chip" disabled={loading} onClick={() => m.text && send(m.text)}>
                        Tentar novamente
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="msg assistant">
                <div className="bubble typing" aria-label="Calculando resposta">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </main>

        <footer className="footer">
          <Composer onSend={send} disabled={loading} />
          <p className="legal">
            Dados fictícios inspirados na Plaid Sandbox, em USD. Não é um banco real nem o Open Finance brasileiro. Nenhuma operação de escrita é feita.
          </p>
        </footer>
      </div>
    </div>
  );
}
