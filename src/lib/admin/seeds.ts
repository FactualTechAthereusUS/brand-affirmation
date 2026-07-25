/**
 * Blissley Admin — seed data for V1 (physicians, pharmacies, cases, check-ins,
 * notifications, integrations, campaigns). Consumed by store.ts::seed().
 */
import type {
  Physician, Pharmacy, PhysicianCase, CheckIn, Notification, Integration,
  Campaign, FunnelDay,
} from "./store";

const now = Date.now();
const HR = 3600_000;
const DAY = 86400_000;

export const PHYSICIANS: Physician[] = [
  { id: "phy_nass",      name: "Dr. Sara Nass",       avatar: "SN", casesReviewed: 412, avgResponseHrs: 4.2, denialRate: 8.1 },
  { id: "phy_suppa",     name: "Dr. Michael Suppa",   avatar: "MS", casesReviewed: 287, avgResponseHrs: 5.6, denialRate: 6.4 },
  { id: "phy_chu",       name: "Dr. Elaine Chu",      avatar: "EC", casesReviewed: 198, avgResponseHrs: 3.8, denialRate: 11.2 },
  { id: "phy_patterson", name: "Dr. Owen Patterson",  avatar: "OP", casesReviewed: 156, avgResponseHrs: 6.1, denialRate: 9.0 },
];

export const PHARMACIES: Pharmacy[] = [
  { id: "phar_southend", name: "South End Compounding", role: "primary", apiStatus: "connected", queue: 42, avgPrepHrs: 26, onTimeRate: 96.4, drugs: ["Tirzepatide", "Semaglutide"] },
  { id: "phar_wellsrx",  name: "Wells Rx",              role: "backup",  apiStatus: "connected", queue: 18, avgPrepHrs: 34, onTimeRate: 92.1, drugs: ["Tirzepatide"] },
  { id: "phar_epiq",     name: "EpiqScripts",           role: "primary", apiStatus: "connected", queue: 24, avgPrepHrs: 20, onTimeRate: 94.8, drugs: ["Oral GLP"] },
  { id: "phar_strive",   name: "Strive Rx",             role: "backup",  apiStatus: "degraded",  queue: 11, avgPrepHrs: 41, onTimeRate: 88.3, drugs: ["Semaglutide"] },
  { id: "phar_truemeds", name: "Truemeds Rx",           role: "backup",  apiStatus: "connected", queue: 7,  avgPrepHrs: 30, onTimeRate: 91.6, drugs: ["Tirzepatide"] },
];

export const CASES: PhysicianCase[] = [
  { id: "case_5001", patientId: "pt_1005", patientName: "Priya Nair",       product: "Tirzepatide 2.5mg", submittedAt: now - 2*HR,  slaHrs: 24, priority: "urgent", flags: ["Titration Q1"],          assignedTo: "phy_nass",       status: "new" },
  { id: "case_5002", patientId: "pt_1012", patientName: "Yuki Tanaka",      product: "Semaglutide 0.25mg", submittedAt: now - 4*HR,  slaHrs: 24, priority: "urgent", flags: ["Family Hx MTC"],         assignedTo: "phy_nass",       status: "flagged" },
  { id: "case_5003", patientId: "pt_1018", patientName: "Idris Mehta",      product: "Tirzepatide 5mg",    submittedAt: now - 6*HR,  slaHrs: 24, priority: "normal", flags: [],                        assignedTo: "phy_suppa",      status: "new" },
  { id: "case_5004", patientId: "pt_1024", patientName: "Marcus Bell",      product: "Tirzepatide 7.5mg",  submittedAt: now - 8*HR,  slaHrs: 24, priority: "normal", flags: ["Dose increase"],         assignedTo: "phy_chu",        status: "awaitingReply" },
  { id: "case_5005", patientId: "pt_1029", patientName: "Chloé Martel",     product: "Semaglutide 0.5mg",  submittedAt: now - 12*HR, slaHrs: 24, priority: "urgent", flags: ["BP elevated"],           assignedTo: "phy_nass",       status: "flagged" },
  { id: "case_5006", patientId: "pt_1033", patientName: "Henrik Solberg",   product: "Tirzepatide 10mg",   submittedAt: now - 14*HR, slaHrs: 24, priority: "normal", flags: [],                        assignedTo: "phy_patterson",  status: "new" },
  { id: "case_5007", patientId: "pt_1038", patientName: "Amara Diallo",     product: "Semaglutide 1mg",    submittedAt: now - 16*HR, slaHrs: 24, priority: "normal", flags: ["Nausea Wk 3"],           assignedTo: "phy_suppa",      status: "awaitingReply" },
  { id: "case_5008", patientId: "pt_1002", patientName: "Michael Thompson", product: "Tirzepatide 5mg",    submittedAt: now - 18*HR, slaHrs: 24, priority: "normal", flags: ["Refill"],                assignedTo: "phy_nass",       status: "refill" },
  { id: "case_5009", patientId: "pt_1007", patientName: "Hannah Cole",      product: "Semaglutide 0.25mg", submittedAt: now - 22*HR, slaHrs: 24, priority: "normal", flags: [],                        assignedTo: "phy_chu",        status: "new" },
  { id: "case_5010", patientId: "pt_1014", patientName: "Lena Petrov",      product: "Tirzepatide 2.5mg",  submittedAt: now - 26*HR, slaHrs: 24, priority: "urgent", flags: ["SLA breach"],            assignedTo: "phy_nass",       status: "flagged" },
];

