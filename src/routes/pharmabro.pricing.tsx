import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "Flat fee pricing. No revenue share, ever | PharmaBro";
const DESCRIPTION = "Every plan is a flat monthly fee. You keep 100% of your patient revenue because it never leaves your Stripe account in the first place. Compare that to...";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/pricing";

export const Route = createFileRoute("/pharmabro/pricing")({
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
  component: Page_pricing,
});

function Page_pricing() {
  return (
    <StubPage
      eyebrow="Pricing"
      lead="Flat fee pricing."
      trail="No revenue share, ever."
      intro="Every plan is a flat monthly fee. You keep 100% of your patient revenue because it never leaves your Stripe account in the first place. Compare that to a 35% revenue share and the difference is hundreds of thousands per year."
      points={["Flat monthly fee, published publicly, no custom quote games.", "Zero revenue share and zero per-prescription markups.", "Unlimited brands on one account at every tier."]}
    />
  );
}
