/**
 * CRO / funnel-step metrics.
 *
 * Everything here is deterministically derived from AdminState.funnelDays
 * (+ build.intakeScreens for screen-level drop-off), so SSR and client render
 * identically — no Date.now()/Math.random().
 *
 * Step model (per day):
 *   sessions
 *     → presell views          (share of sessions landing on a presell/advertorial)
 *     → presell clicks         (CTR out of presell into sales page)
 *     → sales page views       (direct sessions + presell clicks)
 *     → sales page clicks      (CTA clicks → intake)
 *     → intake starts          (funnelDay.intakeStarted)
 *     → intake completions     (funnelDay.intakeCompleted)
 *     → checkout starts
 *     → purchases              (funnelDay.paid)
 */
import type { AdminState, FunnelDay, IntakeScreen } from "./store";
import { pctDelta, ptDelta, type WindowSpec } from "./analytics";

/* Deterministic 0..1 wobble from a day timestamp + salt. */
function jitter(ts: number, salt: number): number {
  const x = Math.sin((Math.floor(ts / 86400000) + 1) * (12.9898 + salt * 0.7213)) * 43758.5453;
  return x - Math.floor(x);
}

export type CroDay = {
  ts: number;
  sessions: number;
  presellViews: number;
  presellClicks: number;
  salesViews: number;
  salesClicks: number;
  salesBounces: number;
  intakeViews: number;
  intakeStarts: number;
  intakeCompletions: number;
  checkoutStarts: number;
  purchases: number;
};

export function croDay(d: FunnelDay): CroDay {
  const sessions = Math.max(0, d.sessions);
  const presellShare = 0.34 + jitter(d.ts, 1) * 0.06;          // ~34–40% of traffic hits a presell
  const presellViews = Math.round(sessions * presellShare);
  const presellCtr = 0.52 + jitter(d.ts, 2) * 0.1;             // presell → sales page
  const presellClicks = Math.round(presellViews * presellCtr);
  const salesViews = Math.round(sessions - presellViews + presellClicks);
  const intakeStarts = Math.max(0, d.intakeStarted);
  // Sales-page CTA clicks must be ≥ intake starts (some clickers never render step 1)
  const salesClicks = Math.max(intakeStarts, Math.round(intakeStarts * (1.08 + jitter(d.ts, 3) * 0.09)));
  const intakeViews = salesClicks;
  const bounceRate = 0.41 + jitter(d.ts, 4) * 0.08;
  const salesBounces = Math.round(salesViews * bounceRate);
  const intakeCompletions = Math.max(0, Math.min(intakeStarts, d.intakeCompleted));
  const purchases = Math.max(0, Math.min(intakeCompletions, d.paid));
  const checkoutStarts = Math.max(
    purchases,
    Math.min(intakeCompletions, Math.round(purchases * (1.34 + jitter(d.ts, 5) * 0.22))),
  );
  return {
    ts: d.ts, sessions,
    presellViews, presellClicks,
    salesViews, salesClicks, salesBounces,
    intakeViews, intakeStarts, intakeCompletions,
    checkoutStarts, purchases,
  };
}

type Totals = Record<Exclude<keyof CroDay, "ts">, number>;

function totals(days: CroDay[]): Totals {
  const keys: (keyof Totals)[] = [
    "sessions", "presellViews", "presellClicks", "salesViews", "salesClicks",
    "salesBounces", "intakeViews", "intakeStarts", "intakeCompletions",
    "checkoutStarts", "purchases",
  ];
  const out = {} as Totals;
  for (const k of keys) out[k] = days.reduce((a, d) => a + d[k], 0);
  return out;
}

const rate = (n: number, d: number) => (d ? (n / d) * 100 : 0);

export type CroRate = {
  key: string;
  label: string;
  hint: string;
  value: number;          // percent
  prior: number;          // percent
  deltaPt: number;        // percentage-point change
  positiveIsGood: boolean;
  numerator: number;
  denominator: number;
  series: number[];       // per-day percent, current window
  priorSeries: number[];
};

