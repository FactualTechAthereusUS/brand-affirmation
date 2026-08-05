import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { BarChart3, Building2, LayoutDashboard, Menu, Pill, Stethoscope, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hydratePlatform, platformActions, usePlatform } from "@/lib/platform/store";

const nav = [
  { to: "/operator", label: "Overview", icon: LayoutDashboard },
  { to: "/operator/brands", label: "Brands", icon: Building2 },
  { to: "/operator/revenue", label: "Revenue", icon: BarChart3 },
  { to: "/operator/pharmacy/orders", label: "Pharmacy", icon: Pill },
  { to: "/operator/physicians", label: "Physicians", icon: Stethoscope },
] as const;

export function OperatorShell({ children, title, description, action }: { children: ReactNode; title: string; description?: string; action?: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const session = usePlatform((s) => s.operatorSession);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  useEffect(() => hydratePlatform(), []);
  const sidebar = <>
    <div className="flex h-14 items-center justify-between border-b border-ink/10 px-4"><Link to="/operator" className="font-hero text-base font-bold text-ink">Blissley <span className="font-normal text-ink/45">Ops</span></Link><Button variant="ghost" size="icon" className="lg:hidden" onClick={()=>setOpen(false)}><X/></Button></div>
    <nav className="flex-1 space-y-1 p-3">{nav.map(({to,label,icon:Icon})=>{const active=to==="/operator"?path===to:path.startsWith(to);return <Link key={to} to={to} onClick={()=>setOpen(false)} className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm ${active?"bg-marine/10 font-semibold text-marine":"text-ink/60 hover:bg-ink/5 hover:text-ink"}`}><Icon className="h-4 w-4"/>{label}</Link>})}</nav>
    <div className="border-t border-ink/10 p-3"><div className="mb-2 truncate text-xs text-ink/50">{session?.email??"Internal operator"}</div><Button variant="ghost" size="sm" className="w-full justify-start" onClick={()=>{platformActions.signOutOperator();navigate({to:"/operator/login"})}}><LogOut/>Sign out</Button></div>
  </>;
  return <div className="admin-scope min-h-screen overflow-x-hidden bg-canvas text-ink"><aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-ink/10 bg-white lg:flex">{sidebar}</aside>{open&&<><Button aria-label="Close navigation" variant="ghost" className="fixed inset-0 z-40 h-auto w-auto rounded-none bg-ink/35 p-0 hover:bg-ink/35 lg:hidden" onClick={()=>setOpen(false)}/><aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-xl lg:hidden">{sidebar}</aside></>}<div className="min-w-0 lg:pl-56"><header className="sticky top-0 z-20 flex h-14 items-center border-b border-ink/10 bg-white px-4 lg:px-6"><Button variant="ghost" size="icon" className="lg:hidden" onClick={()=>setOpen(true)}><Menu/></Button><div className="ml-auto flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-check"/><span className="text-xs text-ink/55">Platform operational</span></div></header><main className="min-w-0 px-4 py-5 lg:px-7"><div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div className="min-w-0"><h1 className="text-2xl font-semibold text-ink">{title}</h1>{description&&<p className="mt-1 text-sm text-ink/55">{description}</p>}</div>{action}</div>{children}</main></div></div>;
}

export function PlatformCard({ children, className="" }: { children:ReactNode; className?:string }) { return <div className={`rounded-lg border border-ink/10 bg-white shadow-sm ${className}`}>{children}</div> }
export function StatusBadge({ value }: { value:string }) { const tone=value==="active"||value==="connected"||value==="delivered"?"bg-check/10 text-check":value==="suspended"||value==="failed"?"bg-ever/10 text-ever":value==="processing"||value==="shipped"?"bg-marine/10 text-marine":"bg-honey/15 text-honey";return <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold capitalize ${tone}`}>{value}</span> }