import { createFileRoute } from "@tanstack/react-router";
import { BookingPage } from "@/components/pharmabro/BookingPage";

const TITLE = "See PharmaBro live. 20 minutes, no slides | PharmaBro";
const DESCRIPTION = "We will model your current platform cost against a PharmaBro flat fee using your real patient volume, then walk you through the operator dashboard, the intake builder, and the rebill engine.";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/demo";

export const Route = createFileRoute("/pharmabro/demo")({
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
  component: Page_demo,
});

function Page_demo() {
  return <BookingPage />;
}

