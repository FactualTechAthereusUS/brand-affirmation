import { Fragment, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import {
  BLOG_CARDS,
  BLOG_H2,
  BLOG_SUB,
  COMPARE_COLUMNS,
  COMPARE_FOOTNOTE,
  COMPARE_H2,
  COMPARE_SUB,
  COMPARE_TABLE,
  CTA_BODY,
  CTA_FOOT,
  CTA_H2,
  CTA_PRODUCTS,
  FAQ_H2,
  FAQ_INTRO,
  FAQ_ITEMS,
  GROWTH_H2,
  GROWTH_SHOTS,
  GROWTH_TABS,
  LEGIT_BARS,
  LEGIT_BODY,
  LEGIT_BODY_DIM,
  LEGIT_DISCLAIMER,
  LEGIT_H2,
  LEGIT_PANELS,
  NATION_BODY,
  NATION_EYEBROW,

  NATION_H2,
  NATION_ROWS,
  FULFILLMENT_LOGOS,
  PHARMACY_PARTNERS,
  PRICING_H2,
  PRICING_PEEK,
  PRICING_SUB,
  RETENTION_H2,
  RETENTION_ROWS,
} from "@/lib/pharmabro/home";
import {
  Btn,
  Cell,
  Check,
  Container,
  MicroLabel,
  Section,
  SquareEyebrow,
} from "@/components/pharmabro/primitives";
import { KineticRule, PB_EASE_SOFT, Rise } from "@/components/pharmabro/motion";
import { Shot } from "./Shot";
import { Corners, UsProviderMap } from "./UsProviderMap";
import { RetentionScene } from "./RetentionLoops";
import { LegitScriptMark, LegitTimeline } from "./LegitTimeline";


/* --------------------------------------------- 8 nationwide infrastructure */

function CoverageBlock({
  title,
  body,
  to,
  srLabel,
  children,
}: {
  title: React.ReactNode;
  body: string;
  to: string;
  srLabel: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-[12px] border border-[var(--color-hairline)] bg-white">
      <Corners />
      <div className="grid gap-7 px-5 py-8 sm:gap-8 sm:px-8 sm:py-12 lg:grid-cols-12 lg:px-12">
        <h3 className="text-balance text-[22px] font-normal leading-tight tracking-[-0.025em] text-ink sm:text-[26px] lg:col-span-3 lg:text-[28px]">
          {title}
        </h3>
        <div className={children ? "lg:col-span-5" : "lg:col-span-7"}>
          <p className="pb-body max-w-[440px] text-[14.5px] leading-relaxed sm:text-[15.5px]">
            {body}
          </p>
          <Link
            to={to}
            className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--color-marine)] hover:underline"
          >
            Learn more<span className="sr-only"> {srLabel}</span>
            <span aria-hidden>→</span>
          </Link>
        </div>
        {children ? <div className="lg:col-span-4">{children}</div> : null}
      </div>
    </div>
  );
}


