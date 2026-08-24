import { createFileRoute } from "@tanstack/react-router";
import { UOHomePage } from "@/components/unhingedone/UOHomePage";

const TITLE = "Unhinged One — The sweatshirt your family will never forgive";
const DESC =
  "Heavyweight 400gsm crewnecks with something to say. 998 reviews, almost none of them about the sweatshirt. Restock ships October 25.";

export const Route = createFileRoute("/unhingedone/homepage")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
  }),
  component: UOHomePage,
});
