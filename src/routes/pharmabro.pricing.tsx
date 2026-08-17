import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Btn,
  Card,
  Check,
  Chip,
  Container,
  MicroLabel,
  Reveal,
  RevealGroup,
  RevealItem,
  Section,
  TwoTone,
} from "@/components/pharmabro/primitives";
import { Faq, faqSchema, breadcrumbSchema } from "@/components/pharmabro/Faq";
import { PricingTiers } from "@/components/pharmabro/pricing/PricingTiers";
import { FeatureTable } from "@/components/pharmabro/pricing/FeatureTable";
import { RevenueCalculator } from "@/components/pharmabro/pricing/RevenueCalculator";
import {
  addOns,
  pricingFaqs,
  setupCards,
  transparencyCallout,
} from "@/lib/pharmabro/pricing";

const TITLE = "PharmaBro Pricing (2026) — Flat Fees, Zero Revenue Share";
const DESCRIPTION =
  "PharmaBro charges a flat monthly fee starting at $1,000/mo. No revenue share. No percentage of billings. Your Stripe. Your patients. Full feature table and plan comparison.";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/pricing";

export const Route = createFileRoute("/pharmabro/pricing")({
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
          "@type": "SoftwareApplication",
          name: "PharmaBro",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: URL,
          offers: [
            {
              "@type": "Offer",
              name: "Launch",
              price: "1000",
              priceCurrency: "USD",
              description: "Flat monthly fee, 0-500 active patients. No revenue share.",
            },
            {
              "@type": "Offer",
              name: "Growth",
              price: "2500",
              priceCurrency: "USD",
              description: "Flat monthly fee, 500-2,000 active patients. No revenue share.",
            },
            {
              "@type": "Offer",
              name: "Scale",
              price: "5000",
              priceCurrency: "USD",
              description: "Flat monthly fee, 2,000-5,000+ active patients. No revenue share.",
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(faqSchema(pricingFaqs)),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Home", url: "https://sweet-confirm-it.lovable.app/pharmabro" },
            { name: "Pricing", url: URL },
          ]),
        ),
      },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <>
      {/* ------------------------------------------------------------- hero */}
      <Section className="pt-10 sm:pt-14">
        <Container size="wide">
          <Reveal>
            <div className="mb-6 flex flex-wrap items-center gap-2.5">
              <MicroLabel>Pricing</MicroLabel>
              <span className="pb-micro rounded-full border border-[var(--color-hairline)] px-2.5 py-1">
                Pricing last reviewed: August 2026
              </span>
            </div>

            <TwoTone
              as="h1"
              lead="Simple pricing."
              trail="You keep what you earn."
              className="max-w-[880px]"
            />
            <p className="pb-body mt-6 max-w-[700px] text-[16px] leading-relaxed sm:text-[17px]">
              No revenue share. No percentage of your billings. One flat platform fee by
              patient volume. You own your Stripe. You own your patients. You own your data.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              <Chip tone="live">
                PharmaBro launch guarantee: first patient in 7 days or we refund your setup fee
              </Chip>
              <Chip to="/pharmabro/compare">Compare vs revenue share</Chip>
            </div>

            <div className="mt-8 flex flex-wrap gap-2.5">
              <Btn to="/pharmabro/demo" size="lg">
                Book a demo
              </Btn>
              <Btn to="/pharmabro/compare" variant="ghost" size="lg">
                See every comparison
              </Btn>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-10 flex flex-col gap-3 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-mist)] p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[14.5px] leading-relaxed text-ink">
                Switching from another platform? Free white-glove migration. We move your
                patients and data for you.
              </p>
              <Btn to="/pharmabro/contact" variant="ghost">
                Talk to migration
              </Btn>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ------------------------------------------------------------ tiers */}
      <Section band id="plans" className="py-14 sm:py-20">
        <Container size="full">
          <Reveal>
            <MicroLabel className="mb-5">Plans</MicroLabel>
            <TwoTone
              lead="Three volume tiers,"
              trail="plus headless for teams building their own front end."
              className="max-w-[820px]"
            />
          </Reveal>
          <div className="mt-10">
            <PricingTiers />
          </div>

          <Reveal delay={0.08} className="mt-8">
            <div className="rounded-xl border border-[color-mix(in_oklab,var(--color-marine)_28%,transparent)] bg-canvas p-6 sm:p-8">
              <MicroLabel className="mb-3">Transparency</MicroLabel>
              <h3 className="text-[20px] leading-snug text-ink">{transparencyCallout.title}</h3>
              <p className="pb-body mt-3 max-w-[760px] text-[15px] leading-relaxed">
                {transparencyCallout.body}
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ------------------------------------------------------ setup fee */}
      <Section>
        <Container size="wide">
          <Reveal>
            <MicroLabel className="mb-5">Setup</MicroLabel>
            <TwoTone lead="One setup fee." trail="Month to month after that." className="max-w-[760px]" />
            <p className="pb-body mt-6 max-w-[700px] text-[15px] leading-relaxed">
              From day one we set up your entire clinic: pharmacy connections,{" "}
              <Link
                to="/pharmabro/platform/legitscript"
                className="text-[var(--color-marine)] underline decoration-[color-mix(in_oklab,var(--color-marine)_35%,transparent)] underline-offset-4"
              >
                LegitScript in 7-14 days
              </Link>
              , patient portal, compliance structure, Stripe OAuth, pixel installation. One
              setup fee. Then a flat monthly fee. No long-term contracts.
            </p>
          </Reveal>

          <RevealGroup className="mt-10 grid gap-4 md:grid-cols-3">
            {setupCards.map((c) => (
              <RevealItem key={c.title}>
                <Card className="h-full">
                  <h3 className="text-[16px] font-medium text-ink">{c.title}</h3>
                  <p className="pb-body mt-3 text-[14px] leading-relaxed">{c.body}</p>
                </Card>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* ------------------------------------------------------ calculator */}
      <Section band id="calculator">
        <Container size="wide">
          <Reveal>
            <MicroLabel className="mb-5">Calculate your savings</MicroLabel>
            <TwoTone
              lead="A flat fee, or 35% of everything"
              trail="you bill. Run your own numbers."
              className="max-w-[820px]"
            />
            <p className="pb-body mt-6 max-w-[680px] text-[15px] leading-relaxed">
              Set your patient count and average billing. The flat fee is the published plan
              price at that volume, and the comparison column is a{" "}
              <Link
                to="/pharmabro/compare/$slug"
                params={{ slug: "pharmabro-vs-openloop" }}
                className="text-[var(--color-marine)] underline decoration-[color-mix(in_oklab,var(--color-marine)_35%,transparent)] underline-offset-4"
              >
                35% revenue share
              </Link>{" "}
              on the same revenue.
            </p>
          </Reveal>
          <Reveal delay={0.06} className="mt-10">
            <RevenueCalculator />
          </Reveal>
        </Container>
      </Section>

      {/* --------------------------------------------------- feature table */}
      <Section id="features">
        <Container size="full">
          <Reveal>
            <MicroLabel className="mb-5">Every feature, every plan</MicroLabel>
            <TwoTone
              lead="The full table."
              trail="Nothing hidden behind a sales call."
              className="max-w-[760px]"
            />
            <p className="pb-body mt-6 max-w-[680px] text-[15px] leading-relaxed">
              Includes the{" "}
              <Link
                to="/pharmabro/platform/payments"
                className="text-[var(--color-marine)] underline decoration-[color-mix(in_oklab,var(--color-marine)_35%,transparent)] underline-offset-4"
              >
                in-house rebill engine
              </Link>{" "}
              on every plan, which saves 0.5-1% per billing cycle against Stripe recurring.
            </p>
          </Reveal>
          <Reveal delay={0.06} className="mt-10">
            <FeatureTable />
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------- add-ons */}
      <Section band>
        <Container size="wide">
          <Reveal>
            <MicroLabel className="mb-5">Optional add-ons</MicroLabel>
            <TwoTone lead="Bolt on what you need," trail="skip what you do not." className="max-w-[720px]" />
          </Reveal>
          <RevealGroup className="mt-10 grid gap-px overflow-hidden rounded-xl border border-[var(--color-hairline)] bg-[var(--color-hairline)] md:grid-cols-3">
            {addOns.map((a) => (
              <RevealItem key={a.name} className="bg-canvas p-6 sm:p-8">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[16px] font-medium text-ink">{a.name}</h3>
                  <span className="pb-micro whitespace-nowrap">{a.price}</span>
                </div>
                <p className="pb-body mt-3 text-[14px] leading-relaxed">{a.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.08} className="mt-8">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                "No revenue share on any plan",
                "No platform transaction fees",
                "Cancel any time, data out in 24 hours",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="shrink-0" />
                  <span className="pb-body text-[14px]">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      {/* -------------------------------------------------------------- FAQ */}
      <Faq items={pricingFaqs} eyebrow="FAQ" lead="Pricing questions," trail="answered plainly." />

      {/* -------------------------------------------------------- final CTA */}
      <Section band className="py-14 sm:py-16">
        <Container size="wide">
          <Reveal>
            <div className="flex flex-col gap-4 rounded-xl border border-[var(--color-hairline)] bg-canvas p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <p className="max-w-[560px] text-[18px] leading-snug text-ink sm:text-[20px]">
                Flat fee, your Stripe, first patient in 7 days. See it running on your own
                brand before you sign anything.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Btn to="/pharmabro/demo">Book a demo</Btn>
                <Btn to="/pharmabro/compare" variant="ghost">
                  Compare platforms
                </Btn>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
