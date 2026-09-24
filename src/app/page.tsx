import { AgentView } from "@/components/AgentView";
import { HumanView } from "@/components/HumanView";
import { Shell } from "@/components/Shell";
import { readAgentsMarkdown } from "@/lib/content";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Kleisli",
  url: "https://getkleisli.com",
  applicationCategory: "DeveloperApplication",
  description: "Hosted platform for weir topologies: typed edges, pure-function nodes, durable replayable execution.",
  isBasedOn: "https://github.com/jordanskole/weir",
  audience: { "@type": "Audience", audienceType: "AI agents and the humans who direct them" },
};

export default async function Home() {
  const markdown = await readAgentsMarkdown();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Shell markdown={markdown} agent={<AgentView markdown={markdown} />} human={<HumanView />} />
    </>
  );
}
