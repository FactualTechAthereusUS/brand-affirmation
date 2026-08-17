import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "TRT and ED fully managed end to end | PharmaBro";
const DESCRIPTION = "Testosterone and ED protocols with lab ordering, physician review, and recurring fulfillment. The clinical workflow, the pharmacy routing, and the...";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/solutions/mens-health";

export const Route = createFileRoute("/pharmabro/solutions/mens-health")({
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
  component: Page_solutions_mens_health,
});

function Page_solutions_mens_health() {
  return (
    <StubPage
      eyebrow="Men's Health"
      lead="TRT and ED,"
      trail="fully managed end to end."
      intro="Testosterone and ED protocols with lab ordering, physician review, and recurring fulfillment. The clinical workflow, the pharmacy routing, and the rebill schedule are configured before you launch."
      points={["Lab ordering and result review inside the workflow.", "TRT, ED, and combined protocol support.", "Discreet packaging and shipment tracking."]}
    />
  );
}
