import { memo, type ReactElement } from "react";

/** Minimal, dependency-free pretty JSON renderer with semantic syntax tokens. */
function render(value: unknown, indent = 0): ReactElement[] {
  const pad = "  ".repeat(indent);
  const out: ReactElement[] = [];
  let key = 0;

  if (value === null)
    return [
      <span key={key++} className="text-[var(--syntax-null)]">
        null
      </span>,
    ];
  if (typeof value === "string")
    return [
      <span key={key++} className="text-[var(--syntax-string)]">
        "{value}"
      </span>,
    ];
  if (typeof value === "number")
    return [
      <span key={key++} className="text-[var(--syntax-number)]">
        {value}
      </span>,
    ];
  if (typeof value === "boolean")
    return [
      <span key={key++} className="text-[var(--syntax-bool)]">
        {String(value)}
      </span>,
    ];

  if (Array.isArray(value)) {
    if (value.length === 0)
      return [
        <span key={key++} className="text-[var(--syntax-punct)]">
          []
        </span>,
      ];
    out.push(
      <span key={key++} className="text-[var(--syntax-punct)]">
        [
      </span>,
    );
    value.forEach((v, i) => {
      out.push(<span key={key++}>{"\n" + pad + "  "}</span>);
      out.push(...render(v, indent + 1));
      if (i < value.length - 1)
        out.push(
          <span key={key++} className="text-[var(--syntax-punct)]">
            ,
          </span>,
        );
    });
    out.push(<span key={key++}>{"\n" + pad}</span>);
    out.push(
      <span key={key++} className="text-[var(--syntax-punct)]">
        ]
      </span>,
    );
    return out;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0)
      return [
        <span key={key++} className="text-[var(--syntax-punct)]">
          {"{}"}
        </span>,
      ];
    out.push(
      <span key={key++} className="text-[var(--syntax-punct)]">
        {"{"}
      </span>,
    );
    entries.forEach(([k, v], i) => {
      out.push(<span key={key++}>{"\n" + pad + "  "}</span>);
      out.push(
        <span key={key++} className="text-[var(--syntax-key)]">
          "{k}"
        </span>,
      );
      out.push(
        <span key={key++} className="text-[var(--syntax-punct)]">
          :{" "}
        </span>,
      );
      out.push(...render(v, indent + 1));
      if (i < entries.length - 1)
        out.push(
          <span key={key++} className="text-[var(--syntax-punct)]">
            ,
          </span>,
        );
    });
    out.push(<span key={key++}>{"\n" + pad}</span>);
    out.push(
      <span key={key++} className="text-[var(--syntax-punct)]">
        {"}"}
      </span>,
    );
    return out;
  }

  return [<span key={key++}>{String(value)}</span>];
}

export const JsonView = memo(function JsonView({ data }: { data: unknown }) {
  return (
    <pre className="font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap break-words">
      {render(data)}
    </pre>
  );
});
