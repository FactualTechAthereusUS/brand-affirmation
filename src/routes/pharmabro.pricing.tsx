import { createFileRoute } from "@tanstack/react-router";
import {
  Btn,
  Check,
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
import {
  addOns,
  cardsFootnote,
  migrationBanner,
  PRICING_REVIEWED,
  PRICING_REVIEWED_ISO,
  pricingFaqs,
  setupBody,
  setupStats,
  transparency,
} from "@/lib/pharmabro/pricing";

const TITLE = "PharmaBro Pricing — Flat Setup Fee, No Revenue Share";
const DESCRIPTION =
  "PharmaBro pricing starts at $15,000 setup + $1,500/month. LegitScript included. No revenue share, no medication markup. Month to month after setup.";
const URL = "https://sweet-confirm-it.lovable.app/pharmabro/pricing";

const OFFERS = [
  {
    name: "Launch",
    price: "1500",
    setup: "15000",
    band: "0-500 active patients",
  },
  {
    name: "Grow",
    price: "3000",
    setup: "25000",
    band: "501-2,000 active patients",
  },
  {
    name: "Scale",
    price: "5000",
    setup: "50000",
    band: "2,001-5,000 active patients",
  },
];

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
          "@type": "Organization",
          name: "PharmaBro",
          url: "https://sweet-confirm-it.lovable.app/pharmabro",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "PharmaBro white-label telehealth platform",
          serviceType: "White-label telehealth infrastructure",
          provider: { "@type": "Organization", name: "PharmaBro" },
          areaServed: "US",
          url: URL,
          dateModified: PRICING_REVIEWED_ISO,
          offers: OFFERS.map((o) => ({
            "@type": "Offer",
            name: o.name,
            price: o.price,
            priceCurrency: "USD",
            url: URL,
            description: `Flat monthly platform fee for ${o.band}, plus a $${o.setup} one-time setup fee. No revenue share.`,
          })),
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
      {/* -------------------------------------------------- migration banner */}
      <Section className="py-6 sm:py-8">
        <Container size="wide">
          <Reveal>
            <div className="flex flex-col gap-3 rounded-xl bg-[#F8F8F8] p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[14.5px] leading-relaxed text-ink">
                <span className="font-medium">{migrationBanner.lead}</span>{" "}
                <span className="pb-dim">{migrationBanner.body}</span>
              </p>
              <Btn to={migrationBanner.cta.to} variant="ghost">
                {migrationBanner.cta.label} →
              </Btn>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ------------------------------------------------------------- hero */}
      <Section className="pt-4 pb-12 sm:pt-6 sm:pb-16">
        <Container size="wide">
          <Reveal>
            <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
              <MicroLabel className="mb-5">Pricing</MicroLabel>
              <TwoTone as="h1" lead="Flat, transparent pricing." />
              <p className="pb-body mt-6 max-w-[540px] text-[17px] leading-relaxed sm:text-[18px]">
                PharmaBro charges one setup fee and one monthly platform fee. Medication
                passes through at cost. PharmaBro never takes a percentage of your revenue
                or your patients' billings.
              </p>

              <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                {["No revenue share", "LegitScript included", "Month to month"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Check className="shrink-0" />
                    <span className="text-[14px] text-ink">{t}</span>
                  </li>
                ))}
              </ul>

              <p className="pb-dim mt-5 text-[11px] tracking-[0.04em] uppercase">
                Pricing last reviewed {PRICING_REVIEWED}
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ------------------------------------------------------------ cards */}
      <Section id="plans" className="pt-0 pb-14 sm:pb-20">
        <Container size="wide" className="max-w-[1100px]">
          <PricingTiers />
          <Reveal delay={0.08}>
            <p className="pb-dim mx-auto mt-8 max-w-[760px] text-center text-[13px] leading-relaxed">
              {cardsFootnote}
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* -------------------------------------------------------- setup fee */}
      <Section>
        <Container size="wide">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <MicroLabel className="mb-5">Setup</MicroLabel>
              <TwoTone
                lead="One setup fee."
                trail="Then month to month."
                className="max-w-[520px]"
              />
              {setupBody.map((p) => (
                <p key={p} className="pb-body mt-6 max-w-[560px] text-[16px] leading-relaxed sm:text-[17px]">
                  {p}
                </p>
              ))}
            </Reveal>

            <RevealGroup className="grid gap-4">
              {setupStats.map((s) => (
                <RevealItem key={s.label}>
                  <div className="rounded-xl border border-[var(--color-hairline)] bg-canvas p-6">
                    <MicroLabel>{s.label}</MicroLabel>
                    <div className="mt-3 text-[20px] leading-snug text-ink">{s.value}</div>
                    <div className="pb-dim mt-1 text-[13px]">{s.sub}</div>
                    <p className="pb-body mt-3 text-[14px] leading-relaxed">{s.body}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Container>
      </Section>

      {/* ----------------------------------------------------- transparency */}
      <Section band>
        <Container size="wide">
          <Reveal>
            <div className="mx-auto max-w-[640px] text-center">
              <MicroLabel className="mb-5">Transparency</MicroLabel>
              <TwoTone lead={transparency.title} />
              {transparency.body.map((p) => (
                <p key={p} className="pb-body mt-6 text-[16px] leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* --------------------------------------------------- feature table */}
      <Section id="features">
        <Container size="full">
          <Reveal>
            <MicroLabel className="mb-5">Every feature, every plan</MicroLabel>
            <TwoTone
              lead="Full plan comparison."
              trail="Nothing hidden behind a sales call."
              className="max-w-[780px]"
            />
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
            <MicroLabel className="mb-5">Add-ons</MicroLabel>
            <TwoTone lead="Add-ons." trail="Bolt on what you need." className="max-w-[720px]" />
          </Reveal>
          <RevealGroup className="mt-10 grid gap-px overflow-hidden rounded-xl border border-[var(--color-hairline)] bg-[var(--color-hairline)] md:grid-cols-3">
            {addOns.map((a) => (
              <RevealItem key={a.name} className="bg-canvas p-6 sm:p-8">
                <h3 className="text-[16px] font-medium text-ink">{a.name}</h3>
                <p className="pb-body mt-3 text-[14px] leading-relaxed">{a.body}</p>
                <div className="pb-micro mt-5">{a.price}</div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* -------------------------------------------------------------- FAQ */}
      <Faq items={pricingFaqs} eyebrow="FAQ" lead="Pricing questions," trail="answered plainly." />

      {/* -------------------------------------------------------- final CTA */}
      <section className="bg-[#0C0C0C] py-16 sm:py-20 lg:py-24">
        <Container size="wide">
          <Reveal>
            <div className="mx-auto flex max-w-[640px] flex-col items-center text-center">
              <h2 className="text-3xl leading-[1.12] tracking-[-0.02em] font-normal text-white md:text-4xl">
                Not sure which plan fits?
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-white/60">
                That's what the call is for.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2.5">
                <Btn
                  to="/pharmabro/demo"
                  className="bg-white text-[#0C0C0C] hover:bg-white/90"
                >
                  Book a call
                </Btn>
                <Btn
                  to="/pharmabro/platform"
                  className="border border-white/25 bg-transparent text-white hover:bg-white/10"
                >
                  View demo
                </Btn>
              </div>
              <p className="mt-6 text-[12.5px] text-white/45">
                Month to month. Your brand, your patients.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
