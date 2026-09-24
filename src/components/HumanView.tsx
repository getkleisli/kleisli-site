type Status = "runs" | "building" | "planned";

const STATUS_ROWS: { piece: string; does: string; status: Status }[] = [
  { piece: "weir compiler", does: "Reads edge, node and topology files and checks they fit together", status: "runs" },
  { piece: "Acceptance gate", does: "Runs examples, generated cases and properties before an agent's code is kept", status: "runs" },
  { piece: "Replay", does: "Re-runs a past invocation against the exact implementation it used", status: "runs" },
  { piece: "Iteration", does: "Cycles in the wiring run until nothing is left to process", status: "runs" },
  { piece: "Deploy to Kleisli", does: "Push your edges, nodes, topology and accepted bodies; Kleisli hosts them", status: "planned" },
  { piece: "Kleisli app", does: "Sign in and manage your topologies at app.getkleisli.com", status: "building" },
  { piece: "Hosted runs", does: "Durable orchestration, isolated node execution, per-run budgets", status: "planned" },
  { piece: "Planner", does: "Suggests type-safe routes from one edge to another", status: "planned" },
];

const WEIR_REPO = "https://github.com/jordanskole/weir";

export function HumanView() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="eyebrow">Kleisli &middot; hosted weir</div>
          <h1 className="analogy">
            Deploy weir
            <br />
            to <span className="kl">Kleisli</span>.
          </h1>
          <div className="gloss">
            Next.js<span className="kl"> : </span>Vercel<span className="kl"> :: </span>weir
            <span className="kl"> : </span>Kleisli
          </div>
          <p className="lede">
            You design the shape of your software: the data, and the places it has to pass through. Agents
            write the code in between. Deploy it to Kleisli, and Kleisli hosts it: runs every step, keeps a
            record of each one, and can replay any run exactly.
          </p>
          <div className="hero-cta">
            <a className="btn primary" href={WEIR_REPO} target="_blank" rel="noopener">
              Read the weir source
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Three jobs, three owners</h2>
          <p className="sub">
            weir draws a hard line between the parts people should decide and the parts machines are good at
            filling in.
          </p>
          <div className="split">
            <div>
              <div className="who">You</div>
              <h3>Draw the weir</h3>
              <p>
                Name your data as <code>.edge</code> files and wire steps together in a <code>.topology</code>. A
                fish weir funnels a river through one narrow gap so you can check what passes. Edges are those
                gaps.
              </p>
            </div>
            <div>
              <div className="who">Your agents</div>
              <h3>Fill in the nodes</h3>
              <p>
                Each <code>.node</code> is a contract: one input, one output, a few examples. An agent writes
                the body. It only ships if it passes the examples and the properties you declared.
              </p>
            </div>
            <div>
              <div className="who">Kleisli</div>
              <h3>Run it and remember</h3>
              <p>
                Every value that crosses an edge is logged. Side effects are recorded as data, so replaying a
                run gives you the same answer, even a month later.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>A whole program, in three files</h2>
          <p className="sub">
            This is the recipe example from the weir repo, trimmed to fit. There are no function bodies here.
            Those are generated, checked, and kept separately.
          </p>
          <div className="files">
            <div className="file">
              <div className="fname">
                <span>edges/Dough.edge</span>
                <span>schema</span>
              </div>
              <pre>
                <span className="k">label</span>: Dough{"\n"}
                <span className="k">fields</span>:{"\n"}
                {"  "}<span className="k">title</span>:{"\n"}
                {"    "}<span className="k">type</span>: utf8{"\n"}
                {"    "}<span className="k">nullable</span>: false{"\n"}
                {"  "}<span className="k">servings</span>:{"\n"}
                {"    "}<span className="k">type</span>: uint8{"\n"}
                {"    "}<span className="k">nullable</span>: false
              </pre>
            </div>
            <div className="file">
              <div className="fname">
                <span>nodes/bake.node</span>
                <span>contract</span>
              </div>
              <pre>
                <span className="k">label</span>: Bake{"\n"}
                <span className="k">input</span>:{"\n"}
                {"  "}<span className="k">allOf</span>:{"\n"}
                {"    "}- Dough{"\n"}
                {"    "}- Oven{"\n"}
                <span className="k">output</span>: BakedCookies{"\n"}
                <span className="c"># waits until both exist</span>
              </pre>
            </div>
            <div className="file">
              <div className="fname">
                <span>topology/main.topology</span>
                <span>wiring</span>
              </div>
              <pre>
                <span className="k">gatherIngredients</span>:{"\n"}
                {"  "}<span className="k">then</span>:{"\n"}
                {"    "}<span className="k">mix</span>:{"\n"}
                {"      "}<span className="k">then</span>:{"\n"}
                {"        "}<span className="k">bake</span>:{"\n"}
                {"          "}<span className="k">then</span>: {"{ "}<span className="k">cool</span>: {"{} }"}{"\n"}
                {"    "}<span className="k">preheatOven</span>:{"\n"}
                {"      "}<span className="k">then</span>: {"{ "}<span className="k">bake</span>: {"{} }"}
              </pre>
            </div>
          </div>
          <p className="caption">
            Mixing and preheating run at the same time. <code>bake</code> fires once both the dough and the hot
            oven exist, in whatever order they arrive.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap arrow-sec">
          <div>
            <h2>Why it&apos;s called Kleisli</h2>
            <p>
              In category theory, a Kleisli arrow is a function that returns its result wrapped in a context: a
              value that might have failed, or a request to go do something. Kleisli composition is how you chain
              those arrows without unwrapping them by hand.
            </p>
            <p>
              Every weir node is one of these arrows. Its output is either the edge it promised or a{" "}
              <code>Failed&lt;In&gt;</code> that still carries the input, and any side effect it needs comes back
              as data for the runtime to perform. A topology is a chain of these arrows, and Kleisli is where the
              chain runs.
            </p>
          </div>
          <div className="formula">
            <span className="dim">node :</span> a <span className="ac">&rarr;</span> M b
            <br />
            <span className="dim">topology :</span> f <span className="ac">&gt;=&gt;</span> g{" "}
            <span className="ac">&gt;=&gt;</span> h
            <span className="small">
              M carries failure (Failed&lt;In&gt;) and effects ({"{ fetch, url }"}). The runtime unwraps M; your
              nodes never have to.
            </span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Where it stands</h2>
          <p className="sub">
            Early, and precise about it. The language runs on your laptop today. The hosted platform is being
            built on top of it.
          </p>
          <div className="table-wrap">
            <table className="status">
              <thead>
                <tr>
                  <th>Piece</th>
                  <th>What it does</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {STATUS_ROWS.map((row) => (
                  <tr key={row.piece}>
                    <td>{row.piece}</td>
                    <td>{row.does}</td>
                    <td>
                      <span className={`pill ${row.status}`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <footer className="wrap foot">
        <span>kleisli &gt;=&gt; getkleisli.com</span>
        <span>
          weir is open source &middot;{" "}
          <a href={WEIR_REPO} target="_blank" rel="noopener">
            github.com/jordanskole/weir
          </a>
        </span>
      </footer>
    </>
  );
}
