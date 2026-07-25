/**
 * Blissley Admin — seed data for V1 (physicians, pharmacies, cases, check-ins,
 * notifications, integrations, campaigns). Consumed by store.ts::seed().
 */
import type {
  Physician, Pharmacy, PhysicianCase, CheckIn, Notification, Integration,
  Campaign, FunnelDay,
} from "./store";
import logoStripe from "@/assets/logo-stripe.png.asset.json";
import logoPaddle from "@/assets/logo-paddle.png.asset.json";
import logoKlarna from "@/assets/logo-klarna.png.asset.json";
import logoAffirm from "@/assets/logo-affirm.png.asset.json";
import logoDoseSpot from "@/assets/logo-dosespot.png.asset.json";
import logoMeta from "@/assets/logo-meta.png.asset.json";
import logoGoogleAds from "@/assets/logo-google-ads.png.asset.json";
import logoGoogleAnalytics from "@/assets/logo-google-analytics.png.asset.json";
import logoTikTokAds from "@/assets/logo-tiktok-ads.png.asset.json";
import logoUps from "@/assets/logo-ups.png.asset.json";

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

/* ────────── Integrations catalog ────────── */

const SCOPES_READWRITE = [
  { key: "read", label: "Read your account data", required: true },
  { key: "write", label: "Create and update records on your behalf", required: true },
  { key: "events", label: "Receive webhook events", required: false },
];

const SCOPES_READONLY = [
  { key: "read", label: "Read your account data", required: true },
  { key: "events", label: "Receive webhook events", required: false },
];

function history(...entries: Array<[number, string, "ok" | "warn" | "error", string?]>) {
  return entries.map(([ts, event, status, detail]) => ({ ts, event, status, detail }));
}

const CONNECTED = (offset: number) => now - offset;

