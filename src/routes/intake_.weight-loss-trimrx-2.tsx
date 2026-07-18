import { createFileRoute } from "@tanstack/react-router";
import { TrimRxIntakeFlowV2 } from "@/components/intake/TrimRxIntakeFlowV2";

export const Route = createFileRoute("/intake_/weight-loss-trimrx-2")({
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
  component: () => <TrimRxIntakeFlowV2 />,
});
