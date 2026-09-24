# kleisli-site

The marketing site for **getkleisli.com**. Kleisli hosts weir: you deploy weir to Kleisli.
The product itself lives in the sibling `kleisli` repo (app.getkleisli.com).

The site is written for agents first. The default view is raw markdown; a **For humans** button
switches to the designed page.

## Where things live

| Path | What it is |
|------|------------|
| `content/agents.md` | The agent view. Single source of truth: rendered on `/`, and served raw at `/agents.md` and `/llms.txt`. |
| `src/components/HumanView.tsx` | The "For humans" view. |
| `src/components/AgentView.tsx` | Renders the markdown with light syntax colouring, without changing the text. |
| `src/components/Shell.tsx` | Top bar, view toggle (`#humans` deep-links to the human view), copy-as-markdown. |

## Run it

```bash
npm install
npm run dev
```

## Deploy

Its own Vercel project, production domain `getkleisli.com`. Nothing here depends on the app repo,
Clerk, or any environment variables.

## Copy rules

- Tag every capability `[runs]`, `[building]` or `[planned]`, and keep the tags true.
  The human view's status table in `HumanView.tsx` must agree with `content/agents.md`.
- Don't document a `kleisli` CLI or API until its interface is decided.
