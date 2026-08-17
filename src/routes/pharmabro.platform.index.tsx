import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "One platform. Every layer of a telehealth brand | PharmaBro";
const DESCRIPTION = "Payments, pharmacy, physicians, patient portal, intake, compliance, and analytics. Pre-integrated, pre-certified, and running under your brand name in...";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/platform";

export const Route = createFileRoute("/pharmabro/platform/")({
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
  component: Page_platform,
});

function Page_platform() {
  return (
    <StubPage
      eyebrow="Platform"
      lead="One platform."
      trail="Every layer of a telehealth brand."
      intro="Payments, pharmacy, physicians, patient portal, intake, compliance, and analytics. Pre-integrated, pre-certified, and running under your brand name in seven days."
      points={["Seven core systems, one flat monthly fee.", "Every layer white-labeled to your domain and your logo.", "Nothing to negotiate, integrate, or self-host."]}
    />
  );
}
