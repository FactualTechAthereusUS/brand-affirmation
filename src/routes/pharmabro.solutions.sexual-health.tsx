import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/pharmabro/StubPage";

const TITLE = "Sexual health discreet and recurring | PharmaBro";
const DESCRIPTION = "ED, PE, and libido protocols with fully async intake, discreet packaging, and recurring billing. One of the highest-converting verticals in telehealth.";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/solutions/sexual-health";

export const Route = createFileRoute("/pharmabro/solutions/sexual-health")({
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
  component: Page_solutions_sexual_health,
});

function Page_solutions_sexual_health() {
  return (
    <StubPage
      eyebrow="Sexual Health"
      lead="Sexual health,"
      trail="discreet and recurring."
      intro="ED, PE, and libido protocols with fully async intake, discreet packaging, and recurring billing. One of the highest-converting verticals in telehealth."
      points={["Sildenafil, tadalafil, and combination therapies.", "Fully async intake with no video requirement.", "Discreet, unbranded shipping on every order."]}
    />
  );
}
