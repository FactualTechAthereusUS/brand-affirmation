## Recommendation: Hybrid model (stricter than today, but not overreaching)

Pure "physician decides" wastes physician time and gives ineligible users false hope after they've invested 12 screens. Pure "quiz rejects everything" over-blocks borderline cases that a doctor could actually approve. The right line is: **auto-block only what a physician would reject 100% of the time**, and let the physician handle everything judgment-based.

### What auto-blocks in the quiz (hard stops → `blocked_*` screen)

Keep existing:
1. Age < 18 → `blocked_minor`
2. Pregnancy / trying / breastfeeding / postpartum <6mo → `blocked_pregnancy`

Add these absolute contraindications on the `contra` screen (any one selected → block):
3. Personal or family history of medullary thyroid carcinoma (MTC)
4. Multiple Endocrine Neoplasia syndrome type 2 (MEN2)
5. History of pancreatitis
6. Active cancer (currently in treatment)
7. Prior serious allergic reaction to GLP-1 medication

Add BMI floor:
8. BMI < 18.5 → `blocked_bmi_low` (underweight — GLP-1 not clinically appropriate, no physician would prescribe)

### What stays soft (physician reviews in Case Review)

- BMI 18.5–24.9 without comorbidity → continue, physician decides (some approve with qualifying comorbidity like PCOS, prediabetes)
- Organ transplant, gallbladder disease, kidney/liver disease, eating disorder history, gastroparesis → flag for physician, do not block
- Current medications, other conditions → physician review

### Implementation in `src/components/intake/BlissleyIntakeFlow.tsx`

1. Add block reasons to the phase/state union: `blocked_mtc`, `blocked_men2`, `blocked_pancreatitis`, `blocked_cancer`, `blocked_glp1_allergy`, `blocked_bmi_low`.
2. In the `contra` screen's onChange/next handler, check selected options against the hard-block set; if any match, route to the appropriate blocked screen instead of advancing.
3. In the `bmi` screen's next handler, if BMI < 18.5, route to `blocked_bmi_low`.
4. Add a single reusable `BlockedScreen` variant that takes `{ title, body, supportCta }` so we don't duplicate 6 near-identical screens. Copy per reason:
   - MTC/MEN2: "Because of your thyroid history, GLP-1 medications aren't safe for you. This is an FDA boxed warning, not a Blissley policy."
   - Pancreatitis: "A history of pancreatitis makes GLP-1s unsafe. We recommend speaking with your primary care physician about alternatives."
   - Active cancer: "While you're in active treatment, GLP-1s aren't appropriate. You're welcome back after treatment ends."
   - GLP-1 allergy: "A prior serious reaction rules out this medication class entirely."
   - BMI low: "Your BMI is below the range where GLP-1s are clinically appropriate. These medications are for weight loss, not for people at or below a healthy weight."
5. Every blocked screen: no "Next", no way to bypass. Offer "Contact support" and "Return home" only.
6. Keep the existing `contra` multi-select UI — just intercept on advance. Soft-flag conditions (transplant, gallbladder, kidney/liver, eating disorder, gastroparesis) still record to the store for physician review.

### Files touched
- `src/components/intake/BlissleyIntakeFlow.tsx` — phase union, contra/bmi handlers, `BlockedScreen` component, 4 new blocked variants.

No store, route, or physician portal changes needed — the physician portal already handles soft flags in Case Review.
