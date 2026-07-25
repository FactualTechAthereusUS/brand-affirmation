CREATE TABLE public.admin_leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  dob TEXT,
  sex TEXT,
  program TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  intent TEXT NOT NULL DEFAULT 'cold',
  funnel_step TEXT NOT NULL DEFAULT 'landing',
  progress_pct INTEGER NOT NULL DEFAULT 0,
  state_eligible BOOLEAN NOT NULL DEFAULT true,
  bmi NUMERIC,
  current_weight INTEGER,
  goal_weight INTEGER,
  consent JSONB NOT NULL DEFAULT '{"sms": false, "email": true, "marketing": false}'::jsonb,
  attribution JSONB NOT NULL DEFAULT '{}'::jsonb,
  projected_first_order INTEGER NOT NULL DEFAULT 0,
  projected_ltv INTEGER NOT NULL DEFAULT 0,
  outreach JSONB NOT NULL DEFAULT '[]'::jsonb,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  assignee TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  loss_reason TEXT,
  won_patient_id TEXT,
  intake_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
  cart_items JSONB,
  coupon TEXT,
  created_at_ms BIGINT NOT NULL,
  last_touch_at_ms BIGINT NOT NULL,
  source TEXT NOT NULL DEFAULT 'Organic',
  last_step TEXT NOT NULL DEFAULT 'Landing page',
  age_hrs INTEGER NOT NULL DEFAULT 0,
  contacted BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.admin_leads TO service_role;
ALTER TABLE public.admin_leads ENABLE ROW LEVEL SECURITY;
CREATE INDEX admin_leads_status_idx ON public.admin_leads (status);
CREATE INDEX admin_leads_funnel_step_idx ON public.admin_leads (funnel_step);
CREATE INDEX admin_leads_score_idx ON public.admin_leads (score DESC);
CREATE INDEX admin_leads_created_at_ms_idx ON public.admin_leads (created_at_ms DESC);

