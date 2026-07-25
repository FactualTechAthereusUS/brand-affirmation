import type { AdminState, Lead, LeadStatus, LeadSegment } from "./store";

export type LeadKpis = {
  total: number;
  open: number;
  hot: number;
  abandonedCheckouts30d: number;
  recoveryRate30d: number;
  avgTimeToContactHrs: number;
  recoverableRevenue: number;
};

const DAY = 86_400_000;

export function selectLeadKpis(s: Pick<AdminState, "leads">): LeadKpis {
  const leads = s.leads;
  const open = leads.filter((l) => l.status === "new" || l.status === "working" || l.status === "nurturing").length;
  const hot = leads.filter((l) => l.score >= 70 && l.status !== "won" && l.status !== "lost" && l.status !== "do_not_contact").length;
  const abandonedCheckouts30d = leads.filter(
    (l) => (l.funnelStep === "checkout" || l.funnelStep === "payment_fail" || l.funnelStep === "abandoned_cart")
      && Date.now() - l.createdAt < 30 * DAY,
  ).length;
  const contactWindow = leads.filter((l) => l.contacted && Date.now() - l.createdAt < 30 * DAY);
  const recoveryRate30d = abandonedCheckouts30d > 0
    ? Math.round((leads.filter((l) => l.status === "won" && Date.now() - l.createdAt < 30 * DAY).length / abandonedCheckouts30d) * 1000) / 10
    : 0;
  const avgTimeToContactHrs = contactWindow.length
    ? Math.round((contactWindow.reduce((sum, l) => sum + Math.max(0.1, (l.outreach[l.outreach.length - 1]?.ts ?? l.lastTouchAt) - l.createdAt), 0) / contactWindow.length) / 3_600_000 * 10) / 10
    : 0;
  const recoverableRevenue = leads
    .filter((l) => l.status !== "won" && l.status !== "lost" && l.status !== "do_not_contact")
    .reduce((sum, l) => sum + l.projectedFirstOrder, 0);
  return {
    total: leads.length,
    open,
    hot,
    abandonedCheckouts30d,
    recoveryRate30d,
    avgTimeToContactHrs,
    recoverableRevenue,
  };
}

export const STATUS_TABS: Array<{ key: LeadStatus | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "working", label: "Working" },
  { key: "nurturing", label: "Nurturing" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
  { key: "do_not_contact", label: "Do not contact" },
];

export function selectStatusCounts(s: Pick<AdminState, "leads">): Record<string, number> {
  const c: Record<string, number> = { all: s.leads.length };
  for (const t of STATUS_TABS) if (t.key !== "all") c[t.key] = 0;
  for (const l of s.leads) c[l.status] = (c[l.status] ?? 0) + 1;
  return c;
}

export const SEGMENTS: LeadSegment[] = [
  { key: "hot_24h", label: "Hot · last 24h", definition: "score ≥ 70 · age < 24h", pinned: true },
  { key: "abandoned_checkout", label: "Abandoned checkout · 30d", definition: "funnelStep in (checkout, payment_fail, abandoned_cart) · < 30d", pinned: true },
  { key: "intake_stalled", label: "Intake started · not finished", definition: "funnelStep in (intake_start, intake_mid)", pinned: true },
  { key: "payment_failed", label: "Payment failed", definition: "funnelStep = payment_fail" },
  { key: "state_eligible", label: "State-eligible only", definition: "stateEligible = true" },
  { key: "meta_paid", label: "Meta · paid", definition: "attribution.source = Meta" },
  { key: "google_paid", label: "Google · paid", definition: "attribution.source = Google" },
  { key: "dnc", label: "DNC list", definition: "status = do_not_contact" },
  { key: "won_month", label: "Won this month", definition: "status = won · < 30d" },
];

function matchSegment(l: Lead, key: string | null): boolean {
  if (!key) return true;
  switch (key) {
    case "hot_24h": return l.score >= 70 && Date.now() - l.createdAt < DAY;
    case "abandoned_checkout": return (l.funnelStep === "checkout" || l.funnelStep === "payment_fail" || l.funnelStep === "abandoned_cart") && Date.now() - l.createdAt < 30 * DAY;
    case "intake_stalled": return l.funnelStep === "intake_start" || l.funnelStep === "intake_mid";
    case "payment_failed": return l.funnelStep === "payment_fail";
    case "state_eligible": return l.stateEligible;
    case "meta_paid": return l.attribution.source === "Meta";
    case "google_paid": return l.attribution.source === "Google";
    case "dnc": return l.status === "do_not_contact";
    case "won_month": return l.status === "won" && Date.now() - l.createdAt < 30 * DAY;
    default: return true;
  }
}

export function selectSegmentCounts(s: Pick<AdminState, "leads">): Record<string, number> {
  const out: Record<string, number> = {};
  for (const seg of SEGMENTS) out[seg.key] = s.leads.filter((l) => matchSegment(l, seg.key)).length;
  return out;
}

export type LeadListParams = {
  statusTab: LeadStatus | "all";
  segment: string | null;
  search: string;
  sort: { key: string; dir: "asc" | "desc" };
  page: number;
  pageSize: number;
};

export function selectLeads(s: Pick<AdminState, "leads">, p: LeadListParams) {
  const q = p.search.trim().toLowerCase();
  let rows = s.leads.filter((l) => {
    if (p.statusTab !== "all" && l.status !== p.statusTab) return false;
    if (!matchSegment(l, p.segment)) return false;
    if (q) {
      const hay = `${l.name} ${l.email} ${l.phone} ${l.state} ${l.program} ${l.attribution.source} ${l.attribution.campaign}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const dir = p.sort.dir === "asc" ? 1 : -1;
  rows = [...rows].sort((a, b) => {
    const k = p.sort.key as keyof Lead;
    const av = (a as any)[k];
    const bv = (b as any)[k];
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
    return String(av ?? "").localeCompare(String(bv ?? "")) * dir;
  });

  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / p.pageSize));
  const page = Math.min(Math.max(1, p.page), pageCount);
  const start = (page - 1) * p.pageSize;
  return { rows: rows.slice(start, start + p.pageSize), total, pageCount };
}

export const FUNNEL_STEPS: Array<{ key: Lead["funnelStep"]; label: string }> = [
  { key: "landing", label: "Landing" },
  { key: "intake_start", label: "Intake start" },
  { key: "intake_mid", label: "Intake mid" },
  { key: "intake_complete", label: "Intake complete" },
  { key: "checkout", label: "Checkout" },
  { key: "payment_fail", label: "Payment" },
];

export function scoreBreakdown(l: Lead) {
  const funnel = Math.round(l.progressPct * 0.55);
  const ageHrs = (Date.now() - l.createdAt) / 3_600_000;
  const recency = ageHrs < 12 ? 25 : ageHrs < 36 ? 15 : ageHrs < 72 ? 6 : 0;
  const channel = l.attribution.source === "Google" ? 12 : l.attribution.source === "Meta" ? 10 : l.attribution.source === "Referral" ? 15 : l.attribution.source === "Klaviyo" ? 8 : 4;
  const engagement = Math.min(20, l.outreach.filter((o) => o.outcome.includes("replied") || o.outcome.includes("connected")).length * 8 + l.intakeSnapshot.length);
  return [
    { label: "Funnel depth", value: funnel, max: 55, tone: "indigo" as const },
    { label: "Recency", value: recency, max: 25, tone: "violet" as const },
    { label: "Channel quality", value: channel, max: 15, tone: "sky" as const },
    { label: "Engagement", value: engagement, max: 20, tone: "emerald" as const },
  ];
}
