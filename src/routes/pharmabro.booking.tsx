import { createFileRoute } from "@tanstack/react-router";
import { BookingPage } from "@/components/pharmabro/BookingPage";

const TITLE = "Book a strategy call | PharmaBro";
const DESCRIPTION =
  "Pick a time for a 30 minute strategy call. We map your brand onto PharmaBro: 50-state providers, pharmacy fulfillment, intake, and compliance under your name.";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/booking";

export const Route = createFileRoute("/pharmabro/booking")({
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
  component: BookingRoute,
});

function BookingRoute() {
  return <BookingPage />;
}
