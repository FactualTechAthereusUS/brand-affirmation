import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Bell, Check } from "lucide-react";
import { PageHeader, SettingsCard, Field, Select, Toggle, TextInput } from "@/components/admin/settings/primitives";
import { adminActions, useAdmin, US_STATE_LIST } from "@/lib/admin/store";

export const Route = createFileRoute("/admin/settings/states")({
  head: () => ({ meta: [{ title: "States Served · Settings — Blissley HQ" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: StatesPage,
});

function StatesPage() {
  const served = useAdmin((s) => s.settings.states.served);
  const waitlistCounts = useAdmin((s) => s.settings.states.waitlistCounts);
  const autoNotify = useAdmin((s) => s.settings.states.autoNotify);
  const waitlistList = useAdmin((s) => s.settings.states.waitlistList);
  const [q, setQ] = useState("");

  const enabledCount = useMemo(() => Object.values(served).filter((c) => c.enabled).length, [served]);
  const filtered = US_STATE_LIST.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()) || s.code.toLowerCase().includes(q.toLowerCase()));
  const waitlistRows = US_STATE_LIST.filter((s) => !served[s.code]?.enabled && (waitlistCounts[s.code] ?? 0) > 0).sort((a, b) => (waitlistCounts[b.code] ?? 0) - (waitlistCounts[a.code] ?? 0)).slice(0, 8);

  return (
    <div className="space-y-4">
      <PageHeader title="States Served" description="Where Blissley currently accepts patients." />

      <SettingsCard label="Coverage">
        <div className="grid gap-3 sm:grid-cols-3">
          <StatBox k="Currently serving" v={`${enabledCount} states`} tone="success" />
          <StatBox k="Not yet serving" v={`${50 - enabledCount} states`} tone="warn" />
          <StatBox k="Waitlist" v={autoNotify ? "Active" : "Off"} tone="info" />
        </div>
      </SettingsCard>

      <SettingsCard label="State toggles" description="Turning off a state stops new intake — existing patients are unaffected."
        action={<TextInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search states…" className="w-48" />}
      >
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map((s) => {
            const cov = served[s.code] ?? { enabled: false, primary: false, backup: false };
            return (
              <button key={s.code} type="button"
                onClick={() => { adminActions.toggleServedState(s.code, !cov.enabled); toast.success(`${s.name} · ${!cov.enabled ? "enabled" : "disabled"}`); }}
                className={`group flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition ${cov.enabled ? "border-emerald-300/60 bg-emerald-50/40" : "border-ink/10 bg-white hover:bg-ink/2"}`}
              >
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">{s.code}</div>
                  <div className="truncate text-[13px] font-semibold text-ink">{s.name}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {cov.primary && <span className="rounded-full bg-ink/6 px-1.5 text-[9.5px] font-semibold text-ink/70">SE</span>}
                    {cov.backup  && <span className="rounded-full bg-ink/6 px-1.5 text-[9.5px] font-semibold text-ink/70">WR</span>}
                  </div>
                </div>
                <span className={`grid h-5 w-5 place-items-center rounded-full ${cov.enabled ? "bg-emerald-500 text-white" : "bg-ink/10 text-ink/40"}`}>
                  {cov.enabled && <Check className="h-3 w-3" />}
                </span>
              </button>
            );
          })}
        </div>
      </SettingsCard>

      <SettingsCard label="Waitlist">
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Top waitlisted states</div>
            <div className="overflow-hidden rounded-xl border border-ink/8">
              <table className="w-full text-[13px]">
                <thead className="bg-[#faf9f6] text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">
                  <tr>
                    <th className="px-3 py-2">State</th>
                    <th className="px-3 py-2 text-right">Patients waiting</th>
                    <th className="px-3 py-2 w-40 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/6">
                  {waitlistRows.map((s) => (
                    <tr key={s.code}>
                      <td className="px-3 py-2.5 font-semibold text-ink">{s.name} <span className="text-ink/40">· {s.code}</span></td>
                      <td className="px-3 py-2.5 text-right font-hero text-[15px] font-bold text-ink">{waitlistCounts[s.code] ?? 0}</td>
                      <td className="px-3 py-2.5 text-right">
                        <button onClick={() => { adminActions.notifyWaitlist(s.code); toast.success(`Notified waitlist in ${s.name}`); }}
                          className="inline-flex items-center gap-1 rounded-full border border-ink/12 bg-white px-2.5 py-1 text-[11.5px] font-semibold text-ink/70 hover:border-ink/30 hover:text-ink"
                        ><Bell className="h-3 w-3" /> Notify all</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="space-y-3">
            <Field label="Klaviyo list for waitlist patients">
              <Select value={waitlistList} onChange={(e) => { adminActions.updateSettingsSection("states", { waitlistList: e.target.value }); }}>
                <option>Blissley — State Waitlist</option>
                <option>Blissley — General Nurture</option>
                <option>Blissley — GLP-1 Interested</option>
              </Select>
            </Field>
            <div className="rounded-xl border border-ink/8 p-3">
              <Toggle checked={autoNotify}
                onChange={(v) => { adminActions.updateSettingsSection("states", { autoNotify: v }); toast(`Auto-notify ${v ? "on" : "off"}`); }}
                label="Auto-notify when state goes live"
                description="Sends a Klaviyo email + SMS to waitlisted patients when their state is enabled." />
            </div>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}

function StatBox({ k, v, tone }: { k: string; v: string; tone: "success" | "warn" | "info" }) {
  const bg = tone === "success" ? "bg-emerald-50" : tone === "warn" ? "bg-amber-50" : "bg-sky-50";
  return (
    <div className={`rounded-xl border border-ink/8 ${bg} p-3`}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">{k}</div>
      <div className="mt-1 font-hero text-xl font-bold text-ink">{v}</div>
    </div>
  );
}
