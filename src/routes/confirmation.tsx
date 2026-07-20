import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, Shield, Sparkles } from "lucide-react";
import blissleyLogo from "@/assets/blissley-white.png.asset.json";
import vialSema from "@/assets/vial-semaglutide.png.asset.json";
import vialTirz from "@/assets/vial-tirzepatide.png.asset.json";

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

/* ── Plan catalog (matches checkouts) ── */
const PLANS = {
  monthly: { supply: "1-Month Supply", months: 1, label: "Monthly" },
  three: { supply: "3-Month Supply", months: 3, label: "3-Month Plan" },
  six: { supply: "6-Month Supply", months: 6, label: "6-Month Plan" },
} as const;

const TX = {
  sema: { name: "Semaglutide", vial: vialSema.url, bg: "#EDE7DE" },
  tirz: { name: "Tirzepatide", vial: vialTirz.url, bg: "#E7EEFB" },
} as const;

function ConfirmationPage() {
  const search = Route.useSearch() as ConfirmationSearch;
  const { model, tx, plan, total, first, email, order } = search;
  const navigate = useNavigate();
  const treatment = TX[tx];
  const planDef = PLANS[plan];
  const firstName = first || "friend";
  const fallbackId = useMemo(() => `BLS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, []);
  const orderId = order || fallbackId;

  // OTO state
  const [otoState, setOtoState] = useState<"idle" | "added" | "declined">("idle");

  // Analytics stub
  useEffect(() => {
    // TODO: wire to Klaviyo + Meta Pixel on backend
    // Auth model: purchase_initiated. Charged model: purchase_completed. Meta: Purchase.
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("blissley:purchase", { detail: { model, orderId, total, plan, tx } }),
      );
    }
    // Send magic link email (backend hook)
    if (typeof window !== "undefined" && email) {
      window.dispatchEvent(new CustomEvent("blissley:sendMagicLink", { detail: { email, orderId } }));
    }
  }, [model, orderId, total, plan, tx, email]);

  return (
    <div
      className="min-h-svh bg-[#F4F2ED] text-ink"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* iOS-style top bar */}
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1000px] items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-ink">
              <img src={blissleyLogo.url} alt="" className="h-4 w-4 object-contain invert" />
            </span>
            <span className="text-[15px] font-bold tracking-tight">blissley</span>
          </Link>
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-ink/60">
            <Shield className="h-3.5 w-3.5" />
            Secure order
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1000px] px-4 pb-24 pt-6 sm:px-6 sm:pt-10">
        {/* HERO */}
        <ConfirmationHero firstName={firstName} model={model} />

        {/* Two-column on desktop */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="space-y-6">
            <OrderSummary
              treatment={treatment}
              planLabel={planDef.label}
              supply={planDef.supply}
              total={total}
              model={model}
              orderId={orderId}
              email={email}
            />
            <TrustFooter model={model} total={total} />
          </div>

          <div className="space-y-6">
            <NextStepsTimeline model={model} />
            <PortalCTA firstName={firstName} onGo={() => navigate({ to: "/portal/patient" })} />
          </div>
        </div>

        {/* OTO */}
        <div className="mt-10">
          <NauseaOTO state={otoState} onAccept={() => setOtoState("added")} onDecline={() => setOtoState("declined")} />
        </div>

        {/* Footer note */}
        <p className="mx-auto mt-10 max-w-md text-center text-[12px] leading-relaxed text-ink/45">
          Order #{orderId} · A confirmation was sent to {email || "your email"}.
          <br />
          Need help? <a className="underline underline-offset-2" href="mailto:care@blissley.com">care@blissley.com</a>
        </p>
      </main>
    </div>
  );
}

/* ────────── HERO ────────── */
function ConfirmationHero({ firstName, model }: { firstName: string; model: "auth" | "charged" }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl bg-white p-6 text-center shadow-[0_20px_60px_-30px_rgba(0,0,0,0.15)] sm:p-10"
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-64 w-64 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #ee7273 0%, transparent 70%)" }}
      />
      <div className="relative">
        <AnimatedCheckmark />
        <h1 className="mt-6 text-[26px] font-black leading-[1.05] tracking-tight sm:text-[38px]">
          You're in, {firstName}.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-ink/60 sm:text-[15px]">
          {model === "charged"
            ? "Payment received. Your program starts now."
            : "Your card is authorized. Your program starts now."}
        </p>
        <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full bg-[#ee7273]/10 px-4 py-1.5 text-[12px] font-semibold text-[#ee7273]">
          <Sparkles className="h-3.5 w-3.5" />
          {model === "charged" ? "Payment received" : "Card authorized · not charged yet"}
        </div>
      </div>
    </motion.section>
  );
}

function AnimatedCheckmark() {
  return (
    <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-white shadow-[0_10px_30px_-10px_rgba(238,114,115,0.5)] ring-1 ring-[#ee7273]/25">
      <motion.svg
        viewBox="0 0 60 60"
        className="h-16 w-16"
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx="30" cy="30" r="26"
          fill="none" stroke="#ee7273" strokeWidth="3" strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: { pathLength: 1, opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
          }}
        />
        <motion.path
          d="M18 31 L27 40 L43 22"
          fill="none" stroke="#ee7273" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
          variants={{
            hidden: { pathLength: 0 },
            visible: { pathLength: 1, transition: { delay: 0.25, duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
          }}
        />
      </motion.svg>
    </div>
  );
}

/* ────────── ORDER SUMMARY ────────── */
function OrderSummary({
  treatment, planLabel, supply, total, model, orderId, email,
}: {
  treatment: { name: string; vial: string; bg: string };
  planLabel: string; supply: string; total: number;
  model: "auth" | "charged"; orderId: string; email: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl bg-white p-5 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.15)] sm:p-6"
    >
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">
          Order confirmed
        </div>
        <div className="text-[11px] font-mono text-ink/45">#{orderId}</div>
      </div>

      <div className="mt-4 flex items-center gap-4 rounded-2xl bg-[#FAFAF8] p-4">
        <div
          className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl"
          style={{ background: treatment.bg }}
        >
          <img src={treatment.vial} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-bold leading-tight">{treatment.name}</div>
          <div className="text-[12px] text-ink/60">{planLabel} · {supply}</div>
        </div>
        <div className="text-right">
          <div className="text-[17px] font-black tracking-tight">${total}</div>
          <div className="text-[10.5px] font-semibold uppercase tracking-wide text-ink/45">Total</div>
        </div>
      </div>

      <div className={`mt-4 flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12px] font-medium ${
        model === "charged" ? "bg-[#EAFBEF] text-[#0F6E3A]" : "bg-[#FFF6EB] text-[#8A5A00]"
      }`}>
        <span className={`grid h-4 w-4 place-items-center rounded-full ${model === "charged" ? "bg-[#0F6E3A]" : "bg-[#8A5A00]"} text-white`}>
          <Check className="h-2.5 w-2.5" strokeWidth={3} />
        </span>
        {model === "charged"
          ? `Payment received to card on file`
          : `Card authorized. Not charged until your physician approves.`}
      </div>

      {email && (
        <p className="mt-3 text-[12px] text-ink/55">
          Confirmation sent to <span className="font-semibold text-ink/80">{email}</span>
        </p>
      )}
    </motion.section>
  );
}

/* ────────── TIMELINE ────────── */
function NextStepsTimeline({ model }: { model: "auth" | "charged" }) {
  const steps = [
    { title: "Dr. Nass is reviewing your intake", meta: "In progress right now", active: true },
    { title: "Physician approval", meta: "Within 24 hours" },
    { title: model === "charged" ? "Prescription sent to pharmacy" : "Card charged · Rx sent to pharmacy", meta: "Once approved" },
    { title: "Shipped discreetly", meta: "Within 48 hours of approval" },
    { title: "Arrives at your door", meta: "3-5 business days" },
  ];
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl bg-white p-5 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.15)] sm:p-6"
    >
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">
        What happens next
      </div>
      <ol className="mt-5 space-y-4">
        {steps.map((s, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.08, duration: 0.4 }}
            className="flex items-start gap-3"
          >
            <div className="relative">
              <div className={`grid h-7 w-7 place-items-center rounded-full ${
                s.active ? "bg-[#ee7273] text-white" : "bg-[#F0EEE8] text-ink/40"
              }`}>
                {s.active ? (
                  <motion.span
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="h-2 w-2 rounded-full bg-white"
                  />
                ) : (
                  <span className="text-[11px] font-bold">{i + 1}</span>
                )}
              </div>
              {i < steps.length - 1 && (
                <span className="absolute left-1/2 top-8 h-full w-px -translate-x-1/2 bg-black/8" />
              )}
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <div className={`text-[14px] font-semibold ${s.active ? "text-ink" : "text-ink/70"}`}>
                {s.title}
              </div>
              <div className="mt-0.5 text-[12px] text-ink/50">{s.meta}</div>
            </div>
          </motion.li>
        ))}
      </ol>
    </motion.section>
  );
}

/* ────────── PORTAL CTA (liquid) ────────── */
function PortalCTA({ firstName, onGo }: { firstName: string; onGo: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl bg-ink p-6 text-white sm:p-7"
    >
      {/* liquid glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(circle, #ee7273 0%, transparent 60%)" }}
        animate={{ x: [0, 20, -10, 0], y: [0, 10, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, #ee7273 0%, transparent 60%)" }}
        animate={{ x: [0, -15, 5, 0], y: [0, -8, 10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
          Your patient portal is ready
        </div>
        <h3 className="mt-2 text-[22px] font-black leading-tight sm:text-[24px]">
          Track approval, message Dr. Nass, and see your plan live.
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-white/60">
          A magic link is on its way to your inbox. You can also open it right now.
        </p>

        <button
          type="button"
          onClick={onGo}
          className="group relative mt-5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#ee7273] px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_10px_30px_-8px_rgba(238,114,115,0.6)] transition hover:bg-[#e85f60]"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative">Open my patient portal</span>
          <ArrowRight className="relative h-4 w-4 transition group-hover:translate-x-0.5" strokeWidth={2.5} />
        </button>

        <p className="mt-3 text-center text-[11px] text-white/40">
          Signed in as {firstName}. No password required.
        </p>
      </div>
    </motion.section>
  );
}

/* ────────── TRUST FOOTER ────────── */
function TrustFooter({ model, total }: { model: "auth" | "charged"; total: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl border border-black/5 bg-white p-5 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#EAFBEF] text-[#0F6E3A]">
          <Shield className="h-4.5 w-4.5" strokeWidth={2.2} />
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-bold text-ink">
            {model === "charged" ? "Full refund if not approved" : "Zero-risk authorization"}
          </div>
          <p className="mt-1 text-[12.5px] leading-relaxed text-ink/60">
            {model === "charged"
              ? `You've been charged $${total} today. If our physician does not approve your prescription, a full refund is issued automatically within 24 hours. No questions asked.`
              : `Your card will only be charged once your physician approves your prescription. If you're not approved, no charge is ever made. Ever.`}
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
      className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_-30px_rgba(0,0,0,0.15)]"
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
            <p className="text-[13px] text-ink/50">Got it. Moving on to your portal.</p>
          </motion.div>
        ) : (
          <motion.div
            key="live"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#FFF0F0] via-white to-[#FFE9EA] md:aspect-auto">
              <img
                src="/assets/blissley-ondansetron-odt.png"
                alt="Blissley Ondansetron ODT anti-nausea"
                className="absolute inset-0 h-full w-full object-contain p-6"
              />
              <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ee7273] shadow-sm backdrop-blur">
                One-time add-on
              </div>
            </div>

            {/* Copy */}
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">
                One thing before we get started
              </div>
              <h3 className="mt-2 text-[22px] font-black leading-tight text-ink sm:text-[26px]">
                Stop nausea before it starts.
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink/65">
                73% of GLP-1 patients experience nausea in weeks 2-4. It's the #1 reason patients quit before results come.
              </p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink/65">
                Ondansetron ODT prevents it. Physician-included in your review. Ships with your first order.
              </p>

              <div className="mt-5 flex items-end justify-between rounded-2xl bg-[#FAFAF8] p-4">
                <div>
                  <div className="text-[13px] font-semibold text-ink">Anti-Nausea Pack</div>
                  <div className="text-[11.5px] text-ink/50">Ondansetron ODT 4mg · 10 tabs</div>
                </div>
                <div className="text-right">
                  <div className="text-[11.5px] text-ink/40 line-through">$45</div>
                  <div className="text-[22px] font-black leading-none text-[#ee7273]">$29</div>
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
