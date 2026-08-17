import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "Guides and playbooks for telehealth operators | PharmaBro";
const DESCRIPTION = "Deep operator content on revenue share math, GLP-1 economics, LegitScript timelines, and the mechanics of launching a white-label telehealth brand in 2026.";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/blog";

export const Route = createFileRoute("/pharmabro/blog")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: Page_blog,
});

function Page_blog() {
  return (
    <StubPage
      eyebrow="Resources"
      lead="Guides and playbooks"
      trail="for telehealth operators."
      intro="Deep operator content on revenue share math, GLP-1 economics, LegitScript timelines, and the mechanics of launching a white-label telehealth brand in 2026."
      points={["The true cost of revenue share, modeled at every volume tier.", "GLP-1 business guide covering pharmacy, pricing, and refills.", "Launch week playbook used by brands going live in seven days."]}
    />
  );
}
