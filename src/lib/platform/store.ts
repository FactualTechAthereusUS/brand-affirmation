import { useSyncExternalStore } from "react";

export type BrandStatus = "onboarding" | "active" | "suspended";
export type DomainState = "idle" | "checking" | "verified" | "failed" | "skipped";
export type ConnectionState = "disconnected" | "connecting" | "connected" | "failed";
export type PriceState = "empty" | "checking" | "verified" | "invalid";
export type PharmacyOrderStatus = "pending" | "processing" | "shipped" | "delivered" | "failed";

export const ONBOARDING_LABELS = ["Brand identity", "Intake domain", "Stripe Connect", "Pricing plans", "Compliance", "Review & launch"] as const;
export const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

export type PricePlan = { id: "sema-monthly" | "sema-quarterly" | "tirze-monthly" | "tirze-quarterly"; name: string; priceId: string; state: PriceState };
export type Brand = {
  id: string; name: string; slug: string; adminEmail: string; status: BrandStatus; fee: number;
  tagline: string; logoName: string; primary: string; accent: string; domain: string; domainState: DomainState;
  stripeState: ConnectionState; stripeAccount: string; prices: PricePlan[]; compliance: boolean[];
  complianceAt?: number; registrationFile?: string; launchedAt?: number; createdAt: number;
  patients: number; mrr: number; revenue: number; orders: number; onboardingStep: number;
  integrations: { stripe: boolean; meta: boolean; perfectRx: boolean };
};
export type BrandEvent = { id: string; brandId: string; ts: number; label: string; detail: string; tone: "info" | "success" | "warning" };
export type PharmacyOrder = {
  id: string; brandId: string; pharmacyId: string; status: PharmacyOrderStatus; state: string; receivedAt: number;
  molecule: string; formulation: string; dose: string; volume: string; daysSupply: number; syringeCount: number;
  sig: string; allergies: string; statement: string; tracking?: string; carrier?: string; shippedAt?: number; deliveredAt?: number; error?: string;
};
export type RoutingRule = { state: string; pharmacyId: string | null; updatedAt: number };
export type PlatformPhysician = { id: string; name: string; email: string; active: boolean; states: string[]; cases: number; avgHours: number; approvalRate: number; lastActiveAt: number };
export type PlatformSession = { email: string; role: "operator" | "pharmacy"; pharmacyId?: string };
export type PlatformState = {
  brands: Brand[]; events: BrandEvent[]; orders: PharmacyOrder[]; routing: RoutingRule[]; physicians: PlatformPhysician[];
  operatorSession: PlatformSession | null; pharmacySession: PlatformSession | null;
};

