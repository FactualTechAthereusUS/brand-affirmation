import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "Build a clinical intake without writing code | PharmaBro";
const DESCRIPTION = "Drag-and-drop screens, branching logic, medical history gates, and physician-reviewed question sets. Publish to your domain and start collecting...";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/platform/intake-builder";

export const Route = createFileRoute("/pharmabro/platform/intake-builder")({
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
  component: Page_platform_intake_builder,
});

function Page_platform_intake_builder() {
  return (
    <StubPage
      eyebrow="Intake Builder"
      lead="Build a clinical intake"
      trail="without writing code."
      intro="Drag-and-drop screens, branching logic, medical history gates, and physician-reviewed question sets. Publish to your domain and start collecting consults the same afternoon."
      points={["No-code branching logic with clinical safety gates.", "Screen-level drop-off analytics on every question.", "Templates for every treatment vertical we support."]}
    />
  );
}
