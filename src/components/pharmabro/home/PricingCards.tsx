import { motion, useReducedMotion } from "motion/react";
import { Container, Section } from "@/components/pharmabro/primitives";

/* --------------------------------------------------------------- primitives */

const EASE = [0.22, 1, 0.36, 1] as const;

/** Framer-style per-word blur-in heading. */
function BlurWords({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          className="inline-block will-change-transform"
          initial={reduce ? undefined : { opacity: 0, filter: "blur(8px)", y: 12 }}
          whileInView={reduce ? undefined : { opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE, delay: delay + i * 0.055 }}
        >
          {w}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </span>
  );
}

function Rise({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? undefined : { opacity: 0, y: 22 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Phosphor bold check, exact path from the reference. */
function PCheck({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" />
    </svg>
  );
}

function Benefit({ label, dark = false }: { label: string; dark?: boolean }) {
  return (
    <div className="flex items-start gap-2.5">
      <PCheck
        className={
          dark
            ? "mt-[3px] size-[14px] shrink-0 text-[rgb(240,240,240)]"
            : "mt-[3px] size-[14px] shrink-0 text-[rgb(130,130,130)]"
        }
      />
      <span
        className={
          dark
            ? "text-[13.5px] font-medium leading-snug text-white"
            : "text-[13.5px] font-medium leading-snug text-[#0A0A0A]"
        }
      >
        {label}
      </span>
    </div>
  );
}

/** Green pulse dot, same two-ring animation as the reference. */
function PulseDot() {
  const reduce = useReducedMotion();
  return (
    <span className="relative grid size-[14px] place-items-center">
      {!reduce && (
        <motion.span
          className="absolute inset-0 rounded-full bg-[rgb(18,179,63)]"
          animate={{ scale: [0.9, 2.1], opacity: [0.35, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <span className="size-[7px] rounded-full bg-[rgb(18,179,63)]" />
    </span>
  );
}

const SHADOW_CARD =
  "0 0.6px 0.6px -1.25px rgba(0,0,0,0.18), 0 2.29px 2.29px -2.5px rgba(0,0,0,0.16), 0 10px 10px -3.75px rgba(0,0,0,0.06)";
const SHADOW_PILL =
  "0 0.6px 0.6px -1.25px rgba(0,0,0,0.18), 0 2.29px 2.29px -2.5px rgba(0,0,0,0.16), 0 10px 10px -3.75px rgba(0,0,0,0.06)";
const SHADOW_BLACK_BTN =
  "inset 0 2px 4px 0 rgba(255,255,255,0.4), 0 0.74px 0.74px -0.75px rgba(0,0,0,0.33), 0 2.02px 2.02px -1.5px rgba(0,0,0,0.32), 0 4.43px 4.43px -2.25px rgba(0,0,0,0.3), 0 9.83px 9.83px -3px rgba(0,0,0,0.25), 0 25px 25px -3.75px rgba(0,0,0,0.11)";
const SHADOW_WHITE_BTN =
  "0 0.6px 0.6px -0.94px rgba(0,0,0,0.07), 0 1.81px 1.81px -1.88px rgba(0,0,0,0.07), 0 4.79px 4.79px -2.81px rgba(0,0,0,0.06), 0 15px 15px -3.75px rgba(0,0,0,0.03)";

function StripeS({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M11.6 10.4c0-.5.42-.72 1.06-.72.9 0 2.04.3 2.94.79V8.3a7.1 7.1 0 0 0-2.94-.6c-2.05 0-3.42 1.09-3.42 2.9 0 2.85 3.83 2.39 3.83 3.62 0 .57-.5.76-1.18.76-.98 0-2.25-.41-3.24-.96v2.2c1.03.45 2.1.65 3.24.65 2.1 0 3.55-1.05 3.55-2.9 0-3.07-3.84-2.53-3.84-3.57Z"
        fill="currentColor"
      />
    </svg>
  );
}

function StripeWordmark({ className }: { className?: string }) {
  return (
    <span
      aria-label="Stripe"
      className={className}
      style={{ fontWeight: 700, letterSpacing: "-0.03em" }}
    >
      stripe
    </span>
  );
}

function DocIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </svg>
  );
}

/* ------------------------------------------------------------------ content */

const LAUNCH_BENEFITS = [
  ["All 50 states", "Month to month"],
  ["Pharmacy fulfillment", "LegitScript included, $0"],
  ["Licensed providers", "Your own Stripe account"],
  ["Rebill engine", "Full data export, any day"],
  ["White-label patient portal", "HIPAA infrastructure + BAA"],
  ["Intake builder", "Guided onboarding"],
];

const SCALE_BENEFITS = [
  ["Everything in Launch + Grow", "Dedicated account manager"],
  ["Lowest transaction rate 1.5%", "Named compliance team"],
  ["Patient migration included", "Custom SLA"],
  ["Priority pharmacy routing", "Quarterly business reviews"],
];

/* -------------------------------------------------------------------- block */

export function PricingCards() {
  const reduce = useReducedMotion();

  return (
    <Section band id="pricing">
      <Container size="wide">
        {/* header */}
        <div className="max-w-[46ch]">
          <h2 className="text-[34px] font-normal leading-[1.06] tracking-[-0.03em] md:text-[46px] lg:text-[52px]">
            <BlurWords text="Flat pricing." className="block text-[rgb(107,114,128)]" />
            <BlurWords text="Transparent math." className="block text-[#0A0A0A]" delay={0.12} />
          </h2>
          <Rise delay={0.18}>
            <p className="mt-5 max-w-[56ch] text-[15.5px] leading-relaxed">
              <strong className="font-medium text-[#0A0A0A]">
                Clear costs, no hidden fees.
              </strong>{" "}
              <span className="text-[rgb(84,84,84)]">
                Published on this page so you know before you talk to anyone.
              </span>
            </p>
          </Rise>
        </div>

        {/* card grid */}
        <div className="mt-12 grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
          {/* left column */}
          <div className="grid content-start gap-4">
            {/* CARD 1 — dark brand card */}
            <Rise>
              <motion.div
                initial={reduce ? undefined : { rotate: -3, y: 14, opacity: 0 }}
                whileInView={reduce ? undefined : { rotate: -1.5, y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.85, ease: EASE }}
                whileHover={reduce ? undefined : { rotate: 0, y: -4 }}
                className="relative overflow-hidden rounded-[24px] bg-[#0A0A0A] p-6 will-change-transform sm:p-7"
                style={{ boxShadow: SHADOW_CARD }}
              >
                <div
                  className="relative z-10 inline-flex items-center rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-[#0A0A0A]"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
                >
                  Month to month
                </div>

                <motion.img
                  src="/assets/pharmabro-3d-cross.png"
                  alt=""
                  aria-hidden
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="pointer-events-none absolute -right-6 top-6 w-[190px] select-none sm:w-[210px]"
                  initial={reduce ? undefined : { rotate: 18, scale: 0.9, opacity: 0 }}
                  whileInView={
                    reduce ? undefined : { rotate: 25, scale: 1, opacity: 1 }
                  }
                  viewport={{ once: true, margin: "-70px" }}
                  transition={{ duration: 1, ease: EASE, delay: 0.15 }}
                />

                <p className="relative z-10 mt-[150px] text-[21px] font-normal leading-[1.2] tracking-[-0.02em] text-[rgb(184,184,184)] sm:mt-[170px] sm:text-[23px]">
                  The telehealth business,
                  <br />
                  already built.{" "}
                  <span className="font-medium text-white">
                    Your brand on top of it.
                  </span>
                </p>
              </motion.div>
            </Rise>

            {/* CARD 2 — availability */}
            <Rise delay={0.1}>
              <div
                className="rounded-[24px] border border-[#F0F0F0] bg-white p-6 sm:p-7"
                style={{ boxShadow: SHADOW_CARD }}
              >
                <div
                  className="inline-flex items-center gap-2 rounded-full border border-[#F0F0F0] bg-white px-3.5 py-1.5"
                  style={{ boxShadow: SHADOW_PILL }}
                >
                  <PulseDot />
                  <span className="text-[12.5px] font-medium text-[#0A0A0A]">
                    Brands launching now
                  </span>
                </div>
                <h3 className="mt-6 text-[26px] font-medium leading-[1.1] tracking-[-0.025em] text-[#0A0A0A] sm:text-[28px]">
                  Launch your brand today.
                </h3>
                <p className="mt-3 max-w-[38ch] text-[14px] leading-relaxed text-[rgb(84,84,84)]">
                  No medical license. No infrastructure to build. Put your brand
                  on a clinic that is already running.
                </p>
              </div>
            </Rise>
          </div>

          {/* CARD 3 — main plan */}
          <Rise delay={0.06}>
            <div
              className="flex h-full flex-col rounded-[24px] border border-[#F0F0F0] bg-white p-6 sm:p-9"
              style={{ boxShadow: SHADOW_CARD }}
            >
              <h3 className="text-[26px] font-medium leading-[1.1] tracking-[-0.025em] text-[#0A0A0A] sm:text-[28px]">
                Launch Plan
              </h3>
              <p className="mt-3 max-w-[52ch] text-[14.5px] leading-relaxed">
                <strong className="font-medium text-[#0A0A0A]">
                  One setup fee. One flat monthly rate. Your first clinic, taking
                  patients in 14 days.
                </strong>{" "}
                <span className="text-[rgb(84,84,84)]">
                  Ideal for 0 to 500 patients.
                </span>
              </p>

              <div className="my-7 h-px w-full bg-[#F0F0F0]" />

              <div className="flex items-baseline gap-2.5">
                <span className="text-[46px] font-medium leading-none tracking-[-0.035em] text-[#0A0A0A] sm:text-[56px]">
                  $1,500
                </span>
                <span className="text-[15px] text-[rgb(84,84,84)]">/ month</span>
              </div>
              <div className="mt-3 text-[13px] text-[rgb(130,130,130)]">
                $15,000 one-time setup fee
              </div>

              <div className="mt-8 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
                {LAUNCH_BENEFITS.flat().map((b, i) => (
                  <motion.div
                    key={b}
                    initial={reduce ? undefined : { opacity: 0, y: 8 }}
                    whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.45, ease: EASE, delay: i * 0.035 }}
                  >
                    <Benefit label={b} />
                  </motion.div>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-5">
                <motion.a
                  href="/pharmabro/booking"
                  whileHover={reduce ? undefined : { y: -2 }}
                  whileTap={reduce ? undefined : { scale: 0.985 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="inline-flex items-center gap-2.5 rounded-[24px] bg-[#0A0A0A] px-5 py-3 text-[14px] font-medium text-white"
                  style={{ boxShadow: SHADOW_BLACK_BTN }}
                >
                  <StripeS className="size-[17px]" />
                  Get started
                </motion.a>
                <StripeWordmark className="text-[22px] leading-none text-[rgb(130,130,130)]" />
              </div>
            </div>
          </Rise>
        </div>

        {/* CARD 4 — full width dark */}
        <Rise delay={0.12} className="mt-4">
          <div
            className="rounded-[24px] bg-[#0A0A0A] p-6 sm:p-9"
            style={{ boxShadow: SHADOW_CARD }}
          >
            <div className="grid gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-12">
              <div>
                <h3 className="text-[26px] font-medium leading-[1.1] tracking-[-0.025em] text-white sm:text-[28px]">
                  Scale Plan
                </h3>
                <p className="mt-3 max-w-[42ch] text-[14.5px] leading-relaxed text-white">
                  For brands operating 2,000 to 5,000 patients.{" "}
                  <span className="text-[rgb(184,184,184)]">
                    Custom pricing available for 5,000+.
                  </span>
                </p>
              </div>

              <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
                  {SCALE_BENEFITS.flat().map((b, i) => (
                    <motion.div
                      key={b}
                      initial={reduce ? undefined : { opacity: 0, y: 8 }}
                      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.45, ease: EASE, delay: i * 0.035 }}
                    >
                      <Benefit label={b} dark />
                    </motion.div>
                  ))}
                </div>

                <motion.a
                  href="/pharmabro/booking"
                  whileHover={reduce ? undefined : { y: -2 }}
                  whileTap={reduce ? undefined : { scale: 0.985 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="inline-flex w-fit shrink-0 items-center gap-2.5 rounded-[24px] border border-[rgb(222,222,222)] bg-[rgb(250,250,250)] px-5 py-3 text-[14px] font-medium text-[#0A0A0A]"
                  style={{ boxShadow: SHADOW_WHITE_BTN }}
                >
                  <DocIcon className="size-[17px]" />
                  Talk to us <span aria-hidden>→</span>
                </motion.a>
              </div>
            </div>
          </div>
        </Rise>

        <p className="mt-6 text-[12.5px] text-[rgb(130,130,130)]">
          Grow: $25,000 setup and $3,000 per month. Scale: $50,000 setup and
          $5,000 per month. Enterprise: custom.
        </p>
      </Container>
    </Section>
  );
}
