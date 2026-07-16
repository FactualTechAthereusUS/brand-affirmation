import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal/LegalPage";
import content from "@/content/legal/terms-and-conditions.md?raw";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Blissley" },
      { name: "description", content: "The terms that govern your use of the Blissley platform." },
      { property: "og:title", content: "Terms & Conditions — Blissley" },
      { property: "og:description", content: "The terms that govern your use of the Blissley platform." },
    ],
  }),
  component: () => <LegalPage eyebrow="Legal" title="Terms & Conditions" content={content} />,
});
