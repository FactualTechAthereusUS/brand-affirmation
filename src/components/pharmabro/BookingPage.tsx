import { useEffect, useRef, useState } from "react";
import { Container, MicroLabel, Btn } from "@/components/pharmabro/primitives";
import { Rise, WordsReveal, KineticRule } from "@/components/pharmabro/motion";

const ICLOSED_SRC = "https://app.iclosed.io/assets/widget.js";
const ICLOSED_URL = "https://app.iclosed.io/e/Pharmabro/strategy-call";

const COVERED = [
  {
    n: "01",
    title: "Your brand and market",
    body: "We start with what you are building: your audience, the treatments you want to offer, and where your patients will come from.",
  },
  {
    n: "02",
    title: "How PharmaBro runs the clinic",
    body: "We map your setup onto our infrastructure: licensed providers in 50 states, pharmacy fulfillment, intake, and compliance, all operating under your name.",
  },
  {
    n: "03",
    title: "Your launch plan",
    body: "You leave with a concrete timeline and a flat monthly number, so you know exactly what it takes to be live and taking patients.",
  },
] as const;

/**
 * Booking page. The iClosed inline widget is mounted as a plain div and the
 * vendor script is injected once on mount; it hydrates the div into an iframe
 * and reports its own height, so we only reserve a min-height and show a
 * spinner underneath until the frame paints.
 */
export function BookingPage() {
  const holder = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;

    // Vendor script only processes widgets present at load; re-inject per mount.
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${ICLOSED_SRC}"]`,
    );
    existing?.remove();

    const s = document.createElement("script");
    s.src = ICLOSED_SRC;
    s.async = true;
    s.type = "text/javascript";
    document.body.appendChild(s);

    const obs = new MutationObserver(() => {
      if (el.querySelector("iframe")) setReady(true);
    });
    obs.observe(el, { childList: true, subtree: true });

    return () => {
      obs.disconnect();
      s.remove();
    };
  }, []);

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="bg-canvas pt-12 pb-8 lg:pt-16 lg:pb-10">
        <Container size="wide" className="text-left lg:text-center">
          <MicroLabel className="mb-5 lg:mb-6">Discovery call</MicroLabel>
          <h1 className="font-normal tracking-[-0.03em] text-ink text-[40px] leading-[0.98] sm:text-[56px] lg:text-[64px] lg:leading-[1.02]">
            <WordsReveal text="Book your strategy call." />
          </h1>
          <p className="mt-6 max-w-[560px] font-serif text-[17px] italic leading-[1.5] text-ink/70 lg:mx-auto lg:mt-8 lg:text-[19px]">
            Pick a time below. We will walk through your brand, the treatments you
            want to offer, and exactly how PharmaBro runs the clinic behind it,
            from licensed providers to pharmacy and compliance.
          </p>
          <p className="mt-4 text-[13px] text-[color-mix(in_oklab,var(--color-ink)_52%,transparent)]">
            30 minutes. No medical license required.
          </p>
          <div className="mt-6 flex lg:justify-center">
            <Btn to="/pharmabro/contact" variant="ghost">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
                <path
                  d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.3A8 8 0 1 1 21 12z"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinejoin="round"
                />
              </svg>
              Message us instead
            </Btn>
          </div>
        </Container>
      </section>

      {/* -------------------------------------------------------- scheduler */}
      <section className="bg-canvas pb-12 lg:pb-16">
        <Container size="wide" className="px-3 sm:px-6">
          <div className="relative min-h-[760px] w-full rounded-2xl border border-[var(--color-hairline)] bg-canvas shadow-[0_1px_2px_rgba(10,10,10,0.04),0_18px_50px_-30px_rgba(10,10,10,0.25)] sm:min-h-[680px] lg:min-h-[620px]">
            {!ready ? (
              <div
                aria-hidden
                className="absolute inset-0 flex items-center justify-center rounded-2xl bg-canvas"
              >
                <span className="size-6 animate-spin rounded-full border-2 border-[var(--color-hairline)] border-t-[var(--color-marine)]" />
              </div>
            ) : null}
            <div
              ref={holder}
              className="iclosed-widget relative w-full [&_iframe]:!w-full"
              data-url={ICLOSED_URL}
              data-resize="true"
              title="Strategy call"
              style={{ width: "100%", minHeight: 620 }}
            />
          </div>
        </Container>
      </section>


      {/* ------------------------------------------------ what we cover */}
      <section className="bg-canvas pb-20 lg:pb-24">
        <Container size="wide">
          <KineticRule className="mb-10 lg:mb-12" />
          <MicroLabel>What we cover on the call</MicroLabel>
          <div className="mt-8 grid gap-10 md:grid-cols-3 md:gap-8">
            {COVERED.map((c, i) => (
              <Rise key={c.n} delay={i * 0.1}>
                <div className="border-l border-[var(--color-hairline)] pl-5">
                  <span className="pb-micro text-[var(--color-marine)]">
                    {c.n}
                  </span>
                  <h3 className="mt-3 text-[20px] font-normal tracking-[-0.02em] text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-3 font-serif text-[16px] leading-[1.5] text-ink/60">
                    {c.body}
                  </p>
                </div>
              </Rise>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
