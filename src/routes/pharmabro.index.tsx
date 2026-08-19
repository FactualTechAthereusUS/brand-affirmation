import { createFileRoute } from "@tanstack/react-router";
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
  ScaleStats,
  Testimonials,
} from "@/components/pharmabro/home/ScaleProof";

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


function PharmaBroHome() {
  return (
    <>
      <HeroBlock />
      <TrustStrip />
      <ScaleStats />
      <CompleteClinic />
      <UnderOneRoof />
      <RunOn />
      <CheckoutToRevenue />
      <Nationwide />
      <Retention />
      <GrowthBand />
      <Testimonials />
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

