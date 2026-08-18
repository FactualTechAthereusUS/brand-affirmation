import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import {
  HOME_COMPARE,
  HOME_FAQ,
  HOME_FINAL_CTA,
  HOME_HERO,
  HOME_HOW,
  HOME_LEGITSCRIPT,
  HOME_PILLARS,
  HOME_PRICING,
  HOME_SEVEN_DAYS,
  HOME_TRUST_STRIP,
  BRAND_LOGOS,
  type HomePillar,
} from "@/lib/pharmabro/home";
import {
  DrawRule,
  GrowBar,
  HeroText,
  HeroVisual,
  Marquee,
  Reveal,
  ScrollRail,
  Stagger,
  StaggerItem,
} from "@/components/pharmabro/motion";
import {
  LAST_UPDATED,
  LAST_UPDATED_ISO,
  ORG_NODE,
  WEBSITE_NODE,
  breadcrumbNode,
  faqNode,
  ldGraph,
  pbCanonical,
  pbMeta,
  softwareNode,
} from "@/lib/pharmabro/seo";

const TITLE =
  "White Label Telehealth Platform | Launch in 7 Days | PharmaBro";
const DESCRIPTION =
  "Launch your telehealth brand in 7 days. PharmaBro runs the licensed providers, pharmacy and compliance under your name. 0% medication markup, no revenue share, your Stripe.";

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
          faqNode(HOME_FAQ),
          breadcrumbNode([{ name: "PharmaBro", path: "" }]),
        ]),
      },
    ],
  }),
  component: PharmaBroHome,
});

/* ------------------------------------------------------------------ atoms */

