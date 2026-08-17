import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "Your Stripe. Your revenue. Same day | PharmaBro";
const DESCRIPTION = "We connect to your Stripe merchant account via OAuth, so patient payments never touch our balance. Our in-house rebill engine tokenizes every card as a...";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/platform/payments";

export const Route = createFileRoute("/pharmabro/platform/payments")({
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
  component: Page_platform_payments,
});

function Page_platform_payments() {
  return (
    <StubPage
      eyebrow="Payments & Rebill Engine"
      lead="Your Stripe."
      trail="Your revenue. Same day."
      intro="We connect to your Stripe merchant account via OAuth, so patient payments never touch our balance. Our in-house rebill engine tokenizes every card as a one-time transaction, saving 0.5 to 1% per rebill versus subscription APIs."
      points={["Up to 5 MIDs with intelligent routing and failover.", "13 billing cycles per year instead of 12.", "Automatic failed payment recovery and dunning."]}
    />
  );
}