INSERT INTO public.admin_leads (
  id, name, email, phone, state, city, dob, sex, program, score, intent, funnel_step, progress_pct,
  state_eligible, bmi, current_weight, goal_weight, consent, attribution, projected_first_order,
  projected_ltv, outreach, tags, assignee, status, loss_reason, won_patient_id, intake_snapshot,
  cart_items, coupon, created_at_ms, last_touch_at_ms, source, last_step, age_hrs, contacted
)
SELECT
  'ld_' || (900 + gs)::text,
  (ARRAY['Michael Thompson','Dana Kim','Priya Nair','Eleanor Whitfield','Robert Kim','Marcus Bell','Omar Haddad','Nadia Okonkwo','Amara Diallo','Leo Nguyen','Maya Alvarez','Grace Ivanov','Kai Hughes','Elena Nassar','Kristin Peterson','Aiden Patel','Hiroshi Yamada','Julie Martin','Sarah Reyes','Jennifer Cole','Lisa Foster','Hannah Vance','Alden Tanaka','Theo Solberg','Yuki Mehta','Henrik Chen','Idris Martel','Lena Ali','Chloe Park','Zara Ross','Owen Cohen','Sofia Sato','Jordan Blake','Rowan Kaur','Daiene Silva','David Brooks','Noah Johnson','Ethan Sullivan','Isabel Miller','Michael Nair','Dana Thompson','Priya Reyes'])[gs + 1],
  lower(replace((ARRAY['Michael Thompson','Dana Kim','Priya Nair','Eleanor Whitfield','Robert Kim','Marcus Bell','Omar Haddad','Nadia Okonkwo','Amara Diallo','Leo Nguyen','Maya Alvarez','Grace Ivanov','Kai Hughes','Elena Nassar','Kristin Peterson','Aiden Patel','Hiroshi Yamada','Julie Martin','Sarah Reyes','Jennifer Cole','Lisa Foster','Hannah Vance','Alden Tanaka','Theo Solberg','Yuki Mehta','Henrik Chen','Idris Martel','Lena Ali','Chloe Park','Zara Ross','Owen Cohen','Sofia Sato','Jordan Blake','Rowan Kaur','Daiene Silva','David Brooks','Noah Johnson','Ethan Sullivan','Isabel Miller','Michael Nair','Dana Thompson','Priya Reyes'])[gs + 1], ' ', '.')) || '@email.com',
  '+1 (415) 555-1' || lpad((100 + gs)::text, 3, '0'),
  (ARRAY['CA','TX','NY','FL','IL','PA','OH','GA','NC','MI','WA','CO','AZ','MA','VA','NJ'])[((gs * 5) % 16) + 1],
  (ARRAY['San Francisco','Austin','Brooklyn','Miami','Chicago','Seattle','Denver','Boston'])[((gs) % 8) + 1],
  '19' || (70 + (gs % 30))::text || '-' || lpad(((gs % 12) + 1)::text, 2, '0') || '-' || lpad(((gs % 27) + 1)::text, 2, '0'),
  CASE WHEN gs % 2 = 0 THEN 'F' ELSE 'M' END,
  (ARRAY['Tirzepatide','Semaglutide','Hair','ED','TRT'])[((gs) % 5) + 1],
  LEAST(99, GREATEST(3,
    round(((ARRAY[8,22,52,52,74,88,94,82])[((gs) % 8) + 1]) * 0.55
      + CASE WHEN (1 + ((gs * 7) % 96)) < 12 THEN 25 WHEN (1 + ((gs * 7) % 96)) < 36 THEN 15 WHEN (1 + ((gs * 7) % 96)) < 72 THEN 6 ELSE 0 END
      + CASE (ARRAY['Meta','Google','Organic','Referral','TikTok','Klaviyo'])[((gs) % 6) + 1] WHEN 'Google' THEN 12 WHEN 'Meta' THEN 10 WHEN 'Referral' THEN 15 WHEN 'Klaviyo' THEN 8 ELSE 4 END
      + (gs % 5)
    )::int
  )),
  CASE WHEN LEAST(99, GREATEST(3, round(((ARRAY[8,22,52,52,74,88,94,82])[((gs) % 8) + 1]) * 0.55 + CASE WHEN (1 + ((gs * 7) % 96)) < 12 THEN 25 WHEN (1 + ((gs * 7) % 96)) < 36 THEN 15 WHEN (1 + ((gs * 7) % 96)) < 72 THEN 6 ELSE 0 END + CASE (ARRAY['Meta','Google','Organic','Referral','TikTok','Klaviyo'])[((gs) % 6) + 1] WHEN 'Google' THEN 12 WHEN 'Meta' THEN 10 WHEN 'Referral' THEN 15 WHEN 'Klaviyo' THEN 8 ELSE 4 END + (gs % 5))::int)) >= 70 THEN 'hot'
       WHEN LEAST(99, GREATEST(3, round(((ARRAY[8,22,52,52,74,88,94,82])[((gs) % 8) + 1]) * 0.55 + CASE WHEN (1 + ((gs * 7) % 96)) < 12 THEN 25 WHEN (1 + ((gs * 7) % 96)) < 36 THEN 15 WHEN (1 + ((gs * 7) % 96)) < 72 THEN 6 ELSE 0 END + CASE (ARRAY['Meta','Google','Organic','Referral','TikTok','Klaviyo'])[((gs) % 6) + 1] WHEN 'Google' THEN 12 WHEN 'Meta' THEN 10 WHEN 'Referral' THEN 15 WHEN 'Klaviyo' THEN 8 ELSE 4 END + (gs % 5))::int)) >= 45 THEN 'warm'
       ELSE 'cold' END,
  (ARRAY['landing','intake_start','intake_mid','intake_mid','intake_complete','checkout','payment_fail','abandoned_cart'])[((gs) % 8) + 1],
  (ARRAY[8,22,52,52,74,88,94,82])[((gs) % 8) + 1],
  NOT ((ARRAY['CA','TX','NY','FL','IL','PA','OH','GA','NC','MI','WA','CO','AZ','MA','VA','NJ'])[((gs * 5) % 16) + 1] IN ('MI','GA')),
  CASE WHEN (ARRAY['Tirzepatide','Semaglutide','Hair','ED','TRT'])[((gs) % 5) + 1] IN ('Tirzepatide','Semaglutide') THEN round((26 + (gs % 12))::numeric, 1) END,
  CASE WHEN (ARRAY['Tirzepatide','Semaglutide','Hair','ED','TRT'])[((gs) % 5) + 1] IN ('Tirzepatide','Semaglutide') THEN 180 + (gs % 60) END,
  CASE WHEN (ARRAY['Tirzepatide','Semaglutide','Hair','ED','TRT'])[((gs) % 5) + 1] IN ('Tirzepatide','Semaglutide') THEN 150 + (gs % 40) END,
  jsonb_build_object('sms', gs % 11 <> 0, 'email', true, 'marketing', gs % 7 <> 0),
  jsonb_build_object(
    'source', (ARRAY['Meta','Google','Organic','Referral','TikTok','Klaviyo'])[((gs) % 6) + 1],
    'medium', CASE WHEN (ARRAY['Meta','Google','Organic','Referral','TikTok','Klaviyo'])[((gs) % 6) + 1] IN ('Meta','Google','TikTok') THEN 'paid' WHEN (ARRAY['Meta','Google','Organic','Referral','TikTok','Klaviyo'])[((gs) % 6) + 1] = 'Klaviyo' THEN 'email' WHEN (ARRAY['Meta','Google','Organic','Referral','TikTok','Klaviyo'])[((gs) % 6) + 1] = 'Referral' THEN 'referral' ELSE 'organic' END,
    'campaign', CASE (ARRAY['Meta','Google','Organic','Referral','TikTok','Klaviyo'])[((gs) % 6) + 1] WHEN 'Meta' THEN 'US_WL_Prospecting_v4' WHEN 'Google' THEN 'brand_exact' WHEN 'TikTok' THEN 'creator_seeding' WHEN 'Klaviyo' THEN 'abandoned_flow_2' ELSE 'organic' END,
    'adset', CASE WHEN (ARRAY['Meta','Google','Organic','Referral','TikTok','Klaviyo'])[((gs) % 6) + 1] = 'Meta' THEN (ARRAY['Women 35-54 · GLP-1','Men 30-50 · TRT','LAL 1% purchasers'])[((gs) % 3) + 1] END,
    'creative', CASE WHEN (ARRAY['Meta','Google','Organic','Referral','TikTok','Klaviyo'])[((gs) % 6) + 1] = 'Meta' THEN (ARRAY['UGC_Before_After_08','Static_Rx_Kit_02','VSL_60s_Coral'])[((gs) % 3) + 1] END,
    'landingUrl', CASE WHEN (ARRAY['Tirzepatide','Semaglutide','Hair','ED','TRT'])[((gs) % 5) + 1] IN ('Tirzepatide','Semaglutide') THEN '/weight-loss' ELSE '/' || lower((ARRAY['Tirzepatide','Semaglutide','Hair','ED','TRT'])[((gs) % 5) + 1]) END,
    'firstTouch', ((extract(epoch from now()) * 1000)::bigint - (1 + ((gs * 7) % 96)) * 3600000 - (gs % 4) * 86400000 - 3 * 86400000),
    'lastTouch', ((extract(epoch from now()) * 1000)::bigint - floor((1 + ((gs * 7) % 96)) / 2) * 3600000),
    'sessions', 1 + (gs % 5),
    'deviceType', (ARRAY['mobile','mobile','desktop','tablet'])[((gs) % 4) + 1]
  ),
  CASE WHEN (ARRAY['Tirzepatide','Semaglutide','Hair','ED','TRT'])[((gs) % 5) + 1] = 'Tirzepatide' THEN 299 WHEN (ARRAY['Tirzepatide','Semaglutide','Hair','ED','TRT'])[((gs) % 5) + 1] = 'Semaglutide' THEN 249 WHEN (ARRAY['Tirzepatide','Semaglutide','Hair','ED','TRT'])[((gs) % 5) + 1] = 'Hair' THEN 39 WHEN (ARRAY['Tirzepatide','Semaglutide','Hair','ED','TRT'])[((gs) % 5) + 1] = 'ED' THEN 79 ELSE 149 END,
  (CASE WHEN (ARRAY['Tirzepatide','Semaglutide','Hair','ED','TRT'])[((gs) % 5) + 1] = 'Tirzepatide' THEN 299 WHEN (ARRAY['Tirzepatide','Semaglutide','Hair','ED','TRT'])[((gs) % 5) + 1] = 'Semaglutide' THEN 249 WHEN (ARRAY['Tirzepatide','Semaglutide','Hair','ED','TRT'])[((gs) % 5) + 1] = 'Hair' THEN 39 WHEN (ARRAY['Tirzepatide','Semaglutide','Hair','ED','TRT'])[((gs) % 5) + 1] = 'ED' THEN 79 ELSE 149 END) * CASE WHEN (ARRAY['Tirzepatide','Semaglutide','Hair','ED','TRT'])[((gs) % 5) + 1] IN ('Tirzepatide','Semaglutide') THEN 5 ELSE 3 END,
  CASE WHEN CASE WHEN gs % 21 = 0 THEN 'won' WHEN gs % 17 = 0 THEN 'lost' WHEN gs % 19 = 0 THEN 'do_not_contact' WHEN (ARRAY['landing','intake_start','intake_mid','intake_mid','intake_complete','checkout','payment_fail','abandoned_cart'])[((gs) % 8) + 1] = 'payment_fail' THEN 'working' WHEN LEAST(99, GREATEST(3, round(((ARRAY[8,22,52,52,74,88,94,82])[((gs) % 8) + 1]) * 0.55 + CASE WHEN (1 + ((gs * 7) % 96)) < 12 THEN 25 WHEN (1 + ((gs * 7) % 96)) < 36 THEN 15 WHEN (1 + ((gs * 7) % 96)) < 72 THEN 6 ELSE 0 END + CASE (ARRAY['Meta','Google','Organic','Referral','TikTok','Klaviyo'])[((gs) % 6) + 1] WHEN 'Google' THEN 12 WHEN 'Meta' THEN 10 WHEN 'Referral' THEN 15 WHEN 'Klaviyo' THEN 8 ELSE 4 END + (gs % 5))::int)) >= 70 THEN CASE WHEN gs % 3 = 0 THEN 'working' ELSE 'new' END WHEN LEAST(99, GREATEST(3, round(((ARRAY[8,22,52,52,74,88,94,82])[((gs) % 8) + 1]) * 0.55 + CASE WHEN (1 + ((gs * 7) % 96)) < 12 THEN 25 WHEN (1 + ((gs * 7) % 96)) < 36 THEN 15 WHEN (1 + ((gs * 7) % 96)) < 72 THEN 6 ELSE 0 END + CASE (ARRAY['Meta','Google','Organic','Referral','TikTok','Klaviyo'])[((gs) % 6) + 1] WHEN 'Google' THEN 12 WHEN 'Meta' THEN 10 WHEN 'Referral' THEN 15 WHEN 'Klaviyo' THEN 8 ELSE 4 END + (gs % 5))::int)) >= 45 THEN 'nurturing' ELSE 'new' END = 'new'
    THEN '[]'::jsonb
    ELSE jsonb_build_array(jsonb_build_object('id','or_' || gs || '_1','ts',((extract(epoch from now()) * 1000)::bigint - (1 + ((gs * 7) % 96)) * 3600000 - (gs % 4) * 86400000 + 1800000),'channel','email','by','System','subject','Complete your Blissley intake','outcome','delivered · opened')) END,
  CASE WHEN LEAST(99, GREATEST(3, round(((ARRAY[8,22,52,52,74,88,94,82])[((gs) % 8) + 1]) * 0.55 + CASE WHEN (1 + ((gs * 7) % 96)) < 12 THEN 25 WHEN (1 + ((gs * 7) % 96)) < 36 THEN 15 WHEN (1 + ((gs * 7) % 96)) < 72 THEN 6 ELSE 0 END + CASE (ARRAY['Meta','Google','Organic','Referral','TikTok','Klaviyo'])[((gs) % 6) + 1] WHEN 'Google' THEN 12 WHEN 'Meta' THEN 10 WHEN 'Referral' THEN 15 WHEN 'Klaviyo' THEN 8 ELSE 4 END + (gs % 5))::int)) >= 70 THEN '["priority"]'::jsonb ELSE '[]'::jsonb END,
  CASE WHEN CASE WHEN gs % 21 = 0 THEN 'won' WHEN gs % 17 = 0 THEN 'lost' WHEN gs % 19 = 0 THEN 'do_not_contact' WHEN (ARRAY['landing','intake_start','intake_mid','intake_mid','intake_complete','checkout','payment_fail','abandoned_cart'])[((gs) % 8) + 1] = 'payment_fail' THEN 'working' ELSE 'new' END = 'working' THEN (ARRAY['Andre F.','Priya S.','Ops'])[((gs) % 3) + 1] END,
  CASE WHEN gs % 21 = 0 THEN 'won' WHEN gs % 17 = 0 THEN 'lost' WHEN gs % 19 = 0 THEN 'do_not_contact' WHEN (ARRAY['landing','intake_start','intake_mid','intake_mid','intake_complete','checkout','payment_fail','abandoned_cart'])[((gs) % 8) + 1] = 'payment_fail' THEN 'working' WHEN LEAST(99, GREATEST(3, round(((ARRAY[8,22,52,52,74,88,94,82])[((gs) % 8) + 1]) * 0.55 + CASE WHEN (1 + ((gs * 7) % 96)) < 12 THEN 25 WHEN (1 + ((gs * 7) % 96)) < 36 THEN 15 WHEN (1 + ((gs * 7) % 96)) < 72 THEN 6 ELSE 0 END + CASE (ARRAY['Meta','Google','Organic','Referral','TikTok','Klaviyo'])[((gs) % 6) + 1] WHEN 'Google' THEN 12 WHEN 'Meta' THEN 10 WHEN 'Referral' THEN 15 WHEN 'Klaviyo' THEN 8 ELSE 4 END + (gs % 5))::int)) >= 70 THEN CASE WHEN gs % 3 = 0 THEN 'working' ELSE 'new' END WHEN LEAST(99, GREATEST(3, round(((ARRAY[8,22,52,52,74,88,94,82])[((gs) % 8) + 1]) * 0.55 + CASE WHEN (1 + ((gs * 7) % 96)) < 12 THEN 25 WHEN (1 + ((gs * 7) % 96)) < 36 THEN 15 WHEN (1 + ((gs * 7) % 96)) < 72 THEN 6 ELSE 0 END + CASE (ARRAY['Meta','Google','Organic','Referral','TikTok','Klaviyo'])[((gs) % 6) + 1] WHEN 'Google' THEN 12 WHEN 'Meta' THEN 10 WHEN 'Referral' THEN 15 WHEN 'Klaviyo' THEN 8 ELSE 4 END + (gs % 5))::int)) >= 45 THEN 'nurturing' ELSE 'new' END,
  CASE WHEN gs % 17 = 0 THEN (ARRAY['price','ineligible state','competitor','unresponsive'])[((gs) % 4) + 1] END,
  NULL,
  jsonb_build_array(
    jsonb_build_object('q','Which program are you interested in?','a',(ARRAY['Tirzepatide','Semaglutide','Hair','ED','TRT'])[((gs) % 5) + 1],'ts',((extract(epoch from now()) * 1000)::bigint - (1 + ((gs * 7) % 96)) * 3600000 + 60000)),
    jsonb_build_object('q','What state do you live in?','a',(ARRAY['CA','TX','NY','FL','IL','PA','OH','GA','NC','MI','WA','CO','AZ','MA','VA','NJ'])[((gs * 5) % 16) + 1],'ts',((extract(epoch from now()) * 1000)::bigint - (1 + ((gs * 7) % 96)) * 3600000 + 90000))
  ),
  CASE WHEN (ARRAY['landing','intake_start','intake_mid','intake_mid','intake_complete','checkout','payment_fail','abandoned_cart'])[((gs) % 8) + 1] IN ('checkout','payment_fail','abandoned_cart') THEN jsonb_build_array((ARRAY['Tirzepatide · Monthly','Semaglutide · Monthly','Hair Kit','ED Plan','TRT Consult','Tirzepatide · 3-Month'])[((gs) % 6) + 1]) END,
  CASE WHEN (ARRAY['landing','intake_start','intake_mid','intake_mid','intake_complete','checkout','payment_fail','abandoned_cart'])[((gs) % 8) + 1] IN ('checkout','payment_fail') AND gs % 3 = 0 THEN 'BLISS30' END,
  ((extract(epoch from now()) * 1000)::bigint - (1 + ((gs * 7) % 96)) * 3600000 - (gs % 4) * 86400000),
  ((extract(epoch from now()) * 1000)::bigint - floor((1 + ((gs * 7) % 96)) / 2) * 3600000),
  (ARRAY['Meta','Google','Organic','Referral','TikTok','Klaviyo'])[((gs) % 6) + 1],
  (jsonb_build_object('landing','Landing page','intake_start','Q3 · Health history','intake_mid','Q7 · State','intake_complete','Q12 · Plan select','checkout','Q14 · Payment','payment_fail','Payment · declined','abandoned_cart','Cart · abandoned') ->> (ARRAY['landing','intake_start','intake_mid','intake_mid','intake_complete','checkout','payment_fail','abandoned_cart'])[((gs) % 8) + 1]),
  1 + ((gs * 7) % 96),
  CASE WHEN CASE WHEN gs % 21 = 0 THEN 'won' WHEN gs % 17 = 0 THEN 'lost' WHEN gs % 19 = 0 THEN 'do_not_contact' WHEN (ARRAY['landing','intake_start','intake_mid','intake_mid','intake_complete','checkout','payment_fail','abandoned_cart'])[((gs) % 8) + 1] = 'payment_fail' THEN 'working' ELSE 'new' END = 'new' THEN false ELSE true END
FROM generate_series(0, 41) AS gs;