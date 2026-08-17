import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "Hormone therapy under your brand | PharmaBro";
const DESCRIPTION = "HRT, birth control, and menopause protocols with async consults, physician oversight, and recurring pharmacy fulfillment. Built for brands serving...";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/solutions/womens-health";

export const Route = createFileRoute("/pharmabro/solutions/womens-health")({
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
  component: Page_solutions_womens_health,
});

function Page_solutions_womens_health() {
  return (
    <StubPage
      eyebrow="Women's Health"
      lead="Hormone therapy"
      trail="under your brand."
      intro="HRT, birth control, and menopause protocols with async consults, physician oversight, and recurring pharmacy fulfillment. Built for brands serving women across every life stage."
      points={["HRT, contraception, and menopause protocols.", "Async consults with licensed physician review.", "Recurring fulfillment with automatic refill timing."]}
    />
  );
}
