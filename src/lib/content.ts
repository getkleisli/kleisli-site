import { readFile } from "node:fs/promises";
import path from "node:path";

/** content/agents.md is the single source for the agent view, /agents.md and /llms.txt. */
export async function readAgentsMarkdown(): Promise<string> {
  return readFile(path.join(process.cwd(), "content", "agents.md"), "utf8");
}
