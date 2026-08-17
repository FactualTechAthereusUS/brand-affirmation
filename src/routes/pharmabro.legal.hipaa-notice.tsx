import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "HIPAA Notice of Privacy Practices | PharmaBro";
const DESCRIPTION = "Your rights regarding protected health information, how it may be used and disclosed, and our obligations as a business associate to covered entities...";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/legal/hipaa-notice";

export const Route = createFileRoute("/pharmabro/legal/hipaa-notice")({
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
  component: Page_legal_hipaa_notice,
});

function Page_legal_hipaa_notice() {
  return (
    <StubPage
      eyebrow="Legal"
      lead="HIPAA Notice of Privacy Practices"
      intro="Your rights regarding protected health information, how it may be used and disclosed, and our obligations as a business associate to covered entities on the platform."
    />
  );
}
