import { BEST_SELLERS, NEW_DROP } from "./data";
import { UOEditorial } from "./UOEditorial";
import { UOHero } from "./UOHero";
import { UOProductGrid } from "./UOProductGrid";
import { UOReactions } from "./UOReactions";
import { UOTargets } from "./UOTargets";
import { UOUgc } from "./UOUgc";

/**
 * Unhinged One homepage — Comfrt's skeleton, Hears' review block in place of
 * the clinician section, two steals from Alo (swatch placement, shoppable UGC).
 */
export function UOHomePage() {
  return (
    <>
      <UOHero />
      <UOProductGrid
        id="best-sellers"
        title="Shop Best Sellers"
        sub="One garment. Eighty-four payloads. 400gsm brushed fleece, every one."
        products={BEST_SELLERS}
      />
      <UOReactions />
      <UOTargets />
      <UOEditorial />
      <UOUgc />
      <UOProductGrid
        id="new-drop"
        title="New Drop"
        sub="Restock ships October 25. Members get 24 hours' head start."
        products={NEW_DROP}
      />
    </>
  );
}
