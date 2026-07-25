/**
 * Derived selectors — pure functions over AdminState.
 * All screens read from these so a scenario switch reflows everything.
 */
import type { AdminState, FunnelDay } from "./store";

export function todayRevenue(s: AdminState): number {
  const t = s.funnelDays[s.funnelDays.length - 1];
  return t ? t.revenue : 0;
}

export function revenueTrend(s: AdminState, days = 30): number[] {
  const raw = s.funnelDays.slice(-days).map((d) => d.revenue);
  if (raw.length < 3) return raw;
  return raw.map((_, i) => {
    const a = raw[Math.max(0, i - 1)];
    const b = raw[i];
    const c = raw[Math.min(raw.length - 1, i + 1)];
    return Math.round((a + b + c) / 3);
  });
}

export function datesTrend(s: AdminState, days = 30): number[] {
  return s.funnelDays.slice(-days).map((d) => d.ts);
}

export function newPatientsTrend(s: AdminState, days = 30): number[] {
  return s.funnelDays.slice(-days).map((d) => d.paid);
}

export function ordersTrend(s: AdminState, days = 30): number[] {
  return s.funnelDays.slice(-days).map((d) => d.shipped);
}

export function failedPaymentsToday(s: AdminState): number {
  return s.payments.filter((p) => p.status === "failed").length;
}

export function refillsDue(s: AdminState): number {
  return s.checkIns.filter((c) => c.decision === "clear" && c.day >= 85 && c.day <= 92).length;
}

export function pipelineByPharmacy(s: AdminState) {
  return s.pharmacies.map((ph) => {
    const orders = s.orders.filter((o) => (o as { pharmacyId?: string }).pharmacyId === ph.id);
    return {
      pharmacy: ph,
      awaitingRx: Math.max(2, orders.filter((o) => o.status === "processing").length),
      preparing: Math.max(3, orders.filter((o) => o.status === "at_pharmacy").length),
      shipped: Math.max(1, orders.filter((o) => o.status === "shipped").length),
      delivered: orders.filter((o) => o.status === "delivered").length,
    };
  });
}

export function queueCounts(s: AdminState) {
  return {
    physician: s.cases.filter((c) => c.status === "new" || c.status === "flagged").length,
    flagged: s.cases.filter((c) => c.status === "flagged").length,
    awaitingReply: s.cases.filter((c) => c.status === "awaitingReply").length,
    refills: s.cases.filter((c) => c.status === "refill").length,
    support: s.conversations.filter((c) => c.status === "unassigned").length,
    checkinsOverdue: s.checkIns.filter((c) => c.decision === "hold").length,
  };
}

export function mrrWaterfall(s: AdminState) {
  const days = s.funnelDays.slice(-30);
  const newMrr = days.reduce((a, d) => a + d.newMrr, 0);
  const churn = days.reduce((a, d) => a + d.churnedMrr, 0);
  return [
    { label: "Starting", value: 84200, kind: "base" as const },
    { label: "New", value: newMrr, kind: "pos" as const },
    { label: "Expansion", value: 4200, kind: "pos" as const },
    { label: "Reactivated", value: 1800, kind: "pos" as const },
    { label: "Contraction", value: -1200, kind: "neg" as const },
    { label: "Churn", value: churn, kind: "neg" as const },
    { label: "Ending", value: 84200 + newMrr + 4200 + 1800 - 1200 + churn, kind: "base" as const },
  ];
}

export function abandonedCheckouts(s: AdminState) {
  // Reuse leads as "abandoned checkouts" for demo purposes
  return s.leads.slice(0, 10).map((l, i) => ({
    id: `#${(41710000 + i * 1234).toString()}`,
    created: `${i + 1}h ago`,
    name: l.name,
    region: "United States",
    recoveryStatus: i % 3 === 0 ? "Recovering" : "Not recovered",
    total: 249 + (i % 3) * 50,
  }));
}

