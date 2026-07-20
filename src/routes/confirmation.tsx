import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import {
  ArrowRight,
  Check,
  Copy,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import blissleyLogo from "@/assets/blissley-logo.png.asset.json";
import vialSema from "@/assets/vial-semaglutide.png.asset.json";
import vialTirz from "@/assets/vial-tirzepatide.png.asset.json";
import iconTruck from "@/assets/icon-truck.png.asset.json";
import iconDoctor from "@/assets/icon-doctor.png.asset.json";
import iconDeliveryShield from "@/assets/icon-delivery-shield.png.asset.json";
import shipBox from "@/assets/ship-box.png.asset.json";
import drNassPortal from "@/assets/dr-nass-portal.png.asset.json";
import guaranteeBadge from "@/assets/guarantee-badge.png.asset.json";


/* ── Search params ── */
type Model = "auth" | "charged";
type Tx = "sema" | "tirz";
type Plan = "monthly" | "three" | "six";

type ConfirmationSearch = {
  model: Model; tx: Tx; plan: Plan;
  total: number; first: string; email: string; order: string;
};

const pick = <T extends string>(v: unknown, opts: readonly T[], d: T): T =>
  (typeof v === "string" && (opts as readonly string[]).includes(v) ? (v as T) : d);

export const Route = createFileRoute("/confirmation")({
  component: ConfirmationPage,
  validateSearch: (s: Record<string, unknown>): ConfirmationSearch => ({
    model: pick(s.model, ["auth", "charged"] as const, "auth"),
    tx: pick(s.tx, ["sema", "tirz"] as const, "sema"),
    plan: pick(s.plan, ["monthly", "three", "six"] as const, "three"),
    total: Number(s.total) || 711,
    first: typeof s.first === "string" ? s.first : "",
    email: typeof s.email === "string" ? s.email : "",
    order: typeof s.order === "string" ? s.order : "",
  }),
  head: () => ({
    meta: [
      { title: "You're in · Blissley" },
      { name: "description", content: "Your Blissley program is confirmed. Physician review begins now." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

/* ── Catalogs ── */
const PLANS = {
  monthly: { supply: "1-Month Supply", months: 1, label: "Monthly" },
  three: { supply: "3-Month Supply", months: 3, label: "3-Month Plan" },
  six: { supply: "6-Month Supply", months: 6, label: "6-Month Plan" },
} as const;

const TX = {
  sema: { name: "Semaglutide", vial: vialSema.url, bg: "#F4EFE7" },
  tirz: { name: "Tirzepatide", vial: vialTirz.url, bg: "#EAF0FA" },
} as const;

const CORAL = "#ee7273";

function todayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function ConfirmationPage() {
  const { model, tx, plan, total, first, email, order } = Route.useSearch() as ConfirmationSearch;
  const navigate = useNavigate();
  const treatment = TX[tx];
  const planDef = PLANS[plan];
  const firstName = first || "friend";
  const fallbackId = useMemo(
    () => `BLS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    [],
  );
  const orderId = order || fallbackId;

  const [otoState, setOtoState] = useState<"idle" | "added" | "declined">("idle");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("blissley:purchase", { detail: { model, orderId, total, plan, tx } }),
    );
    if (email) {
      window.dispatchEvent(
        new CustomEvent("blissley:sendMagicLink", { detail: { email, orderId } }),
      );
    }
  }, [model, orderId, total, plan, tx, email]);

  const copyOrder = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch { /* noop */ }
  };

  return (
    <div className="min-h-svh bg-white text-ink" style={{ fontFamily: "var(--font-sans)" }}>
      <LiquidHeader />

      <main className="mx-auto w-full max-w-[1120px] px-4 pb-24 pt-6 sm:px-6 sm:pt-10 lg:pt-14">
        {/* HERO */}
        <Hero firstName={firstName} model={model} />

        {/* Order number chip */}
        <div className="mx-auto mt-6 flex max-w-md flex-col items-center gap-3 sm:mt-8">
          <button
            type="button"
            onClick={copyOrder}
            className="group flex items-center gap-3 rounded-2xl border border-black/8 bg-white px-4 py-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.06)] transition hover:border-black/15"
          >
            <div className="text-left">
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">
                Order number
              </div>
              <div className="text-[15px] font-bold tracking-tight">#{orderId}</div>
            </div>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#F6F4EF] text-ink/60 transition group-hover:bg-black/5">
              {copied ? (
                <Check className="h-4 w-4 text-[#0F6E3A]" strokeWidth={2.6} />
              ) : (
                <Copy className="h-4 w-4" strokeWidth={2.2} />
              )}
            </div>
          </button>
          {email && (
            <div className="flex items-center gap-1.5 text-[12.5px] text-ink/55">
              <Mail className="h-3.5 w-3.5" />
              Confirmation sent to <span className="font-semibold text-ink/80">{email}</span>
            </div>
          )}
        </div>

        {/* Two-column layout on desktop */}
        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8">
          <div className="space-y-6">
            <OrderSummary
              treatment={treatment}
              planLabel={planDef.label}
              supply={planDef.supply}
              total={total}
              model={model}
            />
            <DeliveryDetails firstName={firstName} />
            <RefundGuarantee model={model} total={total} />
          </div>

          <div className="space-y-6">
            <NextStepsTimeline model={model} />
            <PortalCTA firstName={firstName} onGo={() => navigate({ to: "/portal/patient" })} />
          </div>
        </div>

        {/* OTO */}
        <div className="mt-10 lg:mt-14">
          <NauseaOTO
            state={otoState}
            onAccept={() => setOtoState("added")}
            onDecline={() => setOtoState("declined")}
          />
        </div>

        {/* Support */}
        <SupportBlock />

        <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center gap-2 text-center">
          <p className="text-[12px] text-ink/50">© 2026 TheFactual LLC DBA Blissley</p>
          <p className="text-[11.5px] leading-[1.65] text-ink/45">
            Blissley is a technology platform and does not provide medical advice. Physician services are provided by independent licensed practitioners. Individual results may vary.
          </p>
        </div>
      </main>
    </div>
  );
}

/* ────────── LIQUID HEADER (matches main LP) ────────── */
function LiquidHeader() {
  return (
    <header className="sticky top-0 z-30 bg-white/75 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-4 sm:h-18 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={blissleyLogo.url}
            alt="Blissley"
            className="h-10 w-auto sm:h-14"
          />
        </Link>
        <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-ink/40 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-md">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full opacity-70" style={{ background: CORAL }} />
            <span className="relative h-1.5 w-1.5 rounded-full" style={{ background: CORAL }} />
          </span>
          Secure order
        </div>
      </div>
    </header>
  );
}

/* ────────── HERO ────────── */
function Hero({ firstName, model }: { firstName: string; model: Model }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden pt-4 text-center sm:pt-8"
    >
      {/* pink gradient glow removed */}

      <div className="relative">
        <AnimatedCheckmark />
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-[28px] font-black leading-[1.05] tracking-tight sm:text-[42px] lg:text-[52px]"
        >
          Thank you, {firstName}.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-ink/60 sm:text-[16px]"
        >
          {model === "charged"
            ? "Payment received. Dr. Nass is reviewing your intake now."
            : "Your card is authorized. Dr. Nass is reviewing your intake now."}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mx-auto mt-5 inline-flex items-center gap-2.5 rounded-full border border-white/15 px-4 py-2 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.12)]"
          style={{
            background:
              "linear-gradient(180deg, rgba(30,22,22,0.78) 0%, rgba(18,14,14,0.72) 100%)",
            backdropFilter: "blur(14px) saturate(140%)",
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full" style={{ background: CORAL, opacity: 0.55 }} />
            <span className="relative h-2 w-2 rounded-full" style={{ background: CORAL }} />
          </span>
          {model === "charged" ? "Payment received" : "Card authorized"}
        </motion.div>


      </div>
    </motion.section>
  );
}

function AnimatedCheckmark() {
  return (
    <div className="relative mx-auto grid h-28 w-28 place-items-center sm:h-32 sm:w-32">
      <motion.svg
        viewBox="0 0 60 60"
        className="h-20 w-20 sm:h-24 sm:w-24"
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx="30"
          cy="30"
          r="28"
          fill="#171717"
          variants={{
            hidden: { scale: 0.8, opacity: 0 },
            visible: { scale: 1, opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
          }}
        />
        <motion.path
          d="M18 31 L27 40 L43 22"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { pathLength: 0 },
            visible: { pathLength: 1, transition: { delay: 0.25, duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
          }}
        />
      </motion.svg>
    </div>
  );
}

/* ────────── CARD SHELL ────────── */
function Card({
  eyebrow,
  title,
  children,
  className = "",
  delay = 0,
}: {
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-3xl border border-black/6 bg-white p-5 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.06)] sm:p-6 ${className}`}
    >
      {(eyebrow || title) && (
        <div className="mb-4 flex items-center justify-between">
          <div>
            {eyebrow && (
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">
                {eyebrow}
              </div>
            )}
            {title && (
              <h3 className="mt-0.5 text-[16px] font-bold tracking-tight sm:text-[17px]">
                {title}
              </h3>
            )}
          </div>
        </div>
      )}
      {children}
    </motion.section>
  );
}

/* ────────── ORDER SUMMARY ────────── */
function OrderSummary({
  treatment, planLabel, supply, total, model,
}: {
  treatment: { name: string; vial: string; bg: string };
  planLabel: string; supply: string; total: number; model: Model;
}) {
  return (
    <Card eyebrow="Order summary" title="Your treatment" delay={0.08}>
      <div className="flex items-center gap-4 rounded-2xl bg-[#FAF8F3] p-3.5 sm:p-4">
        <div
          className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl sm:h-24 sm:w-24"
          style={{ background: treatment.bg }}
        >
          <img src={treatment.vial} alt={treatment.name} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[15.5px] font-bold leading-tight sm:text-[16.5px]">
            {treatment.name}
          </div>
          <div className="mt-0.5 text-[12.5px] text-ink/60">
            {planLabel} · {supply}
          </div>
          <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-white px-2 py-0.5 text-[10.5px] font-semibold text-ink/70 ring-1 ring-black/5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: CORAL }} />
            Rx pending physician review
          </div>
        </div>
        <div className="text-right">
          <div className="text-[19px] font-black tracking-tight sm:text-[22px]">${total}</div>
          <div className="text-[10.5px] font-semibold uppercase tracking-wide text-ink/45">
            Total
          </div>
        </div>
      </div>

      {/* Line breakdown */}
      <dl className="mt-4 space-y-2 text-[13px]">
        <div className="flex justify-between text-ink/65">
          <dt>Subtotal</dt>
          <dd>${total}</dd>
        </div>
        <div className="flex justify-between text-ink/65">
          <dt>Shipping</dt>
          <dd className="font-semibold text-[#0F6E3A]">Free</dd>
        </div>
        <div className="flex justify-between text-ink/65">
          <dt>Physician review</dt>
          <dd className="font-semibold text-[#0F6E3A]">Included</dd>
        </div>
        <div className="mt-1 flex items-center justify-between border-t border-black/8 pt-3">
          <dt className="text-[14px] font-bold">Charged today</dt>
          <dd className="text-[16px] font-black tracking-tight">
            {model === "charged" ? `$${total}` : "$0.00"}
          </dd>
        </div>
      </dl>
    </Card>
  );
}

/* ────────── DELIVERY DETAILS ────────── */
function DeliveryDetails({ firstName }: { firstName: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white py-1"
    >
      <div className="mb-5">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">
          Delivery details
        </div>
        <h3 className="mt-0.5 text-[16px] font-bold tracking-tight sm:text-[17px]">
          Where it ships
        </h3>
      </div>

      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <svg
            height="24"
            width="24"
            viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 shrink-0 text-ink/70"
          >
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
              <circle cx="15.25" cy="12.75" r="2" />
              <path d="M16.25,8.371v-3.374c0-.64-.592-1.115-1.217-.976l-2.998,.666c-.186,.041-.38,.029-.559-.036l-4.952-1.801c-.179-.065-.373-.078-.559-.036l-3.432,.763c-.458,.102-.783,.508-.783,.976V13.003c0,.64,.592,1.115,1.217,.976l2.998-.666c.186-.041,.38-.029,.559,.036l4.926,1.791" />
              <line x1="15.25" x2="15.25" y1="14.75" y2="17.25" />
            </g>
          </svg>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-bold text-ink">Shipping to</div>
            <p className="mt-0.5 text-[13px] leading-relaxed text-ink/60">
              {firstName === "friend" ? "The address on file" : `${firstName}, at the address on file`}
              <br />
              <span className="text-ink/45">Discreet, unbranded packaging</span>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <img
            src="/assets/icon-shipping-truck.png"
            alt=""
            className="h-8 w-8 shrink-0 object-contain"
          />
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-bold text-ink">Shipping method</div>
            <p className="mt-0.5 text-[13px] text-ink/60">
              Standard temperature-controlled — Free
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <img src={shipBox.url} alt="" className="h-8 w-8 shrink-0 object-contain" />
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-bold" style={{ color: CORAL }}>
              Estimated delivery
            </div>
            <p className="mt-0.5 text-[13px] font-semibold text-ink">
              {todayPlus(3)} – {todayPlus(6)}
            </p>
            <p className="mt-0.5 text-[11.5px] text-ink/55">
              Tracking sent to your inbox once your Rx ships.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ────────── TIMELINE (flat, scroll-animated progress line) ────────── */
function NextStepsTimeline({ model }: { model: Model }) {
  const steps = [
    { title: "Order confirmed", meta: "Just now", done: true, icon: iconDeliveryShield.url },
    { title: "Dr. Nass is reviewing your intake", meta: "In progress right now", active: true, icon: iconDoctor.url },
    { title: model === "charged" ? "Physician approval" : "Approval & card charged", meta: "Within 24 hours", icon: iconDeliveryShield.url },
    { title: "Prescription sent to pharmacy", meta: "Once approved", icon: shipBox.url },
    { title: "Shipped discreetly to your door", meta: "3–5 business days", icon: iconTruck.url },
  ];

  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 85%", "end 60%"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  // Progress only reaches the 2nd step (index 1) since that's the live state
  const lineHeight = useTransform(smooth, [0, 1], ["0%", "28%"]);


  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white py-1"
    >
      <div className="mb-5">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">
          What happens next
        </div>
        <h3 className="mt-0.5 text-[16px] font-bold tracking-tight sm:text-[17px]">
          Your timeline
        </h3>
      </div>

      <ol ref={listRef} className="relative space-y-6">
        {/* Rail (base) */}
        <span
          aria-hidden
          className="absolute left-5 top-2 bottom-2 w-px bg-black/8"
        />
        {/* Rail (progress) — grows with scroll */}
        <motion.span
          aria-hidden
          style={{ height: lineHeight, background: CORAL }}
          className="absolute left-5 top-2 w-px origin-top"
        />

        {steps.map((s, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-start gap-4"
          >
            <div className="relative z-10">
              <div
                className={`grid h-10 w-10 place-items-center rounded-full ring-4 ring-white ${
                  s.done
                    ? "bg-[#EAFBEF] text-[#0F6E3A]"
                    : s.active
                      ? "text-white"
                      : "bg-[#F6F4EF] text-ink/40"
                }`}
                style={s.active ? { background: CORAL } : undefined}
              >
                {s.done ? (
                  <Check className="h-4.5 w-4.5" strokeWidth={2.8} />
                ) : s.active ? (
                  <motion.span
                    animate={{ scale: [1, 1.35, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="h-2.5 w-2.5 rounded-full bg-white"
                  />
                ) : (
                  <img src={s.icon} alt="" className="h-5 w-5 object-contain opacity-60" />
                )}
              </div>
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <div className={`text-[14px] font-semibold ${
                s.active ? "text-ink" : s.done ? "text-ink/70" : "text-ink/60"
              }`}>
                {s.title}
              </div>
              <div className={`mt-0.5 text-[12px] ${s.active ? "font-semibold" : "text-ink/50"}`}
                   style={s.active ? { color: CORAL } : undefined}>
                {s.meta}
              </div>
            </div>
          </motion.li>
        ))}
      </ol>
    </motion.section>
  );
}

/* ────────── PORTAL CTA (white card, doctor image on top) ────────── */
function PortalCTA({ firstName, onGo }: { firstName: string; onGo: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden bg-white"
    >
      {/* Image on top — square, shown at native size, no extra blur */}
      <div className="relative mx-auto w-full max-w-[500px] overflow-hidden rounded-3xl">
        <img
          src={drNassPortal.url}
          alt="Dr. Scott Nass, MD"
          className="block h-auto w-full"
          loading="lazy"
        />

        {/* Soft blended blur over bottom ~40% — feathered, no hard line */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%]"
          style={{
            backdropFilter: "blur(14px)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 22%, rgba(0,0,0,0.85) 55%, #000 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 22%, rgba(0,0,0,0.85) 55%, #000 100%)",
          }}
        />
        {/* Tint for text legibility, same feather */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Availability chip — top-left */}
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold text-ink shadow-[0_4px_14px_-6px_rgba(0,0,0,0.3)] backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full" style={{ background: CORAL, opacity: 0.6 }} />
            <span className="relative h-2 w-2 rounded-full" style={{ background: CORAL }} />
          </span>
          Online now
        </div>

        {/* Text over the feathered blur */}
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/85">
            Your care team
          </div>
          <div className="mt-1 text-[18px] font-bold leading-tight text-white sm:text-[20px]">
            Dr. Scott Nass, MD
          </div>
          <div className="text-[12px] text-white/80">
            Board-certified · Reviewing your intake
          </div>
        </div>
      </div>


      {/* White area — copy + CTA */}
      <div className="px-1 pt-6 sm:pt-7">

        <div className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink/50">
          Your patient portal
        </div>
        <h3 className="mt-2 text-[20px] font-black leading-tight text-ink sm:text-[24px]">
          Track approval, message Dr. Nass, see your plan live.
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-ink/60 sm:text-[14px]">
          A magic link is on its way to your inbox. You can open your portal right now, no password needed.
        </p>

        <button
          type="button"
          onClick={onGo}
          className="group relative mt-5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_10px_30px_-8px_rgba(238,114,115,0.6)] transition"
          style={{ background: CORAL }}
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative">Open my patient portal</span>
          <ArrowRight className="relative h-4 w-4 transition group-hover:translate-x-0.5" strokeWidth={2.5} />
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-ink/50">
          <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
          Signed in as {firstName} · No password required
        </div>
      </div>
    </motion.section>
  );
}


/* ────────── REFUND GUARANTEE ────────── */
function RefundGuarantee({ model, total }: { model: Model; total: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white py-5 sm:py-6"
    >
      <div className="flex items-start gap-3">
        <img src={guaranteeBadge.url} alt="" className="h-12 w-12 shrink-0 object-contain" />
        <div className="min-w-0">
          <div className="text-[13.5px] font-bold text-ink">
            {model === "charged" ? "Full refund if not approved" : "Zero-risk authorization"}
          </div>
          <p className="mt-1 text-[12.5px] leading-relaxed text-ink/60">
            {model === "charged"
              ? `You've been charged $${total} today. If our physician doesn't approve your prescription, a full refund is issued automatically within 24 hours.`
              : `Your card will only be charged once Dr. Nass approves your prescription. Not approved? No charge is ever made.`}
          </p>
        </div>
      </div>
    </motion.section>
  );
}

/* ────────── OTO: NAUSEA PACK ────────── */
function NauseaOTO({
  state, onAccept, onDecline,
}: {
  state: "idle" | "added" | "declined";
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-3xl border border-black/6 bg-white shadow-[0_20px_60px_-30px_rgba(0,0,0,0.15)]"
    >
      <AnimatePresence mode="wait">
        {state === "declined" ? (
          <motion.div
            key="declined"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 text-center"
          >
            <p className="text-[13px] text-ink/50">Got it. Heading to your portal.</p>
          </motion.div>
        ) : (
          <motion.div
            key="live"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]"
          >
            <div className="relative flex aspect-square w-full max-w-[500px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF0F0] via-white to-[#FFE9EA]">
              <img
                src="/assets/blissley-ondansetron-odt.png"
                alt="Blissley Ondansetron ODT anti-nausea"
                className="h-full w-full object-contain"
              />
              <div
                className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-ink/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#ee7273]" />
                One-time add-on
              </div>
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8">
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">
                One thing before you go
              </div>
              <h3 className="mt-2 text-[22px] font-black leading-tight text-ink sm:text-[26px]">
                Stop nausea before it starts.
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink/65">
                73% of GLP-1 patients experience nausea in weeks 2–4. It's the #1 reason patients quit before results come.
              </p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink/65">
                Ondansetron ODT prevents it. Physician-included in your review. Ships with your first order.
              </p>

              <div className="mt-5 flex items-end justify-between rounded-2xl bg-[#FAF8F3] p-4">
                <div>
                  <div className="text-[13px] font-semibold text-ink">Anti-Nausea Pack</div>
                  <div className="text-[11.5px] text-ink/50">Ondansetron ODT 4mg · 10 tabs</div>
                </div>
                <div className="text-right">
                  <div className="text-[11.5px] text-ink/40 line-through">$45</div>
                  <div className="text-[22px] font-black leading-none" style={{ color: CORAL }}>
                    $29
                  </div>
                </div>
              </div>

              {state === "added" ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#EAFBEF] px-5 py-3.5 text-[14px] font-bold text-[#0F6E3A]"
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                  Added to your order
                </motion.div>
              ) : (
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={onAccept}
                    className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-ink px-5 py-3.5 text-[14px] font-bold text-white transition hover:bg-black"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative">Yes, add for $29</span>
                    <ArrowRight className="relative h-4 w-4" strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={onDecline}
                    className="text-center text-[12.5px] font-medium text-ink/45 transition hover:text-ink/70"
                  >
                    No thanks
                  </button>
                </div>
              )}

              <p className="mt-3 text-center text-[11px] text-ink/40">
                This offer disappears when you leave.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

/* ────────── SUPPORT ────────── */
function SupportBlock() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="mt-8 grid gap-3 sm:grid-cols-2"
    >
      <a
        href="mailto:care@blissley.com"
        className="group flex items-center gap-3 rounded-2xl border border-black/6 bg-white p-4 transition hover:border-black/15 hover:shadow-[0_6px_20px_-10px_rgba(0,0,0,0.15)]"
      >
        <Mail className="h-5 w-5 text-ink/70" />
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-bold">Need help?</div>
          <div className="text-[12px] text-ink/55">care@blissley.com · Reply within 2 hours</div>
        </div>
        <ArrowRight className="h-4 w-4 text-ink/30 transition group-hover:translate-x-0.5 group-hover:text-ink/60" />
      </a>
      <img
        src="/assets/trustpilot-badge.png"
        alt="Trustpilot Excellent rating"
        className="mx-auto h-auto w-full max-w-[280px] object-contain"
      />
    </motion.section>
  );
}
