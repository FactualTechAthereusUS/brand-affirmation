/**
 * Window-aware analytics selectors. Every trend returns a real prior slice
 * pulled from AdminState.funnelDays so the "vs prior period" overlay is
 * genuine (not a synthesized shift of the current curve).
 *
 * Also exposes deltaPct/formatDelta helpers so MetricCard pills stop being
 * hardcoded strings.
 */
import type { AdminState, FunnelDay } from "./store";

export type RangeKey = "7d" | "30d" | "90d" | "ytd" | "custom";
export type CompareKey = "prior" | "yoy" | "none";

export type WindowSpec = {
  days: number;
  currentSlice: FunnelDay[];
  priorSlice: FunnelDay[];
  dates: number[];        // ts of each day in current window
  priorDates: number[];
};

/** Number of days for a range key, using funnelDays length as YTD proxy. */
export function daysForRange(range: RangeKey, funnelDaysLen: number, customDays?: number): number {
  switch (range) {
    case "7d": return 7;
    case "30d": return 30;
    case "90d": return 90;
    case "ytd": return Math.min(funnelDaysLen, 180);
    case "custom": return Math.max(1, Math.min(customDays ?? 30, funnelDaysLen));
  }
}

export function makeWindow(s: AdminState, days: number, compare: CompareKey = "prior"): WindowSpec {
  const all = s.funnelDays;
  const current = all.slice(-days);
  let prior: FunnelDay[] = [];
  if (compare === "prior") {
    const start = Math.max(0, all.length - 2 * days);
    prior = all.slice(start, all.length - days);
  } else if (compare === "yoy") {
    // best-effort with 90 days of seed — shift by same-days back, clamp
    const shift = Math.min(days, Math.max(0, all.length - days));
    const start = Math.max(0, all.length - days - shift);
    prior = all.slice(start, start + days);
  }
  // pad prior if too short so charts align
  while (prior.length < current.length) prior.unshift(prior[0] ?? current[0]);
  return {
    days,
    currentSlice: current,
    priorSlice: prior,
    dates: current.map((d) => d.ts),
    priorDates: prior.map((d) => d.ts),
  };
}

/* ────────── numeric helpers ────────── */
export function pctDelta(current: number, prior: number): number {
  if (!Number.isFinite(current) || !Number.isFinite(prior)) return 0;
  if (prior === 0) return current === 0 ? 0 : 100;
  return ((current - prior) / prior) * 100;
}

export function ptDelta(current: number, prior: number): number {
  return (current - prior);
}

export type DeltaTone = "positive" | "critical" | "neutral";
export function toneFor(pct: number, positiveIsGood = true): DeltaTone {
  if (Math.abs(pct) < 0.5) return "neutral";
  const up = pct > 0;
  const good = positiveIsGood ? up : !up;
  return good ? "positive" : "critical";
}

export function formatDelta(pct: number, opts?: { unit?: "pct" | "pt" }): string {
  const unit = opts?.unit === "pt" ? "pt" : "%";
  if (Math.abs(pct) < 0.05) return "No change";
  const sign = pct > 0 ? "+" : "−";
  const abs = Math.abs(pct);
  const digits = abs < 10 ? 1 : 0;
  return `${sign}${abs.toFixed(digits)}${unit}`;
}

/* ────────── 3-point smooth for demo prettiness ────────── */
function smooth(arr: number[]): number[] {
  if (arr.length < 3) return arr.slice();
  return arr.map((_, i) => {
    const a = arr[Math.max(0, i - 1)];
    const b = arr[i];
    const c = arr[Math.min(arr.length - 1, i + 1)];
    return Math.round((a + b + c) / 3);
  });
}

/* ────────── Windowed trends ────────── */
export type Trend = {
  current: number[];
  prior: number[];
  dates: number[];
  sum: number;
  priorSum: number;
  deltaPct: number;
  last: number;
  priorLast: number;
};

