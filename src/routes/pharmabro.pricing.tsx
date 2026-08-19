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
import { Faq, faqSchema, breadcrumbSchema } from "@/components/pharmabro/Faq";
import { PricingTiers } from "@/components/pharmabro/pricing/PricingTiers";
import { FeatureTable } from "@/components/pharmabro/pricing/FeatureTable";
import {
  addOns,
  cardsFootnote,
  PRICING_REVIEWED,
  PRICING_REVIEWED_ISO,
  pricingFaqs,
  setupBody,
  setupStats,
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
      {/* ------------------------------------------------------------- hero */}
      <Section className="pt-2 pb-10 sm:pt-4 sm:pb-14">
        <Container size="wide">
          <Reveal>
            <div className="max-w-[860px]">
              <MicroLabel className="mb-5">Pricing</MicroLabel>
              <h1 className="font-sans text-[40px] leading-[1.02] tracking-[-0.02em] text-ink sm:text-[52px] lg:text-[60px]">
                Flat, transparent pricing.
              </h1>
              <p className="mt-6 max-w-[560px] font-serif italic text-[16px] leading-[1.5] text-ink/70 sm:text-[18px]">
                PharmaBro runs the clinic behind your brand: licensed providers, pharmacy
                fulfillment, software, and compliance. One flat platform fee, and no cut of
                your revenue or your patients.
              </p>

              <Link
                to="/pharmabro/demo"
                className="group mt-8 inline-flex items-center gap-2"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-[var(--color-check)]"
                >
                  <path
                    d="M5 12.5l4.5 4.5L19 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-ink underline decoration-ink/40 underline-offset-4 transition-colors group-hover:decoration-ink">
                  PharmaBro launch guarantee
                </span>
              </Link>

              <p className="pb-dim mt-5 text-[13px] text-ink/60">
                Pricing facts last reviewed {PRICING_REVIEWED}.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* -------------------------------------------------- migration banner */}
      <Section className="py-5 sm:py-6">
        <Container size="wide">
          <Reveal>
            <div className="rounded-2xl border border-black/10 bg-[#fafaf9] px-6 py-5">
              <p className="text-[18px] leading-[1.3] text-ink sm:text-[22px]">
                Switching from another platform?{" "}
                <span className="text-[var(--color-marine)]">Free white-glove migration</span>{" "}
                — PharmaBro moves your patients and data for you.
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
      <Section band id="add-ons" className="scroll-mt-24">
        <Container size="wide">
          <Reveal>
            <h2 className="font-sans text-[36px] leading-none tracking-[-0.02em] text-ink sm:text-[44px] lg:text-[54px]">
              Optional add-ons for any plan
            </h2>
            <p className="mt-4 max-w-[560px] text-sm text-ink/80">
              Layer any of these onto a plan. Add or remove them as you grow.
            </p>
          </Reveal>
          <RevealGroup className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {addOns.map((a) => (
              <RevealItem key={a.name}>
                <Link
                  to={a.to}
                  className="group relative flex h-full flex-col justify-between gap-8 bg-[#f7f4ef] p-6 transition-colors hover:bg-[#efeae1] sm:p-8"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-[3px] z-10 text-[var(--color-hairline)]"
                  >
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="h-full w-full"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M0 12 L0 0 L12 0" />
                      <path d="M88 0 L100 0 L100 12" />
                      <path d="M100 88 L100 100 L88 100" />
                      <path d="M12 100 L0 100 L0 88" />
                    </svg>
                  </span>
                  <div className="flex flex-col gap-4">
                    <h3 className="font-sans text-[22px] leading-none tracking-[-0.02em] text-ink">
                      {a.name}
                    </h3>
                    <p className="text-[15px] leading-[1.4] text-ink/60">{a.body}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[20px] leading-none text-ink">
                      {a.price}{" "}
                      <span className="text-sm text-ink/70">/ {a.priceUnit}</span>
                    </p>
                    <span className="mt-1 inline-flex w-fit items-center gap-1 text-sm text-ink underline decoration-ink/40 underline-offset-4 transition-colors group-hover:decoration-ink">
                      Learn more
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      >
                        <path
                          d="M5 12h14M13 6l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
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
                <Link
                  to="/pharmabro/demo"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-3xl border border-black bg-black px-6 text-[14.5px] font-medium text-white transition-all duration-200 hover:bg-neutral-900 active:scale-[0.985]"
                  style={{
                    boxShadow:
                      "inset 0px 2px 4px 0px rgba(255,255,255,0.4), 0px 0.7409732186279143px 0.7409732186279143px -0.75px rgba(0,0,0,0.33), 0px 2.0178668455264415px 2.0178668455264415px -1.5px rgba(0,0,0,0.32), 0px 4.430505261661892px 4.430505261661892px -2.25px rgba(0,0,0,0.3), 0px 9.834710084098335px 9.834710084098335px -3px rgba(0,0,0,0.25), 0px 25px 25px -3.75px rgba(0,0,0,0.11), 0px 0px 0px 1px rgb(130,130,130)",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-[18px]"
                    aria-hidden="true"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Schedule Now
                </Link>
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
