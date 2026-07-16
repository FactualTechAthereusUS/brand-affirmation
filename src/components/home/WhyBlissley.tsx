import { Reveal } from "../Reveal";
import iconDoctor from "@/assets/icon-doctor.png.asset.json";
import iconTruck from "@/assets/icon-truck.png.asset.json";
import iconLock from "@/assets/icon-lock.png.asset.json";

const MadeForYouIcon = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className} aria-hidden>
    <path
      fill="#818263"
      d="M254.3,107.91,228.78,56.85a16,16,0,0,0-21.47-7.15L182.44,62.13,130.05,48.27a8.14,8.14,0,0,0-4.1,0L73.56,62.13,48.69,49.7a16,16,0,0,0-21.47,7.15L1.7,107.9a16,16,0,0,0,7.15,21.47l27,13.51,55.49,39.63a8.06,8.06,0,0,0,2.71,1.25l64,16a8,8,0,0,0,7.6-2.1l55.07-55.08,26.42-13.21a16,16,0,0,0,7.15-21.46Zm-54.89,33.37L165,113.72a8,8,0,0,0-10.68.61C136.51,132.27,116.66,130,104,122L147.24,80h31.81l27.21,54.41ZM41.53,64,62,74.22,36.43,125.27,16,115.06Zm116,119.13L99.42,168.61l-49.2-35.14,28-56L128,64.28l9.8,2.59-45,43.68-.08.09a16,16,0,0,0,2.72,24.81c20.56,13.13,45.37,11,64.91-5L188,152.66Zm62-57.87-25.52-51L214.47,64,240,115.06Zm-87.75,92.67a8,8,0,0,1-7.75,6.06,8.13,8.13,0,0,1-1.95-.24L80.41,213.33a7.89,7.89,0,0,1-2.71-1.25L51.35,193.26a8,8,0,0,1,9.3-13l25.11,17.94L126,208.24A8,8,0,0,1,131.82,217.94Z"
    />
  </svg>
);

type Item = {
  image?: string;
  svg?: boolean;
  titleTop: string;
  titleBottom: string;
  body: string;
};

const items: Item[] = [
  {
    image: iconDoctor.url,
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
    svg: true,
    titleTop: "Made for you.",
    titleBottom: "Not the masses.",
    body: "Every protocol is built around your labs, your history, and your goals. No cookie-cutter plans — the treatment adapts to you as your body changes.",
  },
];

function Card({ item, index }: { item: Item; index: number }) {
  return (
    <Reveal delay={index * 0.06} blur>
      <div
        className="group relative h-full overflow-hidden rounded-[28px] border border-black/5 bg-gradient-to-b from-white to-[#F5F3EE] p-6 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_20px_50px_-30px_rgba(23,23,23,0.25)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_30px_60px_-25px_rgba(23,23,23,0.35)] md:p-8"
      >
        {/* liquid glass sheen */}
        <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(120%_60%_at_0%_0%,rgba(255,255,255,0.9),transparent_50%)]" />

        <div className="relative flex items-start gap-5 md:gap-6">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/70 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_10px_30px_-10px_rgba(23,23,23,0.15)] ring-1 ring-black/5 backdrop-blur-xl md:h-20 md:w-20">
            {item.svg ? (
              <MadeForYouIcon className="h-10 w-10 md:h-12 md:w-12" />
            ) : (
              <img src={item.image} alt="" className="h-14 w-14 object-contain md:h-16 md:w-16" />
            )}
          </div>

          <div className="min-w-0 flex-1 pt-1">
            <h3 className="text-[22px] font-semibold leading-[1.15] tracking-[-0.01em] text-ink md:text-[26px]">
              {item.titleTop}
            </h3>
            <p className="mt-1 text-[22px] font-semibold leading-[1.15] tracking-[-0.01em] text-ever md:text-[26px]">
              {item.titleBottom}
            </p>
            <p className="mt-4 text-[15px] leading-[1.55] text-[#5F5F58] md:text-[16px]">
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
    <section className="bg-white px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-16">
          <Reveal>
            <div className="md:sticky md:top-32">
              <h2 className="text-[38px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[56px]">
                We didn't just build
                <br />
                a better platform.
                <br />
                <span className="text-ever">We rebuilt the standard of care.</span>
              </h2>
              <p className="mt-6 max-w-md text-[15px] leading-[1.6] text-[#5F5F58] md:text-[17px]">
                Most online health platforms settled for a workaround inside a broken system. We were tired of it — so we built something better. Here's what that means for you.
              </p>
            </div>
          </Reveal>

          <div className="flex flex-col gap-5 md:gap-6">
            {items.map((it, i) => (
              <Card key={it.titleTop} item={it} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
