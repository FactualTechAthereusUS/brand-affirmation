import { UOEditorial } from "./UOEditorial";
import { UOHero } from "./UOHero";
import { UOProductGrid } from "./UOProductGrid";
import { UOReactions } from "./UOReactions";
import { UOTargets } from "./UOTargets";
import { UOUgc } from "./UOUgc";

/**
 * Unhinged One homepage — Comfrt's skeleton, Hears' review block in place of
 * the clinician section, two steals from Alo (swatch placement, shoppable UGC).
 * Every product, price, and image comes from the live Shopify catalog.
 */
export function UOHomePage() {
  return (
    <>
      <UOHero />
      <UOProductGrid
        id="best-sellers"
        title="Shop Best Sellers"
        sub="One garment. Every payload. Heavyweight brushed fleece, every one."
        collection="best-selling-products"
      />
      <UOReactions />
      <UOTargets />
      <UOEditorial />
      <UOProductGrid
        id="talk-shit"
        title="The Shit Talk Collection"
        sub="You and your co-conspirator. Matching, obviously."
        collection="shit-talk-collection"
      />
      <UOUgc />
      <UOProductGrid
        id="new-drop"
        title="New Drop"
        sub="Members get 24 hours' head start on every restock."
        collection="new-arrivals"
      />
    </>
  );
}
