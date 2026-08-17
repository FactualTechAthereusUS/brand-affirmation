import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "Telehealth infrastructure explained plainly | PharmaBro";
const DESCRIPTION = "MSO, MID, rebill, SKU routing, LegitScript, compounding, async consult. The vocabulary you need to evaluate a telehealth platform without a consultant...";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/glossary";

export const Route = createFileRoute("/pharmabro/glossary")({
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
  component: Page_glossary,
});

function Page_glossary() {
  return (
    <StubPage
      eyebrow="Glossary"
      lead="Telehealth infrastructure"
      trail="explained plainly."
      intro="MSO, MID, rebill, SKU routing, LegitScript, compounding, async consult. The vocabulary you need to evaluate a telehealth platform without a consultant translating for you."
      points={["Plain-language definitions written for operators.", "Cross-linked to the platform pages that implement each concept.", "Updated as regulation and pharmacy practice change."]}
    />
  );
}
