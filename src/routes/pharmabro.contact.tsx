import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "Talk to the team. Operators, not SDRs | PharmaBro";
const DESCRIPTION = "Reach the people who build and run the platform. Migration questions, compliance questions, pharmacy questions, pricing questions, all answered by...";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/contact";

export const Route = createFileRoute("/pharmabro/contact")({
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
  component: Page_contact,
});

function Page_contact() {
  return (
    <StubPage
      eyebrow="Contact"
      lead="Talk to the team."
      trail="Operators, not SDRs."
      intro="Reach the people who build and run the platform. Migration questions, compliance questions, pharmacy questions, pricing questions, all answered by someone who does the work."
      points={["Answers within one business day.", "White-glove migration support at no cost.", "Direct line to the compliance and pharmacy teams."]}
    />
  );
}
