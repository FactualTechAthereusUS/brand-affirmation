import { createFileRoute } from "@tanstack/react-router";
import { WLIntakeFlow } from "@/components/intake/WLIntakeFlow";

export const Route = createFileRoute("/intake/weight-loss")({
  head: () => ({
    meta: [
      { title: "Start your weight loss assessment — Blissley" },
      {
        name: "description",
        content:
          "A few quick questions to build your personalized GLP-1 weight loss plan. Physician-reviewed within 24 hours.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Start your weight loss assessment — Blissley" },
      {
        property: "og:description",
        content:
          "A few quick questions to build your personalized GLP-1 weight loss plan. Physician-reviewed within 24 hours.",
      },
    ],
  }),
  component: WLIntakePage,
});

function WLIntakePage() {
  return <WLIntakeFlow />;
}
