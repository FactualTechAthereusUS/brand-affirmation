import { createFileRoute, notFound } from "@tanstack/react-router";
import { ComparePage } from "@/components/pharmabro/ComparePage";
import { StubPage } from "@/components/pharmabro/StubPage";
import { breadcrumbSchema, faqSchema } from "@/components/pharmabro/Faq";
import { COMPARE, compareBySlug, compareUrl } from "@/lib/pharmabro/compare";

const SITE = "https://sweet-confirm-it.lovable.app";

export const Route = createFileRoute("/pharmabro/compare/$slug")({
  loader: ({ params }) => {
    const entry = compareBySlug(params.slug);
    if (!entry) throw notFound();
    return { entry };
  },
  head: ({ params, loaderData }) => {
    const entry = loaderData?.entry;
    const url = compareUrl(params.slug);

    if (!entry) {
      return {
        meta: [
          { title: "Comparison unavailable | PharmaBro" },
          { name: "robots", content: "noindex" },
        ],
      };
    }

    return {
      meta: [
        { title: entry.title },
        { name: "description", content: entry.description },
        { property: "og:title", content: entry.title },
        { property: "og:description", content: entry.description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: entry.h1Lead + " " + entry.h1Trail,
            description: entry.description,
            datePublished: entry.datePublished,
            dateModified: entry.dateModified,
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            author: { "@type": "Organization", name: "PharmaBro" },
            publisher: { "@type": "Organization", name: "PharmaBro" },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(faqSchema(entry.faqs)),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: `${SITE}/pharmabro` },
              { name: "Compare", url: `${SITE}/pharmabro/compare` },
              { name: `PharmaBro vs ${entry.competitor}`, url },
            ]),
          ),
        },
      ],
    };
  },
  notFoundComponent: CompareNotFound,
  component: CompareRoute,
});

function CompareRoute() {
  const { entry } = Route.useLoaderData();
  return <ComparePage entry={entry} />;
}

function CompareNotFound() {
  return (
    <StubPage
      eyebrow="Compare"
      lead="That comparison"
      trail="does not exist yet."
      intro="Pick one of the published comparisons instead. Every one covers pricing model, revenue share, data ownership, and launch time."
      points={COMPARE.slice(0, 3).map((c) => `PharmaBro vs ${c.competitor}: ${c.teaser}`)}
    />
  );
}
