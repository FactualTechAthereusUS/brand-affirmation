import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "Security that holds up to a HIPAA audit | PharmaBro";
const DESCRIPTION = "AES-256 encryption at rest, TLS in transit, role-based access control, and a full audit log on every patient record. SOC 2 Type II is in progress....";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/security";

export const Route = createFileRoute("/pharmabro/security")({
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
  component: Page_security,
});

function Page_security() {
  return (
    <StubPage
      eyebrow="Security & Compliance"
      lead="Security"
      trail="that holds up to a HIPAA audit."
      intro="AES-256 encryption at rest, TLS in transit, role-based access control, and a full audit log on every patient record. SOC 2 Type II is in progress. LegitScript certification is managed for every brand on the platform."
      points={["HIPAA compliant infrastructure with signed BAAs.", "AES-256 at rest and TLS 1.2+ in transit.", "Zero confirmed patient data breaches to date."]}
    />
  );
}