export function Nationwide() {
  return (
    <Section id="network">
      <Container size="wide">
        <Rise>
          <SquareEyebrow>{NATION_EYEBROW}</SquareEyebrow>
          <h2 className="mt-4 max-w-[18ch] text-balance text-3xl font-normal leading-[1.1] tracking-[-0.025em] text-ink md:text-4xl lg:text-[2.6rem]">
            {NATION_H2[0]} <span className="pb-dim">{NATION_H2[1]}</span>
          </h2>
          <p className="pb-body mt-5 max-w-[62ch] text-[15.5px] leading-relaxed">
            {NATION_BODY}
          </p>
        </Rise>

        <div className="mt-12 space-y-6">
          <Rise>
            <CoverageBlock
              title={
                <>
                  Licensed in
                  <br />
                  every state
                </>
              }
              body={NATION_ROWS[0].body}
              to={NATION_ROWS[0].to}
              srLabel="about the 50 state provider network"
            />
          </Rise>

          <Rise delay={0.05}>
            <div className="relative overflow-hidden rounded-[12px] border border-[var(--color-hairline)] bg-white">
              <div className="relative overflow-hidden">

                <Corners tone="marine" />
                <div className="grid items-center gap-4 sm:gap-6 lg:grid-cols-12">
                  <div className="px-3 pb-2 pt-8 sm:px-8 sm:pb-4 sm:pt-10 lg:col-span-8 lg:py-12 lg:pl-10 lg:pr-0">
                    <UsProviderMap className="h-[220px] sm:h-[360px] lg:h-[440px]" />
                  </div>
                  <div className="px-5 pb-9 text-center sm:px-8 sm:pb-12 lg:col-span-4 lg:pb-0 lg:pr-12 lg:text-left">
                    <h3 className="text-balance text-[22px] font-normal leading-tight tracking-[-0.025em] text-ink sm:text-[26px] lg:text-[28px]">
                      Providers in all 50 states
                    </h3>
                    <p className="pb-body mx-auto mt-3 max-w-[340px] text-[14.5px] leading-relaxed sm:mt-4 sm:text-[15px] lg:mx-0">
                      A clinician network that reaches every state, so wherever a patient
                      signs up there is already a licensed provider ready to review the
                      visit and start care under your brand.
                    </p>
                    <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--color-hairline)] bg-white/80 px-3 py-1.5 backdrop-blur">
                      <Check className="size-3.5 shrink-0" />
                      <span className="min-w-0 text-left text-[11.5px] leading-snug text-ink sm:text-[12.5px]">
                        Licensed clinicians in all 50 states and D.C.
                      </span>
                    </div>
                    <p className="pb-body mt-3 text-[10.5px] lg:text-left">
                      Tap or hover a state to see its provider region.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Rise>

          <Rise delay={0.05}>
            <CoverageBlock
              title={
                <>
                  Pharmacy and
                  <br />
                  fulfillment
                </>
              }
              body={NATION_ROWS[1].body}
              to={NATION_ROWS[1].to}
              srLabel="about pharmacy and lab fulfillment"
            >
              <div className="grid grid-cols-2 items-center gap-x-5 gap-y-6 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-8">
                {FULFILLMENT_LOGOS.map((l) => (
                  <div key={l.name} className="flex h-7 items-center justify-center sm:h-8">
                    <img
                      src={l.src}
                      alt={l.name}
                      loading="lazy"
                      decoding="async"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </CoverageBlock>
          </Rise>
        </div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------- 9 keep patients on treatment */

const RETENTION_MS = 9000;

export function Retention() {
  const [open, setOpen] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setOpen((o) => (o + 1) % RETENTION_ROWS.length);
      setCycle((c) => c + 1);
    }, RETENTION_MS);
    return () => window.clearTimeout(id);
  }, [open, cycle]);

  const pick = (i: number) => {
    setOpen(i);
    setCycle((c) => c + 1);
  };

  return (
    <Section band>
      <Container size="wide">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
          <Rise>
            <MicroLabel>Retention</MicroLabel>
            <h2 className="mt-4 text-balance text-3xl font-normal leading-[1.1] tracking-[-0.025em] text-ink md:text-4xl lg:text-[2.6rem]">
              {RETENTION_H2[0]}
              <span className="block pb-dim">{RETENTION_H2[1]}</span>
            </h2>

            {/* desktop: tab list with auto-advance loader */}
            <div className="mt-10 hidden flex-col lg:flex">
              {RETENTION_ROWS.map((r, i) => {
                const on = i === open;
                return (
                  <div key={r.title} className="border-t border-[var(--color-hairline)] last:border-b">
                    <button
                      type="button"
                      onClick={() => pick(i)}
                      aria-pressed={on}
                      className="w-full pb-4 pt-4 text-left"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className="size-1.5 shrink-0 transition-colors duration-300"
                          style={{
                            backgroundColor: on
                              ? "var(--color-brand, #1B4EF5)"
                              : "color-mix(in oklab, var(--color-ink) 18%, transparent)",
                          }}
                        />
                        <span
                          className={`text-[16px] font-medium tracking-[-0.015em] transition-colors ${on ? "text-ink" : "text-[color-mix(in_oklab,var(--color-ink)_55%,transparent)]"}`}
                        >
                          {r.title}
                        </span>
                      </span>
                      <AnimatePresence initial={false}>
                        {on ? (
                          <motion.span
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: PB_EASE_SOFT }}
                            className="block overflow-hidden"
                          >
                            <span className="pb-body block max-w-[46ch] pl-[18px] pt-2.5 text-[14.5px] leading-relaxed">
                              {r.body}
                            </span>
                          </motion.span>
                        ) : null}
                      </AnimatePresence>
                    </button>
                    <div className="h-[2px] w-full overflow-hidden">
                      {on ? (
                        <div
                          key={`${i}-${cycle}`}
                          className="pb-tab-loader h-full w-full origin-left"
                          style={{ animationDuration: `${RETENTION_MS}ms` }}
                        />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </Rise>

          {/* desktop: looping scene */}
          <Rise delay={0.06} className="hidden lg:block">
            <RetentionScene index={open} />
          </Rise>

          {/* mobile: accordion with the scene inside the open panel */}
          <div className="lg:hidden">
            {RETENTION_ROWS.map((r, i) => {
              const on = i === open;
              return (
                <div key={r.title} className="border-b border-[var(--color-hairline)] first:border-t">
                  <button
                    type="button"
                    onClick={() => pick(i)}
                    className="flex w-full items-center gap-3 py-4 text-left"
                  >
                    <span
                      className="size-1.5 shrink-0"
                      style={{
                        backgroundColor: on
                          ? "var(--color-brand, #1B4EF5)"
                          : "color-mix(in oklab, var(--color-ink) 18%, transparent)",
                      }}
                    />
                    <span
                      className={`text-[16px] font-medium tracking-[-0.015em] ${on ? "text-ink" : "text-[color-mix(in_oklab,var(--color-ink)_55%,transparent)]"}`}
                    >
                      {r.title}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {on ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.42, ease: PB_EASE_SOFT }}
                        className="overflow-hidden"
                      >
                        <p className="pb-body pb-4 pl-[18px] pr-2 text-[14.5px] leading-relaxed">
                          {r.body}
                        </p>
                        <div className="pb-5">
                          <RetentionScene index={i} />
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}


/* --------------------------------------- 10 watch your brand grow in real time */

export function GrowthBand() {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(0);

  // Auto-advance the desktop tabs in sync with the progress loader.
  useEffect(() => {
    const id = window.setTimeout(() => setI((v) => (v + 1) % GROWTH_TABS.length), 7000);
    return () => window.clearTimeout(id);
  }, [i]);

  return (
    <Section id="analytics">
      <Container size="wide">
        <Rise>
          <MicroLabel>Analytics</MicroLabel>
          <h2 className="mt-4 text-balance text-3xl font-normal leading-[1.1] tracking-[-0.025em] text-ink md:text-4xl lg:text-[2.85rem]">
            {GROWTH_H2[0]}
            <span className="block text-[color-mix(in_oklab,var(--color-ink)_45%,transparent)]">
              {GROWTH_H2[1]}
            </span>
          </h2>
        </Rise>

        <div className="mt-12">
          {/* desktop: stacked image board + three inline tabs */}
          <div className="hidden lg:flex lg:flex-col">
            <div className="relative aspect-[1672/941] w-full overflow-hidden rounded-[16px]">
              {GROWTH_SHOTS.map((s, idx) => (
                <img
                  key={s.src}
                  src={s.src}
                  alt={s.alt}
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className={`absolute inset-0 size-full object-contain transition-opacity duration-700 ease-in-out ${idx === i ? "opacity-100" : "opacity-0"}`}
                />
              ))}
            </div>


            <div className="flex flex-col lg:flex-row">
              {GROWTH_TABS.map((t, idx) => {
                const on = idx === i;
                return (
                  <button
                    key={t.title}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setI(idx)}
                    className={`relative flex-1 cursor-pointer overflow-hidden px-6 py-6 text-left transition-colors ${on ? "bg-black/[0.03]" : "hover:bg-black/[0.02]"}`}
                  >
                    {on ? (
                      <span
                        key={`loader-${idx}-${i}`}
                        aria-hidden
                        className="pb-tab-loader absolute left-0 top-0 h-0.5 w-full origin-left"
                      />
                    ) : null}
                    <div className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className={`mt-2.5 size-2 shrink-0 rounded-[1px] transition-colors ${on ? "bg-[var(--color-primary,#1b4ef5)]" : "bg-[var(--color-hairline)]"}`}
                      />
                      <div>
                        <h4
                          className={`text-[20px] font-normal leading-[24px] tracking-[-0.01em] transition-colors ${on ? "text-ink" : "text-[color-mix(in_oklab,var(--color-ink)_45%,transparent)]"}`}
                        >
                          {t.title}
                        </h4>
                        <p
                          className={`mt-2 text-[16px] leading-[1.4] transition-colors ${on ? "text-[color-mix(in_oklab,var(--color-ink)_70%,transparent)]" : "text-[color-mix(in_oklab,var(--color-ink)_35%,transparent)]"}`}
                        >
                          {t.body}
                        </p>
                        <span
                          className={`mt-4 inline-block text-[16px] underline underline-offset-2 transition-colors ${on ? "text-ink" : "text-[color-mix(in_oklab,var(--color-ink)_35%,transparent)]"}`}
                        >
                          Learn more
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* mobile / tablet: accordion with the image inside the open panel */}
          <div className="border border-[var(--color-hairline)] lg:hidden">
            {GROWTH_TABS.map((t, idx) => {
              const on = idx === open;
              return (
                <div
                  key={t.title}
                  className={`transition-colors ${idx > 0 ? "border-t border-[var(--color-hairline)]" : ""} ${on ? "bg-[var(--color-mist)]" : ""}`}
                >
                  <button
                    type="button"
                    aria-expanded={on}
                    onClick={() => setOpen(idx)}
                    className={`block w-full px-5 py-5 text-left transition-opacity ${on ? "" : "opacity-60"}`}
                  >
                    <span className="flex w-full items-baseline justify-between gap-4">
                      <span className="text-[20px] leading-5 tracking-[-0.4px] text-ink">
                        {t.title}
                      </span>
                      <span aria-hidden className="relative h-4 w-4 shrink-0 self-center text-ink">
                        <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                        {on ? null : (
                          <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current" />
                        )}
                      </span>
                    </span>
                    <p className="mt-3 text-[14px] leading-[1.4] text-[color-mix(in_oklab,var(--color-ink)_70%,transparent)]">
                      {t.body}
                    </p>
                  </button>
                  <AnimatePresence initial={false}>
                    {on ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.42, ease: PB_EASE_SOFT }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5">
                          <span className="inline-block text-[15px] text-ink underline underline-offset-2">
                            Learn more
                          </span>
                          <div className="relative mt-4 aspect-[1672/941] w-full overflow-hidden rounded-[12px]">
                            <img
                              src={GROWTH_SHOTS[idx].src}
                              alt={GROWTH_SHOTS[idx].alt}
                              loading="lazy"
                              decoding="async"
                              className="absolute inset-0 size-full object-contain"

                            />
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------ 11 how pharmabro compares */

export function Comparison() {
  const cols = COMPARE_COLUMNS.length + 1;
  let rowIndex = 0;

  return (
    <Section id="compare">
      <Container size="wide">
        {/* Cuvo-style opener: bracketed frame, oversized two-tone headline */}
        <div className="relative">
          <Corners tone="marine" />
          <div className="px-1 sm:px-2">
            <Rise>
              <MicroLabel>Comparison</MicroLabel>
              <h2 className="mt-6 max-w-[22ch] text-balance text-[30px] font-normal leading-[1.04] tracking-[-0.025em] text-ink sm:text-[40px] lg:text-[56px]">
                How PharmaBro
                <span className="pb-dim"> compares.</span>
              </h2>
              <p className="mt-6 max-w-[640px] text-[18px] leading-[1.2] tracking-[-0.02em] text-ink lg:text-[26px]">
                {COMPARE_SUB}
              </p>
              <div className="mt-8">
                <Btn to="/pharmabro/compare" variant="blue">
                  See every comparison
                </Btn>
              </div>
            </Rise>
          </div>
        </div>

        {/* Framed table panel on a dotted field, PharmaBro column pinned */}
        <Rise delay={0.06}>
          <div className="relative mt-16 lg:mt-20">
            <Corners />
            <div className="pb-dotgrid overflow-hidden rounded-[var(--pb-r-xl)] border border-[var(--color-hairline)] bg-canvas">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[var(--color-hairline)] bg-canvas/80">
                      <th className="sticky left-0 z-20 bg-canvas px-5 py-5 align-bottom">
                        <span className="pb-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[color-mix(in_oklab,var(--color-ink)_40%,transparent)]">
                          Feature
                        </span>
                      </th>
                      {COMPARE_COLUMNS.map((c, i) => (
                        <th key={c} className="px-5 py-5 align-bottom">
                          {i === 0 ? (
                            <span className="inline-flex items-center gap-2 rounded-full bg-[color-mix(in_oklab,var(--color-marine)_10%,white)] px-3 py-1.5 text-[13px] font-semibold text-ink ring-1 ring-[color-mix(in_oklab,var(--color-marine)_28%,transparent)]">
                              <span className="size-1.5 rounded-full bg-[var(--color-marine)]" />
                              {c}
                            </span>
                          ) : (
                            <span className="text-[13px] font-medium text-[color-mix(in_oklab,var(--color-ink)_48%,transparent)]">
                              {c}
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARE_TABLE.map((g) => (
                      <Fragment key={g.group}>
                        <tr>
                          <td
                            colSpan={cols}
                            className="border-y border-[var(--color-hairline)] bg-[var(--color-mist)] px-5 py-3"
                          >
                            <span className="pb-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[color-mix(in_oklab,var(--color-ink)_46%,transparent)]">
                              {g.group}
                            </span>
                          </td>
                        </tr>
                        {g.rows.map((r) => {
                          const delay = Math.min(rowIndex++, 12) * 0.035;
                          return (
                            <motion.tr
                              key={g.group + r.feature}
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, amount: 0.4 }}
                              transition={{
                                duration: 0.55,
                                delay,
                                ease: PB_EASE_SOFT,
                              }}
                              className="group border-b border-[var(--color-hairline)] last:border-0"
                            >
                              <td className="sticky left-0 z-10 bg-canvas px-5 py-4 text-[13.5px] leading-snug text-ink transition-colors group-hover:bg-[var(--color-mist)]">
                                {r.feature}
                              </td>
                              {r.values.map((v, i) => (
                                <td
                                  key={i}
                                  className={
                                    i === 0
                                      ? "border-x border-[color-mix(in_oklab,var(--color-marine)_16%,transparent)] bg-[color-mix(in_oklab,var(--color-marine)_5%,white)] px-5 py-4"
                                      : "bg-canvas/70 px-5 py-4 transition-colors group-hover:bg-[var(--color-mist)]"
                                  }
                                >
                                  <Cell value={v} own={i === 0} />
                                </td>
                              ))}
                            </motion.tr>
                          );
                        })}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="pb-body max-w-[70ch] text-[13px] leading-relaxed">
              {COMPARE_FOOTNOTE}
            </p>
            <Btn to="/pharmabro/compare" variant="ghost">
              Compare side by side
            </Btn>
          </div>
        </Rise>
      </Container>
    </Section>
  );
}


/* -------------------------------------------------------- 12 legitscript */

export function LegitScript() {
  return (
    <Section band id="legitscript">
      <Container size="wide">
        <div className="relative">
          <Corners tone="marine" />
          <div className="px-1 sm:px-2">
            <div className="hidden lg:absolute lg:right-2 lg:top-0 lg:block">
              <LegitScriptMark className="text-[20px]" />
            </div>
            <Rise>
              <LegitScriptMark className="mb-6 text-[17px] lg:hidden" />
              <h2 className="max-w-[24ch] text-balance text-[30px] font-normal leading-[1.04] tracking-[-0.025em] text-ink sm:text-[40px] lg:text-[56px]">
                {LEGIT_H2[0]}
                <span className="pb-dim">{LEGIT_H2[1]}</span>
              </h2>
              <p className="mt-6 max-w-[640px] text-[18px] leading-[1.2] tracking-[-0.02em] text-ink lg:text-[26px]">
                {LEGIT_BODY}{" "}
                <span className="pb-dim">{LEGIT_BODY_DIM}</span>
              </p>
              <div className="mt-8">
                <Btn to="/pharmabro/demo" variant="blue">
                  Get started
                </Btn>
              </div>
            </Rise>
          </div>
        </div>

        <Rise delay={0.06}>
          <div className="relative mt-16 lg:mt-20">
            <Corners />
            <LegitTimeline />
          </div>
        </Rise>

        <div className="mt-14 grid gap-10 lg:mt-16 lg:grid-cols-3">
          {LEGIT_PANELS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: PB_EASE_SOFT }}
            >
              <h3 className="text-[22px] font-normal leading-[1.05] tracking-[-0.02em] text-ink lg:text-[24px]">
                {p.title}
              </h3>
              <p className="pb-body mt-4 text-[15.5px] leading-[1.45]">{p.body}</p>
            </motion.div>
          ))}
        </div>

        <p className="pb-micro mt-10 max-w-[640px]">{LEGIT_DISCLAIMER}</p>
      </Container>
    </Section>
  );
}


/* ------------------------------------------------------------ 13 from the blog */

export function FromTheBlog() {
  return (
    <Section>
      <Container size="wide">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Rise>
            <MicroLabel>From the blog</MicroLabel>
            <h2 className="mt-4 text-balance text-3xl font-normal leading-[1.1] tracking-[-0.025em] text-ink md:text-4xl lg:text-[2.5rem]">
              {BLOG_H2[0]}
              <span className="block pb-dim">{BLOG_H2[1]}</span>
            </h2>
            <p className="pb-body mt-4 max-w-[60ch] text-[15.5px] leading-relaxed">
              {BLOG_SUB}
            </p>
          </Rise>
          <Btn to="/pharmabro/blog" variant="ghost">
            View all
          </Btn>
        </div>

        <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible">
          {BLOG_CARDS.map((c, i) => (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: PB_EASE_SOFT }}
              className="pb-card pb-card-lift w-[78vw] shrink-0 snap-start overflow-hidden p-0 sm:w-[340px] lg:w-auto"
            >
              <div className="relative aspect-[1200/750] w-full overflow-hidden bg-[var(--color-mist)]">
                <img
                  src={c.image}
                  alt={c.slot}
                  width={1200}
                  height={750}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-[var(--color-hairline)] bg-[var(--color-mist)] px-2.5 py-1 text-[11px] font-medium text-ink">
                    {c.category}
                  </span>
                  <span className="pb-micro">{c.date}</span>
                </div>
                <h3 className="mt-3 text-[15.5px] font-medium leading-snug tracking-[-0.015em] text-ink">
                  {c.title}
                </h3>
                <p className="pb-body mt-2 text-[13.5px] leading-relaxed">{c.body}</p>
                <Link
                  to="/pharmabro/blog"
                  className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-marine)] hover:underline"
                >
                  Read article <span aria-hidden>→</span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ---------------------------------------------------------------- 14 pricing */

export function PricingPeek() {
  return (
    <Section band id="pricing">
      <Container size="wide">
        <Rise className="text-center">
          <MicroLabel className="mx-auto w-fit">Pricing</MicroLabel>
          <h2 className="mx-auto mt-4 max-w-[20ch] text-balance text-3xl font-normal leading-[1.08] tracking-[-0.025em] text-ink md:text-4xl lg:text-[3rem]">
            {PRICING_H2}
          </h2>
          <p className="pb-body mx-auto mt-5 max-w-[64ch] text-[16.5px] leading-relaxed">
            {PRICING_SUB}
          </p>
        </Rise>

        <Rise delay={0.08} className="mt-10">
          <div className="pb-card pb-dotgrid mx-auto max-w-[680px] overflow-hidden p-7 text-center sm:p-10">
            <h3 className="text-[20px] font-medium tracking-[-0.02em] text-ink">
              {PRICING_PEEK.title}
            </h3>
            <p className="pb-body mx-auto mt-3 max-w-[52ch] text-[15px] leading-relaxed">
              {PRICING_PEEK.body}
            </p>

            <div className="pb-micro mt-8">Starting at</div>
            <div className="mt-2 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
              <span className="pb-mono text-[38px] font-medium leading-none tracking-[-0.03em] text-ink">
                {PRICING_PEEK.setup}
              </span>
              <span className="pb-body text-[15px]">setup</span>
              <span className="pb-dim">·</span>
              <span className="pb-mono text-[38px] font-medium leading-none tracking-[-0.03em] text-ink">
                {PRICING_PEEK.monthly}
              </span>
              <span className="pb-body text-[15px]">/ month</span>
            </div>
            <div className="pb-micro mt-3">{PRICING_PEEK.tierNote}</div>

            <div className="mt-7">
              <Btn to="/pharmabro/pricing" size="lg">
                View full pricing
              </Btn>
            </div>

            <div className="mt-8 grid gap-2 border-t border-[var(--color-hairline)] pt-6 sm:grid-cols-3">
              {PRICING_PEEK.facts.map((f) => (
                <div key={f} className="flex items-center justify-center gap-2">
                  <Check className="size-3.5" />
                  <span className="text-[13px] text-ink">{f}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="pb-micro mt-5 text-center">{PRICING_PEEK.ladder}</p>
        </Rise>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------- 15 faq */

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq">
      <Container size="wide">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Rise className="lg:sticky lg:top-28 lg:self-start">
            <MicroLabel>FAQ</MicroLabel>
            <h2 className="mt-4 text-balance text-3xl font-normal leading-[1.1] tracking-[-0.025em] text-ink md:text-4xl lg:text-[2.5rem]">
              {FAQ_H2[0]}
              <span className="block pb-dim">{FAQ_H2[1]}</span>
            </h2>
            <p className="pb-body mt-5 max-w-[50ch] text-[15.5px] leading-relaxed">
              {FAQ_INTRO}
            </p>
          </Rise>

          <div>
            {FAQ_ITEMS.map((item, i) => {
              const on = open === i;
              return (
                <div key={item.q} className="border-b border-[var(--color-hairline)]">
                  <button
                    type="button"
                    onClick={() => setOpen(on ? null : i)}
                    aria-expanded={on}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="text-[16px] font-medium tracking-[-0.015em] text-ink">
                      {item.q}
                    </span>
                    <motion.span
                      animate={{ rotate: on ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: PB_EASE_SOFT }}
                      className="grid size-7 shrink-0 place-items-center rounded-full border border-[var(--color-hairline)] text-[15px] text-ink"
                      aria-hidden
                    >
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {on ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.42, ease: PB_EASE_SOFT }}
                        className="overflow-hidden"
                      >
                        <p className="pb-body max-w-[70ch] pb-6 pr-8 text-[14.5px] leading-relaxed">
                          {item.a}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------- 16 final cta */

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-[#0c0c0c] py-20 sm:py-24 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(55% 55% at 50% 110%, rgba(27,78,245,0.34) 0%, transparent 70%)",
        }}
      />

      {/* floating product images */}
      {CTA_PRODUCTS.map((src, i) => {
        const spots = [
          "left-[4%] top-[14%] w-[110px] sm:w-[150px] -rotate-12",
          "right-[5%] top-[10%] w-[100px] sm:w-[140px] rotate-12",
          "left-[9%] bottom-[10%] w-[120px] sm:w-[165px] rotate-6",
          "right-[8%] bottom-[12%] w-[95px] sm:w-[135px] -rotate-6",
        ];
        return (
          <motion.img
            key={src}
            src={src}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 0.9, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: i * 0.1, ease: PB_EASE_SOFT }}
            className={`pointer-events-none absolute hidden object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)] md:block ${spots[i]}`}
          />
        );
      })}

      <Container size="wide" className="relative text-center">
        <Rise>
          <h2 className="mx-auto max-w-[22ch] text-balance text-[2rem] font-normal leading-[1.06] tracking-[-0.03em] text-white sm:text-[2.75rem] lg:text-[3.25rem]">
            {CTA_H2[0]}
            <span className="block text-white/50">{CTA_H2[1]}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[50ch] text-[16.5px] leading-relaxed text-white/62 sm:text-[18px]">
            {CTA_BODY}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Btn to="/pharmabro/demo" size="lg" className="bg-white text-ink hover:bg-white/90">
              Get started
            </Btn>
            <Btn
              to="/pharmabro/contact"
              size="lg"
              className="border border-white/25 bg-white/[0.06] text-white backdrop-blur-xl hover:bg-white/[0.14]"
            >
              View demo
            </Btn>
          </div>
          <p className="mt-6 text-[13px] text-white/45">{CTA_FOOT}</p>
        </Rise>
      </Container>
    </section>
  );
}
