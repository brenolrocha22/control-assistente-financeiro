import type { Block } from "../engine/types";

interface Props {
  blocks: Block[];
  onSuggestion: (text: string) => void;
  disabled: boolean;
}

export function Blocks({ blocks, onSuggestion, disabled }: Props) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "text":
            return <p key={i}>{b.text}</p>;
          case "note":
            return (
              <p key={i} className="note">
                {b.text}
              </p>
            );
          case "cards":
            return (
              <div key={i} className="cards">
                {b.items.map((c) => (
                  <div key={c.label} className={`card ${c.tone ?? ""}`}>
                    <span className="card-label">{c.label}</span>
                    <strong className="card-value">{c.value}</strong>
                    {c.hint && <span className="card-hint">{c.hint}</span>}
                  </div>
                ))}
              </div>
            );
          case "table":
            return (
              <div key={i} className="table-wrap" role="region" aria-label={b.caption ?? "Tabela"} tabIndex={0}>
                <table>
                  {b.caption && <caption>{b.caption}</caption>}
                  <thead>
                    <tr>
                      {b.columns.map((c, ci) => (
                        <th key={c} className={b.numericCols?.includes(ci) ? "num" : undefined}>
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, ri) => (
                      <tr key={ri}>
                        {r.map((cell, ci) => (
                          <td key={ci} data-label={b.columns[ci]} className={b.numericCols?.includes(ci) ? "num" : undefined}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "bars": {
            const max = Math.max(...b.items.map((x) => x.value), 1);
            return (
              <figure key={i} className="bars">
                {b.caption && <figcaption>{b.caption}</figcaption>}
                {b.items.map((x) => (
                  <div key={x.label} className="bar-row">
                    <span className="bar-label">{x.label}</span>
                    <span className="bar-track" aria-hidden="true">
                      <span className="bar-fill" style={{ width: `${(x.value / max) * 100}%` }} />
                    </span>
                    <span className="bar-value">{x.display}</span>
                  </div>
                ))}
              </figure>
            );
          }
          case "suggestions":
            return (
              <div key={i} className="chips">
                {b.items.map((s) => (
                  <button key={s} type="button" className="chip" disabled={disabled} onClick={() => onSuggestion(s)}>
                    {s}
                  </button>
                ))}
              </div>
            );
        }
      })}
    </>
  );
}
