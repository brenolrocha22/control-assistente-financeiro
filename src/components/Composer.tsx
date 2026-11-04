import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
}

export function Composer({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const empty = value.trim().length === 0;

  function submit(e?: FormEvent) {
    e?.preventDefault();
    if (empty || disabled) return;
    onSend(value.trim());
    setValue("");
    ref.current?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // Enter envia; Shift+Enter quebra a linha.
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <form className="composer" onSubmit={submit}>
      <label htmlFor="msg" className="sr-only">
        Sua pergunta
      </label>
      <textarea
        id="msg"
        ref={ref}
        rows={1}
        value={value}
        placeholder="Pergunte sobre contas, saldos ou gastos…"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        maxLength={500}
      />
      <button type="submit" className="send" disabled={empty || disabled} aria-label="Enviar mensagem">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M3 11.5 20.5 4l-7.5 17.5-2.2-7.8L3 11.5Z" fill="currentColor" />
        </svg>
      </button>
    </form>
  );
}