export const INTEGRATIONS: Integration[] = [
  // ── Payments ──────────────────────────────────────────────
  {
    id: "int_stripe", name: "Stripe", category: "Payments", status: "connected",
    lastSync: now - 4*60_000, connectedAt: now - 42*DAY,
    description: "Process card payments, subscriptions, and refunds.",
    docsUrl: "https://stripe.com/docs",
    brand: { color: "#635bff", mono: "S", logoUrl: logoStripe.url },
    scopes: SCOPES_READWRITE,
    configSchema: [
      { key: "pk", label: "Publishable key", type: "text", required: true, placeholder: "pk_live_..." },
      { key: "sk", label: "Secret key", type: "secret", required: true, placeholder: "sk_live_..." },
      { key: "whsec", label: "Webhook signing secret", type: "secret", required: true, placeholder: "whsec_..." },
      { key: "descriptor", label: "Statement descriptor", type: "text", placeholder: "BLISSLEY" },
      { key: "currency", label: "Default currency", type: "select", options: ["USD","EUR","GBP","CAD"] },
    ],
    config: { pk: "pk_live_51H••••••eL", sk: "sk_live_••••••3f2c", whsec: "whsec_••••••a1", descriptor: "BLISSLEY", currency: "USD" },
    webhookEvents: [
      { key: "charge.succeeded", label: "Charge succeeded", enabled: true },
      { key: "charge.failed", label: "Charge failed", enabled: true },
      { key: "customer.subscription.deleted", label: "Subscription canceled", enabled: true },
      { key: "invoice.payment_failed", label: "Invoice payment failed", enabled: true },
      { key: "customer.updated", label: "Customer updated", enabled: false },
    ],
    syncHistory: history(
      [now - 4*60_000, "Charge succeeded · $299.00", "ok", "pi_3PjHqk··"],
      [now - 18*60_000, "Charge succeeded · $249.00", "ok"],
      [now - 42*60_000, "Charge failed · card_declined", "warn", "Retry scheduled"],
      [now - 3*HR, "Webhook delivered", "ok"],
      [now - DAY, "Daily reconciliation", "ok"],
    ),
  },
  { id: "int_paddle", name: "Paddle", category: "Payments", status: "disconnected",
    lastSync: 0, description: "Merchant-of-record billing with tax + compliance handled.",
    docsUrl: "https://developer.paddle.com", brand: { color: "#FFDD35", mono: "P", logoUrl: logoPaddle.url },
    scopes: SCOPES_READWRITE,
    configSchema: [
      { key: "vendor_id", label: "Vendor ID", type: "text", required: true },
      { key: "api_key", label: "API key", type: "secret", required: true },
      { key: "environment", label: "Environment", type: "select", options: ["sandbox","live"], required: true },
    ],
    config: {}, webhookEvents: [], syncHistory: [],
  },
  { id: "int_affirm", name: "Affirm", category: "Payments", status: "disconnected",
    lastSync: 0, description: "Buy-now-pay-later for eligible carts $150+.",
    docsUrl: "https://docs.affirm.com", brand: { color: "#0FA0EA", mono: "A", logoUrl: logoAffirm.url },
    scopes: SCOPES_READONLY,
    configSchema: [
      { key: "public_key", label: "Public API key", type: "text", required: true },
      { key: "private_key", label: "Private API key", type: "secret", required: true },
    ],
    config: {}, webhookEvents: [], syncHistory: [],
  },
  { id: "int_klarna", name: "Klarna", category: "Payments", status: "disconnected",
    lastSync: 0, description: "Pay in 4 installments at checkout.",
    docsUrl: "https://docs.klarna.com", brand: { color: "#FFA8CD", mono: "K", logoUrl: logoKlarna.url },
    scopes: SCOPES_READONLY,
    configSchema: [
      { key: "username", label: "API username", type: "text", required: true },
      { key: "password", label: "API password", type: "secret", required: true },
      { key: "region", label: "Region", type: "select", options: ["NA","EU","OC"], required: true },
    ],
    config: {}, webhookEvents: [], syncHistory: [],
  },

  // ── Pharmacies ────────────────────────────────────────────
  { id: "int_southend", name: "South End Rx", category: "Pharmacies", status: "connected",
    lastSync: now - 12*60_000, connectedAt: now - 90*DAY,
    description: "Primary compounding pharmacy — tirzepatide + semaglutide.",
    docsUrl: "https://southendrx.example", brand: { color: "#2563eb", mono: "S" },
    scopes: SCOPES_READWRITE,
    configSchema: [
      { key: "api_url", label: "API base URL", type: "url", required: true },
      { key: "api_key", label: "API key", type: "secret", required: true },
      { key: "account_id", label: "Account ID", type: "text", required: true },
      { key: "fallback", label: "Enable fallback routing", type: "toggle" },
    ],
    config: { api_url: "https://api.southendrx.com/v2", api_key: "se_live_••••8f", account_id: "BLS-4421", fallback: true },
    webhookEvents: [
      { key: "rx.received", label: "Rx received", enabled: true },
      { key: "rx.prepared", label: "Rx prepared", enabled: true },
      { key: "rx.shipped", label: "Rx shipped", enabled: true },
      { key: "rx.error", label: "Rx error", enabled: true },
    ],
    syncHistory: history(
      [now - 12*60_000, "Rx prepared · #RX-2841", "ok"],
      [now - 55*60_000, "Rx shipped · UPS 1Z999AA10123456784", "ok"],
      [now - 2*HR, "Rx received · #RX-2842", "ok"],
    ),
  },
  { id: "int_wellsrx", name: "Wells Rx", category: "Pharmacies", status: "connected",
    lastSync: now - 34*60_000, connectedAt: now - 60*DAY,
    description: "Backup pharmacy — tirzepatide overflow.",
    docsUrl: "https://wellsrx.example", brand: { color: "#0ea5e9", mono: "W" },
    scopes: SCOPES_READWRITE,
    configSchema: [
      { key: "api_url", label: "API base URL", type: "url", required: true },
      { key: "api_key", label: "API key", type: "secret", required: true },
    ],
    config: { api_url: "https://api.wellsrx.com", api_key: "wr_live_••••a2" },
    webhookEvents: [
      { key: "rx.received", label: "Rx received", enabled: true },
      { key: "rx.shipped", label: "Rx shipped", enabled: true },
    ],
    syncHistory: history([now - 34*60_000, "Rx received", "ok"]),
  },
  { id: "int_epiq", name: "EpiqScripts", category: "Pharmacies", status: "connected",
    lastSync: now - 42*60_000, connectedAt: now - 45*DAY,
    description: "Oral GLP formulations and specialty compounds.",
    docsUrl: "https://epiqscripts.example", brand: { color: "#7c3aed", mono: "E" },
    scopes: SCOPES_READWRITE,
    configSchema: [
      { key: "api_key", label: "API key", type: "secret", required: true },
      { key: "location_id", label: "Location ID", type: "text", required: true },
    ],
    config: { api_key: "epq_••••4c", location_id: "EPQ-BOS-01" },
    webhookEvents: [{ key: "rx.shipped", label: "Rx shipped", enabled: true }],
    syncHistory: history([now - 42*60_000, "Manual sync", "ok"]),
  },
  { id: "int_strive", name: "Strive Rx", category: "Pharmacies", status: "degraded",
    lastSync: now - 4*HR, lastError: "API 502 · 12m ago", connectedAt: now - 30*DAY,
    description: "Secondary semaglutide compounding.",
    docsUrl: "https://striverx.example", brand: { color: "#f59e0b", mono: "S" },
    scopes: SCOPES_READWRITE,
    configSchema: [
      { key: "api_key", label: "API key", type: "secret", required: true },
    ],
    config: { api_key: "sv_••••9d" },
    webhookEvents: [{ key: "rx.shipped", label: "Rx shipped", enabled: true }],
    syncHistory: history(
      [now - 4*HR, "Sync failed", "error", "HTTP 502 Bad Gateway"],
      [now - 8*HR, "Sync failed", "warn", "Retry succeeded on 2nd attempt"],
    ),
  },
  { id: "int_empower", name: "Empower Pharmacy", category: "Pharmacies", status: "disconnected",
    lastSync: 0, description: "503B outsourcing facility for sterile injectables.",
    docsUrl: "https://empowerpharmacy.com", brand: { color: "#10b981", mono: "E" },
    scopes: SCOPES_READWRITE,
    configSchema: [
      { key: "api_key", label: "API key", type: "secret", required: true },
      { key: "account_id", label: "Account ID", type: "text", required: true },
    ],
    config: {}, webhookEvents: [], syncHistory: [],
  },

  // ── Clinical / EHR ────────────────────────────────────────
  { id: "int_lifefile", name: "LifeFile EHR", category: "Clinical", status: "connected",
    lastSync: now - 18*60_000, connectedAt: now - 120*DAY,
    description: "Patient charts, e-signatures, HIPAA audit trail.",
    docsUrl: "https://lifefile.example", brand: { color: "#059669", mono: "L" },
    scopes: SCOPES_READWRITE,
    configSchema: [
      { key: "base_url", label: "Base URL", type: "url", required: true },
      { key: "client_id", label: "Client ID", type: "text", required: true },
      { key: "client_secret", label: "Client secret", type: "secret", required: true },
      { key: "sync_interval", label: "Sync interval", type: "select", options: ["5m","15m","1h","6h"], required: true },
    ],
    config: { base_url: "https://api.lifefile.io/v3", client_id: "blis_prod", client_secret: "••••••", sync_interval: "15m" },
    webhookEvents: [
      { key: "chart.updated", label: "Chart updated", enabled: true },
      { key: "signature.captured", label: "E-signature captured", enabled: true },
    ],
    syncHistory: history([now - 18*60_000, "Chart sync (42 records)", "ok"]),
  },
  { id: "int_drtelx", name: "Dr. Telx", category: "Clinical", status: "connected",
    lastSync: now - 22*60_000, connectedAt: now - 75*DAY,
    description: "Async physician marketplace + case routing.",
    docsUrl: "https://drtelx.example", brand: { color: "#0891b2", mono: "T" },
    scopes: SCOPES_READWRITE,
    configSchema: [
      { key: "api_key", label: "API key", type: "secret", required: true },
      { key: "org_id", label: "Organization ID", type: "text", required: true },
    ],
    config: { api_key: "dtx_••••2a", org_id: "org_blis" },
    webhookEvents: [
      { key: "case.assigned", label: "Case assigned", enabled: true },
      { key: "case.reviewed", label: "Case reviewed", enabled: true },
    ],
    syncHistory: history([now - 22*60_000, "Case reviewed · case_5008", "ok"]),
  },
  { id: "int_dosespot", name: "DoseSpot", category: "Clinical", status: "disconnected",
    lastSync: 0, description: "E-prescribing across all 50 states with EPCS.",
    docsUrl: "https://dosespot.com", brand: { color: "#0F6FB8", mono: "D", logoUrl: logoDoseSpot.url },
    scopes: SCOPES_READWRITE,
    configSchema: [
      { key: "clinic_id", label: "Clinic ID", type: "text", required: true },
      { key: "api_key", label: "API key", type: "secret", required: true },
      { key: "environment", label: "Environment", type: "select", options: ["staging","production"], required: true },
    ],
    config: {}, webhookEvents: [], syncHistory: [],
  },
  { id: "int_photon", name: "Photon Health", category: "Clinical", status: "disconnected",
    lastSync: 0, description: "Rx orchestration and patient-choice pharmacy routing.",
    docsUrl: "https://photon.health", brand: { color: "#8b5cf6", mono: "P" },
    scopes: SCOPES_READWRITE,
    configSchema: [
      { key: "client_id", label: "Client ID", type: "text", required: true },
      { key: "client_secret", label: "Client secret", type: "secret", required: true },
    ],
    config: {}, webhookEvents: [], syncHistory: [],
  },

  // ── Marketing ─────────────────────────────────────────────
  { id: "int_meta_ads", name: "Meta Ads", category: "Marketing", status: "connected",
    lastSync: now - 6*60_000, connectedAt: now - 30*DAY,
    description: "Facebook & Instagram campaigns, audiences, and conversions.",
    docsUrl: "https://developers.facebook.com/docs/marketing-apis",
    brand: { color: "#1877F2", mono: "M", logoUrl: logoMeta.url },
    scopes: [
      { key: "ads_read", label: "Read your ads and campaigns", required: true },
      { key: "ads_management", label: "Create and edit campaigns", required: true },
      { key: "business_management", label: "Manage business assets", required: false },
    ],
    configSchema: [
      { key: "ad_account_id", label: "Ad account ID", type: "text", required: true, placeholder: "act_1234567890" },
      { key: "access_token", label: "Access token", type: "secret", required: true },
    ],
    config: { ad_account_id: "act_192837", access_token: "EAAB••••" },
    webhookEvents: [
      { key: "campaign.updated", label: "Campaign updated", enabled: true },
      { key: "lead.received", label: "Lead form submission", enabled: true },
    ],
    syncHistory: history([now - 6*60_000, "Spend sync · $2,140 today", "ok"]),
  },
  { id: "int_google_ads", name: "Google Ads", category: "Marketing", status: "disconnected",
    lastSync: 0, description: "Search, Performance Max, and YouTube campaigns.",
    docsUrl: "https://developers.google.com/google-ads", brand: { color: "#4285F4", mono: "G", logoUrl: logoGoogleAds.url },
    scopes: [
      { key: "adwords", label: "Manage your AdWords campaigns", required: true },
    ],
    configSchema: [
      { key: "customer_id", label: "Customer ID", type: "text", required: true, placeholder: "123-456-7890" },
      { key: "developer_token", label: "Developer token", type: "secret", required: true },
    ],
    config: {}, webhookEvents: [], syncHistory: [],
  },
  { id: "int_tiktok", name: "TikTok Ads", category: "Marketing", status: "disconnected",
    lastSync: 0, description: "Spark ads, Events API, and conversion campaigns.",
    docsUrl: "https://business-api.tiktok.com", brand: { color: "#000000", mono: "T", logoUrl: logoTikTokAds.url },
    scopes: SCOPES_READWRITE,
    configSchema: [
      { key: "advertiser_id", label: "Advertiser ID", type: "text", required: true },
      { key: "access_token", label: "Access token", type: "secret", required: true },
    ],
    config: {}, webhookEvents: [], syncHistory: [],
  },

  // ── Analytics ─────────────────────────────────────────────
  { id: "int_meta_pixel", name: "Meta Pixel / CAPI", category: "Analytics", status: "connected",
    lastSync: now - 8*60_000, connectedAt: now - 60*DAY,
    description: "Server-side conversion API + browser pixel for iOS attribution.",
    docsUrl: "https://developers.facebook.com/docs/marketing-api/conversions-api",
    brand: { color: "#1877F2", mono: "P", logoUrl: logoMeta.url },
    scopes: [{ key: "capi", label: "Send conversion events server-side", required: true }],
    configSchema: [
      { key: "pixel_id", label: "Pixel ID", type: "text", required: true },
      { key: "capi_token", label: "CAPI access token", type: "secret", required: true },
      { key: "test_code", label: "Test event code", type: "text" },
      { key: "advanced_matching", label: "Automatic advanced matching", type: "toggle" },
    ],
    config: { pixel_id: "492034829384", capi_token: "EAAF••••", test_code: "TEST12345", advanced_matching: true },
    webhookEvents: [],
    syncHistory: history([now - 8*60_000, "42 events dispatched", "ok"]),
  },
  { id: "int_ga4", name: "Google Analytics 4", category: "Analytics", status: "connected",
    lastSync: now - 14*60_000, connectedAt: now - 90*DAY,
    description: "First-party analytics, funnels, and audiences.",
    docsUrl: "https://developers.google.com/analytics",
    brand: { color: "#F9AB00", mono: "G", logoUrl: logoGoogleAnalytics.url },
    scopes: [{ key: "analytics.read", label: "Read Analytics data", required: true }],
    configSchema: [
      { key: "measurement_id", label: "Measurement ID", type: "text", required: true, placeholder: "G-XXXXXXXX" },
      { key: "api_secret", label: "API secret", type: "secret", required: true },
    ],
    config: { measurement_id: "G-B2XZ8K9LMN", api_secret: "gA1••••" },
    webhookEvents: [],
    syncHistory: history([now - 14*60_000, "Reporting sync", "ok"]),
  },
  { id: "int_posthog", name: "PostHog", category: "Analytics", status: "disconnected",
    lastSync: 0, description: "Product analytics, session replay, and feature flags.",
    docsUrl: "https://posthog.com/docs", brand: { color: "#F54E00", mono: "P" },
    scopes: SCOPES_READWRITE,
    configSchema: [
      { key: "project_api_key", label: "Project API key", type: "text", required: true },
      { key: "personal_api_key", label: "Personal API key", type: "secret" },
      { key: "host", label: "Host", type: "select", options: ["https://us.posthog.com","https://eu.posthog.com"], required: true },
    ],
    config: {}, webhookEvents: [], syncHistory: [],
  },
  { id: "int_segment", name: "Segment", category: "Analytics", status: "disconnected",
    lastSync: 0, description: "Customer data pipeline to 300+ destinations.",
    docsUrl: "https://segment.com/docs", brand: { color: "#52BD95", mono: "S" },
    scopes: SCOPES_READONLY,
    configSchema: [
      { key: "write_key", label: "Write key", type: "secret", required: true },
      { key: "source_id", label: "Source ID", type: "text", required: true },
    ],
    config: {}, webhookEvents: [], syncHistory: [],
  },

  // ── Email / SMS ───────────────────────────────────────────
  { id: "int_klaviyo", name: "Klaviyo", category: "Email/SMS", status: "connected",
    lastSync: now - 8*60_000, connectedAt: now - 55*DAY,
    description: "Email + SMS lifecycle flows and segmentation.",
    docsUrl: "https://developers.klaviyo.com", brand: { color: "#000000", mono: "K" },
    scopes: SCOPES_READWRITE,
    configSchema: [
      { key: "private_key", label: "Private API key", type: "secret", required: true },
      { key: "public_key", label: "Public API key", type: "text", required: true },
      { key: "default_list", label: "Default list ID", type: "text" },
      { key: "double_opt_in", label: "Require double opt-in", type: "toggle" },
    ],
    config: { private_key: "pk_••••7f", public_key: "XyZ123", default_list: "Vk3n2H", double_opt_in: true },
    webhookEvents: [
      { key: "profile.subscribed", label: "Profile subscribed", enabled: true },
      { key: "profile.unsubscribed", label: "Profile unsubscribed", enabled: true },
    ],
    syncHistory: history([now - 8*60_000, "Flow 'Cart abandon' triggered · 18 profiles", "ok"]),
  },
  { id: "int_postmark", name: "Postmark", category: "Email/SMS", status: "disconnected",
    lastSync: 0, description: "Transactional email with delivery-focused reliability.",
    docsUrl: "https://postmarkapp.com/developer", brand: { color: "#FFDE38", mono: "P" },
    scopes: SCOPES_READWRITE,
    configSchema: [
      { key: "server_token", label: "Server token", type: "secret", required: true },
      { key: "from_email", label: "Default from address", type: "text", required: true },
    ],
    config: {}, webhookEvents: [], syncHistory: [],
  },
  { id: "int_twilio", name: "Twilio SMS", category: "Email/SMS", status: "disconnected",
    lastSync: 0, description: "Programmable SMS, MMS, and phone verification.",
    docsUrl: "https://twilio.com/docs", brand: { color: "#F22F46", mono: "T" },
    scopes: SCOPES_READWRITE,
    configSchema: [
      { key: "account_sid", label: "Account SID", type: "text", required: true },
      { key: "auth_token", label: "Auth token", type: "secret", required: true },
      { key: "from_number", label: "From number", type: "text", required: true, placeholder: "+15551234567" },
      { key: "messaging_service_sid", label: "Messaging Service SID", type: "text" },
    ],
    config: {}, webhookEvents: [], syncHistory: [],
  },
  { id: "int_sendgrid", name: "SendGrid", category: "Email/SMS", status: "disconnected",
    lastSync: 0, description: "High-volume email with template management.",
    docsUrl: "https://docs.sendgrid.com", brand: { color: "#1A82E2", mono: "S" },
    scopes: SCOPES_READWRITE,
    configSchema: [
      { key: "api_key", label: "API key", type: "secret", required: true },
      { key: "from_email", label: "Verified sender", type: "text", required: true },
    ],
    config: {}, webhookEvents: [], syncHistory: [],
  },

  // ── Shipping ──────────────────────────────────────────────
  { id: "int_shipstation", name: "ShipStation", category: "Shipping", status: "disconnected",
    lastSync: 0, description: "Multi-carrier label buying and tracking.",
    docsUrl: "https://www.shipstation.com/docs", brand: { color: "#F58220", mono: "S" },
    scopes: SCOPES_READWRITE,
    configSchema: [
      { key: "api_key", label: "API key", type: "text", required: true },
      { key: "api_secret", label: "API secret", type: "secret", required: true },
      { key: "store_id", label: "Store ID", type: "text", required: true },
    ],
    config: {}, webhookEvents: [], syncHistory: [],
  },
  { id: "int_easypost", name: "EasyPost", category: "Shipping", status: "disconnected",
    lastSync: 0, description: "Rate shopping and label printing across USPS/UPS/FedEx/DHL.",
    docsUrl: "https://easypost.com/docs", brand: { color: "#164DFB", mono: "E" },
    scopes: SCOPES_READWRITE,
    configSchema: [
      { key: "api_key", label: "API key", type: "secret", required: true },
    ],
    config: {}, webhookEvents: [], syncHistory: [],
  },
  { id: "int_ups", name: "UPS", category: "Shipping", status: "disconnected",
    lastSync: 0, description: "Direct UPS shipping account for cold-chain routing.",
    docsUrl: "https://www.ups.com/developer", brand: { color: "#5F3B1A", mono: "U", logoUrl: logoUps.url },
    scopes: SCOPES_READONLY,
    configSchema: [
      { key: "account_number", label: "Account number", type: "text", required: true },
      { key: "access_key", label: "Access key", type: "secret", required: true },
    ],
    config: {}, webhookEvents: [], syncHistory: [],
  },
  { id: "int_fedex", name: "FedEx", category: "Shipping", status: "disconnected",
    lastSync: 0, description: "Direct FedEx account for expedited overnight.",
    docsUrl: "https://developer.fedex.com", brand: { color: "#4D148C", mono: "F" },
    scopes: SCOPES_READONLY,
    configSchema: [
      { key: "account_number", label: "Account number", type: "text", required: true },
      { key: "api_key", label: "API key", type: "secret", required: true },
      { key: "secret_key", label: "Secret key", type: "secret", required: true },
    ],
    config: {}, webhookEvents: [], syncHistory: [],
  },

  // ── Comms ─────────────────────────────────────────────────
  { id: "int_slack", name: "Slack", category: "Comms", status: "disconnected",
    lastSync: 0, description: "Route critical alerts to team channels.",
    docsUrl: "https://api.slack.com", brand: { color: "#611F69", mono: "S" },
    scopes: [
      { key: "chat:write", label: "Post messages to channels", required: true },
      { key: "channels:read", label: "Read channel metadata", required: false },
    ],
    configSchema: [
      { key: "webhook_url", label: "Incoming webhook URL", type: "url", required: true },
      { key: "channel", label: "Default channel", type: "text", placeholder: "#ops-alerts" },
    ],
    config: {}, webhookEvents: [], syncHistory: [],
  },
  { id: "int_intercom", name: "Intercom", category: "Comms", status: "disconnected",
    lastSync: 0, description: "In-app messenger and shared support inbox.",
    docsUrl: "https://developers.intercom.com", brand: { color: "#0057FF", mono: "I" },
    scopes: SCOPES_READWRITE,
    configSchema: [
      { key: "access_token", label: "Access token", type: "secret", required: true },
      { key: "app_id", label: "App ID", type: "text", required: true },
    ],
    config: {}, webhookEvents: [], syncHistory: [],
  },
  { id: "int_zendesk", name: "Zendesk", category: "Comms", status: "disconnected",
    lastSync: 0, description: "Ticketing and support macros.",
    docsUrl: "https://developer.zendesk.com", brand: { color: "#03363D", mono: "Z" },
    scopes: SCOPES_READWRITE,
    configSchema: [
      { key: "subdomain", label: "Subdomain", type: "text", required: true, placeholder: "blissley" },
      { key: "email", label: "Admin email", type: "text", required: true },
      { key: "api_token", label: "API token", type: "secret", required: true },
    ],
    config: {}, webhookEvents: [], syncHistory: [],
  },

  // ── Banking ───────────────────────────────────────────────
  { id: "int_mercury", name: "Mercury", category: "Banking", status: "connected",
    lastSync: now - 32*60_000, connectedAt: now - 200*DAY,
    description: "Business banking, cards, and payouts.",
    docsUrl: "https://mercury.com/api", brand: { color: "#5B5BD6", mono: "M" },
    scopes: SCOPES_READONLY,
    configSchema: [
      { key: "api_token", label: "API token", type: "secret", required: true },
      { key: "account_id", label: "Primary account ID", type: "text", required: true },
    ],
    config: { api_token: "mrc_••••1e", account_id: "acc_9fk32" },
    webhookEvents: [
      { key: "transaction.settled", label: "Transaction settled", enabled: true },
    ],
    syncHistory: history([now - 32*60_000, "12 transactions synced", "ok"]),
  },

  // ── Auth ──────────────────────────────────────────────────
  { id: "int_auth0", name: "Auth0", category: "Auth", status: "disconnected",
    lastSync: 0, description: "Enterprise SSO, MFA, and passwordless login.",
    docsUrl: "https://auth0.com/docs", brand: { color: "#EB5424", mono: "A" },
    scopes: SCOPES_READWRITE,
    configSchema: [
      { key: "domain", label: "Domain", type: "text", required: true, placeholder: "blissley.us.auth0.com" },
      { key: "client_id", label: "Client ID", type: "text", required: true },
      { key: "client_secret", label: "Client secret", type: "secret", required: true },
    ],
    config: {}, webhookEvents: [], syncHistory: [],
  },
  { id: "int_google_sso", name: "Google SSO", category: "Auth", status: "disconnected",
    lastSync: 0, description: "Sign in with Google for admin & staff accounts.",
    docsUrl: "https://developers.google.com/identity", brand: { color: "#4285F4", mono: "G" },
    scopes: [
      { key: "openid", label: "Verify your identity", required: true },
      { key: "email", label: "See your primary email address", required: true },
      { key: "profile", label: "See basic profile info", required: true },
    ],
    configSchema: [
      { key: "client_id", label: "OAuth client ID", type: "text", required: true },
      { key: "client_secret", label: "OAuth client secret", type: "secret", required: true },
      { key: "hosted_domain", label: "Restrict to domain", type: "text", placeholder: "blissley.com" },
    ],
    config: {}, webhookEvents: [], syncHistory: [],
  },
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
