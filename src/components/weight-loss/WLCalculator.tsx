import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
} from "chart.js";
import bgImg from "@/assets/calc-bg.png.asset.json";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);

const MIN = 150;
const MAX = 400;
const DEFAULT = 220;
const LABELS = ["Now", "Month 1", "Month 2", "Month 3", "Month 4", "Month 5"];

function getPoint(month: number, start: number, end: number) {
  const t = month / 5;
  const eased = 1 - Math.pow(1 - t, 3);
  return Math.round(start - (start - end) * eased);
}

const buildSeries = (weight: number, endMultiplier: number) =>
  LABELS.map((_, i) => getPoint(i, weight, weight * endMultiplier));

export function WLCalculator() {
  const [weight, setWeight] = useState<number>(DEFAULT);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  const { tirz, sema, lossTirz, endTirz } = useMemo(() => {
    const t = buildSeries(weight, 0.78);
    const s = buildSeries(weight, 0.85);
    return {
      tirz: t,
      sema: s,
      lossTirz: Math.round(weight * 0.22),
      endTirz: Math.round(weight * 0.78),
    };
  }, [weight]);

  // Create chart once
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: LABELS,
        datasets: [
          {
            label: "Tirzepatide",
            data: tirz,
            borderColor: "#ffffff",
            backgroundColor: "#ffffff",
            borderWidth: 2.5,
            tension: 0.4,
            pointRadius: (c) => (c.dataIndex === 0 || c.dataIndex === LABELS.length - 1 ? 5 : 0),
            pointBackgroundColor: "#ffffff",
            pointBorderColor: "#ffffff",
            pointHoverRadius: 6,
          },
          {
            label: "Semaglutide",
            data: sema,
            borderColor: "rgba(255,255,255,0.75)",
            backgroundColor: "rgba(255,255,255,0.75)",
            borderWidth: 2,
            borderDash: [6, 5],
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400, easing: "easeOutCubic" },
        interaction: { intersect: false, mode: "index" },
        plugins: {
          tooltip: {
            backgroundColor: "#0f2e44",
            titleColor: "#fff",
            bodyColor: "#fff",
            padding: 10,
            displayColors: false,
            callbacks: { label: (i) => `${i.dataset.label}: ${i.formattedValue} lbs` },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(255,255,255,0.08)" },
            ticks: { color: "rgba(255,255,255,0.85)", font: { size: 11, weight: 600 } },
            border: { display: false },
          },
          y: {
            min: weight * 0.74,
            max: weight * 1.02,
            grid: { color: "rgba(255,255,255,0.08)" },
            ticks: {
              color: "rgba(255,255,255,0.7)",
              font: { size: 10 },
              callback: (v) => `${v} lbs`,
              maxTicksLimit: 5,
            },
            border: { display: false },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update chart data on slider change
  useEffect(() => {
    const c = chartRef.current;
    if (!c) return;
    c.data.datasets[0].data = tirz;
    c.data.datasets[1].data = sema;
    if (c.options.scales?.y) {
      (c.options.scales.y as any).min = weight * 0.74;
      (c.options.scales.y as any).max = weight * 1.02;
    }
    c.update();
  }, [weight, tirz, sema]);

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
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="weight-slider" className="text-sm font-medium text-white md:text-base">
                Current weight
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
              <div className="mt-3 flex justify-between text-[11px] font-medium uppercase tracking-wide text-white/60">
                <span>{MIN} lbs</span>
                <span>{MAX} lbs</span>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-between gap-4 md:mt-14">
              <span className="text-sm font-medium text-white md:text-base">You could lose up to</span>
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

            <motion.a
              href="#assessment"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-white text-base font-semibold text-[#1e4560] shadow-lg transition-shadow hover:shadow-xl"
            >
              Start My Free Assessment
              <ArrowRight className="h-5 w-5" strokeWidth={2} />
            </motion.a>

            <p className="mt-4 text-center text-[12px] leading-relaxed text-white/70">
              *Based on published clinical trial averages showing 15-22% body weight reduction.
              Individual results vary and are not guaranteed.
            </p>
          </motion.div>

          {/* RIGHT — Live chart card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur-md md:p-7"
          >
            <div className="flex items-center justify-between text-white">
              <div>
                <div className="text-xs uppercase tracking-wide text-white/60">Projected in 5 months</div>
                <div className="text-2xl font-semibold tracking-tight md:text-3xl">{endTirz} lbs</div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/80">
                <span className="inline-flex items-center gap-2">
                  <span className="h-[2px] w-6 rounded bg-white" /> Tirzepatide
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-[2px] w-6 rounded border-t-2 border-dashed border-white/70" />
                  Semaglutide
                </span>
              </div>
            </div>

            <div className="relative mt-4 h-[280px] w-full md:h-[340px]">
              <canvas ref={canvasRef} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