export const CHECK_INS: CheckIn[] = [
  { id: "ci_1", patientId: "pt_1002", patientName: "Michael Thompson", day: 88, submittedAt: now - 6*HR, weight: 214.2, delta: -12.8, sideEffects: ["Mild nausea"], decision: "clear" },
  { id: "ci_2", patientId: "pt_1005", patientName: "Priya Nair",       day: 30, submittedAt: now - 24*HR, weight: 178.5, delta: -3.2, sideEffects: [], decision: "clear" },
  { id: "ci_3", patientId: "pt_1007", patientName: "Hannah Cole",      day: 92, sideEffects: [], decision: "hold" },
  { id: "ci_4", patientId: "pt_1010", patientName: "Eleanor Whitfield", day: 90, submittedAt: now - 12*HR, weight: 165.0, delta: -8.4, sideEffects: [], decision: "clear" },
  { id: "ci_5", patientId: "pt_1012", patientName: "Yuki Tanaka",      day: 96, sideEffects: [], decision: "hold" },
  { id: "ci_6", patientId: "pt_1018", patientName: "Idris Mehta",      day: 89, submittedAt: now - 3*HR, weight: 201.7, delta: -5.9, sideEffects: ["Fatigue"], decision: "review" },
  { id: "ci_7", patientId: "pt_1020", patientName: "Robert Kim",       day: 85, sideEffects: [], decision: "hold" },
  { id: "ci_8", patientId: "pt_1024", patientName: "Marcus Bell",      day: 91, submittedAt: now - 48*HR, weight: 189.3, delta: -14.2, sideEffects: [], decision: "clear" },
];

export const NOTIFICATIONS: Notification[] = [
  { id: "n_1", ts: now - 12*60_000, tone: "critical", title: "3 failed payments",       detail: "Card declined on renewal in last 24h",         deepLink: "/admin/payments?tab=failed",       unread: true },
  { id: "n_2", ts: now - 24*60_000, tone: "critical", title: "Yuki Tanaka — MTC flag",  detail: "Case flagged: family Hx MTC",                  deepLink: "/admin/physician-queue?tab=flagged", unread: true },
  { id: "n_3", ts: now - 42*60_000, tone: "warn",     title: "Order shipping delayed",   detail: "Strive Rx running 41h avg prep (SLA 30h)",     deepLink: "/admin/pharmacy",                  unread: true },
  { id: "n_4", ts: now - 1*HR,      tone: "warn",     title: "2 check-ins overdue",      detail: "Rx on hold — Day 96, 92",                      deepLink: "/admin/check-ins?tab=overdue",     unread: true },
  { id: "n_5", ts: now - 3*HR,      tone: "info",     title: "1 refund requested",       detail: "Robert Kim — $299 last order",                 deepLink: "/admin/payments?tab=refunds",      unread: false },
  { id: "n_6", ts: now - 5*HR,      tone: "success",  title: "Meta ads campaign live",   detail: "Week 30 creative — $2.1k daily spend",         deepLink: "/admin/analytics/acquisition",     unread: false },
];

