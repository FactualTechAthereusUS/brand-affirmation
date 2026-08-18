import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  BarChart3,
  CreditCard,
  MonitorSmartphone,
  Pill,
  RefreshCw,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import {
  Btn,
  Card,
  Cell,
  Check,
  Chip,

  Container,
  CountUp,
  EyebrowPill,
  MicroLabel,
  Reveal,
  RevealGroup,
  RevealItem,
  Section,
  SquareEyebrow,
  TwoTone,
} from "@/components/pharmabro/primitives";
import { ProductTabs } from "@/components/pharmabro/ProductTabs";
import { BentoGrid } from "@/components/pharmabro/BentoGrid";
import { OrderJourney } from "@/components/pharmabro/OrderJourney";

import {
  AD_PLATFORMS,
  BRAND_LOGOS,
  COMPARE_COLUMNS,
  COMPARE_FOOTNOTE,
  COMPARE_TABLE,
  DASHBOARD_POINTS,
  FAQ_ITEMS,
  HERO_ROTATING,
  HERO_SUB,
  HERO_TRUST,
  JOURNEY,
  LEGITSCRIPT_BARS,
  LEGITSCRIPT_PANELS,
  MATH_FOOTNOTE,
  MATH_ROWS,
  POSITIONING_BODY,
  POSITIONING_H2,
  POSITIONING_PROOF,
  POSITIONING_QUOTE,
  PRICING_FACTS,
  PRICING_PEEK,
  STATS,
  STAT_STATIC,
  STEPS,
  SWITCHING_CARDS,
  TESTIMONIALS,
} from "@/lib/pharmabro/home";
import {
  LAST_UPDATED,
  ORG_NODE,
  WEBSITE_NODE,
  breadcrumbNode,
  faqNode,
  ldGraph,
  pbCanonical,
  pbMeta,
  softwareNode,
} from "@/lib/pharmabro/seo";
import { HeroLine, KineticRule, Marquee, Rise } from "@/components/pharmabro/motion";
import { cn } from "@/lib/utils";

const TITLE = "White Label Telehealth Platform, Flat Fee | PharmaBro";
const DESCRIPTION =
  "Launch your own telehealth brand in 7 days on a white label platform. Flat monthly fee, zero revenue share, your own Stripe, LegitScript in 7 to 14 days, 30+ pharmacies.";

export const Route = createFileRoute("/pharmabro/")({
  head: () => ({
    meta: pbMeta({ title: TITLE, description: DESCRIPTION }),
    links: pbCanonical(),
    scripts: [
      {
        type: "application/ld+json",
        children: ldGraph([
          ORG_NODE,
          WEBSITE_NODE,
          softwareNode(),
          faqNode(FAQ_ITEMS),
          breadcrumbNode([{ name: "PharmaBro", path: "" }]),
        ]),
      },
    ],
  }),
  component: PharmaBroHome,
});

const FEATURE_ICONS: Record<string, LucideIcon> = {
  card: CreditCard,
  refresh: RefreshCw,
  shield: ShieldCheck,
  pill: Pill,
  portal: MonitorSmartphone,
  chart: BarChart3,
};

function PharmaBroHome() {
  return (
    <>
      <Hero />
      <StatsBand />
      <Positioning />
      <ComparisonTable />
      <HowItWorks />
      <Features />
      <ProductSurfaces />
      <TheMath />
      <LegitScript />
      <Switching />
      <Testimonials />
      <FinalCta />
    </>
  );
}

/* ------------------------------------------------------------------- 3 hero */

/** Longest rotating word, used to reserve the highlight box width. */
const longestRotating = [...HERO_ROTATING].sort((a, b) => b.length - a.length)[0];

/** Word-by-word blur-in reveal, CSS driven so it never sticks at opacity 0. */
function BlurWords({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <>
      {text.split(" ").map((w, idx) => (
        <Fragment key={`${w}-${idx}`}>
          {idx > 0 ? " " : null}
          <span
            className="pb-word"
            style={{ animationDelay: `${delay + idx * 0.08}s` }}
          >
            {w}
          </span>
        </Fragment>
      ))}
    </>
  );
}