function rateMetric(
  key: string, label: string, hint: string,
  cur: CroDay[], pri: CroDay[],
  num: keyof Totals, den: keyof Totals,
  positiveIsGood = true,
  invert = false,
): CroRate {
  const tc = totals(cur), tp = totals(pri);
  const val = invert ? 100 - rate(tc[num], tc[den]) : rate(tc[num], tc[den]);
  const prv = invert ? 100 - rate(tp[num], tp[den]) : rate(tp[num], tp[den]);
  const series = cur.map((d) => (invert ? 100 - rate(d[num], d[den]) : rate(d[num], d[den])));
  const priorSeries = pri.map((d) => (invert ? 100 - rate(d[num], d[den]) : rate(d[num], d[den])));
  return {
    key, label, hint,
    value: val, prior: prv, deltaPt: ptDelta(val, prv),
    positiveIsGood,
    numerator: invert ? tc[den] - tc[num] : tc[num],
    denominator: tc[den],
    series, priorSeries,
  };
}

export type CroMetrics = {
  cur: CroDay[];
  pri: CroDay[];
  dates: number[];
  totals: Totals;
  priorTotals: Totals;
  rates: Record<
    | "presellCtr" | "salesClickRate" | "salesBounceRate"
    | "intakeStartRate" | "intakeCompletionRate" | "intakeAbandonRate"
    | "checkoutStartRate" | "checkoutCompletionRate" | "checkoutAbandonRate"
    | "overallConversionRate",
    CroRate
  >;
  steps: { label: string; count: number; pct: number; dropPct: number }[];
  volumeDeltas: Record<"presellViews" | "salesViews" | "intakeStarts" | "checkoutStarts" | "purchases", number>;
};

export function croMetrics(s: AdminState, w: WindowSpec): CroMetrics {
  const cur = w.currentSlice.map(croDay);
  const pri = (w.priorSlice.length ? w.priorSlice : w.currentSlice).map(croDay);
  const tc = totals(cur), tp = totals(pri);

  const rates: CroMetrics["rates"] = {
    presellCtr: rateMetric("presellCtr", "Presell click-through", "Presell / advertorial → sales page", cur, pri, "presellClicks", "presellViews"),
    salesClickRate: rateMetric("salesClickRate", "Sales page click rate", "CTA clicks ÷ sales page visitors", cur, pri, "salesClicks", "salesViews"),
    salesBounceRate: rateMetric("salesBounceRate", "Sales page bounce rate", "Left without any interaction", cur, pri, "salesBounces", "salesViews", false),
    intakeStartRate: rateMetric("intakeStartRate", "Intake start rate", "Started screen 1 ÷ intake page views", cur, pri, "intakeStarts", "intakeViews"),
    intakeCompletionRate: rateMetric("intakeCompletionRate", "Intake completion rate", "Submitted ÷ started", cur, pri, "intakeCompletions", "intakeStarts"),
    intakeAbandonRate: rateMetric("intakeAbandonRate", "Intake abandon rate", "Started but never submitted", cur, pri, "intakeCompletions", "intakeStarts", false, true),
    checkoutStartRate: rateMetric("checkoutStartRate", "Checkout start rate", "Reached checkout ÷ intake submitted", cur, pri, "checkoutStarts", "intakeCompletions"),
    checkoutCompletionRate: rateMetric("checkoutCompletionRate", "Checkout completion rate", "Purchased ÷ checkout started", cur, pri, "purchases", "checkoutStarts"),
    checkoutAbandonRate: rateMetric("checkoutAbandonRate", "Checkout abandon rate", "Entered checkout, never paid", cur, pri, "purchases", "checkoutStarts", false, true),
    overallConversionRate: rateMetric("overallConversionRate", "Overall conversion rate", "Purchases ÷ all sessions", cur, pri, "purchases", "sessions"),
  };

  const stepDefs: { label: string; n: number }[] = [
    { label: "Sessions", n: tc.sessions },
    { label: "Sales page views", n: tc.salesViews },
    { label: "Sales CTA clicks", n: tc.salesClicks },
    { label: "Intake started", n: tc.intakeStarts },
    { label: "Intake submitted", n: tc.intakeCompletions },
    { label: "Checkout started", n: tc.checkoutStarts },
    { label: "Purchased", n: tc.purchases },
  ];
  const steps = stepDefs.map((st, i) => ({
    label: st.label,
    count: st.n,
    pct: rate(st.n, tc.sessions),
    dropPct: i === 0 ? 0 : 100 - rate(st.n, stepDefs[i - 1].n),
  }));

  const volumeDeltas = {
    presellViews: pctDelta(tc.presellViews, tp.presellViews),
    salesViews: pctDelta(tc.salesViews, tp.salesViews),
    intakeStarts: pctDelta(tc.intakeStarts, tp.intakeStarts),
    checkoutStarts: pctDelta(tc.checkoutStarts, tp.checkoutStarts),
    purchases: pctDelta(tc.purchases, tp.purchases),
  };

  return { cur, pri, dates: w.dates, totals: tc, priorTotals: tp, rates, steps, volumeDeltas };
}