function Wrap({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1180px] px-5 sm:px-6 ${className ?? ""}`}>
      {children}
    </div>
  );
}

function Band({
  children,
  surface = false,
  id,
}: {
  children: React.ReactNode;
  surface?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`pb-band ${surface ? "bg-[var(--color-mist)]" : "bg-canvas"}`}
    >
      {children}
    </section>
  );
}

function InkButton({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-medium text-white transition-transform duration-150 [transition-timing-function:var(--pb-ease)] hover:scale-[1.02]"
    >
      {children}
    </Link>
  );
}

function GhostButton({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--color-hairline)] bg-canvas px-6 py-3.5 text-[15px] font-medium text-ink transition-colors duration-200 [transition-timing-function:var(--pb-ease)] hover:bg-[var(--pb-accent-soft)]"
    >
      {children}
    </Link>
  );
}

/* --------------------------------------------------- 03 · hero word swap */

/**
 * Visual-only word swap. The <h1> in the DOM always contains the full static
 * sentence for crawlers; this layer is aria-hidden and purely decorative.
 */
function WordSwap({ words }: { words: readonly string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((p) => (p + 1) % words.length), 2400);
    return () => window.clearInterval(id);
  }, [words.length]);
  const word = words[i];
  return (
    <span aria-hidden className="pb-swap">
      <span key={word} className="pb-swap-word">
        {word}
      </span>
    </span>
  );
}

/** The branded patient checkout, the screen their customer actually sees. */
function CheckoutPhone() {
  return (
    <div className="mx-auto w-full max-w-[320px] rotate-[3deg] rounded-[38px] border border-black/[0.06] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_40px_90px_-30px_rgba(0,0,0,0.22)]">
      <div className="overflow-hidden rounded-[30px] border border-[var(--color-hairline)]">
        <div className="flex items-center justify-between bg-[var(--color-mist)] px-4 py-3">
          <span className="pb-label">yourbrand.com</span>
          <span className="pb-label">Secure</span>
        </div>
        <div className="space-y-4 px-4 py-5">
          <div>
            <div className="pb-label">Your plan</div>
            <div className="mt-1 text-[17px] font-semibold text-ink">
              GLP-1 Monthly
            </div>
            <div className="text-[13px] text-[var(--color-bluebell)]">
              Compounded semaglutide, shipped monthly
            </div>
          </div>
          <div className="rounded-[12px] border border-[var(--color-hairline)] p-3">
            <div className="flex items-center justify-between text-[14px] text-ink">
              <span>Medication</span>
              <span>$299.00</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[14px] text-[var(--color-bluebell)]">
              <span>Provider consult</span>
              <span>$30.00</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-[var(--color-hairline)] pt-2.5 text-[15px] font-semibold text-ink">
              <span>Due today</span>
              <span>$329.00</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-10 rounded-[12px] border border-[var(--color-hairline)] bg-[var(--color-mist)]" />
            <div className="grid grid-cols-2 gap-2">
              <div className="h-10 rounded-[12px] border border-[var(--color-hairline)] bg-[var(--color-mist)]" />
              <div className="h-10 rounded-[12px] border border-[var(--color-hairline)] bg-[var(--color-mist)]" />
            </div>
          </div>
          <div className="rounded-full bg-ink py-3 text-center text-[14px] font-medium text-white">
            Start treatment
          </div>
          <div className="pb-label text-center">
            Reviewed by a licensed provider
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- 06 · visuals */

const MAP_DOTS = 220;

function MapVisual() {
  /* A dot field in the rough shape of the continental US, filling accent in
     sequence. Cheap, crisp, and no image payload. */
  const dots = Array.from({ length: MAP_DOTS }, (_, i) => i);
  return (
    <div className="pb-card grid aspect-[4/3] place-items-center overflow-hidden p-6">
      <div className="grid w-full grid-cols-[repeat(20,minmax(0,1fr))] gap-1.5">
        {dots.map((d) => {
          const row = Math.floor(d / 20);
          const col = d % 20;
          const inside =
            row > 0 &&
            row < 10 &&
            col > Math.max(0, 2 - row) &&
            col < 19 - Math.max(0, 3 - row) &&
            !(row > 7 && col > 15) &&
            !(row > 8 && col < 4);
          return (
            <span
              key={d}
              className="aspect-square rounded-full"
              style={{
                background: inside
                  ? "var(--color-marine)"
                  : "var(--color-hairline)",
                opacity: inside ? 0 : 0.5,
                animation: inside
                  ? `pb-dot-in 0.5s var(--pb-ease) ${(col * 0.03 + row * 0.04).toFixed(2)}s both`
                  : undefined,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function PharmacyVisual() {
  return (
    <div className="pb-card overflow-hidden">
      <img
        src="/assets/pb-pharmacy-fulfilment.jpg"
        alt="A labelled medication vial beside an open cold-pack shipping box ready for fulfilment"
        width={1280}
        height={960}
        loading="lazy"
        decoding="async"
        className="aspect-[4/3] w-full object-cover"
      />
    </div>
  );
}

function PhonesVisual() {
  const screens = ["Storefront", "Intake", "Patient portal"];
  return (
    <Stagger className="pb-card flex aspect-[4/3] items-end justify-center gap-3 overflow-hidden bg-[var(--color-mist)] p-6">
      {screens.map((s, i) => (
        <StaggerItem key={s} className="w-1/3">
          <div
            className="rounded-[18px] border border-black/[0.06] bg-white p-2 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)]"
            style={{ marginBottom: i === 1 ? 22 : 0 }}
          >
            <div className="space-y-1.5 rounded-[12px] border border-[var(--color-hairline)] p-2.5">
              <div className="h-1.5 w-8 rounded-full bg-[var(--color-marine)]" />
              <div className="h-1.5 w-full rounded-full bg-[var(--color-hairline)]" />
              <div className="h-1.5 w-3/4 rounded-full bg-[var(--color-hairline)]" />
              <div className="h-8 rounded-[8px] bg-[var(--color-mist)]" />
              <div className="h-1.5 w-2/3 rounded-full bg-[var(--color-hairline)]" />
            </div>
            <div className="pb-label mt-2 text-center">{s}</div>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

function TableVisual() {
  const rows = [
    ["P-10241", "Weight loss", "Active", "Exported"],
    ["P-10242", "Men's health", "Active", "Exported"],
    ["P-10243", "Hair loss", "Paused", "Exported"],
    ["P-10244", "Peptides", "Active", "Exported"],
    ["P-10245", "Longevity", "Active", "Exported"],
  ];
  return (
    <div className="pb-card flex aspect-[4/3] flex-col overflow-hidden p-5">
      <div className="flex items-center justify-between">
        <span className="pb-label">Patients export</span>
        <span className="pb-label text-[var(--color-marine)]">CSV ready</span>
      </div>
      <Stagger className="mt-4 divide-y divide-[var(--color-hairline)]">
        {rows.map((r) => (
          <StaggerItem key={r[0]}>
            <div className="grid grid-cols-4 gap-2 py-2.5 text-[12.5px] text-ink">
              <span className="font-medium">{r[0]}</span>
              <span className="text-[var(--color-bluebell)]">{r[1]}</span>
              <span className="text-[var(--color-bluebell)]">{r[2]}</span>
              <span className="text-right text-[var(--color-marine)]">{r[3]}</span>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

function PillarVisual({ kind }: { kind: HomePillar["visual"] }) {
  if (kind === "map") return <MapVisual />;
  if (kind === "pharmacy") return <PharmacyVisual />;
  if (kind === "phones") return <PhonesVisual />;
  return <TableVisual />;
}

/* ------------------------------------------------------------------ 11 FAQ */

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--color-hairline)]">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 py-5 text-left"
      >
        <span className="text-[17px] font-medium text-ink">{q}</span>
        <ChevronDown
          className={`size-4 shrink-0 text-[var(--color-bluebell)] transition-transform duration-[250ms] [transition-timing-function:var(--pb-ease)] ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div className="pb-faq-panel" data-open={open ? "true" : "false"}>
        <div>
          <p className="pb-copy pb-5">{a}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- page */

function PharmaBroHome() {
  return (
    <>
      {/* 03 · hero */}
      <section className="bg-canvas pb-16 pt-10 sm:pt-16 lg:pb-24 lg:pt-20">
        <Wrap>
          <div className="mx-auto max-w-[760px] text-center">
            <HeroText delay={0.2}>
              <Link
                to="/pharmabro/platform"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-hairline)] bg-canvas px-3.5 py-1.5 text-[13px] text-ink transition-colors duration-200 [transition-timing-function:var(--pb-ease)] hover:bg-[var(--pb-accent-soft)]"
              >
                <span className="pb-label text-[var(--color-marine)]">
                  {HOME_HERO.eyebrow}
                </span>
                <span className="text-[var(--color-bluebell)]">
                  {HOME_HERO.eyebrowText}
                </span>
                <ArrowRight className="size-3.5 opacity-60" />
              </Link>
            </HeroText>

            <HeroText delay={0.4}>
              <h1 className="pb-display mx-auto mt-7 max-w-[1000px] text-[34px] sm:text-[46px] lg:text-[62px]">
                <span className="lg:whitespace-nowrap">
                  Launch your <WordSwap words={HOME_HERO.h1Swap} />
                  <span className="sr-only">GLP-1</span> brand.
                </span>
                <br />
                <span className="lg:whitespace-nowrap">
                  We run the clinic behind it.
                </span>
              </h1>
            </HeroText>


            <HeroText delay={0.6}>
              <p className="pb-copy mx-auto mt-6 text-center">{HOME_HERO.dek}</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <InkButton to="/pharmabro/demo">{HOME_HERO.ctaPrimary}</InkButton>
                <GhostButton to="/pharmabro/platform">
                  {HOME_HERO.ctaSecondary}
                </GhostButton>
              </div>
              <p className="pb-label mx-auto mt-6">{HOME_HERO.trust}</p>
              <p className="pb-label mt-2">
                Updated{" "}
                <time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED}</time>
              </p>
            </HeroText>
          </div>

          <HeroVisual className="mt-14 lg:mt-20">
            <CheckoutPhone />
          </HeroVisual>
        </Wrap>
      </section>

      {/* 04 · trust strip */}
      <section className="bg-canvas">
        <Wrap>
          <DrawRule />
          <Reveal className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5">
            {HOME_TRUST_STRIP.map((t) => (
              <span key={t} className="pb-label">
                {t}
              </span>
            ))}
          </Reveal>
          <DrawRule />
        </Wrap>
      </section>

      {/* brand marquee */}
      <section className="bg-canvas py-10">
        <Wrap>
          <Marquee items={BRAND_LOGOS} />
        </Wrap>
      </section>

      {/* 05 · how it works */}
      <Band surface id="how-it-works">
        <Wrap>
          <Reveal className="mx-auto max-w-[760px] text-center">
            <p className="pb-label">A brand on top. A clinic underneath.</p>
            <h2 className="pb-display mt-4 text-[28px] sm:text-[36px] lg:text-[44px]">
              {HOME_HOW.h2}
            </h2>
            <p className="pb-copy mx-auto mt-5 text-center">{HOME_HOW.dek}</p>
          </Reveal>

          <div className="mt-14">
            <DrawRule />
            <Stagger className="grid gap-8 pt-8 sm:grid-cols-3">
              {HOME_HOW.steps.map((s) => (
                <StaggerItem key={s.n}>
                  <div className="flex items-center gap-3">
                    <span className="grid size-7 place-items-center rounded-full bg-[var(--color-marine)] text-[11px] font-semibold text-white">
                      {s.n}
                    </span>
                    <h3 className="pb-label text-ink">{s.title}</h3>
                  </div>
                  <p className="pb-copy mt-4 text-[16px]">{s.body}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Wrap>
      </Band>

      {/* 06 · four pillars */}
      <Band>
        <Wrap>
          <Reveal className="max-w-[720px]">
            <p className="pb-label">What you get</p>
            <h2 className="pb-display mt-4 text-[28px] sm:text-[36px] lg:text-[44px]">
              Everything a clinic needs, run for you.
            </h2>
          </Reveal>

          <div className="mt-16 space-y-20 lg:space-y-28">
            {HOME_PILLARS.map((p, i) => (
              <div
                key={p.h2}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <Reveal className={i % 2 === 1 ? "lg:order-2" : undefined}>
                  <PillarVisual kind={p.visual} />
                </Reveal>
                <Reveal
                  delay={0.08}
                  className={i % 2 === 1 ? "lg:order-1" : undefined}
                >
                  <span className="pb-label">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="pb-display mt-3 text-[24px] sm:text-[30px]">
                    <Link
                      to={p.to}
                      className="underline decoration-[var(--color-hairline)] decoration-2 underline-offset-4 transition-colors duration-200 [transition-timing-function:var(--pb-ease)] hover:decoration-[var(--color-marine)]"
                    >
                      {p.h2}
                    </Link>
                  </h2>
                  <p className="pb-copy mt-4">{p.body}</p>
                  <ul className="mt-6 space-y-2.5">
                    {p.points.map((pt) => (
                      <li
                        key={pt}
                        className="flex items-start gap-2.5 text-[15px] text-ink"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-[var(--color-marine)]" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={p.to}
                    className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-[var(--color-marine)]"
                  >
                    {p.anchor}
                    <ArrowRight className="size-4" />
                  </Link>
                </Reveal>
              </div>
            ))}
          </div>
        </Wrap>
      </Band>

      {/* 07 · seven days */}
      <Band surface>
        <Wrap>
          <Reveal className="max-w-[760px]">
            <p className="pb-label">Launch timeline</p>
            <h2 className="pb-display mt-4 text-[28px] sm:text-[36px] lg:text-[44px]">
              {HOME_SEVEN_DAYS.h2}
            </h2>
            <p className="pb-copy mt-5">{HOME_SEVEN_DAYS.dek}</p>
          </Reveal>

          <div className="mt-12">
            <ScrollRail>
              <Stagger className="space-y-0">
                {HOME_SEVEN_DAYS.rows.map((r) => (
                  <StaggerItem key={r.day}>
                    <div className="flex flex-col gap-1 border-b border-[var(--color-hairline)] py-5 sm:flex-row sm:items-baseline sm:gap-8">
                      <span className="pb-label w-[64px] shrink-0 text-ink">
                        {r.day}
                      </span>
                      <span className="text-[17px] text-ink">{r.body}</span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </ScrollRail>
          </div>
        </Wrap>
      </Band>

      {/* 08 · legitscript */}
      <Band>
        <Wrap>
          <Reveal className="mx-auto max-w-[760px] text-center">
            <p className="pb-label">Advertising approval</p>
            <h2 className="pb-display mt-4 text-[28px] sm:text-[36px] lg:text-[44px]">
              {HOME_LEGITSCRIPT.h2}
            </h2>
            <p className="pb-copy mx-auto mt-5 text-center">
              {HOME_LEGITSCRIPT.body}
            </p>
          </Reveal>

          <div className="pb-card mx-auto mt-12 max-w-[760px] p-6 sm:p-8">
            {HOME_LEGITSCRIPT.bars.map((b, i) => (
              <div key={b.label} className={i ? "mt-7" : undefined}>
                <div className="flex items-baseline justify-between">
                  <span className="text-[15px] font-medium text-ink">
                    {b.label}
                  </span>
                  <span className="text-[15px] text-[var(--color-bluebell)]">
                    {b.value}
                  </span>
                </div>
                <div className="mt-2.5 h-2.5 w-full rounded-full bg-[var(--color-mist)]">
                  <GrowBar
                    width={`${b.pct}%`}
                    delay={i * 0.2}
                    className="h-2.5 rounded-full"
                    style={{
                      background: b.own
                        ? "var(--color-marine)"
                        : "color-mix(in oklab, var(--color-ink) 18%, transparent)",
                    }}
                  />
                </div>
              </div>
            ))}

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-[var(--color-hairline)] pt-6">
              {HOME_LEGITSCRIPT.platforms.map((p) => (
                <span
                  key={p}
                  className="flex items-center gap-2 text-[14px] text-ink"
                >
                  <Check className="size-4 text-[var(--color-marine)]" />
                  {p}
                </span>
              ))}
            </div>
            <p className="pb-label mt-5 normal-case tracking-normal">
              {HOME_LEGITSCRIPT.footnote}
            </p>
          </div>
        </Wrap>
      </Band>

      {/* 09 · pricing preview */}
      <Band surface id="pricing">
        <Wrap>
          <Reveal className="mx-auto max-w-[760px] text-center">
            <p className="pb-label">Pricing</p>
            <h2 className="pb-display mt-4 text-[28px] sm:text-[36px] lg:text-[44px]">
              {HOME_PRICING.h2}
            </h2>
            <p className="pb-copy mx-auto mt-5 text-center">
              {HOME_PRICING.dek}
            </p>
          </Reveal>

          <Stagger className="mt-12 grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOME_PRICING.tiers.map((t) => (
              <StaggerItem key={t.name}>
                <div
                  className={`pb-card pb-card-lift flex h-full flex-col p-6 ${t.featured ? "border-[var(--color-marine)] pb-[34px] pt-[34px]" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="pb-label text-ink">{t.name}</span>
                    {t.featured ? (
                      <span className="rounded-full bg-[var(--pb-accent-soft)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-marine)]">
                        Popular
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-[13px] text-[var(--color-bluebell)]">
                    {t.range}
                  </p>
                  <p className="pb-display mt-6 text-[30px]">
                    {t.price}
                    {t.price.startsWith("$") ? (
                      <span className="text-[14px] font-normal text-[var(--color-bluebell)]">
                        {" "}
                        /mo
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1.5 text-[14px] text-[var(--color-bluebell)]">
                    {t.setup}
                  </p>
                  <Link
                    to="/pharmabro/pricing"
                    className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--color-marine)]"
                  >
                    telehealth platform pricing
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {HOME_PRICING.facts.map((f) => (
              <span key={f} className="pb-label">
                {f}
              </span>
            ))}
          </Reveal>
          <Reveal className="mt-8 text-center">
            <GhostButton to="/pharmabro/pricing">
              Full pricing
              <ArrowRight className="size-4" />
            </GhostButton>
          </Reveal>
        </Wrap>
      </Band>

      {/* 10 · comparison strip */}
      <Band>
        <Wrap>
          <Reveal className="mx-auto max-w-[720px] text-center">
            <h2 className="pb-display text-[28px] sm:text-[36px]">
              {HOME_COMPARE.h2}
            </h2>
            <p className="pb-copy mx-auto mt-5 text-center">
              {HOME_COMPARE.body}
            </p>
          </Reveal>

          <Stagger
            step={0.04}
            className="mx-auto mt-10 flex max-w-[760px] flex-wrap justify-center gap-3"
          >
            {HOME_COMPARE.pills.map((p) => (
              <StaggerItem key={p.to}>
                <Link
                  to={p.to}
                  className="inline-flex rounded-full border border-[var(--color-hairline)] px-4 py-2.5 text-[14px] font-medium text-ink transition-colors duration-200 [transition-timing-function:var(--pb-ease)] hover:bg-[var(--pb-accent-soft)]"
                >
                  {p.label}
                </Link>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-9 text-center">
            <GhostButton to="/pharmabro/compare">
              All comparisons
              <ArrowRight className="size-4" />
            </GhostButton>
          </Reveal>
        </Wrap>
      </Band>

      {/* 11 · FAQ */}
      <Band surface id="faq">
        <Wrap>
          <div className="grid gap-10 lg:grid-cols-[340px_1fr] lg:gap-16">
            <Reveal>
              <p className="pb-label">Questions</p>
              <h2 className="pb-display mt-4 text-[28px] sm:text-[36px]">
                Answers before the call.
              </h2>
              <p className="pb-copy mt-5 text-[16px]">
                PharmaBro publishes the answers operators ask most, including
                cost, ownership and licensing.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="border-t border-[var(--color-hairline)]">
                {HOME_FAQ.map((f) => (
                  <FaqRow key={f.q} q={f.q} a={f.a} />
                ))}
              </div>
            </Reveal>
          </div>
        </Wrap>
      </Band>

      {/* 12 · final CTA */}
      <section className="bg-[var(--color-mist)] py-24 lg:py-40">
        <Wrap>
          <Reveal className="mx-auto max-w-[760px] text-center">
            <h2 className="pb-display text-[30px] sm:text-[40px] lg:text-[52px]">
              {HOME_FINAL_CTA.h2}
            </h2>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <InkButton to="/pharmabro/demo">Book a call</InkButton>
              <GhostButton to="/pharmabro/pricing">See pricing</GhostButton>
            </div>
            <p className="pb-label mt-7">{HOME_FINAL_CTA.trust}</p>
          </Reveal>
        </Wrap>
      </section>
    </>
  );
}