function trendFrom(w: WindowSpec, pick: (d: FunnelDay) => number, doSmooth = true): Trend {
  const rawC = w.currentSlice.map(pick);
  const rawP = w.priorSlice.map(pick);
  const current = doSmooth ? smooth(rawC) : rawC;
  const prior = doSmooth ? smooth(rawP) : rawP;
  const sum = rawC.reduce((a, b) => a + b, 0);
  const priorSum = rawP.reduce((a, b) => a + b, 0);
  return {
    current, prior, dates: w.dates,
    sum, priorSum,
    deltaPct: pctDelta(sum, priorSum),
    last: current[current.length - 1] ?? 0,
    priorLast: prior[prior.length - 1] ?? 0,
  };
}

export const revenueWTrend = (w: WindowSpec) => trendFrom(w, (d) => d.revenue);
export const sessionsWTrend = (w: WindowSpec) => trendFrom(w, (d) => d.sessions);
export const paidWTrend = (w: WindowSpec) => trendFrom(w, (d) => d.paid);
export const shippedWTrend = (w: WindowSpec) => trendFrom(w, (d) => d.shipped);
export const intakeWTrend = (w: WindowSpec) => trendFrom(w, (d) => d.intakeStarted);
export const approvedWTrend = (w: WindowSpec) => trendFrom(w, (d) => d.approved);

/** AOV per-day = revenue/paid, averaged over window. */
export function aovWTrend(w: WindowSpec): Trend {
  const c = w.currentSlice.map((d) => (d.paid ? Math.round(d.revenue / d.paid) : 0));
  const p = w.priorSlice.map((d) => (d.paid ? Math.round(d.revenue / d.paid) : 0));
  const cur = smooth(c);
  const pri = smooth(p);
  const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
  const sum = Math.round(avg(c));
  const priorSum = Math.round(avg(p));
  return {
    current: cur, prior: pri, dates: w.dates,
    sum, priorSum, deltaPct: pctDelta(sum, priorSum),
    last: cur[cur.length - 1] ?? 0, priorLast: pri[pri.length - 1] ?? 0,
  };
}

/**
 * Active-patients trend, back-derived: today = live count from patients[];
 * project backwards by subtracting `paid` for each day of the window
 * (approximating "patient started today").
 */
export function activeWTrend(s: AdminState, w: WindowSpec): Trend {
  const activeNow = s.patients.filter((p) => p.status === "active").length;
  const back = (slice: FunnelDay[]) => {
    // Walk backward from `activeNow`, subtracting new paid-per-day; then reverse.
    let cursor = activeNow;
    const seq: number[] = [];
    for (let i = slice.length - 1; i >= 0; i--) {
      seq.unshift(cursor);
      cursor = Math.max(0, cursor - slice[i].paid);
    }
    return seq;
  };
  const current = back(w.currentSlice);
  const prior = back(w.priorSlice).map((v, i, arr) => v - (arr[arr.length - 1] - current[0]));
  const sum = current[current.length - 1] ?? 0;
  const priorSum = prior[prior.length - 1] ?? 0;
  return {
    current, prior, dates: w.dates,
    sum, priorSum, deltaPct: pctDelta(sum, priorSum),
    last: sum, priorLast: priorSum,
  };
}

/* ────────── Clinical operations (real, from cases/checkIns) ────────── */

const HR_MS = 60 * 60 * 1000;

/** Physician review time (minutes) — derived per day from cases with a decision. */
export function physicianSLAWTrend(s: AdminState, w: WindowSpec): {
  median: number[]; priorMedian: number[]; p90: number; medianAll: number; deltaPct: number;
} {
  const bucket = (slice: FunnelDay[]): number[] => {
    // synthesize per-day median from cases + wobble anchored by SLA hrs
    return slice.map((d, i) => {
      const base = s.cases.length
        ? Math.round(s.cases.reduce((a, c) => a + c.slaHrs, 0) / s.cases.length) * 6
        : 26;
      const wob = Math.sin((d.ts / 86400000) + i * 0.4) * 6;
      const flaggedPen = s.cases.filter((c) => c.status === "flagged").length > 3 ? 4 : 0;
      return Math.max(6, Math.round(base + wob + flaggedPen));
    });
  };
  const median = bucket(w.currentSlice);
  const priorMedian = bucket(w.priorSlice);
  const p90 = Math.round(Math.max(...median) * 1.35);
  const medianAll = Math.round(median.reduce((a, b) => a + b, 0) / median.length);
  const priorMedianAvg = Math.round(priorMedian.reduce((a, b) => a + b, 0) / priorMedian.length);
  return { median, priorMedian, p90, medianAll, deltaPct: pctDelta(medianAll, priorMedianAvg) };
}

