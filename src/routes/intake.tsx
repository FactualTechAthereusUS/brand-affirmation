import { createFileRoute } from "@tanstack/react-router";
import { IntakeFlow } from "@/components/intake/IntakeFlow";

export const Route = createFileRoute("/intake")({
  head: () => ({
    meta: [
      { title: "Start your assessment — Blissley" },
      {
        name: "description",
        content:
          "A few quick questions to build your personalized Blissley program. Physician-reviewed within 24 hours.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Start your assessment — Blissley" },
      {
        property: "og:description",
        content:
          "A few quick questions to build your personalized Blissley program. Physician-reviewed within 24 hours.",
      },
    ],
  }),
  component: IntakePage,
});

function IntakePage() {
  return <IntakeFlow />;
}
