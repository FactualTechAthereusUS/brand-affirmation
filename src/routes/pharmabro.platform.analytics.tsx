import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "Attribution from day one not month three | PharmaBro";
const DESCRIPTION = "Meta CAPI, GA4, TikTok Pixel, Everflow, Triple Whale, and Klaviyo are pre-wired to your brand. Cohort churn, rebill forecasting, and screen-level...";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/platform/analytics";

export const Route = createFileRoute("/pharmabro/platform/analytics")({
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
  component: Page_platform_analytics,
});

function Page_platform_analytics() {
  return (
    <StubPage
      eyebrow="Analytics & Reporting"
      lead="Attribution from day one,"
      trail="not month three."
      intro="Meta CAPI, GA4, TikTok Pixel, Everflow, Triple Whale, and Klaviyo are pre-wired to your brand. Cohort churn, rebill forecasting, and screen-level funnel drop-off are built in."
      points={["Every ad and analytics integration wired before launch.", "Cohort churn and rebill revenue forecasting.", "Full patient CSV export in 24 hours, any time."]}
    />
  );
}