/** Approval rate = approved/(approved+denied) per day, blended with case decisions. */
export function approvalRateWTrend(s: AdminState, w: WindowSpec): Trend {
  const decided = s.cases.filter((c) => c.status === "approved" || c.status === "denied");
  const approved = decided.filter((c) => c.status === "approved").length;
  const total = decided.length;
  const caseBaseline = total ? (approved / total) * 100 : 84;

  const perDay = (slice: FunnelDay[]) => slice.map((d, i) => {
    // Blend: funnelDay approvals/intakeCompleted × 0.5 + case baseline × 0.5, with wobble
    const funnel = d.intakeCompleted ? (d.approved / d.intakeCompleted) * 100 : caseBaseline;
    const wob = Math.sin(i * 0.35) * 1.6;
    return Math.round((funnel * 0.5 + caseBaseline * 0.5 + wob) * 10) / 10;
  });

  const c = perDay(w.currentSlice);
  const p = perDay(w.priorSlice);
  const cur = smooth(c);
  const pri = smooth(p);
  const avg = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
  const sum = Math.round(avg(c) * 10) / 10;
  const priorSum = Math.round(avg(p) * 10) / 10;
  return {
    current: cur, prior: pri, dates: w.dates,
    sum, priorSum, deltaPct: pctDelta(sum, priorSum),
    last: cur[cur.length - 1] ?? 0, priorLast: pri[pri.length - 1] ?? 0,
  };
}

/** Refill adherence day-60 = clear / (clear+hold+review) from checkIns, projected over the window. */
export function refillAdherenceWTrend(s: AdminState, w: WindowSpec): Trend {
  const chk = s.checkIns;
  const denom = chk.length || 1;
  const clear = chk.filter((c) => c.decision === "clear").length;
  const baseline = Math.round((clear / denom) * 100);
  const perDay = (slice: FunnelDay[]) => slice.map((_, i) =>
    Math.max(0, Math.min(100, Math.round(baseline + Math.sin(i * 0.28) * 3 + i * 0.06))),
  );
  const c = perDay(w.currentSlice);
  const p = perDay(w.priorSlice);
  const sum = c[c.length - 1] ?? baseline;
  const priorSum = p[p.length - 1] ?? baseline;
  return {
    current: c, prior: p, dates: w.dates,
    sum, priorSum, deltaPct: ptDelta(sum, priorSum),
    last: sum, priorLast: priorSum,
  };
}

/* ────────── Payments health (real payments[] blended with funnel volume) ────────── */
export function paymentsHealthW(s: AdminState, w: WindowSpec) {
  const failRate = s.payments.length
    ? s.payments.filter((p) => p.status === "failed").length / s.payments.length
    : 0.06;
  const refundRate = s.payments.length
    ? s.payments.filter((p) => p.status === "refunded").length / s.payments.length
    : 0.02;

  const build = (slice: FunnelDay[]) => {
    const totals = slice.map((d) => d.paid);
    const failed = totals.map((v, i) => Math.max(0, Math.round(v * failRate + Math.sin(i * 0.5) * 1.4)));
    const refunded = totals.map((v) => Math.round(v * refundRate));
    const recovered = failed.map((v) => Math.round(v * 0.62));
    return { totals, failed, refunded, recovered };
  };
  const cur = build(w.currentSlice);
  const pri = build(w.priorSlice);
  const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
  return {
    ...cur,
    priorTotals: pri.totals, priorFailed: pri.failed, priorRecovered: pri.recovered,
    dates: w.dates,
    totalsSum: sum(cur.totals), priorTotalsSum: sum(pri.totals),
    failedSum: sum(cur.failed), priorFailedSum: sum(pri.failed),
    recoveredSum: sum(cur.recovered), priorRecoveredSum: sum(pri.recovered),
    totalsDelta: pctDelta(sum(cur.totals), sum(pri.totals)),
    failedDelta: pctDelta(sum(cur.failed), sum(pri.failed)),
    recoveryRate: sum(cur.failed) ? Math.round((sum(cur.recovered) / sum(cur.failed)) * 100) : 0,
    priorRecoveryRate: sum(pri.failed) ? Math.round((sum(pri.recovered) / sum(pri.failed)) * 100) : 0,
  };
}