export function acquisitionSpendMix(s: AdminState) {
  const grouped: Record<string, number> = {};
  for (const c of s.campaigns) grouped[c.channel] = (grouped[c.channel] ?? 0) + c.spend;
  const total = Object.values(grouped).reduce((a, b) => a + b, 0) || 1;
  const colors: Record<string, string> = { Meta: "#ee7273", Google: "#1D437B", Email: "#4a7c6f", Affiliate: "#c4a265", Organic: "#8b9bb4" };
  return Object.entries(grouped).map(([label, value]) => ({ label, value, pct: (value / total) * 100, color: colors[label] ?? "#171717" }));
}

export function conversionFunnel(s: AdminState) {
  const last30 = s.funnelDays.slice(-30);
  const sum = (k: keyof FunnelDay) => last30.reduce((a, d) => a + (d[k] as number), 0);
  const sessions = sum("sessions");
  const intake = sum("intakeStarted");
  const paid = sum("paid");
  return {
    sessions,
    intake,
    paid,
    intakePct: sessions ? (intake / sessions) * 100 : 0,
    paidPct: sessions ? (paid / sessions) * 100 : 0,
  };
}

/* ────────── Telehealth analytics selectors ────────── */

export function priorPeriodShift(arr: number[], amplitudePct = 8): number[] {
  return arr.map((v, i) => Math.round(v * (1 - amplitudePct / 100 + (Math.sin(i * 0.6) * 0.04))));
}

// 3-point moving average — kills demo spikes so charts read as trends
function smooth(arr: number[]): number[] {
  if (arr.length < 3) return arr.slice();
  return arr.map((_, i) => {
    const a = arr[Math.max(0, i - 1)];
    const b = arr[i];
    const c = arr[Math.min(arr.length - 1, i + 1)];
    return Math.round((a + b + c) / 3);
  });
}

export function sessionsTrend(s: AdminState, days = 30): number[] {
  return smooth(s.funnelDays.slice(-days).map((d) => d.sessions));
}
export function aovTrend(s: AdminState, days = 30): number[] {
  return smooth(s.funnelDays.slice(-days).map((d) => (d.paid ? Math.round(d.revenue / d.paid) : 0)));
}
export function activeTrend(s: AdminState, days = 30): number[] {
  // Smooth upward curve: base + slow growth + gentle wave (no cold-start plateau)
  return Array.from({ length: days }, (_, i) =>
    Math.round(180 + i * 4.2 + Math.sin(i * 0.35) * 12 + Math.cos(i * 0.18) * 6),
  );
}
export function physicianSLATrend(s: AdminState, days = 30): { median: number[]; p90: number } {
  const base = s.funnelDays.slice(-days).map((d, i) => 22 + Math.round(Math.sin(i * 0.4) * 6) + (d.approved > 90 ? 4 : 0));
  return { median: base, p90: Math.max(...base) + 8 };
}
export function approvalRateTrend(s: AdminState, days = 30): number[] {
  return smooth(s.funnelDays.slice(-days).map((d) => (d.intakeCompleted ? Math.round((d.approved / d.intakeCompleted) * 1000) / 10 : 0)));
}
export function refillAdherenceTrend(s: AdminState, days = 30): number[] {
  return s.funnelDays.slice(-days).map((_, i) => 62 + Math.round(Math.sin(i * 0.3) * 5) + Math.round(i * 0.15));
}

export function sessionsByState(s: AdminState): { label: string; value: number; delta: string; deltaTone: "up" | "down" }[] {
  const grouped: Record<string, number> = {};
  for (const p of s.patients) grouped[p.state] = (grouped[p.state] ?? 0) + 1;
  const total = Object.values(grouped).reduce((a, b) => a + b, 0) || 1;
  const deltas = ["+12%", "+7%", "-3%", "+18%", "+4%", "-2%"];
  return Object.entries(grouped)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, n], i) => ({
      label: `United States · ${label}`,
      value: Math.round((n / total) * 12480),
      delta: deltas[i] ?? "—",
      deltaTone: deltas[i]?.startsWith("-") ? "down" : "up",
    }));
}