const now = Date.now();
const plans = (ready: boolean): PricePlan[] => [
  { id: "sema-monthly", name: "Semaglutide monthly", priceId: ready ? "price_sema_monthly" : "", state: ready ? "verified" : "empty" },
  { id: "sema-quarterly", name: "Semaglutide 3-month", priceId: ready ? "price_sema_quarterly" : "", state: ready ? "verified" : "empty" },
  { id: "tirze-monthly", name: "Tirzepatide monthly", priceId: ready ? "price_tirze_monthly" : "", state: ready ? "verified" : "empty" },
  { id: "tirze-quarterly", name: "Tirzepatide 3-month", priceId: ready ? "price_tirze_quarterly" : "", state: ready ? "verified" : "empty" },
];
const brands: Brand[] = [
  { id:"blissley", name:"Blissley", slug:"blissley", adminEmail:"care@blissley.com", status:"active", fee:3, tagline:"Personalized medicine, designed around you.", logoName:"blissley-logo.svg", primary:"#2563eb", accent:"#7c3aed", domain:"intake.blissley.com", domainState:"verified", stripeState:"connected", stripeAccount:"acct_••••4R9L", prices:plans(true), compliance:[true,true,true], complianceAt:now-90*86400000, launchedAt:now-110*86400000, createdAt:now-130*86400000, patients:1842, mrr:487920, revenue:612840, orders:2134, onboardingStep:6, integrations:{stripe:true,meta:true,perfectRx:true} },
  { id:"nova", name:"Nova Health", slug:"nova-health", adminEmail:"hello@novahealth.co", status:"active", fee:3.5, tagline:"A clearer path to feeling like yourself.", logoName:"nova-mark.svg", primary:"#0ea5e9", accent:"#10b981", domain:"start.novahealth.co", domainState:"verified", stripeState:"connected", stripeAccount:"acct_••••1N7Q", prices:plans(true), compliance:[true,true,true], complianceAt:now-40*86400000, launchedAt:now-34*86400000, createdAt:now-58*86400000, patients:284, mrr:71460, revenue:96220, orders:331, onboardingStep:6, integrations:{stripe:true,meta:false,perfectRx:true} },
  { id:"zeroco", name:"ZeroCo", slug:"zeroco", adminEmail:"founder@zeroco.io", status:"onboarding", fee:3, tagline:"", logoName:"", primary:"#ee7273", accent:"#f59e0b", domain:"", domainState:"idle", stripeState:"disconnected", stripeAccount:"", prices:plans(false), compliance:[false,false,false], createdAt:now-2*86400000, patients:0, mrr:0, revenue:0, orders:0, onboardingStep:0, integrations:{stripe:false,meta:false,perfectRx:false} },
];
const pharmacyNames: Record<string,string> = { southend:"South End Pharmacy", wellsrx:"WellsRx", epiq:"Epiq Scripts" };
export const PHARMACY_NAMES = pharmacyNames;
const orderSeed: PharmacyOrder[] = Array.from({ length: 22 }, (_, i) => ({
  id:`RX-${String(8401+i).padStart(5,"0")}`, brandId:i%4===0?"nova":"blissley", pharmacyId:i%5===0?"wellsrx":"southend",
  status:(i===4||i===13?"failed":i%7===0?"delivered":i%4===0?"shipped":i%3===0?"processing":"pending") as PharmacyOrderStatus,
  state:["CA","TX","FL","NY","AZ","WA"][i%6], receivedAt:now-(i+1)*43*60000,
  molecule:i%3===0?"Tirzepatide":"Semaglutide", formulation:"Injectable · compounded", dose:i%3===0?"5 mg weekly":"0.5 mg weekly",
  volume:i%3===0?"2.5 mL":"2 mL", daysSupply:i%2===0?84:28, syringeCount:i%2===0?15:5,
  sig:i%3===0?"Inject 25 units subcutaneously once weekly":"Inject 10 units subcutaneously once weekly",
  allergies:i%6===0?"Penicillin":"No known drug allergies", statement:"Compounded pursuant to a patient-specific prescription under Section 503A.",
  ...(i===4||i===13?{error:"PerfectRx rejected prescriber NPI validation. Confirm credential mapping and resubmit."}:{}),
  ...(i%4===0?{tracking:`1Z84E${904821+i}`,carrier:"UPS",shippedAt:now-i*3600000}:{}),
  ...(i%7===0?{deliveredAt:now-i*1800000}:{}),
}));
const seedState: PlatformState = {
  brands,
  events:[
    {id:"ev1",brandId:"blissley",ts:now-18*60000,label:"Fulfillment synced",detail:"42 prescriptions synced to South End",tone:"success"},
    {id:"ev2",brandId:"nova",ts:now-2*3600000,label:"Meta Pixel needs attention",detail:"No event received in 48 hours",tone:"warning"},
    {id:"ev3",brandId:"zeroco",ts:now-5*3600000,label:"Brand invited",detail:"Setup invitation sent to founder@zeroco.io",tone:"info"},
  ],
  orders:orderSeed,
  routing:US_STATES.map((state,i)=>({state,pharmacyId:i%17===0?null:i%6===0?"wellsrx":"southend",updatedAt:now-i*3600000})),
  physicians:[
    {id:"dr-nass",name:"Dr. Amina Nass",email:"amina@drtelx.com",active:true,states:["CA","TX","FL","NY","AZ","WA"],cases:384,avgHours:1.8,approvalRate:91,lastActiveAt:now-12*60000},
    {id:"dr-chen",name:"Dr. Robert Chen",email:"robert@drtelx.com",active:true,states:["NY","NJ","CT","PA","MA"],cases:291,avgHours:2.4,approvalRate:88,lastActiveAt:now-3*3600000},
    {id:"dr-patel",name:"Dr. Maya Patel",email:"maya@drtelx.com",active:true,states:["TX","CO","NM","OK","KS"],cases:248,avgHours:1.5,approvalRate:93,lastActiveAt:now-38*60000},
    {id:"dr-foster",name:"Dr. Liam Foster",email:"liam@drtelx.com",active:false,states:["FL","GA","SC","NC"],cases:177,avgHours:3.1,approvalRate:86,lastActiveAt:now-18*86400000},
  ],
  operatorSession:null, pharmacySession:null,
};

