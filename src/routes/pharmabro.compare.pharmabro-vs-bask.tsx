import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "PharmaBro vs Bask Public pricing vs hidden percentages | Pha";
const DESCRIPTION = "Bask does not publish pricing and takes an undisclosed percentage. PharmaBro publishes a flat fee and takes no revenue share. Launch is seven days...";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/compare/pharmabro-vs-bask";

export const Route = createFileRoute("/pharmabro/compare/pharmabro-vs-bask")({
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
  component: Page_compare_pharmabro_vs_bask,
});

function Page_compare_pharmabro_vs_bask() {
  return (
    <StubPage
      eyebrow="Compare"
      lead="PharmaBro vs Bask"
      trail="Public pricing vs hidden percentages."
      intro="Bask does not publish pricing and takes an undisclosed percentage. PharmaBro publishes a flat fee and takes no revenue share. Launch is seven days versus 30 to 40."
      points={["Published flat fee versus undisclosed percentage.", "Seven day launch versus 30 to 40 days.", "Unlimited brands versus limited multi-brand support."]}
    />
  );
}