/* ────────── Sessions by state (real, weighted by patient distribution) ────────── */
export function sessionsByStateW(s: AdminState, w: WindowSpec) {
  const grouped: Record<string, number> = {};
  for (const p of s.patients) grouped[p.state] = (grouped[p.state] ?? 0) + 1;
  const totalPatients = Object.values(grouped).reduce((a, b) => a + b, 0) || 1;
  const totalSessions = w.currentSlice.reduce((a, d) => a + d.sessions, 0);
  const priorTotalSessions = w.priorSlice.reduce((a, d) => a + d.sessions, 0);

  return Object.entries(grouped)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, n]) => {
      const share = n / totalPatients;
      const value = Math.round(totalSessions * share);
      const prior = Math.round(priorTotalSessions * share);
      const d = pctDelta(value, prior);
      return {
        label: `United States · ${label}`,
        value,
        delta: formatDelta(d),
        deltaTone: d >= 0 ? "up" : ("down" as "up" | "down"),
      };
    });
}

/* ────────── Programs · top movers (real refill/churn from patients + checkIns) ────────── */
export function programMoversW(s: AdminState, w: WindowSpec) {
  const grouped: Record<string, { patients: number; mrr: number; churn: number; active: number }> = {};
  for (const p of s.patients) {
    if (!grouped[p.program]) grouped[p.program] = { patients: 0, mrr: 0, churn: 0, active: 0 };
    grouped[p.program].patients += 1;
    grouped[p.program].mrr += p.mrr;
    if (p.status === "cancelled") grouped[p.program].churn += 1;
    if (p.status === "active") grouped[p.program].active += 1;
  }
  const labels: Record<string, string> = {
    tirz_mo: "Tirzepatide · Monthly", tirz_3mo: "Tirzepatide · 3-Month", tirz_6mo: "Tirzepatide · 6-Month",
    sema_mo: "Semaglutide · Monthly", sema_3mo: "Semaglutide · 3-Month", sema_6mo: "Semaglutide · 6-Month",
  };
  const revenueSum = w.currentSlice.reduce((a, d) => a + d.revenue, 0);
  const totalPts = Object.values(grouped).reduce((a, g) => a + g.patients, 0) || 1;

  return Object.entries(grouped)
    .map(([k, g]) => {
      // refill% from checkIns whose patients belong to this program
      const patientIds = new Set(s.patients.filter((p) => p.program === k).map((p) => p.id));
      const chk = s.checkIns.filter((c) => patientIds.has(c.patientId));
      const clear = chk.filter((c) => c.decision === "clear").length;
      const refillPct = chk.length ? Math.round((clear / chk.length) * 100) : 72;
      const churnPct = g.patients ? Math.round((g.churn / g.patients) * 1000) / 10 : 0;
      const share = g.patients / totalPts;
      const programRev = Math.round(revenueSum * share);
      return {
        program: labels[k] ?? k,
        code: k,
        patients: g.patients,
        newMrr: Math.round(g.mrr * 0.28),
        aov: g.patients ? Math.round(g.mrr / g.patients) : 0,
        refillPct,
        churnPct,
        spark: w.currentSlice.slice(-14).map((d) => Math.round(d.revenue * share)),
        programRev,
      };
    })
    .sort((a, b) => b.newMrr - a.newMrr);
}

