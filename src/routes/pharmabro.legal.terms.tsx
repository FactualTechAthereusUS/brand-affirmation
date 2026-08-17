import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "Terms of Service | PharmaBro";
const DESCRIPTION = "These terms govern your use of the PharmaBro platform. PharmaBro provides telehealth infrastructure software. All clinical decisions are made by...";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/legal/terms";

export const Route = createFileRoute("/pharmabro/legal/terms")({
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
  component: Page_legal_terms,
});

function Page_legal_terms() {
  return (
    <StubPage
      eyebrow="Legal"
      lead="Terms of Service"
      intro="These terms govern your use of the PharmaBro platform. PharmaBro provides telehealth infrastructure software. All clinical decisions are made by licensed healthcare providers."
    />
  );
}
