import { motion } from "motion/react";
import iconCheckBadge from "@/assets/check-badge.png.asset.json";
import iconShipBox from "@/assets/ship-box.png.asset.json";
import iconDocHeadset from "@/assets/doc-headset.png.asset.json";

const items = [
  {
    title: "Same Price. All Dosage Levels.",
    subtitle: "No surprise fees as your dose increases.",
    icon: iconCheckBadge.url,
    boldIcon: true,
  },
  {
    title: "Prescribed & shipped within 48 hours",
    subtitle: "Discreet, temperature-controlled delivery.",
    icon: iconShipBox.url,
  },
  {
    title: "UNLIMITED doctor calls 7 days a week",
    subtitle: "Talk to a licensed provider anytime.",
    icon: iconDocHeadset.url,
  },
];

export function ValueStack() {
  return (
    <section className="w-full bg-canvas py-14 sm:py-20">
      <div className="mx-auto w-full max-w-[720px] px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-ink/8 bg-white p-6 shadow-[0_18px_44px_rgba(23,23,23,0.06)] sm:p-10"
        >
          <h2 className="text-center font-hero text-[22px] font-black tracking-tight text-ink sm:text-[26px]">
            Everything included. No surprises.
          </h2>
          <p className="mt-2 text-center text-[14px] text-ink/60">
            The same transparent care that powers 30,000+ patient visits.
          </p>

          <ul className="mt-8 space-y-4 sm:mt-10">
            {items.map((item, i) => (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-3.5 sm:gap-4"
              >
                <img
                  src={item.icon}
                  alt=""
                  className={`mt-0.5 shrink-0 object-contain ${
                    item.boldIcon ? "h-6 w-6 brightness-0 contrast-125" : "h-5 w-5"
                  }`}
                />
                <div className="leading-tight">
                  <div className="text-[15px] font-bold text-ink sm:text-[16px]">{item.title}</div>
                  <div className="mt-0.5 text-[13px] text-ink/55 sm:text-[14px]">{item.subtitle}</div>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
