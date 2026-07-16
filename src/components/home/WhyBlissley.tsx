import { Reveal } from "../Reveal";
import iconDoctors from "@/assets/icon-doctors.png.asset.json";
import iconDelivery from "@/assets/icon-delivery.png.asset.json";
import iconPadlock from "@/assets/icon-padlock.png.asset.json";
import iconHandshake from "@/assets/icon-handshake.png.asset.json";

type Item = {
  image: string;
  titleTop: string;
  titleBottom: string;
  body: string;
};

const items: Item[] = [
  {
    image: iconDoctors.url,
    titleTop: "Doctor-guided care.",
    titleBottom: "Always personal.",
    body: "Board-certified US physicians personally review your case, adjust protocols, and stay with you at every step — no bots, no scripts, no shortcuts.",
  },
  {
    image: iconDelivery.url,
    titleTop: "Delivered to your door.",
    titleBottom: "Discreet. Temperature-controlled.",
    body: "Licensed US pharmacies ship your medication in unmarked, cold-chain packaging. Track it end-to-end. It arrives when you need it, exactly as prescribed.",
  },
  {
    image: iconPadlock.url,
    titleTop: "Same price. Every dose.",
    titleBottom: "No surprise increases. Ever.",
    body: "Your price is locked from day one. When your dose goes up, your bill doesn't. Transparent monthly pricing, no hidden fees, no fine print, no games.",
  },
  {
    image: iconHandshake.url,
    titleTop: "Made for you.",
    titleBottom: "Not the masses.",
    body: "Every protocol is built around your labs, your history, and your goals. No cookie-cutter plans — the treatment adapts to you as your body changes.",
  },
];

/* ---------------- Mobile Card (image 1 style) ---------------- */
function MobileCard({ item, index }: { item: Item; index: number }) {
  return (
    <Reveal delay={index * 0.06} blur={10}>
      <div className="rounded-3xl bg-[#F3F2EE] px-5 py-6">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <img src={item.image} alt="" className="h-6 w-6 object-contain" />
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <h3 className="text-[19px] font-semibold leading-[1.2] tracking-[-0.01em] text-ink">
              {item.titleTop}
            </h3>
            <p className="text-[19px] font-semibold leading-[1.2] tracking-[-0.01em] text-ever">
              {item.titleBottom}
            </p>
            <p className="mt-3 text-[14.5px] leading-[1.55] text-[#5F5F58]">
              {item.body}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------------- Desktop Card (kept, icons swapped) ---------------- */
function DesktopCard({ item, index }: { item: Item; index: number }) {
  return (
    <Reveal delay={index * 0.06} blur={12}>
      <div className="group relative h-full overflow-hidden rounded-[28px] border border-black/5 bg-gradient-to-b from-white to-[#F5F3EE] p-8 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_20px_50px_-30px_rgba(23,23,23,0.25)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_30px_60px_-25px_rgba(23,23,23,0.35)]">
        <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(120%_60%_at_0%_0%,rgba(255,255,255,0.9),transparent_50%)]" />
        <div className="relative flex items-start gap-6">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-white/70 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_10px_30px_-10px_rgba(23,23,23,0.15)] ring-1 ring-black/5 backdrop-blur-xl">
            <img src={item.image} alt="" className="h-10 w-10 object-contain" />
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <h3 className="text-[26px] font-semibold leading-[1.15] tracking-[-0.01em] text-ink">
              {item.titleTop}
            </h3>
            <p className="mt-1 text-[26px] font-semibold leading-[1.15] tracking-[-0.01em] text-ever">
              {item.titleBottom}
            </p>
            <p className="mt-4 text-[16px] leading-[1.55] text-[#5F5F58]">
              {item.body}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function WhyBlissley() {
  return (
    <section className="bg-white px-5 py-16 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        {/* ---------- MOBILE ---------- */}
        <div className="md:hidden">
          <Reveal>
            <h2 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
              Healthcare built
              <br />
              <span className="text-ever">differently.</span>
            </h2>
            <p className="mt-4 text-[15px] leading-[1.6] text-[#5F5F58]">
              Most online health platforms settled for a workaround. We rebuilt the standard of care — here's what that means for you.
            </p>
          </Reveal>

          <div className="mt-8 flex flex-col gap-3">
            {items.map((it, i) => (
              <MobileCard key={it.titleTop} item={it} index={i} />
            ))}
          </div>
        </div>

        {/* ---------- DESKTOP ---------- */}
        <div className="hidden md:grid gap-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <Reveal>
            <div className="md:sticky md:top-32">
              <h2 className="text-[56px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
                We didn't just build
                <br />
                a better platform.
                <br />
                <span className="text-ever">We rebuilt the standard of care.</span>
              </h2>
              <p className="mt-6 max-w-md text-[17px] leading-[1.6] text-[#5F5F58]">
                Most online health platforms settled for a workaround inside a broken system. We were tired of it — so we built something better. Here's what that means for you.
              </p>
            </div>
          </Reveal>

          <div className="flex flex-col gap-6">
            {items.map((it, i) => (
              <DesktopCard key={it.titleTop} item={it} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