const KEY="pharmabro-platform-v1";
const listeners=new Set<()=>void>();
let state=seedState;
function load(){ if(typeof window==="undefined") return; try { const raw=localStorage.getItem(KEY); if(raw) state={...seedState,...JSON.parse(raw)}; } catch {} }
function save(){ if(typeof window!=="undefined") try { localStorage.setItem(KEY,JSON.stringify(state)); } catch {} }
function set(patch:Partial<PlatformState>|((s:PlatformState)=>Partial<PlatformState>)){ state={...state,...(typeof patch==="function"?patch(state):patch)}; save(); listeners.forEach(l=>l()); }
function event(brandId:string,label:string,detail:string,tone:BrandEvent["tone"]="info"){ set(s=>({events:[{id:`ev-${Date.now()}`,brandId,ts:Date.now(),label,detail,tone},...s.events].slice(0,80)})); }
export function hydratePlatform(){ load(); listeners.forEach(l=>l()); }
export function usePlatform<T>(selector:(s:PlatformState)=>T){ return useSyncExternalStore((l)=>{listeners.add(l);return()=>listeners.delete(l)},()=>selector(state),()=>selector(seedState)); }
export function getPlatformState(){ return state; }

function slugify(value:string){ return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,48); }
export function onboardingMissing(brand:Brand){
  const missing:string[]=[];
  if(!brand.name||!brand.tagline||!brand.logoName) missing.push("Brand identity");
  if(brand.domainState!=="verified") missing.push("Verified intake domain");
  if(brand.stripeState!=="connected") missing.push("Stripe Connect");
  if(brand.prices.some(p=>p.state!=="verified")) missing.push("Four verified price IDs");
  if(!brand.compliance.every(Boolean)) missing.push("Compliance acknowledgements");
  return missing;
}
export const platformActions={
  signInOperator(email:string){set({operatorSession:{email,role:"operator"}})}, signOutOperator(){set({operatorSession:null})},
  signInPharmacy(email:string,pharmacyId="southend"){set({pharmacySession:{email,role:"pharmacy",pharmacyId}})}, signOutPharmacy(){set({pharmacySession:null})},
  createBrand(input:{name:string;adminEmail:string;slug:string;fee:number}){ const id=`brand-${Date.now()}`; const brand:Brand={id,name:input.name,adminEmail:input.adminEmail,slug:slugify(input.slug||input.name),fee:input.fee,status:"onboarding",tagline:"",logoName:"",primary:"#2563eb",accent:"#10b981",domain:"",domainState:"idle",stripeState:"disconnected",stripeAccount:"",prices:plans(false),compliance:[false,false,false],createdAt:Date.now(),patients:0,mrr:0,revenue:0,orders:0,onboardingStep:0,integrations:{stripe:false,meta:false,perfectRx:false}}; set(s=>({brands:[brand,...s.brands]})); event(id,"Brand invited",`Setup invitation sent to ${input.adminEmail}`); return id; },
  updateBrand(id:string,patch:Partial<Brand>){set(s=>({brands:s.brands.map(b=>b.id===id?{...b,...patch}:b)}))},
  setBrandStatus(id:string,status:BrandStatus){set(s=>({brands:s.brands.map(b=>b.id===id?{...b,status}:b)}));event(id,status==="suspended"?"Brand suspended":status==="active"?"Brand activated":"Brand moved to onboarding",`Status changed to ${status}`,status==="suspended"?"warning":"success")},
  launchBrand(id:string){const brand=state.brands.find(b=>b.id===id);if(!brand)return["Brand not found"];const missing=onboardingMissing(brand);if(missing.length)return missing;set(s=>({brands:s.brands.map(b=>b.id===id?{...b,status:"active",onboardingStep:6,launchedAt:Date.now()}:b)}));event(id,"Brand launched",`${brand.name} is accepting new intakes`,"success");return[];},
  setIdentity(id:string,data:Pick<Brand,"name"|"tagline"|"logoName"|"primary"|"accent">){platformActions.updateBrand(id,{...data,onboardingStep:Math.max(1,state.brands.find(b=>b.id===id)?.onboardingStep??0)});event(id,"Identity saved","Brand identity and storefront colors updated","success")},
  setDomain(id:string,domain:string,domainState:DomainState){platformActions.updateBrand(id,{domain,domainState,onboardingStep:domainState==="verified"?Math.max(2,state.brands.find(b=>b.id===id)?.onboardingStep??0):state.brands.find(b=>b.id===id)?.onboardingStep??0});if(domainState==="verified")event(id,"Domain verified",`https://${domain} is ready`,"success")},
  setStripe(id:string,stripeState:ConnectionState){platformActions.updateBrand(id,{stripeState,stripeAccount:stripeState==="connected"?"acct_••••9K2P":"",onboardingStep:stripeState==="connected"?Math.max(3,state.brands.find(b=>b.id===id)?.onboardingStep??0):state.brands.find(b=>b.id===id)?.onboardingStep??0,integrations:{...(state.brands.find(b=>b.id===id)?.integrations??{stripe:false,meta:false,perfectRx:false}),stripe:stripeState==="connected"}});if(stripeState==="connected")event(id,"Stripe connected","Payout account verified","success")},
  setPrice(id:string,planId:PricePlan["id"],priceId:string,stateValue:PriceState){set(s=>({brands:s.brands.map(b=>b.id!==id?b:{...b,prices:b.prices.map(p=>p.id===planId?{...p,priceId,state:stateValue}:p),onboardingStep:b.prices.every(p=>p.id===planId?stateValue==="verified":p.state==="verified")?Math.max(4,b.onboardingStep):b.onboardingStep})}))},
  setCompliance(id:string,checks:boolean[],file?:string){platformActions.updateBrand(id,{compliance:checks,registrationFile:file,complianceAt:checks.every(Boolean)?Date.now():undefined,onboardingStep:checks.every(Boolean)?Math.max(5,state.brands.find(b=>b.id===id)?.onboardingStep??0):state.brands.find(b=>b.id===id)?.onboardingStep??0});if(checks.every(Boolean))event(id,"Compliance confirmed","Required acknowledgements completed","success")},
  retryOrder(id:string){set(s=>({orders:s.orders.map(o=>o.id===id?{...o,status:"processing",error:undefined}:o)}))},
  processOrder(id:string){set(s=>({orders:s.orders.map(o=>o.id===id&&o.status==="pending"?{...o,status:"processing"}:o)}))},
  shipOrder(id:string,tracking:string,carrier:string){if(!tracking.trim())return false;set(s=>({orders:s.orders.map(o=>o.id===id&&o.status==="processing"?{...o,status:"shipped",tracking:tracking.trim(),carrier,shippedAt:Date.now()}:o)}));return true},
  deliverOrder(id:string){set(s=>({orders:s.orders.map(o=>o.id===id&&o.status==="shipped"?{...o,status:"delivered",deliveredAt:Date.now()}:o)}))},
  updateRouting(rules:RoutingRule[]){set({routing:rules.map(r=>({...r,updatedAt:Date.now()}))})},
  togglePhysician(id:string){set(s=>({physicians:s.physicians.map(p=>p.id===id?{...p,active:!p.active}:p)}))},
  setPhysicianStates(id:string,states:string[]){set(s=>({physicians:s.physicians.map(p=>p.id===id?{...p,states}:p)}))},
  applyPreset(preset:"onboarding-start"|"onboarding-partial"|"launch-ready"|"suspended"){const z=state.brands.find(b=>b.id==="zeroco");if(!z)return; if(preset==="onboarding-start")platformActions.updateBrand(z.id,{status:"onboarding",onboardingStep:0,tagline:"",logoName:"",domain:"",domainState:"idle",stripeState:"disconnected",prices:plans(false),compliance:[false,false,false]}); if(preset==="onboarding-partial")platformActions.updateBrand(z.id,{status:"onboarding",onboardingStep:3,tagline:"Care that moves with you.",logoName:"zeroco-mark.svg",domain:"start.zeroco.io",domainState:"verified",stripeState:"connected",stripeAccount:"acct_••••9K2P",prices:plans(false),compliance:[false,false,false]}); if(preset==="launch-ready")platformActions.updateBrand(z.id,{status:"onboarding",onboardingStep:5,tagline:"Care that moves with you.",logoName:"zeroco-mark.svg",domain:"start.zeroco.io",domainState:"verified",stripeState:"connected",stripeAccount:"acct_••••9K2P",prices:plans(true),compliance:[true,true,true],complianceAt:Date.now()}); if(preset==="suspended")platformActions.updateBrand("nova",{status:"suspended"}); },
};