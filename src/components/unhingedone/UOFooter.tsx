import { useState } from "react";
import { COLLECTIONS } from "./data";
import { IconArrow, Rise } from "./uo";

const HELP = ["Track your order", "Shipping", "Returns and exchanges", "Size guide", "Contact us"];
const ABOUT = ["Our story", "400gsm standard", "Reviews", "Affiliates", "Wholesale"];

/**
 * Section 10 — Comfrt's footer structure: email capture left, About, Help,
 * Social, Region. Their app-download block is dropped; there is no app.
 */
export function UOFooter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <footer className="bg-[#0b0b0b] text-[#f2efe8]">
      <div className="mx-auto max-w-[1440px] px-4 py-14 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.15fr_1fr_1fr_0.9fr]">
          <Rise>
            <h2 className="uo-display text-[30px] leading-[0.95] md:text-[38px]">
              Sign Up. Be First To The Next Drop.
            </h2>
            <p className="mt-3 max-w-[340px] text-[13px] text-[#f2efe8]/55">
              Restocks sell out. Members get 24 hours' head start.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes("@")) setSent(true);
              }}
              className="mt-5 flex max-w-[380px] items-center border-b border-[#f2efe8]/25 pb-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                aria-label="Email address"
                className="w-full bg-transparent text-[14px] text-[#f2efe8] placeholder:text-[#f2efe8]/35 focus:outline-none"
              />
              <button type="submit" aria-label="Subscribe" className="shrink-0 pl-3 text-[#f2efe8]">
                <IconArrow className="h-4 w-4" />
              </button>
            </form>
            {sent ? (
              <p className="mt-2 text-[12px] text-uo-red">You're on the list. Head start unlocked.</p>
            ) : null}
          </Rise>

          <FooterCol title="Shop" items={COLLECTIONS.map((c) => c.label)} />
          <FooterCol title="Help" items={HELP} />

          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#f2efe8]/40">Follow</p>
            <ul className="mt-5 space-y-3 text-[13.5px] text-[#f2efe8]/80">
              {["Instagram", "TikTok", "Facebook", "Pinterest"].map((s) => (
                <li key={s}>
                  <a href="#" className="uo-link-light">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-7 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#f2efe8]/40">
              Region
            </p>
            <p className="mt-3 text-[13.5px] text-[#f2efe8]/80">United States (USD $)</p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[#f2efe8]/12 pt-6 text-[11.5px] text-[#f2efe8]/40 md:flex-row md:items-center md:justify-between">
          <p>&copy; 2026 Unhinged One. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <a href="#" className="uo-link-light">Privacy</a>
            <a href="#" className="uo-link-light">Terms</a>
            <a href="#" className="uo-link-light">Accessibility</a>
          </div>
        </div>
      </div>

      <div className="overflow-hidden px-2 pb-3">
        <p className="uo-display select-none text-center leading-[0.8] text-[#f2efe8]/10 [font-size:clamp(46px,13vw,210px)]">
          UNHINGED ONE
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#f2efe8]/40">{title}</p>
      <ul className="mt-5 space-y-3 text-[13.5px] text-[#f2efe8]/80">
        {items.map((i) => (
          <li key={i}>
            <a href="#" className="uo-link-light">
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
