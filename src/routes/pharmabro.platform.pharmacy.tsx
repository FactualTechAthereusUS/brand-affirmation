import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "30+ pharmacies. Routed per SKU, automatically | PharmaBro";
const DESCRIPTION = "Every order routes to the fastest and cheapest source for that specific SKU. GLP-1, compounding, ED, HRT, peptides, and hair are all covered. You never...";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/platform/pharmacy";

export const Route = createFileRoute("/pharmabro/platform/pharmacy")({
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
  component: Page_platform_pharmacy,
});

function Page_platform_pharmacy() {
  return (
    <StubPage
      eyebrow="Pharmacy Fulfillment"
      lead="30+ pharmacies."
      trail="Routed per SKU, automatically."
      intro="Every order routes to the fastest and cheapest source for that specific SKU. GLP-1, compounding, ED, HRT, peptides, and hair are all covered. You never negotiate a pharmacy contract or maintain a pharmacy API."
      points={["SKU-level routing on cost and fulfillment speed.", "Tracking, exceptions, and refills handled in one queue.", "New pharmacies added without any work on your side."]}
    />
  );
}
