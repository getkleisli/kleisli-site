"use client";

import { useEffect, useState, type ReactNode } from "react";

type View = "agent" | "human";

export function Shell({
  markdown,
  agent,
  human,
}: {
  markdown: string;
  agent: ReactNode;
  human: ReactNode;
}) {
  const [view, setView] = useState<View>("agent");
  const [copyLabel, setCopyLabel] = useState("Copy as markdown");

  useEffect(() => {
    if (window.location.hash === "#humans") setView("human");
  }, []);

  function show(next: View) {
    setView(next);
    history.replaceState(null, "", next === "human" ? "#humans" : "#agents");
    window.scrollTo(0, 0);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopyLabel("Copied");
    } catch {
      setCopyLabel("Copy failed. Use /agents.md");
    }
    setTimeout(() => setCopyLabel("Copy as markdown"), 1800);
  }

  const isHuman = view === "human";

  return (
    <>
      <header className="bar">
        <div className="bar-in">
          <div className="brand">
            kleisli <span className="arrow">&gt;=&gt;</span> <small>getkleisli.com</small>
          </div>
          <div className="spacer" />
          {!isHuman && (
            <button className="btn" type="button" onClick={copy}>
              {copyLabel}
            </button>
          )}
          <button
            className="btn primary"
            type="button"
            aria-pressed={isHuman}
            onClick={() => show(isHuman ? "agent" : "human")}
          >
            {isHuman ? "← For agents" : "For humans →"}
          </button>
        </div>
      </header>

      <main className="view agent" hidden={isHuman} aria-label="Kleisli, written for agents">
        <div className="meta-row">
          <span className="chip">content-type: text/markdown</span>
          <span className="chip">audience: agents</span>
          <span className="chip">raw: /agents.md</span>
          <span>Human reading this? Use the button in the top right.</span>
        </div>
        {agent}
      </main>

      <main className="view human" hidden={!isHuman} aria-label="Kleisli, for humans">
        {human}
        <div className="wrap back">
          <button className="btn" type="button" onClick={() => show("agent")}>
            See the page agents read
          </button>
        </div>
      </main>
    </>
  );
}
