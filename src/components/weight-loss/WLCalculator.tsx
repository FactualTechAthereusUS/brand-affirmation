import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import bgImg from "@/assets/calc-bg.png.asset.json";

const MIN = 150;
const MAX = 400;
const DEFAULT = 220;
const MONTHS = ["JUL", "AUG", "SEP", "OCT", "NOV"];

// ease-out cubic for a natural weight-loss S-curve
function weightAt(monthIdx: number, total: number, start: number, end: number) {
  const t = monthIdx / total;
  const eased = 1 - Math.pow(1 - t, 3);
  return start - (start - end) * eased;
}

export function WLCalculator() {
  const [weight, setWeight] = useState<number>(DEFAULT);

  const { lossTirz, lossSema, goalTirz, tirzPoints, semaPoints } = useMemo(() => {
    const endTirz = weight * 0.78;
    const endSema = weight * 0.85;
    const total = MONTHS.length - 1;
    const tirz = MONTHS.map((_, i) => weightAt(i, total, weight, endTirz));
    const sema = MONTHS.map((_, i) => weightAt(i, total, weight, endSema));
    return {
      lossTirz: Math.round(weight - endTirz),
      lossSema: Math.round(weight - endSema),
      goalTirz: Math.round(endTirz),
      tirzPoints: tirz,
      semaPoints: sema,
    };
  }, [weight]);

  const pct = ((weight - MIN) / (MAX - MIN)) * 100;

  return (
    <section
      className="relative overflow-hidden py-16 md:py-24"
      style={{
        backgroundImage: `url(${bgImg.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-10 text-center md:mb-14">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
            See how much you could lose.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/85 md:text-base">
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
            className="rounded-3xl bg-[#1e4560]/85 p-7 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)] ring-1 ring-white/10 backdrop-blur-md md:p-9"
          >
            <div className="flex items-center justify-between">
              <label htmlFor="weight-slider" className="text-sm font-medium text-white md:text-base">
                How much do you weigh?
              </label>
              <div className="flex items-baseline gap-1 text-white">
                <span className="text-3xl font-bold tracking-tight md:text-4xl">{weight}</span>
                <span className="text-xl font-semibold md:text-2xl">lbs</span>
              </div>
            </div>

            <div className="relative mt-6">
              <div className="h-[3px] w-full rounded-full bg-white/25" />
              <div
                className="pointer-events-none absolute left-0 top-0 h-[3px] rounded-full bg-white"
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
              <span className="text-sm font-medium text-white md:text-base">You can lose up to</span>
              <motion.span
                key={lossTirz}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="text-4xl font-bold tracking-tight text-white md:text-5xl"
              >
                {lossTirz} lbs
              </motion.span>
            </div>
          </motion.div>

          {/* RIGHT — Live curve chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/20 backdrop-blur-md md:p-7"
          >
            <WeightChart
              startWeight={weight}
              tirzPoints={tirzPoints}
              semaPoints={semaPoints}
              goalTirz={goalTirz}
              lossPct="22%"
            />
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] text-white/80">
              <span className="inline-flex items-center gap-2">
                <span className="h-[2px] w-6 rounded bg-white" /> Tirzepatide (up to 22%)
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-[2px] w-6 rounded border-t-2 border-dashed border-white/70" />{" "}
                Semaglutide (up to 15%)
              </span>
            </div>
          </motion.div>
        </div>

        {/* CTA + plan strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-8 flex max-w-2xl flex-col items-center gap-3"
        >
          <div className="grid w-full grid-cols-2 gap-3 text-white/85">
            <div className="rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur-sm">
              <div className="text-[11px] uppercase tracking-wide text-white/60">Semaglutide</div>
              <div className="mt-0.5 text-sm font-medium">Lose up to {lossSema} lbs</div>
            </div>
            <div className="rounded-xl bg-white/15 px-4 py-3 ring-1 ring-white/25 backdrop-blur-sm">
              <div className="text-[11px] uppercase tracking-wide text-white/70">Tirzepatide</div>
              <div className="mt-0.5 text-sm font-medium">Lose up to {lossTirz} lbs</div>
            </div>
          </div>
          <motion.a
            href="#assessment"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="mt-2 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-white text-base font-semibold text-[#1e4560] shadow-lg transition-shadow hover:shadow-xl"
          >
            Start My Free Assessment
            <ArrowRight className="h-5 w-5" strokeWidth={2} />
          </motion.a>
          <p className="text-center text-[13px] text-white/75">
            Your physician will recommend the right program for you.
          </p>
        </motion.div>

        <p className="mx-auto mt-10 max-w-4xl text-center text-[11px] leading-relaxed text-white/65 md:mt-14">
          *16-22% body weight reductions based on published clinical trial data for compounded
          semaglutide and tirzepatide. Individual results vary and are not guaranteed. Results
          depend on adherence to treatment, diet, and lifestyle factors.
        </p>
      </div>
    </section>
  );
}

function WeightChart({
  startWeight,
  tirzPoints,
  semaPoints,
  goalTirz,
  lossPct,
}: {
  startWeight: number;
  tirzPoints: number[];
  semaPoints: number[];
  goalTirz: number;
  lossPct: string;
}) {
  const W = 520;
  const H = 260;
  const padL = 30;
  const padR = 30;
  const padT = 30;
  const padB = 40;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const yMax = startWeight * 1.02;
  const yMin = startWeight * 0.72;

  const xAt = (i: number, total: number) => padL + (i / (total - 1)) * innerW;
  const yAt = (v: number) => padT + (1 - (v - yMin) / (yMax - yMin)) * innerH;

  // Smooth curve via Catmull-Rom → cubic bezier
  const toPath = (pts: number[]) => {
    const coords = pts.map((v, i) => [xAt(i, pts.length), yAt(v)] as const);
    let d = `M ${coords[0][0]} ${coords[0][1]}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i - 1] ?? coords[i];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2] ?? p2;
      const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
      const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
      const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
      const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`;
    }
    return d;
  };

  const tirzD = toPath(tirzPoints);
  const semaD = toPath(semaPoints);
  const startX = xAt(0, tirzPoints.length);
  const startY = yAt(tirzPoints[0]);
  const endX = xAt(tirzPoints.length - 1, tirzPoints.length);
  const endY = yAt(tirzPoints[tirzPoints.length - 1]);

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" preserveAspectRatio="none">
        {/* grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={padL}
            x2={W - padR}
            y1={padT + t * innerH}
            y2={padT + t * innerH}
            stroke="white"
            strokeOpacity={0.12}
            strokeWidth={1}
          />
        ))}
        {/* vertical end line */}
        <line
          x1={endX}
          x2={endX}
          y1={padT}
          y2={H - padB}
          stroke="white"
          strokeOpacity={0.3}
          strokeDasharray="3 4"
        />

        {/* semaglutide (dashed) */}
        <path d={semaD} fill="none" stroke="white" strokeOpacity={0.7} strokeWidth={2} strokeDasharray="5 4" />
        {/* tirzepatide (solid) */}
        <path d={tirzD} fill="none" stroke="white" strokeWidth={2.75} strokeLinecap="round" />

        {/* start point */}
        <circle cx={startX} cy={startY} r={5} fill="white" />
        {/* end point */}
        <circle cx={endX} cy={endY} r={5} fill="white" />

        {/* start label */}
        <g>
          <rect
            x={startX - 26}
            y={startY - 30}
            rx={10}
            ry={10}
            width={52}
            height={20}
            fill="white"
          />
          <text
            x={startX}
            y={startY - 16}
            textAnchor="middle"
            fontSize={11}
            fontWeight={700}
            fill="#0f2e44"
          >
            {Math.round(startWeight)} lbs
          </text>
        </g>

        {/* end label */}
        <g>
          <rect
            x={endX - 30}
            y={endY + 10}
            rx={10}
            ry={10}
            width={52}
            height={20}
            fill="white"
          />
          <text
            x={endX - 4}
            y={endY + 24}
            textAnchor="middle"
            fontSize={11}
            fontWeight={700}
            fill="#0f2e44"
          >
            {goalTirz} lbs
          </text>
        </g>

        {/* center callout */}
        <text
          x={padL + innerW * 0.28}
          y={padT + innerH * 0.55}
          fontSize={15}
          fontWeight={600}
          fill="white"
        >
          Lose up to {lossPct} of
        </text>
        <text
          x={padL + innerW * 0.28}
          y={padT + innerH * 0.55 + 18}
          fontSize={15}
          fontWeight={600}
          fill="white"
        >
          your body weight*
        </text>

        {/* month axis */}
        {MONTHS.map((m, i) => (
          <text
            key={m}
            x={xAt(i, MONTHS.length)}
            y={H - 12}
            textAnchor="middle"
            fontSize={10}
            fontWeight={600}
            fill="white"
            opacity={0.75}
          >
            {m}
          </text>
        ))}
      </svg>
    </div>
  );
}
