import type { Conversation } from "../engine/types";

interface Props {
  conversations: Conversation[];
  activeId: string;
  open: boolean;
  onSelect: (id: string) => void;
  onNew: () => void;
  onClose: () => void;
}

const when = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

export function Sidebar({ conversations, activeId, open, onSelect, onNew, onClose }: Props) {
  return (
    <>
      <div className={`scrim ${open ? "show" : ""}`} onClick={onClose} aria-hidden="true" />
      <aside className={`sidebar ${open ? "open" : ""}`} aria-label="Histórico de conversas">
        <button type="button" className="new-chat" onClick={onNew}>
          + Nova conversa
        </button>
        <h2>Histórico</h2>
        <ul>
          {conversations.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className={c.id === activeId ? "active" : undefined}
                aria-current={c.id === activeId ? "true" : undefined}
                onClick={() => onSelect(c.id)}
              >
                <span className="conv-title">{c.title}</span>
                <span className="conv-date">{when.format(c.createdAt)}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="sidebar-foot">O histórico fica salvo apenas neste navegador.</p>
      </aside>
    </>
  );
}
