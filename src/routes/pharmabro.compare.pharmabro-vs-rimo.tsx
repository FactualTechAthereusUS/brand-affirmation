import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "PharmaBro vs Rimo Same ownership. Deeper platform | PharmaBr";
const DESCRIPTION = "Rimo also charges a flat fee and pays to your account. PharmaBro adds managed LegitScript in 7 to 14 days, 30+ pharmacies with SKU routing, and a...";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/compare/pharmabro-vs-rimo";

export const Route = createFileRoute("/pharmabro/compare/pharmabro-vs-rimo")({
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
  component: Page_compare_pharmabro_vs_rimo,
});

function Page_compare_pharmabro_vs_rimo() {
  return (
    <StubPage
      eyebrow="Compare"
      lead="PharmaBro vs Rimo"
      trail="Same ownership. Deeper platform."
      intro="Rimo also charges a flat fee and pays to your account. PharmaBro adds managed LegitScript in 7 to 14 days, 30+ pharmacies with SKU routing, and a published price you can check before you call."
      points={["Managed LegitScript certification in 7 to 14 days.", "30+ pharmacies with per-SKU cost routing.", "Publicly published pricing, no quote required."]}
    />
  );
}