/* ────────── Screen-level intake drop-off ────────── */

export type ScreenDropoff = {
  id: string;
  order: number;
  name: string;
  question: string;
  locked: boolean;
  entered: number;
  exited: number;
  dropPct: number;        // % of entrants who abandon on this screen
  reachedPct: number;     // % of intake starters who reach this screen
  medianSecs: number;
  worst: boolean;
};

/**
 * Per-screen abandonment across the live intake, seeded by screen type so
 * heavy-friction screens (contact capture, contraindications, multi-select)
 * bleed more than a single-tap question.
 */
export function intakeScreenDropoff(s: AdminState, w: WindowSpec): {
  screens: ScreenDropoff[];
  starts: number;
  completions: number;
  worst?: ScreenDropoff;
} {
  const cur = w.currentSlice.map(croDay);
  const starts = cur.reduce((a, d) => a + d.intakeStarts, 0);
  const completions = cur.reduce((a, d) => a + d.intakeCompletions, 0);
  const active: IntakeScreen[] = [...s.build.intakeScreens]
    .filter((sc) => sc.active)
    .sort((a, b) => a.order - b.order);

  if (!active.length || !starts) return { screens: [], starts, completions };

  const anchorTs = w.currentSlice[w.currentSlice.length - 1]?.ts ?? 0;
  const friction = (sc: IntakeScreen, i: number) => {
    const byType =
      sc.type === "text" ? 3.1 :
      sc.type === "number" ? 2.2 :
      sc.type === "multi" ? 1.9 : 1.2;
    const lockedPen = sc.locked ? 1.5 : 0;
    const fatigue = i * 0.12;
    return byType + lockedPen + fatigue + jitter(anchorTs + i * 86400000, 7) * 1.1;
  };

  const raw = active.map((sc, i) => friction(sc, i));
  const rawSum = raw.reduce((a, b) => a + b, 0);
  const totalLoss = starts - completions;

  let cursor = starts;
  const screens: ScreenDropoff[] = active.map((sc, i) => {
    const share = raw[i] / rawSum;
    const exited = Math.min(cursor, Math.round(totalLoss * share));
    const entered = cursor;
    const row: ScreenDropoff = {
      id: sc.id,
      order: sc.order,
      name: sc.name,
      question: sc.question,
      locked: sc.locked,
      entered,
      exited,
      dropPct: entered ? (exited / entered) * 100 : 0,
      reachedPct: (entered / starts) * 100,
      medianSecs: Math.round(9 + raw[i] * 4 + jitter(anchorTs + i * 3600000, 9) * 6),
      worst: false,
    };
    cursor = Math.max(0, cursor - exited);
    return row;
  });

  let worstIdx = 0;
  screens.forEach((sc, i) => { if (sc.dropPct > screens[worstIdx].dropPct) worstIdx = i; });
  screens[worstIdx].worst = true;

  return { screens, starts, completions, worst: screens[worstIdx] };
}
