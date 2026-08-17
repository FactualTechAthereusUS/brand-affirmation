import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "PharmaBro vs OpenLoop Flat fee vs 35% revenue share | Pharma";
const DESCRIPTION = "OpenLoop takes 35% of revenue you generated with your own ads and your own brand. PharmaBro charges a flat fee and pays into your Stripe. On a...";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/compare/pharmabro-vs-openloop";

export const Route = createFileRoute("/pharmabro/compare/pharmabro-vs-openloop")({
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
  component: Page_compare_pharmabro_vs_openloop,
});

function Page_compare_pharmabro_vs_openloop() {
  return (
    <StubPage
      eyebrow="Compare"
      lead="PharmaBro vs OpenLoop"
      trail="Flat fee vs 35% revenue share."
      intro="OpenLoop takes 35% of revenue you generated with your own ads and your own brand. PharmaBro charges a flat fee and pays into your Stripe. On a 300-patient brand that is $346,740 per year."
      points={["Flat fee versus 35% revenue share on every dollar.", "Your Stripe versus their merchant account.", "716,000 patients affected in the January 2026 breach."]}
    />
  );
}
