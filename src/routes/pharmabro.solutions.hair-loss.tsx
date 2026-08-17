import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "Finasteride and minoxidil on autopilot | PharmaBro";
const DESCRIPTION = "Topical and oral hair loss protocols with async consults and recurring fulfillment. High-retention, low-complexity, and one of the fastest verticals to...";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/solutions/hair-loss";

export const Route = createFileRoute("/pharmabro/solutions/hair-loss")({
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
  component: Page_solutions_hair_loss,
});

function Page_solutions_hair_loss() {
  return (
    <StubPage
      eyebrow="Hair Loss"
      lead="Finasteride and minoxidil"
      trail="on autopilot."
      intro="Topical and oral hair loss protocols with async consults and recurring fulfillment. High-retention, low-complexity, and one of the fastest verticals to launch on PharmaBro."
      points={["Oral and topical finasteride and minoxidil.", "Simple async intake with high completion rates.", "Recurring 90-day fulfillment cycles."]}
    />
  );
}
