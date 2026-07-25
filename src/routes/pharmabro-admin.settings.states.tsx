import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card } from "@/components/pharmabro/BrandShell";
import { pharmabroActions, useActiveBrand } from "@/lib/pharmabro/store";

export const Route = createFileRoute("/pharmabro-admin/settings/states")({
  head: () => ({ meta: [{ title: "States served · Settings" }, { name: "robots", content: "noindex" }] }),
  component: StatesPage,
});

const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

function StatesPage() {
  const brand = useActiveBrand();
  const active = new Set(brand.statesServed);
  return (
    <Card className="p-5">
      <div className="mb-1 text-[13.5px] font-bold text-ink">States served — {active.size} active</div>
      <p className="text-[12px] text-ink/55">Toggle a state to accept new patients from there. Pharmacy coverage is enforced automatically.</p>
      <div className="mt-4 grid grid-cols-5 gap-1.5 sm:grid-cols-8 lg:grid-cols-10">
        {STATES.map((s) => {
          const on = active.has(s);
          return (
            <button key={s} onClick={() => { pharmabroActions.toggleState(s); toast(`${s} ${on ? "disabled" : "enabled"}`); }}
              className={`rounded-lg border p-2 text-[11.5px] font-bold ${on ? "border-transparent text-white" : "border-ink/12 bg-white text-ink/60 hover:border-ink/30"}`}
              style={on ? { background: brand.theme.primary, color: brand.theme.primaryFg } : undefined}
            >{s}</button>
          );
        })}
      </div>
    </Card>
  );
}
