import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "Built by operators who ran the brands first | PharmaBro";
const DESCRIPTION = "PharmaBro exists because we ran telehealth brands and paid revenue share on every dollar we earned. We built the infrastructure we wanted to buy: flat...";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/about";

export const Route = createFileRoute("/pharmabro/about")({
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
  component: Page_about,
});

function Page_about() {
  return (
    <StubPage
      eyebrow="About"
      lead="Built by operators"
      trail="who ran the brands first."
      intro="PharmaBro exists because we ran telehealth brands and paid revenue share on every dollar we earned. We built the infrastructure we wanted to buy: flat fee, full ownership, live in a week."
      points={["We run Blissley on PharmaBro every day.", "Flat fee is a product decision, not a promotion.", "Your Stripe, your patients, your data, permanently."]}
    />
  );
}
