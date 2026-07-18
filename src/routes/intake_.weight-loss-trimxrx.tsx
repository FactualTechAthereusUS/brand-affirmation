import { createFileRoute } from "@tanstack/react-router";
import { TrimRxIntakeFlow } from "@/components/intake/TrimRxIntakeFlow";

export const Route = createFileRoute("/intake_/weight-loss-trimxrx")({
  head: () => ({
    meta: [
      { title: "Weight loss assessment — Blissley" },
      {
        name: "description",
        content:
          "A guided medical assessment to see if you're a candidate for a personalized GLP-1 weight loss plan.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <TrimRxIntakeFlow />,
});
