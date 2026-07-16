import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const MIN = 150;
const MAX = 400;
const DEFAULT = 220;

export function WLCalculator() {
  const [weight, setWeight] = useState<number>(DEFAULT);

  const { lossTirz, goalTirz, goalSema, lossSema } = useMemo(() => {
    const lossTirz = Math.round(weight * 0.22);
    const lossSema = Math.round(weight * 0.15);
    return {
      lossTirz,
      lossSema,
      goalTirz: Math.round(weight - lossTirz),
      goalSema: Math.round(weight - lossSema),
    };
  }, [weight]);

  const pct = ((weight - MIN) / (MAX - MIN)) * 100;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#3d6a8a] via-[#2f5a7a] to-[#254c6b] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-10 text-center md:mb-14">
          <h2 className="font-serif text-3xl leading-tight text-white md:text-5xl">
            See how much you could lose.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/80 md:text-base">
            Adjust your starting weight to estimate your results with GLP-1 treatment.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {/* LEFT — Slider card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-[#1e4560] p-8 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)] md:p-10"
          >
            <div className="flex items-center justify-between">
              <label htmlFor="weight-slider" className="text-base font-medium text-white md:text-lg">
                How much do you weigh?
              </label>
              <div className="flex items-baseline gap-1">
                <input
                  type="number"
                  min={MIN}
                  max={MAX}
                  value={weight}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (!Number.isNaN(v)) setWeight(Math.max(MIN, Math.min(MAX, v)));
                  }}
                  className="w-20 bg-transparent text-right font-serif text-3xl text-white outline-none md:text-4xl [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="font-serif text-2xl text-white md:text-3xl">lbs</span>
              </div>
            </div>

            <div className="relative mt-6">
              <div className="h-[3px] w-full rounded-full bg-white/25" />
              <div
                className="absolute left-0 top-0 h-[3px] rounded-full bg-white"
                style={{ width: `${pct}%` }}
              />
              <input
                id="weight-slider"
                type="range"
                min={MIN}
                max={MAX}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="absolute inset-0 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white"
                style={{ height: 24, marginTop: -10 }}
              />
            </div>

            <div className="mt-10 flex items-center justify-between md:mt-12">
              <span className="text-base font-medium text-white md:text-lg">You can lose up to</span>
              <motion.span
                key={lossTirz}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="font-serif text-4xl text-white md:text-5xl"
              >
                {lossTirz} lbs
              </motion.span>
            </div>

            <p className="mt-6 text-[11px] leading-relaxed text-white/60">
              Based on clinical trial averages. Individual results vary.
            </p>
          </motion.div>

          {/* RIGHT — Plan cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <PlanCard
              name="Compounded Semaglutide"
              starting={weight}
              goal={goalSema}
              loss={lossSema}
              pctLabel="15%"
            />
            <PlanCard
              name="Compounded Tirzepatide"
              starting={weight}
              goal={goalTirz}
              loss={lossTirz}
              pctLabel="22%"
              highlight
            />

            <motion.a
              href="#assessment"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="mt-2 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-white text-base font-medium text-[#1e4560] shadow-lg transition-shadow hover:shadow-xl"
            >
              Start My Free Assessment
              <ArrowRight className="h-5 w-5" strokeWidth={2} />
            </motion.a>
            <p className="text-center text-[13px] text-white/70">
              Your physician will recommend the right program for you.
            </p>
          </motion.div>
        </div>

        <p className="mx-auto mt-10 max-w-4xl text-center text-[11px] leading-relaxed text-white/60 md:mt-14">
          *16-22% body weight reductions based on published clinical trial data for compounded
          semaglutide and tirzepatide. Individual results vary and are not guaranteed. Results
          depend on adherence to treatment, diet, and lifestyle factors.
        </p>
      </div>
    </section>
  );
}

function PlanCard({
  name,
  starting,
  goal,
  loss,
  pctLabel,
  highlight,
}: {
  name: string;
  starting: number;
  goal: number;
  loss: number;
  pctLabel: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-6 md:p-7 ${
        highlight
          ? "bg-white/15 ring-1 ring-white/30 backdrop-blur-sm"
          : "bg-white/10 ring-1 ring-white/15 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-white md:text-lg">{name}</h3>
        <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-[#1e4560]">
          Injectable
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat label="Starting" value={`${starting} lbs`} />
        <Stat label="Goal" value={`${goal} lbs`} />
        <Stat label="Lose up to" value={`${loss} lbs`} />
      </div>
      <p className="mt-4 text-xs text-white/70">
        Lose up to {pctLabel} of body weight
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-white/60">{label}</div>
      <div className="mt-1 font-serif text-xl text-white md:text-2xl">{value}</div>
    </div>
  );
}