export const INTEGRATIONS: Integration[] = [
  // Critical
  { id: "int_stripe",   name: "Stripe",           category: "Critical",   status: "connected", lastSync: now - 4*60_000  },
  { id: "int_southend", name: "South End Rx",     category: "Critical",   status: "connected", lastSync: now - 12*60_000 },
  { id: "int_lifefile", name: "LifeFile EHR",     category: "Critical",   status: "connected", lastSync: now - 18*60_000 },
  { id: "int_drtelx",   name: "Dr. Telx",         category: "Critical",   status: "connected", lastSync: now - 22*60_000 },
  // Clinical backup
  { id: "int_wellsrx",  name: "Wells Rx",         category: "Clinical",   status: "connected", lastSync: now - 34*60_000 },
  { id: "int_epiq",     name: "EpiqScripts",      category: "Clinical",   status: "connected", lastSync: now - 42*60_000 },
  { id: "int_strive",   name: "Strive Rx",        category: "Clinical",   status: "degraded",  lastSync: now - 4*HR, lastError: "API 502 · 12m ago" },
  // Analytics
  { id: "int_klaviyo",  name: "Klaviyo",          category: "Analytics",  status: "connected", lastSync: now - 8*60_000  },
  { id: "int_meta",     name: "Meta Ads",         category: "Analytics",  status: "connected", lastSync: now - 6*60_000  },
  { id: "int_ga",       name: "Google Analytics", category: "Analytics",  status: "connected", lastSync: now - 14*60_000 },
  { id: "int_capi",     name: "Meta CAPI",        category: "Analytics",  status: "connected", lastSync: now - 26*60_000 },
  // Banking
  { id: "int_mercury",  name: "Mercury",          category: "Banking",    status: "connected", lastSync: now - 32*60_000 },
];

export const CAMPAIGNS: Campaign[] = [
  { id: "cmp_1", name: "Meta · WL Broad · Wk30",   channel: "Meta",    spend: 12480, roas: 4.6, cac: 92, leads: 428, purchases: 136 },
  { id: "cmp_2", name: "Meta · Retargeting",        channel: "Meta",    spend: 4210,  roas: 6.1, cac: 61, leads: 168, purchases: 69  },
  { id: "cmp_3", name: "Google · Brand",            channel: "Google",  spend: 3860,  roas: 8.4, cac: 44, leads: 218, purchases: 88  },
  { id: "cmp_4", name: "Google · Non-Brand",        channel: "Google",  spend: 7120,  roas: 3.2, cac: 118, leads: 342, purchases: 60 },
  { id: "cmp_5", name: "Newsletter · Weekly",       channel: "Email",   spend: 0,     roas: 22.4, cac: 8,  leads: 88,  purchases: 42 },
  { id: "cmp_6", name: "Affiliate · GLP creators",  channel: "Affiliate", spend: 2200, roas: 5.4, cac: 88, leads: 96, purchases: 25 },
];

// 90 funnel days for MRR/traffic time series
export function generateFunnelDays(): FunnelDay[] {
  const days: FunnelDay[] = [];
  for (let i = 89; i >= 0; i--) {
    const t = now - i*DAY;
    const wobble = (Math.sin(i * 0.4) + 1) / 2; // 0..1
    const base = 380 + i * 2.6;
    days.push({
      ts: t,
      sessions: Math.round(base * 8 + wobble * 300),
      intakeStarted: Math.round(base * 3.2 + wobble * 120),
      intakeCompleted: Math.round(base * 2.4 + wobble * 90),
      approved: Math.round(base * 1.9 + wobble * 70),
      paid: Math.round(base * 1.5 + wobble * 55),
      shipped: Math.round(base * 1.35 + wobble * 45),
      revenue: Math.round((base * 1.5 + wobble * 55) * 249 + Math.sin(i) * 4200),
      newMrr: Math.round(1200 + wobble * 900),
      churnedMrr: Math.round(-200 - wobble * 320),
    });
  }
  return days;
}
