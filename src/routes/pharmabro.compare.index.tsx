import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "See how PharmaBro compares, honestly | PharmaBro";
const DESCRIPTION = "Side-by-side comparisons on pricing model, revenue share, data ownership, launch time, and breach history. We publish our pricing. Most of them do not.";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/compare";

export const Route = createFileRoute("/pharmabro/compare/")({
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
  component: Page_compare,
});

function Page_compare() {
  return (
    <StubPage
      eyebrow="Compare"
      lead="See how PharmaBro"
      trail="compares, honestly."
      intro="Side-by-side comparisons on pricing model, revenue share, data ownership, launch time, and breach history. We publish our pricing. Most of them do not."
      points={["Pricing model and revenue share compared line by line.", "Data ownership and export terms in plain language.", "Sourced breach history from the HHS OCR portal."]}
    />
  );
}
