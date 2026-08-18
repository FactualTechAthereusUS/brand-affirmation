import { createFileRoute, Link } from "@tanstack/react-router";
import { FAQ_ITEMS, LAUNCH_DAYS, TRUST_MARKS } from "@/lib/pharmabro/home";
import {
  LAST_UPDATED,
  ORG_NODE,
  WEBSITE_NODE,
  breadcrumbNode,
  faqNode,
  ldGraph,
  pbCanonical,
  pbMeta,
  softwareNode,
} from "@/lib/pharmabro/seo";
import { Container } from "@/components/pharmabro/primitives";
import { HeroBlock } from "@/components/pharmabro/home/HeroBlock";
import {
  CheckoutToRevenue,
  CompleteClinic,
  RunOn,
  UnderOneRoof,
} from "@/components/pharmabro/home/SectionsA";
import {
  Comparison,
  Faq,
  FinalCta,
  FromTheBlog,
  GrowthBand,
  LegitScript,
  Nationwide,
  PricingPeek,
  Retention,
} from "@/components/pharmabro/home/SectionsB";

const TITLE = "White Label Telehealth Platform, Flat Fee | PharmaBro";
const DESCRIPTION = `Launch your own telehealth brand in ${LAUNCH_DAYS} days on a white label platform. Flat monthly fee, zero revenue share, your own Stripe, LegitScript support, 30+ pharmacies.`;

export const Route = createFileRoute("/pharmabro/")({
  head: () => ({
    meta: pbMeta({ title: TITLE, description: DESCRIPTION }),
    links: pbCanonical(),
    scripts: [
      {
        type: "application/ld+json",
        children: ldGraph([
          ORG_NODE,
          WEBSITE_NODE,
          softwareNode(),
          faqNode(FAQ_ITEMS),
          breadcrumbNode([{ name: "PharmaBro", path: "" }]),
        ]),
      },
    ],
  }),
  component: PharmaBroHome,
});

function AnnouncementBar() {
  return (
    <div className="border-b border-[var(--color-hairline)] bg-[#0c0c0c]">
      <Container size="wide">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2.5 text-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/45">
            <span className="relative grid size-1.5 place-items-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#6d63ff]/70" />
              <span className="size-1.5 rounded-full bg-[#8fa9ff]" />
            </span>
            New
          </span>
          <span className="text-[13px] text-white/75">
            Launch a compliant telehealth brand in {LAUNCH_DAYS} days, flat fee, zero revenue share.
          </span>
          <Link
            to="/pharmabro/demo"
            className="text-[13px] font-medium text-white underline underline-offset-4 hover:text-white/80"
          >
            Get started
          </Link>
        </div>
      </Container>
    </div>
  );
}

function TrustStrip() {
  return (
    <div className="border-y border-[var(--color-hairline)] bg-[var(--color-mist)]">
      <Container size="wide">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-4">
          {TRUST_MARKS.map((m) => (
            <span key={m} className="pb-micro">
              {m}
            </span>
          ))}
        </div>
      </Container>
    </div>
  );
}

function PharmaBroHome() {
  return (
    <>
      <AnnouncementBar />
      <HeroBlock />
      <TrustStrip />
      <CompleteClinic />
      <UnderOneRoof />
      <RunOn />
      <CheckoutToRevenue />
      <Nationwide />
      <Retention />
      <GrowthBand />
      <Comparison />
      <LegitScript />
      <FromTheBlog />
      <PricingPeek />
      <Faq />
      <FinalCta />
      <p className="sr-only">Last updated {LAST_UPDATED}</p>
    </>
  );
}
