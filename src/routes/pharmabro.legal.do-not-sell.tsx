import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "Do Not Sell My Personal Information | PharmaBro";
const DESCRIPTION = "PharmaBro does not sell personal information. This page explains your rights under applicable state privacy laws and how to submit a request.";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/legal/do-not-sell";

export const Route = createFileRoute("/pharmabro/legal/do-not-sell")({
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
  component: Page_legal_do_not_sell,
});

function Page_legal_do_not_sell() {
  return (
    <StubPage
      eyebrow="Legal"
      lead="Do Not Sell My Personal Information"
      intro="PharmaBro does not sell personal information. This page explains your rights under applicable state privacy laws and how to submit a request."
    />
  );
}