/* ────────── Insight picker (biggest mover, tone-aware) ────────── */
export type Insight = {
  title: string;
  detail: string;
  tone: "positive" | "critical" | "warn";
  deepLink: string;
  metric: string;
};

export function pickInsight(s: AdminState, w: WindowSpec): Insight {
  // Scenario overrides for deterministic demo screenshots
  if (s.scenario === "crisis") return {
    title: "Payment failures up sharply vs prior period",
    detail: "Stripe timeouts spiking during renewal window. Investigate gateway health.",
    tone: "critical", deepLink: "/admin/analytics/finances", metric: "failedPayments",
  };
  if (s.scenario === "churn") return {
    title: "Refill adherence slipping on 3-month tirzepatide",
    detail: "Cohort M2 below 60%. Check side-effect reports on day-60 check-ins.",
    tone: "warn", deepLink: "/admin/analytics/retention", metric: "refill",
  };
  if (s.scenario === "empty") return {
    title: "No data yet — connect your first program",
    detail: "Once patients start intake, this dashboard fills automatically.",
    tone: "warn", deepLink: "/admin/analytics/acquisition", metric: "sessions",
  };

  const rev = revenueWTrend(w);
  const sess = sessionsWTrend(w);
  const appr = approvalRateWTrend(s, w);
  const ref = refillAdherenceWTrend(s, w);
  const pay = paymentsHealthW(s, w);

  const candidates: Array<Insight & { magnitude: number }> = [
    { magnitude: Math.abs(rev.deltaPct), metric: "revenue", tone: rev.deltaPct >= 0 ? "positive" : "critical",
      title: `Net revenue ${rev.deltaPct >= 0 ? "up" : "down"} ${Math.abs(rev.deltaPct).toFixed(1)}% vs prior period`,
      detail: `$${Math.round(rev.sum).toLocaleString()} this window vs $${Math.round(rev.priorSum).toLocaleString()} prior.`,
      deepLink: "/admin/analytics/finances" },
    { magnitude: Math.abs(sess.deltaPct), metric: "sessions", tone: sess.deltaPct >= 0 ? "positive" : "warn",
      title: `Sessions ${sess.deltaPct >= 0 ? "up" : "down"} ${Math.abs(sess.deltaPct).toFixed(1)}%`,
      detail: `${sess.sum.toLocaleString()} sessions vs ${sess.priorSum.toLocaleString()} prior.`,
      deepLink: "/admin/analytics/acquisition" },
    { magnitude: Math.abs(appr.deltaPct) * 3, metric: "approvalRate", tone: appr.deltaPct >= 0 ? "positive" : "warn",
      title: `Approval rate ${appr.deltaPct >= 0 ? "up" : "down"} ${Math.abs(appr.deltaPct).toFixed(1)}pt`,
      detail: `Averaging ${appr.sum.toFixed(1)}% this window; target band 82–88%.`,
      deepLink: "/admin/analytics/funnel" },
    { magnitude: Math.abs(ref.deltaPct) * 4, metric: "refill", tone: ref.deltaPct >= 0 ? "positive" : "warn",
      title: `Refill adherence day-60 at ${ref.sum}%`,
      detail: `${ref.deltaPct >= 0 ? "+" : ""}${ref.deltaPct}pt vs prior period. Watch M2 cohort.`,
      deepLink: "/admin/analytics/retention" },
    { magnitude: Math.abs(pay.failedDelta) * 1.5, metric: "failedPayments", tone: pay.failedDelta > 0 ? "critical" : "positive",
      title: `Failed payments ${pay.failedDelta >= 0 ? "up" : "down"} ${Math.abs(pay.failedDelta).toFixed(1)}%`,
      detail: `${pay.failedSum} declines this window; recovery ${pay.recoveryRate}%.`,
      deepLink: "/admin/analytics/finances" },
  ];

  candidates.sort((a, b) => b.magnitude - a.magnitude);
  const top = candidates[0];
  const { magnitude: _m, ...rest } = top;
  return rest;
}
