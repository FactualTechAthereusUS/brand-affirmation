import { createFileRoute } from "@tanstack/react-router";
import { WeightLoss3IntakeFlow } from "@/components/intake/WeightLoss3IntakeFlow";

export const Route = createFileRoute("/intake_/weightloss-3")({
  head: () => ({
    meta: [
      { title: "Weight loss assessment - Blissley" },
      {
        name: "description",
        content:
          "A guided medical assessment to see if you're a candidate for a personalized GLP-1 weight loss plan.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <WeightLoss3IntakeFlow />,
});
