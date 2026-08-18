import { Fragment, useState } from "react";
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
  GROWTH_TABS,
  LEGIT_BARS,
  LEGIT_BODY,
  LEGIT_DISCLAIMER,
  LEGIT_H2,
  LEGIT_PANELS,
  NATION_EYEBROW,
  NATION_H2,
  NATION_ROWS,
  PHARMACY_PARTNERS,
  PRICING_H2,
  PRICING_PEEK,
  PRICING_SUB,
  RETENTION_H2,
  RETENTION_ROWS,
  STATE_TILES,
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
import { BlogArt } from "./Mocks";

/* --------------------------------------------- 8 nationwide infrastructure */

export function Nationwide() {
  return (
    <Section id="network">
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Rise>
            <SquareEyebrow>{NATION_EYEBROW}</SquareEyebrow>
            <h2 className="mt-4 max-w-[18ch] text-balance text-3xl font-normal leading-[1.1] tracking-[-0.025em] text-ink md:text-4xl lg:text-[2.6rem]">
              {NATION_H2}
            </h2>

            <div className="mt-9 space-y-8">
              {NATION_ROWS.map((r) => (
                <div key={r.title} className="border-t border-[var(--color-hairline)] pt-6">
                  <h3 className="text-[17px] font-medium tracking-[-0.02em] text-ink">
                    {r.title}
                  </h3>
                  <p className="pb-body mt-2.5 max-w-[58ch] text-[15px] leading-relaxed">
                    {r.body}
                  </p>
                  <Link
                    to={r.to}
                    className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[var(--color-marine)] hover:underline"
                  >
                    Learn more <span aria-hidden>→</span>
                  </Link>
                </div>
              ))}
            </div>
          </Rise>

          <Rise delay={0.08}>
            <div className="pb-card p-6">
              <div className="pb-micro">Provider coverage</div>
              <div className="mt-4 grid grid-cols-8 gap-1.5 sm:grid-cols-10">
                {STATE_TILES.map((s, i) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.01, ease: PB_EASE_SOFT }}
                    className="grid h-8 place-items-center rounded-[6px] border border-[color-mix(in_oklab,var(--color-marine)_16%,transparent)] bg-[color-mix(in_oklab,var(--color-marine)_8%,white)] text-[10.5px] font-semibold text-[var(--color-marine)]"
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2 border-t border-[var(--color-hairline)] pt-4">
                <Check className="size-3.5" />
                <span className="text-[13px] text-ink">
                  Licensed clinicians in all 50 states and D.C.
                </span>
              </div>
            </div>

            <div className="mt-6">
              <div className="pb-micro">Fulfillment partners</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {PHARMACY_PARTNERS.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-[var(--color-hairline)] bg-[var(--color-mist)] px-3 py-1.5 text-[12.5px] font-medium text-[color-mix(in_oklab,var(--color-ink)_66%,transparent)]"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </Rise>
        </div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------- 9 keep patients on treatment */

export function Retention() {
  const [open, setOpen] = useState(0);
  const active = RETENTION_ROWS[open];

  return (
    <Section band>
      <Container size="wide">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Rise>
            <MicroLabel>Retention</MicroLabel>
            <h2 className="mt-4 text-balance text-3xl font-normal leading-[1.1] tracking-[-0.025em] text-ink md:text-4xl lg:text-[2.6rem]">
              {RETENTION_H2[0]}
              <span className="block pb-dim">{RETENTION_H2[1]}</span>
            </h2>
          </Rise>

          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              {RETENTION_ROWS.map((r, i) => {
                const on = i === open;
                return (
                  <div key={r.title} className="border-b border-[var(--color-hairline)]">
                    <button
                      type="button"
                      onClick={() => setOpen(i)}
                      className="flex w-full items-center gap-3 py-4 text-left"
                    >
                      <span
                        className={`text-[13px] transition-colors ${on ? "text-[var(--color-marine)]" : "pb-dim"}`}
                        aria-hidden
                      >
                        →
                      </span>
                      <span
                        className={`text-[16px] font-medium tracking-[-0.015em] transition-colors ${on ? "text-ink" : "text-[color-mix(in_oklab,var(--color-ink)_58%,transparent)]"}`}
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
                          <p className="pb-body pb-5 pl-6 pr-2 text-[14.5px] leading-relaxed">
                            {r.body}
                          </p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: PB_EASE_SOFT }}
              >
                <div className="pb-card p-5">
                  <div className="pb-micro">{active.title}</div>
                  <ul className="mt-4 space-y-2.5">
                    {active.checklist.map((c, i) => (
                      <li
                        key={c}
                        className="flex items-center gap-3 rounded-[12px] border border-[var(--color-hairline)] bg-[var(--color-mist)] px-3 py-2.5"
                      >
                        <span
                          className={`grid size-4 place-items-center rounded-full ${i < 2 ? "bg-[color-mix(in_oklab,var(--color-check)_16%,white)]" : "border border-[var(--color-hairline)] bg-canvas"}`}
                        >
                          {i < 2 ? <Check className="size-2.5" /> : null}
                        </span>
                        <span className="text-[13.5px] text-ink">{c}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5">
                    <Shot image={active.image} slot={active.slot} ratio="16 / 10" rounded={14} mock="portal" />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* --------------------------------------- 10 watch your brand grow in real time */

export function GrowthBand() {
  const [i, setI] = useState(0);

  return (
    <section className="relative overflow-hidden bg-[#0c0c0c] py-16 sm:py-20 lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(70% 60% at 20% 0%, rgba(27,78,245,0.30) 0%, transparent 65%), radial-gradient(50% 50% at 90% 20%, rgba(109,99,255,0.24) 0%, transparent 70%)",
        }}
      />
      <Container size="wide" className="relative">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Rise>
            <div className="text-[10px] font-medium uppercase tracking-[0.13em] text-white/45">
              Analytics
            </div>
            <h2 className="mt-4 text-balance text-3xl font-normal leading-[1.1] tracking-[-0.025em] text-white md:text-4xl lg:text-[2.6rem]">
              {GROWTH_H2[0]}
              <span className="block text-white/45">{GROWTH_H2[1]}</span>
            </h2>
          </Rise>

          <Rise delay={0.08}>
            <div className="divide-y divide-white/10">
              {GROWTH_TABS.map((t, idx) => {
                const on = idx === i;
                return (
                  <button
                    key={t.title}
                    type="button"
                    onClick={() => setI(idx)}
                    className="block w-full py-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className={on ? "text-[#8fa9ff]" : "text-white/35"} aria-hidden>
                        →
                      </span>
                      <span
                        className={`text-[16px] font-medium tracking-[-0.015em] ${on ? "text-white" : "text-white/55"}`}
                      >
                        {t.title}
                      </span>
                    </div>
                    <AnimatePresence initial={false}>
                      {on ? (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.42, ease: PB_EASE_SOFT }}
                          className="overflow-hidden pl-6 pr-2 pt-2 text-[14.5px] leading-relaxed text-white/60"
                        >
                          {t.body}
                        </motion.p>
                      ) : null}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>
          </Rise>
        </div>
      </Container>

      <Container size="full" className="relative mt-12">
        <Rise>
          <div className="overflow-hidden rounded-[20px] border border-white/15 bg-white/5 p-2 backdrop-blur-xl">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={GROWTH_SHOTS[i].src}
                src={GROWTH_SHOTS[i].src}
                alt={GROWTH_SHOTS[i].alt}
                loading="lazy"
                decoding="async"
                initial={{ opacity: 0, y: 14, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.45, ease: PB_EASE_SOFT }}
                className="w-full rounded-[14px] object-cover"
              />
            </AnimatePresence>
          </div>
        </Rise>
      </Container>
    </section>
  );
}

/* ------------------------------------------------ 11 how pharmabro compares */

export function Comparison() {
  return (
    <Section id="compare">
      <Container size="wide">
        <Rise>
          <MicroLabel>Comparison</MicroLabel>
          <h2 className="mt-4 text-balance text-3xl font-normal leading-[1.1] tracking-[-0.025em] text-ink md:text-4xl lg:text-[2.85rem]">
            {COMPARE_H2}
          </h2>
          <p className="pb-body mt-5 max-w-[66ch] text-[16.5px] leading-relaxed">
            {COMPARE_SUB}
          </p>
        </Rise>

        <Rise delay={0.06} className="mt-10">
          <div className="pb-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--color-hairline)] bg-[var(--color-mist)]">
                    <th className="px-5 py-4 text-[12px] font-medium uppercase tracking-[0.1em] text-[color-mix(in_oklab,var(--color-ink)_48%,transparent)]">
                      Feature
                    </th>
                    {COMPARE_COLUMNS.map((c, i) => (
                      <th
                        key={c}
                        className={`px-5 py-4 text-[13.5px] font-semibold ${i === 0 ? "text-ink" : "text-[color-mix(in_oklab,var(--color-ink)_52%,transparent)]"}`}
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_TABLE.map((g) => (
                    <Fragment key={g.group}>
                      <tr className="bg-canvas">
                        <td
                          colSpan={COMPARE_COLUMNS.length + 1}
                          className="border-y border-[var(--color-hairline)] px-5 py-3"
                        >
                          <span className="pb-micro">{g.group}</span>
                        </td>
                      </tr>
                      {g.rows.map((r) => (
                        <tr
                          key={g.group + r.feature}
                          className="border-b border-[var(--color-hairline)] last:border-0"
                        >
                          <td className="px-5 py-3.5 text-[13.5px] text-ink">{r.feature}</td>
                          {r.values.map((v, i) => (
                            <td
                              key={i}
                              className={`px-5 py-3.5 ${i === 0 ? "bg-[color-mix(in_oklab,var(--color-marine)_4%,white)]" : ""}`}
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
          </div>
          <p className="pb-micro mt-4">{COMPARE_FOOTNOTE}</p>
          <div className="mt-6">
            <Btn to="/pharmabro/compare" variant="ghost">
              See every comparison
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
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Rise>
            <MicroLabel>Compliance</MicroLabel>
            <h2 className="mt-4 text-balance text-3xl font-normal leading-[1.1] tracking-[-0.025em] text-ink md:text-4xl lg:text-[2.7rem]">
              {LEGIT_H2[0]}
              <span className="block pb-dim">{LEGIT_H2[1]}</span>
            </h2>
            <p className="pb-body mt-5 max-w-[55ch] text-[16.5px] leading-relaxed">
              {LEGIT_BODY}
            </p>
            <div className="mt-7">
              <Btn to="/pharmabro/demo" variant="blue">
                Get started
              </Btn>
            </div>
          </Rise>

          <Rise delay={0.08}>
            <div className="pb-card p-6">
              <div className="pb-micro">Time to LegitScript certification</div>
              <div className="mt-6 space-y-5">
                {LEGIT_BARS.map((b, i) => (
                  <div key={b.label}>
                    <div className="flex items-center justify-between">
                      <span className="text-[13.5px] text-ink">{b.label}</span>
                      <span className="pb-mono text-[13px] text-[color-mix(in_oklab,var(--color-ink)_60%,transparent)]">
                        {b.value}
                      </span>
                    </div>
                    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-mist)]">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${b.pct}%` }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 1.1, delay: i * 0.12, ease: PB_EASE_SOFT }}
                        className="h-full rounded-full"
                        style={{
                          background: b.own
                            ? "linear-gradient(90deg,#1b4ef5,#6d63ff)"
                            : "color-mix(in oklab, #0a0a0a 18%, white)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Rise>
        </div>

        <KineticRule className="mt-14" />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {LEGIT_PANELS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: PB_EASE_SOFT }}
              className="pb-card p-6"
            >
              <h3 className="text-[16px] font-medium leading-snug tracking-[-0.015em] text-ink">
                {p.title}
              </h3>
              <p className="pb-body mt-2.5 text-[14.5px] leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </div>

        <p className="pb-micro mt-8 max-w-[80ch] italic">{LEGIT_DISCLAIMER}</p>
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
              <BlogArt category={c.category} index={i} />
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
