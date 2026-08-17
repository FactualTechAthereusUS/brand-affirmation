import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "Peptide protocols sourced and routed | PharmaBro";
const DESCRIPTION = "BPC-157, CJC-1295, ipamorelin, and the wider peptide catalog through our compounding partners, with the clinical gating and documentation the category...";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/solutions/peptides";

export const Route = createFileRoute("/pharmabro/solutions/peptides")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: Page_solutions_peptides,
});

function Page_solutions_peptides() {
  return (
    <StubPage
      eyebrow="Peptide Therapy"
      lead="Peptide protocols,"
      trail="sourced and routed."
      intro="BPC-157, CJC-1295, ipamorelin, and the wider peptide catalog through our compounding partners, with the clinical gating and documentation the category requires."
      points={["Broad peptide catalog through vetted compounders.", "Clinical gating and documentation built into intake.", "Cost-optimized routing per peptide SKU."]}
    />
  );
}
