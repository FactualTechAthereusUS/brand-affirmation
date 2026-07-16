import { Reveal } from "../Reveal";
import iconDoctors from "@/assets/icon-doctors-new.png.asset.json";
import iconTruck from "@/assets/icon-truck-new.png.asset.json";
import iconLock from "@/assets/icon-lock-new.png.asset.json";
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
    image: iconTruck.url,
    titleTop: "Delivered to your door.",
    titleBottom: "Discreet. Temperature-controlled.",
    body: "Licensed US pharmacies ship your medication in unmarked, cold-chain packaging. Track it end-to-end. It arrives when you need it, exactly as prescribed.",
  },
  {
    image: iconLock.url,
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
    <Reveal delay={index * 0.06} blur={12}>
      <div className="rounded-[28px] bg-[#F2F2EF] p-6 md:p-8">
        <div className="flex items-start gap-5">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:h-16 md:w-16">
            <img src={item.image} alt="" className="h-7 w-7 object-contain md:h-8 md:w-8" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[22px] font-semibold leading-[1.2] tracking-[-0.01em] text-ink md:text-[24px]">
              {item.titleTop}
            </h3>
            <p className="text-[22px] font-semibold leading-[1.2] tracking-[-0.01em] text-ever md:text-[24px]">
              {item.titleBottom}
            </p>
            <p className="mt-3 text-[15px] leading-[1.55] text-[#5F5F58] md:text-[16px]">
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
    <section className="bg-white px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center rounded-full border border-black/15 px-5 py-2 text-[14px] font-medium text-ink">
              Why Blissley
            </span>
            <h2 className="mt-6 text-[30px] font-semibold uppercase leading-[1.1] tracking-[-0.01em] text-ink md:text-[44px]">
              We didn't just build a better platform.{" "}
              <span className="text-ever">We rebuilt the standard of care.</span>
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-[1.6] text-[#5F5F58] md:text-[17px]">
              Most online health platforms settled for a workaround inside a broken system. We were tired of it — so we built something better.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 flex flex-col gap-4 md:mt-14 md:gap-5">
          {items.map((it, i) => (
            <Card key={it.titleTop} item={it} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
