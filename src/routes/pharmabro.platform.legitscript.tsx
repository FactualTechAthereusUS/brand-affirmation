import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "LegitScript in 7-14 days not 3-6 months | PharmaBro";
const DESCRIPTION = "As a LegitScript enterprise partner we manage the entire application from document prep to approval. You sign one form. Typical approval is 12 days,...";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/platform/legitscript";

export const Route = createFileRoute("/pharmabro/platform/legitscript")({
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
  component: Page_platform_legitscript,
});

function Page_platform_legitscript() {
  return (
    <StubPage
      eyebrow="LegitScript Certification"
      lead="LegitScript in 7-14 days,"
      trail="not 3-6 months."
      intro="As a LegitScript enterprise partner we manage the entire application from document prep to approval. You sign one form. Typical approval is 12 days, which unlocks Meta, Google, and TikTok healthcare advertising from launch week."
      points={["Enterprise partner status means priority review.", "One certification unlocks all three major ad platforms.", "Managed end to end at no additional cost."]}
    />
  );
}
