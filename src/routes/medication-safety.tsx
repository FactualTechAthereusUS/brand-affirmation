import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal/LegalPage";
import content from "@/content/legal/medication-safety-information.md?raw";

export const Route = createFileRoute("/medication-safety")({
  head: () => ({
    meta: [
      { title: "Medication Safety Information — Blissley" },
      { name: "description", content: "Important information about medications prescribed through Blissley." },
      { property: "og:title", content: "Medication Safety Information — Blissley" },
      { property: "og:description", content: "Important information about medications prescribed through Blissley." },
    ],
  }),
  component: () => <LegalPage eyebrow="Safety" title="Medication Safety" content={content} />,
});
