import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "A patient portal that never says PharmaBro | PharmaBro";
const DESCRIPTION = "Your patients log in at portal.yourbrand.com. They manage subscriptions, view prescription history, message their physician, and track shipments, all...";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/platform/patient-portal";

export const Route = createFileRoute("/pharmabro/platform/patient-portal")({
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
  component: Page_platform_patient_portal,
});

function Page_platform_patient_portal() {
  return (
    <StubPage
      eyebrow="Patient Portal"
      lead="A patient portal"
      trail="that never says PharmaBro."
      intro="Your patients log in at portal.yourbrand.com. They manage subscriptions, view prescription history, message their physician, and track shipments, all under your name. We are invisible to them."
      points={["Fully white-labeled on your own subdomain.", "Subscription management, Rx history, and secure messaging.", "Mobile-first, built to feel like a native app."]}
    />
  );
}