function Hero() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setI((p) => (p + 1) % HERO_ROTATING.length),
      2200,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-canvas pt-12 pb-16 sm:pt-16 lg:pt-20 lg:pb-24">
      <Container size="wide" className="relative">
        <div className="mx-auto max-w-[900px] text-left lg:text-center">
          <Reveal className="mb-6 flex flex-wrap items-center gap-3 lg:justify-center">
            <EyebrowPill label="New" to="/pharmabro/platform/legitscript">
              LegitScript in 7-14 days
            </EyebrowPill>
            <Chip tone="live">1,284 brands live on PharmaBro</Chip>
          </Reveal>

          <h1 className="text-balance text-[clamp(2rem,10vw,2.6rem)] font-normal leading-[1.04] tracking-[-0.03em] text-ink sm:text-[3.25rem] lg:text-[3.75rem] lg:leading-[1.02]">
            <BlurWords text="Launch Your Own" />{" "}
            <span className="relative inline-flex items-baseline overflow-hidden rounded-[0.25em] border border-[color-mix(in_oklab,var(--color-marine)_25%,transparent)] bg-[color-mix(in_oklab,var(--color-marine)_8%,transparent)] px-[0.18em] py-[0.06em] align-baseline text-[var(--color-marine)]">
              <span aria-hidden className="invisible">
                {longestRotating}
              </span>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={HERO_ROTATING[i]}
                  initial={{ opacity: 0, y: "0.5em", filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: "-0.5em", filter: "blur(8px)" }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-[0.18em] top-[0.06em] whitespace-nowrap"
                >
                  {HERO_ROTATING[i]}
                </motion.span>
              </AnimatePresence>
            </span>{" "}
            <BlurWords text="Brand in 7 Days" delay={0.28} />
          </h1>

          <Reveal delay={0.14}>
            <p className="pb-body mx-auto mt-6 max-w-[620px] text-[16px] leading-relaxed sm:text-[17.5px]">
              {HERO_SUB}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-center">
              <Btn to="/pharmabro/demo" size="lg">
                Book a demo
              </Btn>
              <Btn to="/pharmabro/pricing" variant="ghost" size="lg">
                See pricing
              </Btn>
            </div>
            <p className="pb-micro mt-4">
              No setup fee. No revenue share. Cancel any time.
            </p>
          </Reveal>

          <Reveal delay={0.26}>
            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-[var(--color-hairline)] pt-6 lg:justify-center">
              {HERO_TRUST.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check />
                  <span className="text-[13.5px] font-medium text-[color-mix(in_oklab,var(--color-ink)_72%,transparent)]">
                    {t}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.32} y={26} className="mt-12 lg:mt-16">
          <div className="pb-liquid mx-auto w-full max-w-[1180px]">
            <img
              src="/assets/pharmabro-dashboard.png"
              alt="PharmaBro operator dashboard showing recurring revenue, patient funnel, and pharmacy fulfillment queues"
              width={1680}
              height={969}
              loading="eager"
              className="block h-auto w-full"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ 4 stats */

function StatsBand() {
  return (
    <Section band className="py-14 sm:py-16">
      <Container size="wide">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.07}>
              <div className="pb-mono text-[30px] font-semibold tracking-[-0.03em] text-ink sm:text-[40px]">
                {s.prefix ?? ""}
                <CountUp
                  to={s.value}
                  format={(n) => Math.round(n).toLocaleString("en-US")}
                />
                {s.suffix ?? ""}
              </div>
              <div className="pb-micro mt-2.5">{s.label}</div>
            </Reveal>
          ))}
          <Reveal delay={0.21}>
            <div className="pb-mono text-[30px] font-semibold tracking-[-0.03em] text-[var(--color-marine)] sm:text-[40px]">
              {STAT_STATIC.value}
            </div>
            <div className="pb-micro mt-2.5">{STAT_STATIC.label}</div>
          </Reveal>
        </div>

        {/* borderless brand strip */}
        <div className="mt-14 border-t border-[var(--color-hairline)] pt-8">
          <MicroLabel className="mb-6">Brands running on PharmaBro</MicroLabel>
          <div className="flex flex-wrap gap-x-9 gap-y-4">
            {BRAND_LOGOS.map((b, i) => (
              <Reveal key={b} delay={i * 0.04}>
                <span className="text-[16px] font-semibold tracking-[-0.02em] text-[color-mix(in_oklab,var(--color-ink)_38%,transparent)] transition-colors hover:text-ink">
                  {b}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------ 5 positioning */

function Positioning() {
  return (
    <Section>
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <SquareEyebrow className="mb-7">The problem</SquareEyebrow>
            <Reveal>
              <blockquote className="border-l-2 border-[var(--color-ever)] pl-5 text-[21px] font-medium leading-[1.35] tracking-[-0.02em] text-ink sm:text-[25px]">
                {POSITIONING_QUOTE}
              </blockquote>
            </Reveal>
          </div>

          <div>
            <Reveal delay={0.08}>
              <TwoTone
                lead={POSITIONING_H2}
                className="text-[26px] sm:text-[32px] lg:text-[36px]"
              />
              <p className="pb-body mt-6 text-[16px] leading-relaxed sm:text-[17px]">
                {POSITIONING_BODY}
              </p>
              <div className="mt-8 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-mist)] p-5">
                <MicroLabel className="mb-2.5">Proof</MicroLabel>
                <p className="text-[15px] font-medium leading-relaxed text-ink">
                  {POSITIONING_PROOF}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------- 6 comparison */

function ComparisonTable() {
  return (
    <Section band id="compare">
      <Container size="full">
        <Reveal>
          <MicroLabel className="mb-5">Head to head</MicroLabel>
          <TwoTone
            lead="Compare PharmaBro to every other platform."
            trail="We publish our pricing. They do not."
            className="max-w-[900px]"
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[860px] border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 w-[240px] rounded-tl-xl border-y border-l border-[var(--color-hairline)] bg-canvas px-4 py-3.5">
                    <span className="pb-micro">Feature</span>
                  </th>
                  {COMPARE_COLUMNS.map((c, i) => (
                    <th
                      key={c}
                      className={cn(
                        "border-y border-r border-[var(--color-hairline)] px-4 py-3.5 text-[13px] font-semibold",
                        i === 0
                          ? "bg-[color-mix(in_oklab,var(--color-marine)_7%,white)] text-ink"
                          : "bg-canvas text-[color-mix(in_oklab,var(--color-ink)_55%,transparent)]",
                        i === COMPARE_COLUMNS.length - 1 && "rounded-tr-xl",
                      )}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_TABLE.map((g) => (
                  <Fragment key={g.group}>
                    <tr>
                      <td
                        colSpan={COMPARE_COLUMNS.length + 1}
                        className="border-b border-l border-r border-[var(--color-hairline)] bg-[var(--color-mist)] px-4 py-2.5"
                      >
                        <span className="pb-micro">{g.group}</span>
                      </td>
                    </tr>
                    {g.rows.map((r) => (
                      <tr key={r.feature}>
                        <td className="sticky left-0 z-10 border-b border-l border-[var(--color-hairline)] bg-canvas px-4 py-3.5 align-top text-[13.5px] font-medium text-ink">
                          {r.feature}
                        </td>
                        {r.values.map((v, i) => (
                          <td
                            key={`${r.feature}-${i}`}
                            className={cn(
                              "border-b border-r border-[var(--color-hairline)] px-4 py-3.5 align-top",
                              i === 0
                                ? "bg-[color-mix(in_oklab,var(--color-marine)_5%,white)]"
                                : "bg-canvas",
                            )}
                          >
                            <Cell value={v} own={i === 0} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <p className="pb-micro mt-5">Source: {COMPARE_FOOTNOTE}</p>

        <div className="mt-8">
          <Chip to="/pharmabro/compare">See every comparison in detail</Chip>
        </div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------ 7 how it works */

function HowItWorks() {
  return (
    <Section>
      <Container size="wide">
        <Reveal>
          <MicroLabel className="mb-5">How it works</MicroLabel>
          <TwoTone
            lead="Seven days from signature"
            trail="to your first patient."
            className="max-w-[820px]"
          />
        </Reveal>

        <RevealGroup className="mt-12 grid gap-px overflow-hidden rounded-xl border border-[var(--color-hairline)] bg-[var(--color-hairline)] lg:grid-cols-3">
          {STEPS.map((s) => (
            <RevealItem key={s.num} className="flex flex-col bg-canvas p-6 sm:p-7">
              <div className="mb-6 flex items-center justify-between">
                <span className="pb-mono text-[30px] font-semibold leading-none tracking-[-0.04em] text-[color-mix(in_oklab,var(--color-ink)_15%,transparent)]">
                  {s.num}
                </span>
                <span className="pb-micro rounded-full bg-[var(--color-mist)] px-2.5 py-1.5">
                  {s.days}
                </span>
              </div>
              <h3 className="text-[19px] font-semibold tracking-[-0.02em] text-ink">
                {s.title}
              </h3>
              <p className="pb-body mt-3 text-[14.5px] leading-relaxed">{s.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-20 border-t border-[var(--color-hairline)] pt-14">
          <Reveal>
            <MicroLabel className="mb-5">{JOURNEY.micro}</MicroLabel>
            <TwoTone
              lead={JOURNEY.h2Lead}
              trail={JOURNEY.h2Trail}
              className="max-w-[860px]"
            />
          </Reveal>
          <div className="mt-12">
            <OrderJourney />
          </div>
        </div>
      </Container>

    </Section>
  );
}

/* --------------------------------------------------------------- 8 features */

function Features() {
  return (
    <Section band>
      <Container size="wide">
        <Reveal>
          <MicroLabel className="mb-5">The platform</MicroLabel>
          <TwoTone
            lead="Everything a telehealth brand needs."
            trail="Nothing you have to build."
            className="max-w-[880px]"
          />
        </Reveal>

        <Reveal delay={0.06} className="mt-12">
          <BentoGrid />
        </Reveal>

        {/* The two rebill and portal claims live in the tabbed section below,
            so the bento carries this section on its own. */}


      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------- 9 dashboard */

function ProductSurfaces() {
  return (
    <Section>
      <Container size="wide">
        <Reveal>
          <MicroLabel className="mb-5">Inside the platform</MicroLabel>
          <TwoTone
            lead="Four surfaces run your clinic."
            trail="All of them carry your name."
            className="max-w-[880px]"
          />
        </Reveal>

        <Reveal delay={0.08} className="mt-12">
          <ProductTabs />
        </Reveal>

        <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-xl border border-[var(--color-hairline)] bg-[var(--color-hairline)] sm:grid-cols-2 lg:grid-cols-4">
          {DASHBOARD_POINTS.map((p) => (
            <RevealItem key={p.title} className="bg-canvas p-5">
              <h3 className="text-[15px] font-medium tracking-[-0.01em] text-ink">
                {p.title}
              </h3>
              <p className="pb-body mt-1.5 text-[13.5px] leading-relaxed">
                {p.body}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}


/* ------------------------------------------------------------------ 10 math */

function TheMath() {
  return (
    <Section band>
      <Container size="wide">
        <Reveal>
          <MicroLabel className="mb-5">The math</MicroLabel>
          <TwoTone
            lead="300 patients. Same revenue."
            trail="Three very different outcomes."
            className="max-w-[860px]"
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  <th className="w-[250px] rounded-tl-xl border-y border-l border-[var(--color-hairline)] bg-canvas px-5 py-4">
                    <span className="pb-micro">300 patients at $299/mo</span>
                  </th>
                  <th className="border-y border-r border-[var(--color-hairline)] bg-[color-mix(in_oklab,var(--color-marine)_7%,white)] px-5 py-4 text-[13.5px] font-semibold text-ink">
                    PharmaBro
                  </th>
                  <th className="border-y border-r border-[var(--color-hairline)] bg-canvas px-5 py-4 text-[13.5px] font-semibold text-[color-mix(in_oklab,var(--color-ink)_55%,transparent)]">
                    OpenLoop
                  </th>
                  <th className="rounded-tr-xl border-y border-r border-[var(--color-hairline)] bg-canvas px-5 py-4 text-[13.5px] font-semibold text-[color-mix(in_oklab,var(--color-ink)_55%,transparent)]">
                    Cuvo
                  </th>
                </tr>
              </thead>
              <tbody>
                {MATH_ROWS.map((r) => (
                  <tr key={r.label}>
                    <td className="border-b border-l border-[var(--color-hairline)] bg-canvas px-5 py-4 text-[13.5px] font-medium text-ink">
                      {r.label}
                    </td>
                    <td
                      className={cn(
                        "pb-mono border-b border-r border-[var(--color-hairline)] bg-[color-mix(in_oklab,var(--color-marine)_5%,white)] px-5 py-4 text-[13.5px]",
                        r.emphasize
                          ? "text-[16px] font-semibold text-[var(--color-check)]"
                          : "font-medium text-ink",
                      )}
                    >
                      {r.pharmabro}
                    </td>
                    <td className="pb-mono border-b border-r border-[var(--color-hairline)] bg-canvas px-5 py-4 text-[13px] text-[color-mix(in_oklab,var(--color-ink)_60%,transparent)]">
                      {r.openloop}
                    </td>
                    <td className="pb-mono border-b border-r border-[var(--color-hairline)] bg-canvas px-5 py-4 text-[13px] text-[color-mix(in_oklab,var(--color-ink)_60%,transparent)]">
                      {r.cuvo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-8 max-w-[720px] text-[15.5px] font-medium leading-relaxed text-ink">
            {MATH_FOOTNOTE}
          </p>
          <div className="mt-7">
            <Btn to="/pharmabro/pricing" size="lg">
              See full pricing
            </Btn>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

/* ----------------------------------------------------------- 11 legitscript */

function LegitScript() {
  return (
    <Section>
      <Container size="wide">
        <Reveal>
          <MicroLabel className="mb-5">Compliance</MicroLabel>
          <TwoTone
            lead="LegitScript in 7 to 14 days."
            trail="The industry takes 3 to 6 months."
            className="max-w-[880px]"
          />
        </Reveal>

        {/* horizontal bar comparison, width encodes time */}
        <Reveal delay={0.08} className="mt-11">
          <div className="space-y-5">
            {LEGITSCRIPT_BARS.map((b, i) => (
              <div key={b.label}>
                <div className="mb-2 flex items-baseline justify-between gap-4">
                  <span className="text-[14px] font-semibold text-ink">
                    {b.label}
                  </span>
                  <span
                    className={cn(
                      "pb-mono text-[13px]",
                      b.own
                        ? "font-semibold text-[var(--color-marine)]"
                        : "text-[color-mix(in_oklab,var(--color-ink)_55%,transparent)]",
                    )}
                  >
                    {b.value}
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--color-ink)_7%,transparent)]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${b.weight}%` }}
                    viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                    transition={{
                      duration: 1.1,
                      delay: 0.15 + i * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={cn(
                      "h-full rounded-full",
                      b.own
                        ? "bg-[var(--color-marine)]"
                        : "bg-[color-mix(in_oklab,var(--color-ink)_45%,transparent)]",
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {LEGITSCRIPT_PANELS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <Card className="h-full">
                <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-ink">
                  {p.title}
                </h3>
                <p className="pb-body mt-3 text-[14px] leading-relaxed">{p.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.16}>
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            {AD_PLATFORMS.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-hairline)] bg-canvas px-3.5 py-2 text-[13px] font-medium text-ink"
              >
                <Check />
                {p}
              </span>
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------- 12 switching */

function Switching() {
  return (
    <Section band>
      <Container size="wide">
        <Reveal>
          <MicroLabel className="mb-5">Migration</MicroLabel>
          <TwoTone
            lead="Switching platforms"
            trail="without losing a single patient."
            className="max-w-[820px]"
          />
        </Reveal>

        <RevealGroup className="mt-11 grid gap-5 lg:grid-cols-3">
          {SWITCHING_CARDS.map((c) => (
            <RevealItem key={c.title}>
              <Card className="h-full">
                <Check className="mb-5 size-[18px]" />
                <h3 className="text-[17px] font-semibold leading-snug tracking-[-0.02em] text-ink">
                  {c.title}
                </h3>
                <p className="pb-body mt-3 text-[14px] leading-relaxed">{c.body}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.14}>
          <p className="pb-body mt-8 text-[14px]">
            Free white-glove migration from OpenLoop, Bask, Cuvo, or any other
            platform.
          </p>
          <div className="mt-5">
            <Btn to="/pharmabro/demo" variant="blue" size="lg">
              Plan your migration
            </Btn>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

/* --------------------------------------------------------- 13 testimonials */

function Testimonials() {
  return (
    <Section>
      <Container size="wide">
        <Reveal>
          <MicroLabel className="mb-5">Operators</MicroLabel>
          <TwoTone
            lead="What operators say"
            trail="after they switch."
            className="max-w-[760px]"
          />
        </Reveal>

        <div className="mt-11 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.09}>
              <figure className="flex h-full flex-col rounded-xl border border-[var(--color-hairline)] bg-canvas p-6">
                <blockquote className="pb-body flex-1 text-[14.5px] leading-relaxed">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 border-t border-[var(--color-hairline)] pt-5">
                  <div className="text-[14px] font-semibold text-ink">{t.name}</div>
                  <div className="pb-micro mt-1.5">
                    {t.title}, {t.brand}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------- 14 final cta */

function FinalCta() {
  return (
    <Section className="pb-20 sm:pb-24">
      <Container size="wide">
        <Reveal>
          <div className="pb-dotgrid relative overflow-hidden rounded-2xl border border-[var(--color-hairline)] px-6 py-14 text-center sm:px-12 sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-24 mx-auto size-[520px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-marine)_13%,transparent),transparent_62%)] blur-2xl"
            />
            <div className="relative">
              <MicroLabel className="mb-6">Get started</MicroLabel>
              <h2 className="mx-auto max-w-[720px] text-balance text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[44px]">
                Your brand. Your patients.{" "}
                <span className="pb-dim">Your revenue.</span>
              </h2>
              <p className="pb-body mx-auto mt-6 max-w-[540px] text-[16px] leading-relaxed">
                Book a 20 minute call. We will model your margin against your
                current platform using your real patient volume, then show you the
                dashboard your team would run tomorrow.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Btn to="/pharmabro/demo" size="lg">
                  Book a demo
                </Btn>
                <Btn to="/pharmabro/pricing" variant="ghost" size="lg">
                  See pricing
                </Btn>
              </div>
              <p className="pb-micro mt-6">
                No setup fee. No revenue share. Live in 7 days.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
