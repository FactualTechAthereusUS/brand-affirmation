import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "Longevity protocols for a premium patient base | PharmaBro";
const DESCRIPTION = "NAD+, methylene blue, and metabolic longevity stacks with the clinical review and pharmacy sourcing this emerging category demands.";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/solutions/longevity";

export const Route = createFileRoute("/pharmabro/solutions/longevity")({
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
  component: Page_solutions_longevity,
});

function Page_solutions_longevity() {
  return (
    <StubPage
      eyebrow="Longevity & NAD+"
      lead="Longevity protocols"
      trail="for a premium patient base."
      intro="NAD+, methylene blue, and metabolic longevity stacks with the clinical review and pharmacy sourcing this emerging category demands."
      points={["NAD+ injectable and sublingual fulfillment.", "Metabolic and longevity panel ordering.", "Premium positioning with higher patient LTV."]}
    />
  );
}
