import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import bgImg from "@/assets/calc-bg.png.asset.json";

const MIN = 120;
const MAX = 500;
const DEFAULT = 220;
const MONTHS = ["JUL", "AUG", "SEP", "OCT", "NOV"];

// ease-in-out cubic for a natural S-curve weight-loss trajectory
function weightAt(monthIdx: number, total: number, start: number, end: number) {
  const t = monthIdx / total;
  const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  return start - (start - end) * eased;
}

export function WLCalculator() {
  const [weight, setWeight] = useState<number>(DEFAULT);

  const { lossTirz, goalTirz, tirzPoints } = useMemo(() => {
    const endTirz = weight * 0.78;
    const total = MONTHS.length - 1;
    const tirz = MONTHS.map((_, i) => weightAt(i, total, weight, endTirz));
    return {
      lossTirz: Math.round(weight - endTirz),
      goalTirz: Math.round(endTirz),
      tirzPoints: tirz,
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
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <div className="mb-8 text-center md:mb-12">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
            See how much you could lose.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/85 md:text-base">
            Adjust your starting weight to estimate your results with GLP-1 treatment.
          </p>
        </div>

        {/* Slider card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-[#254c6b] p-7 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)] md:p-10"
        >
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="weight-slider" className="text-base font-semibold text-white md:text-lg">
              How much do you weigh?
            </label>
            <div className="flex items-baseline gap-1.5 text-white">
              <span className="text-3xl font-semibold tracking-tight md:text-5xl">{weight}</span>
              <span className="text-xl font-medium md:text-2xl">lbs</span>
            </div>
          </div>

          <div className="relative mt-5 md:mt-7">
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

          <div className="mt-10 flex items-center justify-between gap-4 md:mt-14">
            <span className="text-base font-semibold text-white md:text-2xl">You can lose up to</span>
            <motion.span
              key={lossTirz}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="text-4xl font-semibold tracking-tight text-white md:text-6xl"
            >
              {lossTirz} lbs
            </motion.span>
          </div>
        </motion.div>

        {/* Chart card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 rounded-3xl bg-white/12 p-5 ring-1 ring-white/15 backdrop-blur-md md:mt-10 md:p-8"
        >
          <WeightChart
            startWeight={weight}
            goalTirz={goalTirz}
            tirzPoints={tirzPoints}
          />
        </motion.div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-[12px] font-medium leading-relaxed text-white/85 md:mt-8">
          Illustrative weight-loss trajectory informed by published Tirzepatide clinical trial data
          showing average 16–22% body-weight reductions in adults with obesity.
        </p>
      </div>
    </section>
  );
}

function WeightChart({
  startWeight,
  goalTirz,
  tirzPoints,
}: {
  startWeight: number;
  goalTirz: number;
  tirzPoints: number[];
}) {
  const W = 640;
  const H = 320;
  const padL = 24;
  const padR = 24;
  const padT = 36;
  const padB = 40;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  // Relative y-domain — curve shape stays consistent, only the labels scale
  const yMax = startWeight;
  const yMin = startWeight * 0.75;

  const xAt = (i: number, total: number) => padL + (i / (total - 1)) * innerW;
  const yAt = (v: number) => padT + (1 - (v - yMin) / (yMax - yMin)) * innerH;

  // Smooth Catmull-Rom → cubic bezier
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
  const startX = xAt(0, tirzPoints.length);
  const startY = yAt(tirzPoints[0]);
  const endX = xAt(tirzPoints.length - 1, tirzPoints.length);
  const endY = yAt(tirzPoints[tirzPoints.length - 1]);

  const spring = { type: "spring" as const, stiffness: 140, damping: 22 };

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
        {/* vertical grid */}
        {MONTHS.map((_, i) => (
          <line
            key={i}
            x1={xAt(i, MONTHS.length)}
            x2={xAt(i, MONTHS.length)}
            y1={padT}
            y2={H - padB}
            stroke="white"
            strokeOpacity={i === MONTHS.length - 1 ? 0.35 : 0.12}
            strokeWidth={1}
            strokeDasharray={i === MONTHS.length - 1 ? "3 4" : undefined}
          />
        ))}
        {/* horizontal grid */}
        {[0, 0.33, 0.66, 1].map((t) => (
          <line
            key={t}
            x1={padL}
            x2={W - padR}
            y1={padT + t * innerH}
            y2={padT + t * innerH}
            stroke="white"
            strokeOpacity={0.1}
            strokeWidth={1}
          />
        ))}

        {/* trajectory line */}
        <motion.path
          d={tirzD}
          animate={{ d: tirzD }}
          transition={spring}
          fill="none"
          stroke="white"
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* endpoints */}
        <motion.circle animate={{ cx: startX, cy: startY }} transition={spring} r={5} fill="white" />
        <motion.circle animate={{ cx: endX, cy: endY }} transition={spring} r={5} fill="white" />

        {/* start pill */}
        <motion.g animate={{ x: startX, y: startY }} transition={spring}>
          <rect x={-2} y={-30} rx={10} ry={10} width={62} height={22} fill="white" />
          <text x={29} y={-15} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f2e44">
            {Math.round(startWeight)} lbs
          </text>
        </motion.g>

        {/* end pill */}
        <motion.g animate={{ x: endX, y: endY }} transition={spring}>
          <rect x={-64} y={10} rx={10} ry={10} width={62} height={22} fill="white" />
          <text x={-33} y={25} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f2e44">
            {goalTirz} lbs
          </text>
        </motion.g>

        {/* center callout */}
        <text x={padL + innerW * 0.22} y={padT + innerH * 0.5} fontSize={18} fontWeight={600} fill="white">
          Lose up to <tspan fontStyle="italic">22%</tspan> of
        </text>
        <text x={padL + innerW * 0.22} y={padT + innerH * 0.5 + 22} fontSize={18} fontWeight={600} fill="white">
          your body weight*
        </text>

        {/* month axis */}
        {MONTHS.map((m, i) => (
          <text
            key={m}
            x={xAt(i, MONTHS.length)}
            y={H - 10}
            textAnchor="middle"
            fontSize={11}
            fontWeight={700}
            fill="white"
            opacity={0.85}
          >
            {m}
          </text>
        ))}
      </svg>

      {/* arrow CTA — matches the reference "→" chip */}
      <a
        href="#assessment"
        className="mt-2 ml-2 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f2e44] text-white shadow-lg transition-transform hover:scale-105 md:-mt-16 md:ml-8"
        aria-label="Start assessment"
      >
        <ArrowRight className="h-5 w-5" strokeWidth={2.25} />
      </a>
    </div>
  );
}
