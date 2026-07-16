import { Check, X } from "lucide-react";
import { Reveal } from "../Reveal";

const rows: { feat: string; b: boolean | "varies"; t: boolean | "varies" }[] = [
  { feat: "Same price at every dose", b: true, t: false },
  { feat: "5-day billing notice", b: true, t: false },
  { feat: "One-click cancel", b: true, t: false },
  { feat: "Board-certified doctors", b: true, t: "varies" },
  { feat: "24-hour review", b: true, t: false },
  { feat: "No insurance needed", b: true, t: false },
  { feat: "Discreet delivery", b: true, t: false },
];

function Cell({ v }: { v: boolean | "varies" }) {
  if (v === "varies") return <span className="text-[13px] text-[#9A9A9A]">Varies</span>;
  return v ? (
    <Check className="mx-auto h-5 w-5 text-check" strokeWidth={2.5} />
  ) : (
    <X className="mx-auto h-5 w-5 text-blush" strokeWidth={2.5} />
  );
}

export function Comparison() {
  return (
    <section className="bg-white px-6 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <h2 className="text-[34px] leading-[1.1] text-ink md:text-[52px]">
            Why <span className="italic text-ever">Blissley.</span>
          </h2>
          <p className="mt-3 text-[16px] text-[#6B6B6B] md:text-[18px]">
            The difference is in the details.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 overflow-hidden rounded-2xl md:mt-14">
            <div className="grid grid-cols-[1.4fr_1fr_1fr] bg-ink text-canvas">
              <div className="px-4 py-4 text-[12px] font-medium uppercase tracking-[0.06em] md:px-6" />
              <div className="px-2 py-4 text-center font-sans text-[16px] md:text-[20px]">
                Blissley
              </div>
              <div className="px-2 py-4 text-center text-[13px] font-medium uppercase tracking-[0.06em] text-canvas/60 md:text-[14px]">
                Traditional
              </div>
            </div>
            {rows.map((r, i) => (
              <div
                key={r.feat}
                className={`grid grid-cols-[1.4fr_1fr_1fr] items-center ${
                  i !== rows.length - 1 ? "border-b border-hairline" : ""
                }`}
              >
                <div className="px-4 py-4 text-[14px] font-medium text-ink md:px-6 md:text-[15px]">
                  {r.feat}
                </div>
                <div className="bg-white px-2 py-4 text-center">
                  <Cell v={r.b} />
                </div>
                <div className="px-2 py-4 text-center">
                  <Cell v={r.t} />
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
