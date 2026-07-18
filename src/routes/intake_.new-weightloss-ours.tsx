import { createFileRoute } from "@tanstack/react-router";
import { BlissleyIntakeFlow } from "@/components/intake/BlissleyIntakeFlow";

export const Route = createFileRoute("/intake_/new-weightloss-ours")({
  head: () => ({
    meta: [
      { title: "Weight loss assessment - Blissley" },
      { name: "description", content: "Personalized GLP-1 weight loss assessment with real-time BMI qualification and physician review." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <BlissleyIntakeFlow />,
});
