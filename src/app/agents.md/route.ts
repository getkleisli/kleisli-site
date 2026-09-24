import { readAgentsMarkdown } from "@/lib/content";

export const dynamic = "force-static";

export async function GET() {
  return new Response(await readAgentsMarkdown(), {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
