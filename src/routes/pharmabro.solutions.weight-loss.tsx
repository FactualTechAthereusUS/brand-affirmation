import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "Launch a GLP-1 brand in seven days | PharmaBro";
const DESCRIPTION = "Semaglutide and tirzepatide sourced through our compounding network, SKU-routed on cost, with dose titration, refill logic, and side-effect protocols...";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/solutions/weight-loss";

export const Route = createFileRoute("/pharmabro/solutions/weight-loss")({
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
  component: Page_solutions_weight_loss,
});

function Page_solutions_weight_loss() {
  return (
    <StubPage
      eyebrow="Weight Loss"
      lead="Launch a GLP-1 brand"
      trail="in seven days."
      intro="Semaglutide and tirzepatide sourced through our compounding network, SKU-routed on cost, with dose titration, refill logic, and side-effect protocols already built into the intake and the portal."
      points={["Compounded semaglutide and tirzepatide fulfillment.", "Titration schedules and refill timing handled automatically.", "Weight projection charts built into the patient portal."]}
    />
  );
}
