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
  return s.funnelDays.slice(-days).map((d) => d.revenue);
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
