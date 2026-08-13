import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Star, ArrowRight, Check, Clock, Heart, MessageCircle } from "lucide-react";
import { MotionButton } from "@/components/MotionButton";

export const INTAKE = "/intake/weight-loss";

/* ------------------------------------------------------------------ chrome */

export function ArticleChrome() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/95 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-4 py-3">
        <div className="min-w-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/40">
          Health Notes
        </div>
        <Link to="/" className="shrink-0 justify-self-center">
          <img src="/assets/blissley-logo.png" alt="Blissley" className="h-6 w-auto sm:h-7" />
        </Link>
        <button
          type="button"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="justify-self-end rounded-lg p-2 text-ink/70 transition hover:bg-ink/5"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-hairline bg-canvas"
          >
            <div className="mx-auto flex max-w-6xl flex-col px-4 py-2">
              {[
                { label: "Home", to: "/" },
                { label: "Weight loss", to: "/weight-loss" },
                { label: "Reviews", to: "#reviews" },
              ].map((item) =>
                item.to.startsWith("#") ? (
                  <a
                    key={item.label}
                    href={item.to}
                    onClick={() => setOpen(false)}
                    className="border-b border-hairline py-3 text-[15px] text-ink/80 last:border-0"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="border-b border-hairline py-3 text-[15px] text-ink/80 last:border-0"
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export function ReviewsTab() {
  return (
    <a
      href="#reviews"
      className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 items-center gap-2 rounded-l-lg bg-ink px-2 py-4 text-canvas lg:flex"
      style={{ writingMode: "vertical-rl" }}
    >
      <Star className="h-3.5 w-3.5 rotate-90 fill-current" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Reviews</span>
    </a>
  );
}

/* ------------------------------------------------------------------ layout */

export function Col({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[720px] px-5 ${className}`}>{children}</div>;
}

export function P({ children, lead = false }: { children: ReactNode; lead?: boolean }) {
  return (
    <p className={`adv-p ${lead ? "adv-p-lead" : ""}`}>{children}</p>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="adv-h2">{children}</h2>;
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ever">
      {children}
    </div>
  );
}

export function Highlight({ children }: { children: ReactNode }) {
  return <span className="adv-mark">{children}</span>;
}

export function Byline() {
  return (
    <div className="my-7 flex flex-col gap-3 border-y border-hairline py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative shrink-0">
          <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-full border border-hairline bg-canvas shadow-[0_6px_18px_-12px_rgba(0,0,0,0.5)]">
            <img
              src="/assets/uo-logo.png"
              alt="UnhingedOne"
              className="h-full w-full scale-[1.55] object-contain p-1"
            />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full border-2 border-canvas bg-ever text-canvas">
            <Check className="h-2.5 w-2.5" strokeWidth={4} />
          </span>
        </div>
        <div className="min-w-0">
          <div className="text-[14.5px] font-bold leading-tight text-ink">
            By the founder of UnhingedOne
          </div>
          <div className="mt-0.5 text-[12.5px] text-ink/50">
            Blissley Health Notes · Medically reviewed
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">
        <span className="rounded-full bg-ink/[0.05] px-2.5 py-1">8 min read</span>
        <span className="rounded-full bg-ever/10 px-2.5 py-1 text-ever">Updated Aug 2026</span>
      </div>
    </div>
  );
}

export function Figure({
  src,
  alt,
  caption,
  badge,
  ratio,
}: {
  src: string;
  alt: string;
  caption?: string;
  badge?: string;
  ratio?: string;
}) {
  return (
    <figure className="my-7">
      <div className="relative overflow-hidden rounded-2xl border border-hairline bg-ink/[0.03]">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full object-cover"
          style={ratio ? { aspectRatio: ratio } : undefined}
        />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-canvas">
            {badge}
          </span>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-[12.5px] text-ink/50">{caption}</figcaption>
      )}
    </figure>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="my-7 rounded-2xl border-l-[3px] border-ever bg-ever/[0.06] px-5 py-4 text-[17px] font-semibold leading-relaxed text-ink">
      {children}
    </div>
  );
}

export function PullQuote({ children }: { children: ReactNode }) {
  return (
    <p className="my-8 text-center text-[26px] font-bold leading-tight tracking-tight text-ink sm:text-[32px]">
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ lists */

export function CrossRow({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex gap-3 border-b border-hairline py-4 last:border-0">
      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[6px] bg-ever text-[12px] font-bold text-canvas">
        ✕
      </span>
      <div className="min-w-0">
        <div className="text-[15.5px] font-bold text-ink">{title}</div>
        <div className="mt-1 text-[15.5px] leading-[1.72] text-ink/70">{children}</div>
      </div>
    </div>
  );
}

export function CheckCard({ items, title }: { items: string[]; title?: string }) {
  return (
    <div className="my-7 rounded-2xl border border-hairline bg-canvas p-5 shadow-[0_10px_30px_-24px_rgba(0,0,0,0.4)]">
      {title && <div className="mb-3 text-[15px] font-bold text-ink">{title}</div>}
      <ul className="space-y-3">
        {items.map((i) => (
          <li key={i} className="flex gap-3 text-[15.5px] leading-relaxed text-ink/80">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ever text-canvas">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ CTAs */

export function CtaButton({ label = "See If You Qualify → 2 Min" }: { label?: string }) {
  return (
    <Link to={INTAKE} className="block">
      <MotionButton
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-full bg-ever px-7 py-4 text-[15.5px] font-bold text-canvas shadow-[0_16px_40px_-18px_color-mix(in_oklab,var(--color-ever)_70%,transparent)]"
      >
        {label}
        <ArrowRight className="h-4 w-4" />
      </MotionButton>
    </Link>
  );
}

export function CtaBand({
  label = "See If You Qualify → 2 Min",
  note,
}: {
  label?: string;
  note?: string;
}) {
  return (
    <div className="my-10 bg-ink/[0.03] py-8">
      <Col>
        <CtaButton label={label} />
        <p className="mt-3 text-center text-[12.5px] text-ink/50">
          {note ?? "Reviewed by a licensed physician · No commitment · 2 minutes"}
        </p>
      </Col>
    </div>
  );
}

export function StickyCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 1200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 90 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-canvas/95 px-4 py-3 backdrop-blur"
        >
          <div className="mx-auto max-w-[560px]">
            <CtaButton />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ story */

export function StoryTimeline({
  steps,
}: {
  steps: { label: string; body: string }[];
}) {
  return (
    <ol className="my-8 space-y-6 border-l border-hairline pl-6">
      {steps.map((s) => (
        <li key={s.label} className="relative">
          <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-ever ring-4 ring-canvas" />
          <div className="text-[12px] font-bold uppercase tracking-[0.16em] text-ever">
            {s.label}
          </div>
          <p className="mt-1 text-[16px] leading-[1.72] text-ink/80">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function BigQuote({ children, who }: { children: ReactNode; who?: string }) {
  return (
    <blockquote className="my-8 rounded-2xl border border-ever/25 bg-ever/[0.05] p-6">
      <div className="text-[20px] font-bold leading-snug text-ink sm:text-[23px]">“{children}”</div>
      {who && <div className="mt-3 text-[13px] font-semibold text-ink/55">— {who}</div>}
    </blockquote>
  );
}

export function TestimonialCard({
  name,
  tag,
  quote,
}: {
  name: string;
  tag: string;
  quote: string;
}) {
  return (
    <div className="rounded-2xl border border-hairline bg-ink/[0.02] p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ever/12 text-[13px] font-bold text-ever">
          {name.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="truncate text-[14px] font-bold text-ink">{name}</div>
          <div className="text-[11.5px] font-semibold uppercase tracking-wide text-ever">
            Verified patient
          </div>
        </div>
        <div className="ml-auto flex shrink-0 gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-ever text-ever" />
          ))}
        </div>
      </div>
      <div className="mt-3 text-[12px] font-semibold uppercase tracking-wide text-ink/40">{tag}</div>
      <p className="mt-1.5 text-[15.5px] leading-[1.7] text-ink/80">“{quote}”</p>
    </div>
  );
}

export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="my-7 divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline">
      {items.map((it, i) => (
        <div key={it.q}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center gap-3 px-5 py-4 text-left"
          >
            <span className="min-w-0 flex-1 text-[15.5px] font-bold text-ink">{it.q}</span>
            <span className="shrink-0 text-[20px] leading-none text-ever">
              {open === i ? "−" : "+"}
            </span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-4 text-[15.5px] leading-[1.72] text-ink/70">{it.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ offer */

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function OfferCard() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const end = Date.now() + 24 * 60 * 60 * 1000;
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const h = left == null ? 24 : Math.floor(left / 3600000);
  const m = left == null ? 0 : Math.floor((left % 3600000) / 60000);
  const s = left == null ? 0 : Math.floor((left % 60000) / 1000);

  return (
    <div className="my-8 overflow-hidden rounded-3xl border border-ever/30 bg-ever/[0.05]">
      <div className="flex items-center justify-center gap-2 bg-ever px-4 py-2.5 text-canvas">
        <Clock className="h-4 w-4" />
        <span className="text-[13px] font-bold uppercase tracking-[0.14em]">
          UO fam · 45% off first month
        </span>
      </div>
      <div className="p-6 text-center">
        <div className="text-[13px] font-semibold uppercase tracking-[0.16em] text-ink/50">
          Offer expires in
        </div>
        <div className="mt-2 flex justify-center gap-2" suppressHydrationWarning>
          {[
            { v: pad(h), l: "hrs" },
            { v: pad(m), l: "min" },
            { v: pad(s), l: "sec" },
          ].map((b) => (
            <div key={b.l} className="min-w-[68px] rounded-xl bg-canvas px-3 py-2 border border-hairline">
              <div className="text-[26px] font-bold leading-none tracking-tight text-ink">{b.v}</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-ink/40">
                {b.l}
              </div>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-4 max-w-[420px] text-[14.5px] leading-relaxed text-ink/70">
          That's the lowest this will ever be. When the 24 hours are up, it's gone.
        </p>
        <div className="mt-5">
          <CtaButton label="See If You Qualify → Claim 45% Off" />
        </div>
      </div>
    </div>
  );
}

export function AnchorRows({
  rows,
  final,
}: {
  rows: { label: string; price: string }[];
  final: { label: string; price: string };
}) {
  return (
    <div className="my-7 rounded-2xl border border-hairline p-5">
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex items-center justify-between gap-3 border-b border-hairline py-3 text-[15px] last:border-0"
        >
          <span className="min-w-0 text-ink/45 line-through">{r.label}</span>
          <span className="shrink-0 font-semibold text-ink/40 line-through">{r.price}</span>
        </div>
      ))}
      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-ever/10 px-4 py-3">
        <span className="min-w-0 text-[15px] font-bold text-ink">{final.label}</span>
        <span className="shrink-0 text-[17px] font-bold text-ever">{final.price}</span>
      </div>
    </div>
  );
}

export function PathCards() {
  return (
    <div className="my-8 grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-hairline bg-ink/[0.02] p-5">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-ink/10 text-[12px] font-bold text-ink/50">
            ✕
          </span>
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-ink/50">
            Path 1
          </span>
        </div>
        <p className="mt-3 text-[15.5px] leading-[1.72] text-ink/60">
          Close this page. Keep fighting a brain that won't stop. Keep losing 10 and gaining 15.
          Keep telling yourself there's something wrong with you. Nothing changes if nothing
          changes.
        </p>
      </div>
      <div className="rounded-2xl border border-ever/30 bg-ever/[0.06] p-5">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-ever text-canvas">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-ever">
            Path 2
          </span>
        </div>
        <p className="mt-3 text-[15.5px] leading-[1.72] text-ink/80">
          Take the 2-minute quiz. A real doctor reviews it. If you qualify, the medication that
          quiets the food noise shows up at your door. A few weeks from now you could feel the noise
          go quiet for the first time in years. A few months from now you could be the person in the
          front of the photo again.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ comments */

type Comment = { name: string; body: string; time: string; likes: number; reply?: string };

export function CommentThread({ comments }: { comments: Comment[] }) {
  return (
    <div className="my-6 space-y-5">
      {comments.map((c) => (
        <div key={c.name + c.body} className="flex gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink/[0.06] text-[13px] font-bold text-ink/60">
            {c.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="rounded-2xl bg-ink/[0.04] px-4 py-3">
              <div className="flex items-baseline gap-2">
                <span className="truncate text-[13.5px] font-bold text-ink">{c.name}</span>
                <span className="shrink-0 text-[11.5px] text-ink/40">{c.time}</span>
              </div>
              <p className="mt-1 text-[15px] leading-[1.65] text-ink/80">{c.body}</p>
            </div>
            <div className="mt-1.5 flex items-center gap-4 pl-1 text-[12px] text-ink/45">
              <span className="inline-flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" /> {c.likes}
              </span>
              <span className="inline-flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" /> Reply
              </span>
            </div>
            {c.reply && (
              <div className="mt-3 flex gap-3 pl-4">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ever/12 text-[11px] font-bold text-ever">
                  B
                </div>
                <div className="min-w-0 flex-1 rounded-2xl bg-ever/[0.06] px-4 py-2.5">
                  <div className="text-[13px] font-bold text-ink">
                    Blissley <span className="font-semibold text-ever">· Team</span>
                  </div>
                  <p className="mt-0.5 text-[14.5px] leading-[1.6] text-ink/75">{c.reply}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
