import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "Privacy Policy | PharmaBro";
const DESCRIPTION = "How PharmaBro collects, uses, stores, and protects information, including protected health information handled on behalf of brand operators under a...";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/legal/privacy";

export const Route = createFileRoute("/pharmabro/legal/privacy")({
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
  component: Page_legal_privacy,
});

function Page_legal_privacy() {
  return (
    <StubPage
      eyebrow="Legal"
      lead="Privacy Policy"
      intro="How PharmaBro collects, uses, stores, and protects information, including protected health information handled on behalf of brand operators under a business associate agreement."
    />
  );
}
