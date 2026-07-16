import { Check, X } from "lucide-react";
import { Reveal } from "../Reveal";
import logo from "@/assets/blissley-logo.png.asset.json";
import hims from "@/assets/compare-hims.png.asset.json";
import mayo from "@/assets/compare-mayo.png.asset.json";

type Val = boolean | "varies";

const rows: { feat: string; blissley: Val; hims: Val; mayo: Val }[] = [
  { feat: "Same price at every dose level", blissley: true, hims: false, mayo: false },
  { feat: "5-day notice before every charge", blissley: true, hims: false, mayo: false },
  { feat: "One-click cancel anytime", blissley: true, hims: false, mayo: false },
  { feat: "Board-certified US physicians", blissley: true, hims: true, mayo: true },
  { feat: "Physician review in 24 hours", blissley: true, hims: true, mayo: false },
  { feat: "No insurance required", blissley: true, hims: true, mayo: false },
  { feat: "No waitlist", blissley: true, hims: true, mayo: false },
  { feat: "Ships in 48 hours", blissley: true, hims: true, mayo: false },
  { feat: "Discreet packaging", blissley: true, hims: true, mayo: false },
  { feat: "Real human support", blissley: true, hims: false, mayo: true },
];

// Blissley column: white check on translucent white circle over coral gradient
function BlissleyCell({ v }: { v: Val }) {
  return (
    <div className="flex items-center justify-center py-4">
      {v === true ? (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 shadow-sm">
          <Check className="h-4 w-4 text-[#ee7273]" strokeWidth={3} />
        </div>
      ) : v === "varies" ? (
        <span className="text-[13px] font-medium text-white/90">Varies</span>
      ) : (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95">
          <X className="h-4 w-4 text-[#ee7273]" strokeWidth={3} />
        </div>
      )}
    </div>
  );
}

// Other columns: soft coral circle with check, or bare X
function OtherCell({ v }: { v: Val }) {
  return (
    <div className="flex items-center justify-center py-4">
      {v === true ? (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fde5e6]">
          <Check className="h-4 w-4 text-[#ee7273]" strokeWidth={3} />
        </div>
      ) : v === "varies" ? (
        <span className="text-[13px] font-medium text-[#8a8a8a]">Varies</span>
      ) : (
        <X className="h-5 w-5 text-[#ee7273]" strokeWidth={3} />
      )}
    </div>
  );
}

export function Comparison() {
  return (
    <section className="bg-white px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="text-center text-[34px] leading-[1.1] text-ink md:text-[52px]">
            Why <span className="italic text-ever">Blissley</span> is
            <br className="hidden md:block" /> the{" "}
            <span className="italic text-ever">smarter choice.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-[16px] text-[#6B6B6B] md:text-[18px]">
            Same clinicians. Same medications. None of the friction.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          {/* Desktop / Tablet */}
          <div className="mt-12 hidden md:block">
            <div className="relative grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-x-2">
              {/* Header row */}
              <div />
              <div className="relative">
                <div className="mx-1 flex h-[130px] items-center justify-center rounded-t-2xl bg-gradient-to-b from-[#f28a86] to-[#ee7273]">
                  <img
                    src={logo.url}
                    alt="Blissley"
                    className="h-12 w-auto invert brightness-0 [filter:invert(1)_brightness(2)]"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center justify-end pb-3">
                <img src={hims.url} alt="Hims" className="h-16 w-auto object-contain" />
                <div className="mt-2 text-center text-[13px] font-medium text-[#4a4a4a]">
                  Hims
                </div>
              </div>
              <div className="flex flex-col items-center justify-end pb-3">
                <img src={mayo.url} alt="Mayo Clinic" className="h-16 w-auto object-contain" />
                <div className="mt-2 text-center text-[13px] font-medium text-[#4a4a4a]">
                  Mayo Clinic
                </div>
              </div>

              {/* Feature label column background */}
              <div className="col-start-1 row-start-2 rounded-2xl bg-[#f4f2ee]">
                {rows.map((r) => (
                  <div
                    key={`lbl-${r.feat}`}
                    className="flex h-14 items-center px-6 text-[14.5px] font-medium text-ink"
                  >
                    {r.feat}
                  </div>
                ))}
              </div>

              {/* Blissley column - coral gradient continues */}
              <div className="col-start-2 row-start-2 mx-1 -mt-px rounded-b-2xl bg-gradient-to-b from-[#ee7273] to-[#f2a08f]">
                {rows.map((r) => (
                  <div key={`b-${r.feat}`} className="flex h-14 items-center justify-center">
                    <BlissleyCell v={r.blissley} />
                  </div>
                ))}
              </div>

              {/* Hims column */}
              <div className="col-start-3 row-start-2">
                {rows.map((r) => (
                  <div key={`hims-${r.feat}`} className="flex h-14 items-center justify-center">
                    <OtherCell v={r.hims} />
                  </div>
                ))}
              </div>

              {/* Mayo Clinic column */}
              <div className="col-start-4 row-start-2">
                {rows.map((r) => (
                  <div key={`mayo-${r.feat}`} className="flex h-14 items-center justify-center">
                    <OtherCell v={r.mayo} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="mt-10 md:hidden">
            <div className="grid grid-cols-[1.2fr_0.7fr_0.7fr_0.7fr] items-end gap-x-1">
              <div />
              <div className="flex h-[110px] items-center justify-center rounded-t-2xl bg-gradient-to-b from-[#f28a86] to-[#ee7273] px-1">
                <img
                  src={logo.url}
                  alt="Blissley"
                  className="h-8 w-auto [filter:invert(1)_brightness(2)]"
                />
              </div>
              <div className="flex flex-col items-center pb-2">
                <img src={hims.url} alt="Hims" className="h-10 w-auto object-contain" />
                <div className="mt-1 px-1 text-center text-[10px] font-medium leading-tight text-[#4a4a4a]">
                  Hims
                </div>
              </div>
              <div className="flex flex-col items-center pb-2">
                <img src={mayo.url} alt="Mayo Clinic" className="h-10 w-auto object-contain" />
                <div className="mt-1 px-1 text-center text-[10px] font-medium leading-tight text-[#4a4a4a]">
                  Mayo Clinic
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[1.2fr_0.7fr_0.7fr_0.7fr] gap-x-1">
              <div className="rounded-2xl bg-[#f4f2ee]">
                {rows.map((r) => (
                  <div
                    key={`m-lbl-${r.feat}`}
                    className="flex h-16 items-center px-3 text-[12.5px] font-medium leading-tight text-ink"
                  >
                    {r.feat}
                  </div>
                ))}
              </div>
              <div className="rounded-b-2xl bg-gradient-to-b from-[#ee7273] to-[#f2a08f]">
                {rows.map((r) => (
                  <div key={`m-b-${r.feat}`} className="flex h-16 items-center justify-center">
                    <BlissleyCell v={r.blissley} />
                  </div>
                ))}
              </div>
              <div>
                {rows.map((r) => (
                  <div key={`m-hims-${r.feat}`} className="flex h-16 items-center justify-center">
                    <OtherCell v={r.hims} />
                  </div>
                ))}
              </div>
              <div>
                {rows.map((r) => (
                  <div key={`m-mayo-${r.feat}`} className="flex h-16 items-center justify-center">
                    <OtherCell v={r.mayo} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
