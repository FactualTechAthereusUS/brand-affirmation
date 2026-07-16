import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal/LegalPage";
import content from "@/content/legal/shipping-policy.md?raw";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping Policy — Blissley" },
      { name: "description", content: "How your medication is processed, prepared, and shipped." },
      { property: "og:title", content: "Shipping Policy — Blissley" },
      { property: "og:description", content: "How your medication is processed, prepared, and shipped." },
    ],
  }),
  component: () => <LegalPage eyebrow="Legal" title="Shipping Policy" content={content} />,
});
