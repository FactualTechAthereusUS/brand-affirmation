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

function Card({ item, index }: { item: Item; index: number }) {
  return (
    <Reveal delay={index * 0.06} blur={10}>
      <div className="rounded-3xl bg-white border border-ink/[0.06] px-5 py-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <img
              src={item.image}
              alt=""
              className={`object-contain ${index < 3 ? "h-8 w-8" : "h-7 w-7"}`}
             loading="lazy" decoding="async" />
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

function Headline() {
  return (
    <Reveal>
      <h2 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[56px]">
        Healthcare built
        <br />
        <span className="text-ever">differently.</span>
      </h2>
      <p className="mt-4 max-w-md text-[15px] leading-[1.6] text-[#5F5F58] md:mt-6 md:text-[17px]">
        Most online health platforms settled for a workaround. We rebuilt the standard of care — here's what that means for you.
      </p>
    </Reveal>
  );
}

export function WhyBlissley() {
  return (
    <section className="bg-white px-5 py-16 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Mobile */}
        <div className="md:hidden">
          <Headline />
          <div className="mt-8 flex flex-col gap-3">
            {items.map((it, i) => (
              <Card key={it.titleTop} item={it} index={i} />
            ))}
          </div>
        </div>

        {/* Desktop — same card style, same content, sticky structure kept */}
        <div className="hidden md:grid gap-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div className="md:sticky md:top-32 md:self-start">
            <Headline />
          </div>

          <div className="flex flex-col gap-3">
            {items.map((it, i) => (
              <Card key={it.titleTop} item={it} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