export function deviceMix(): { label: string; value: number; color: string }[] {
  return [
    { label: "Mobile", value: 68, color: "#ee7273" },
    { label: "Desktop", value: 26, color: "#171717" },
    { label: "Tablet", value: 6, color: "#c4a265" },
  ];
}

export function trafficSources(s: AdminState): { label: string; value: number; delta: string; deltaTone: "up" | "down" }[] {
  const grouped: Record<string, number> = {};
  for (const c of s.campaigns) grouped[c.channel] = (grouped[c.channel] ?? 0) + c.leads;
  grouped["Organic"] = (grouped["Organic"] ?? 0) + 380;
  const deltas: Record<string, string> = { Meta: "+8%", Google: "+3%", Email: "+14%", Affiliate: "-2%", Organic: "+6%" };
  return Object.entries(grouped)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({
      label,
      value,
      delta: deltas[label] ?? "—",
      deltaTone: (deltas[label]?.startsWith("-") ? "down" : "up") as "up" | "down",
    }));
}

export function programMovers(s: AdminState): {
  program: string; patients: number; newMrr: number; aov: number; refillPct: number; churnPct: number; spark: number[];
}[] {
  const grouped: Record<string, { name: string; patients: number; mrr: number; churn: number }> = {};
  for (const p of s.patients) {
    const key = p.program;
    if (!grouped[key]) grouped[key] = { name: key, patients: 0, mrr: 0, churn: 0 };
    grouped[key].patients += 1;
    grouped[key].mrr += p.mrr;
    if (p.status === "cancelled") grouped[key].churn += 1;
  }
  const labels: Record<string, string> = {
    tirz_mo: "Tirzepatide · Monthly", tirz_3mo: "Tirzepatide · 3-Month", tirz_6mo: "Tirzepatide · 6-Month",
    sema_mo: "Semaglutide · Monthly", sema_3mo: "Semaglutide · 3-Month", sema_6mo: "Semaglutide · 6-Month",
  };
  return Object.entries(grouped)
    .map(([k, v], i) => ({
      program: labels[k] ?? k,
      patients: v.patients,
      newMrr: Math.round(v.mrr * 0.28),
      aov: v.patients ? Math.round(v.mrr / v.patients) : 0,
      refillPct: 62 + ((i * 7) % 22),
      churnPct: v.patients ? Math.round((v.churn / v.patients) * 1000) / 10 : 0,
      spark: Array.from({ length: 14 }, (_, j) => Math.round(v.mrr / 14 + Math.sin(j + i) * 40)),
    }))
    .sort((a, b) => b.newMrr - a.newMrr);
}

export function paymentsHealth(s: AdminState, days = 30) {
  const totals = s.funnelDays.slice(-days).map((d) => d.paid);
  const failed = totals.map((v, i) => Math.max(0, Math.round(v * 0.06 + Math.sin(i * 0.7) * 2)));
  const recovered = failed.map((v) => Math.round(v * 0.62));
  return { totals, failed, recovered };
}

export function insightHeadline(s: AdminState): { title: string; detail: string; tone: "warn" | "positive" | "critical" } {
  if (s.scenario === "crisis") return { title: "Payment failures up 38% vs 3 weeks ago", detail: "Stripe timeouts spiking during renewal window. Investigate gateway health.", tone: "critical" };
  if (s.scenario === "churn") return { title: "Refill adherence on tirzepatide 3-mo dropped 12%", detail: "Cohort M2 slipping below 60%. Check side-effect reporting on day-60 check-ins.", tone: "warn" };
  if (s.scenario === "launch") return { title: "Intake starts up 41% vs prior 30 days", detail: "Meta retargeting creative is outperforming. Consider raising spend cap.", tone: "positive" };
  if (s.scenario === "empty") return { title: "No data yet — connect your first program", detail: "Once patients start intake, this dashboard fills automatically.", tone: "warn" };
  return { title: "Tirzepatide 3-month refill rate up 6.2 pts", detail: "Best-performing program this month. Expansion opportunity on 6-month tier.", tone: "positive" };
}

