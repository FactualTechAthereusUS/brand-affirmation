import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "PharmaBro vs CareValidate Built for brands, not for clinics ";
const DESCRIPTION = "CareValidate is compliance tooling for existing clinics. PharmaBro is the full commercial stack a direct-to-consumer brand needs: checkout, rebill,...";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/compare/pharmabro-vs-carevalidate";

export const Route = createFileRoute("/pharmabro/compare/pharmabro-vs-carevalidate")({
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
  component: Page_compare_pharmabro_vs_carevalidate,
});

function Page_compare_pharmabro_vs_carevalidate() {
  return (
    <StubPage
      eyebrow="Compare"
      lead="PharmaBro vs CareValidate"
      trail="Built for brands, not for clinics."
      intro="CareValidate is compliance tooling for existing clinics. PharmaBro is the full commercial stack a direct-to-consumer brand needs: checkout, rebill, pharmacy, portal, and attribution."
      points={["Full commercial stack, not compliance tooling alone.", "Checkout, rebill, and pharmacy fulfillment included.", "Launch a new brand in seven days from zero."]}
    />
  );
}
