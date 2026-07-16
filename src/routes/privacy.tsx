import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal/LegalPage";
import content from "@/content/legal/privacy-policy.md?raw";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Blissley" },
      { name: "description", content: "How Blissley collects, uses, and protects your information." },
      { property: "og:title", content: "Privacy Policy — Blissley" },
      { property: "og:description", content: "How Blissley collects, uses, and protects your information." },
    ],
  }),
  component: () => <LegalPage eyebrow="Legal" title="Privacy Policy" content={content} />,
});
