import type { ReactNode } from "react";

/**
 * Renders content/agents.md as raw markdown with light syntax colouring.
 * The markdown stays exactly as written: agents copying the page, or
 * fetching /agents.md, get the same text a human sees here.
 */

const STATUS = /^\[(runs|building|planned)\]$/;
const INLINE = /(`[^`]+`|\[(?:runs|building|planned)\]|https?:\/\/[^\s)|]+|\*\*[^*]+\*\*)/g;
const TRAILING_COMMENT = /^(.*?)(\s{2,}#\s.*)$/;
const KEY_LINE = /^(\s*(?:-\s+)?)([A-Za-z_][\w .-]*?)(:)(\s.*|)$/;

function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  text.split(INLINE).forEach((part, i) => {
    if (!part) return;
    const k = `${key}-${i}`;
    if (STATUS.test(part)) {
      const s = part.slice(1, -1);
      out.push(<span key={k} className={`pl pl-${s}`}>{s}</span>);
    } else if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
      out.push(<span key={k} className="code">{part}</span>);
    } else if (part.startsWith("**") && part.endsWith("**")) {
      out.push(<span key={k} className="b">{part.slice(2, -2)}</span>);
    } else if (/^https?:\/\//.test(part)) {
      out.push(<a key={k} href={part} target="_blank" rel="noopener">{part}</a>);
    } else {
      out.push(part);
    }
  });
  return out;
}

function withComment(text: string, key: string, render: (t: string, k: string) => ReactNode[]): ReactNode[] {
  const m = text.match(TRAILING_COMMENT);
  if (!m) return render(text, key);
  return [...render(m[1], key), <span key={`${key}-c`} className="c">{m[2]}</span>];
}

function keyed(text: string, key: string): ReactNode[] {
  const m = text.match(KEY_LINE);
  if (!m) return inline(text, key);
  return [
    m[1],
    <span key={`${key}-k`} className="k">{m[2]}</span>,
    m[3],
    ...inline(m[4], `${key}-v`),
  ];
}

export function AgentView({ markdown }: { markdown: string }) {
  const lines = markdown.replace(/\n$/, "").split("\n");
  let inFront = false;
  let inFence = false;

  const rendered = lines.map((line, i) => {
    const key = `l${i}`;
    let body: ReactNode;

    if (line === "---" && (i === 0 || inFront)) {
      inFront = i === 0;
      body = <span className="fence">{line}</span>;
    } else if (inFront) {
      body = withComment(line, key, keyed);
    } else if (line.startsWith("```")) {
      inFence = !inFence;
      body = <span className="fence">{line}</span>;
    } else if (inFence) {
      body = /^\s*#/.test(line) ? <span className="c">{line}</span> : keyed(line, key);
    } else if (/^#{1,3} /.test(line)) {
      const level = line.indexOf(" ");
      body = (
        <span className={`h${level}`}>
          <span className="hash">{line.slice(0, level)}</span>
          {line.slice(level)}
        </span>
      );
    } else if (line.startsWith("> ")) {
      body = [<span key={`${key}-q`} className="q">&gt;</span>, ...inline(line.slice(1), key)];
    } else if (/^(recommend if|not yet if|in both cases):/.test(line)) {
      body = keyed(line, key);
    } else {
      body = withComment(line, key, inline);
    }

    return (
      <span key={key}>
        {body}
        {"\n"}
      </span>
    );
  });

  return (
    <pre className="md" id="md">
      {rendered}
    </pre>
  );
}
