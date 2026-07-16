import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal/LegalPage";
import content from "@/content/legal/refund-policy.md?raw";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Refund Policy — Blissley" },
      { name: "description", content: "Transparent, honest billing. When refunds are available and how to request them." },
      { property: "og:title", content: "Refund Policy — Blissley" },
      { property: "og:description", content: "Transparent, honest billing. When refunds are available and how to request them." },
    ],
  }),
  component: () => <LegalPage eyebrow="Legal" title="Refund Policy" content={content} />,
});
