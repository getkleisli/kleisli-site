import { readAgentsMarkdown } from "@/lib/content";

export const dynamic = "force-static";

export async function GET() {
  return new Response(await readAgentsMarkdown(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
