import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "PharmaBro vs Cuvo No setup fee. Your own Stripe | PharmaBro";
const DESCRIPTION = "Cuvo charges a flat fee plus a setup fee and pharmacy markups, and payments do not settle to your account. PharmaBro removes the setup fee, the...";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/compare/pharmabro-vs-cuvo";

export const Route = createFileRoute("/pharmabro/compare/pharmabro-vs-cuvo")({
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
  component: Page_compare_pharmabro_vs_cuvo,
});

function Page_compare_pharmabro_vs_cuvo() {
  return (
    <StubPage
      eyebrow="Compare"
      lead="PharmaBro vs Cuvo"
      trail="No setup fee. Your own Stripe."
      intro="Cuvo charges a flat fee plus a setup fee and pharmacy markups, and payments do not settle to your account. PharmaBro removes the setup fee, the markups, and the middleman."
      points={["No setup fee and no pharmacy markups.", "Payments settle directly to your Stripe.", "In-house rebill engine and multi-MID routing included."]}
    />
  );
}
