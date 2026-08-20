import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Btn,
  Container,
  MicroLabel,
  Reveal,
  RevealGroup,
  RevealItem,
  Section,
  TwoTone,
} from "@/components/pharmabro/primitives";
import { COMPARE } from "@/lib/pharmabro/compare";

const TITLE = "See how PharmaBro compares, honestly | PharmaBro";
const DESCRIPTION =
  "Side-by-side comparisons on pricing model, revenue share, data ownership, launch time, and breach history. We publish our pricing. Most of them do not.";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/compare";

export const Route = createFileRoute("/pharmabro/compare/")({
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
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: TITLE,
          description: DESCRIPTION,
          url: URL,
          hasPart: COMPARE.map((c) => ({
            "@type": "Article",
            headline: `PharmaBro vs ${c.competitor}`,
            url: `${URL}/${c.slug}`,
          })),
        }),
      },
    ],
  }),
  component: CompareHub,
});

function CompareHub() {
  return (
    <>
      <Section className="pt-10 sm:pt-14">
        <Container size="wide">
          <Reveal>
            <MicroLabel className="mb-5">Compare</MicroLabel>
            <TwoTone
              as="h1"
              lead="See how PharmaBro"
              trail="compares, honestly."
              className="max-w-[820px]"
            />
            <p className="pb-body mt-6 max-w-[660px] text-[16px] leading-relaxed sm:text-[17px]">
              {DESCRIPTION}
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <Btn to="/pharmabro/booking" size="lg">
                Book a demo
              </Btn>
              <Btn to="/pharmabro/pricing" variant="ghost" size="lg">
                View pricing
              </Btn>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section band>
        <Container size="wide">
          <Reveal>
            <MicroLabel className="mb-5">
              {COMPARE.length} published comparisons
            </MicroLabel>
          </Reveal>
          <RevealGroup className="mt-4 grid gap-px overflow-hidden rounded-xl border border-[var(--color-hairline)] bg-[var(--color-hairline)] sm:grid-cols-2 lg:grid-cols-3">
            {COMPARE.map((c) => (
              <RevealItem key={c.slug} className="bg-canvas">
                <Link
                  to="/pharmabro/compare/$slug"
                  params={{ slug: c.slug }}
                  className="flex h-full flex-col p-6 transition-colors hover:bg-[var(--color-mist)]"
                >
                  <div className="pb-micro mb-3">{c.category}</div>
                  <div className="text-[17px] font-medium leading-snug text-ink">
                    PharmaBro vs {c.competitor}
                  </div>
                  <p className="pb-body mt-2.5 text-[13.5px] leading-relaxed">{c.teaser}</p>
                  <span className="pb-micro mt-5 text-[var(--color-marine)]">
                    Read comparison →
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>
    </>
  );
}
