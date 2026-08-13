import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/home/Footer";
import {
  AnchorRows,
  ArticleChrome,
  BigQuote,
  Byline,
  Callout,
  CheckCard,
  Col,
  CommentThread,
  CrossRow,
  CtaBand,
  CtaButton,
  FaqAccordion,
  Figure,
  H2,
  Highlight,
  Kicker,
  OfferCard,
  P,
  PathCards,
  PullQuote,
  ReviewsTab,
  StickyCta,
  StoryTimeline,
  TestimonialCard,
} from "@/components/advertorial/primitives";

const URL = "https://sweet-confirm-it.lovable.app/advertorial/ruby-miller";
const TITLE = "The Real Reason She Couldn't Lose The Weight — Blissley";
const DESC =
  "Why I built a telehealth company for my own employee, and how she got her life back in a few months. A founder's story about food noise, biology, and what finally worked.";

export const Route = createFileRoute("/advertorial/ruby-miller")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { property: "og:image", content: "https://sweet-confirm-it.lovable.app/assets/adv-ruby-now.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: "https://sweet-confirm-it.lovable.app/assets/adv-ruby-now.jpg" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "The Real Reason She Couldn't Lose The Weight (Hint: It Was Never Willpower)",
          description: DESC,
          mainEntityOfPage: URL,
          image: "https://sweet-confirm-it.lovable.app/assets/adv-ruby-now.jpg",
          author: { "@type": "Organization", name: "Blissley" },
          publisher: { "@type": "Organization", name: "Blissley" },
        }),
      },
    ],
  }),
  component: RubyMillerAdvertorial,
});

function RubyMillerAdvertorial() {
  return (
    <div className="min-h-screen bg-canvas">
      <ArticleChrome />
      <ReviewsTab />

      <article className="pb-24">
        {/* ---------------------------------------------- 1. HOOK */}
        <Col className="pt-7">
          <nav className="mb-5 text-[12px] text-ink/40">
            <Link to="/" className="hover:text-ink/70">
              Home
            </Link>
            <span className="mx-1.5">›</span>
            <span>Stories</span>
            <span className="mx-1.5">›</span>
            <span className="text-ink/60">Weight Loss</span>
          </nav>

          <Kicker>Founder's story</Kicker>
          <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[44px]">
            The Real Reason She Couldn't Lose The Weight{" "}
            <span className="text-ink/45">(Hint: It Was Never Willpower)</span>
          </h1>
          <p className="mt-4 text-[18px] leading-[1.6] text-ink/70 sm:text-[20px]">
            Why I built a telehealth company for{" "}
            <Highlight>my own employee</Highlight>, and how she got her life back in a few months.
          </p>

          <Byline />

          <Figure
            src="/assets/adv-ruby-now.jpg"
            alt="Ruby today, smiling"
            caption="Ruby today. Head of brand development, 34, back in the front of the photo."
            ratio="4 / 5"
          />


          <P lead>If you came from my story, this is the whole thing. Sit with me for a sec.</P>
          <P>
            You know Ruby. Head of brand development. Five and a half years by my side. She helped
            build UO from nothing.
          </P>
          <P>
            And a year ago she told me she couldn't stand looking at herself. That she couldn't be in
            her own skin. That she genuinely thought{" "}
            <strong>the best years of her life were already behind her.</strong>
          </P>
          <P>
            <strong>She's 34.</strong>
          </P>

          <Figure
            src="/assets/adv-ruby-2024.jpg"
            alt="Ruby in 2024, before treatment"
            badge="2024"
            caption="Ruby, 2024. 283 lbs."
            ratio="4 / 5"
          />

          {/* ---------------------------------------------- 2. SITUATION */}
          <H2>She didn't let herself go</H2>
          <P>
            I need you to hear that. Ruby is the hardest working person I know. It crept up on her
            slow. A few lbs a year. Life, stress, sitting at a desk building someone else's dream.
            Until one day it wasn't slow anymore.
          </P>
          <P>
            <strong>First it was the photos.</strong> She started angling herself out of every group
            shot. Then team dinners, she just stopped coming.
          </P>
          <P>
            <strong>Then it was mornings.</strong> Nothing fit. She told me she'd stand in her closet
            and just feel her chest get tight before she'd even left the house.
          </P>
          <P>
            <strong>Then it was the nights.</strong> The food noise. That constant background noise
            of thinking about food all day, every hour, that never shuts up. She'd eat when she
            wasn't hungry and hate herself for it, then do it again an hour later.
          </P>
          <P>And the whole time she kept saying the same thing to herself.</P>

          <Callout>“There has to be something wrong with me.”</Callout>

          <P>
            She'd tried everything. Every diet twice. Lose 10, gain 15. Keto, fasting, the apps, the
            trainers. She said she felt like a fraud, a fake, like it was only a matter of time
            before her own body wrecked whatever effort she put in.
          </P>
          <P>
            That was rock bottom. Not the weight. The feeling that she'd stopped becoming the person
            she wanted to be. And she had no idea that in a few months, all of it was about to
            change.
          </P>

          {/* ---------------------------------------------- 3. WHY NOTHING WORKED */}
          <H2>Why nothing worked</H2>
          <Figure
            src="/assets/adv-crossed-out.webp"
            alt="Crossed-out diet books, gym memberships, meal prep and clinic invoices"
            caption="Everything she tried. Every one of them worked on the wrong thing."
          />
          <P>
            Before I tell you what finally worked, you need to see what didn't. Because I'm guessing
            you, or someone you love, has been down this exact road.
          </P>

          <div className="my-7 rounded-2xl border border-hairline px-5 py-2">
            <CrossRow title="Diets">
              She did all of them. Lost weight every time. Gained it all back every time, plus more.
              Because a diet asks you to white-knuckle a brain that is screaming at you 24/7. Nobody
              wins that fight forever.
            </CrossRow>
            <CrossRow title="“Just eat less, just try harder”">
              That's what every doctor told her. She'd sit across the desk, get told to “try harder,”
              and leave feeling like garbage. One even told her she was “within range.” She was not
              okay, and the system had nothing for her.
            </CrossRow>
            <CrossRow title="The gym">
              Six weeks in, motivation gone, right back where she started. Working out an appetite
              that was already impossible to control just made it worse.
            </CrossRow>
            <CrossRow title="The one thing that actually works">
              They lock it behind $1,300 a month. Months of waiting rooms. Doctors who make you jump
              through hoops and still say no. A whole system built to process you, not help you.
            </CrossRow>
          </div>

          <P>
            Nothing worked. Not really. Not permanently. A few good weeks here and there, enough to
            tease her into thinking maybe this time it'll stick.
          </P>
          <P>
            It never did. And that's when I stopped watching and started digging.
          </P>

          {/* ---------------------------------------------- 4. ROOT CAUSE */}
          <H2>The root cause</H2>
          <P>
            I went insane researching this. Reddit at 3am for weeks. And here's what nobody had told
            Ruby, told any of these millions of people saying the exact same words:
          </P>

          <PullQuote>It was never willpower.</PullQuote>

          <P>
            There's a signal between your gut and your brain that tells you when you're full and
            shuts the cravings off. In a lot of people that signal is broken or too weak. So the
            brain never gets the “you're full, you can stop now” message. The food noise never turns
            off. <strong>It's not a character flaw. It's biology.</strong>
          </P>

          <Figure
            src="/assets/adv-gut-brain.png"
            alt="Diagram of the gut-brain fullness signal"
            caption="The OFF switch most diets can't touch."
          />

          <Callout>
            Every diet Ruby ever failed, she failed because they all attack the same broken thing
            from the same wrong angle. Willpower. Motivation. Discipline. None of them touch the
            actual signal.
          </Callout>

          <P>
            Her failures were never her fault. <strong>She was fighting biology with a pep talk.</strong>
          </P>
          <P>
            And that one broken signal? There's now real, prescribed medication that fixes exactly
            it. The same class of medication you've heard about. The one everyone's quietly on. It's
            not a gimmick, not a tea, not a supplement. It's the real thing, and it does the one
            thing every diet never could.
          </P>

          {/* ---------------------------------------------- 5. MECHANISM */}
          <H2>The mechanism</H2>
          <Figure
            src="/assets/adv-product.webp"
            alt="Blissley compounded semaglutide vial and box"
            caption="Prescribed by a licensed physician. Shipped to your door."
          />
          <P>
            The medication is called a <strong>GLP-1</strong> (semaglutide and tirzepatide, the same
            ones you've heard of). It's FDA-approved. A real licensed doctor prescribes it. And it
            works on the actual root cause, not around it.
          </P>
          <P>
            It restores the fullness signal. The cravings quiet down. The food noise, that voice that
            never shut up, gets turned way down for the first time in years. You eat less because
            you're actually full, not because you're forcing yourself.
          </P>
          <P>
            Here's the thing nobody tells you: the pill, the diet, the gym, none of them do this.{" "}
            <Highlight>Only the medication touches the signal.</Highlight> That's why it works when
            everything else failed.
          </P>
          <P>
            But the medication was never the hard part. Getting it was. $1,300 a month. Endless
            waiting rooms. Doctors who say no.
          </P>
          <P>
            So I built the opposite. It's called <strong>Blissley.</strong> Sister company to UO.
          </P>

          <CheckCard
            title="What we built"
            items={[
              "Real licensed doctors, not a chatbot",
              "The real medication, the good stuff, prescribed to you",
              "Honest pricing, nowhere near $1,300",
              "A real human that actually answers when you call",
              "Ships straight to your door, no clinic, no judgment",
            ]}
          />

          <P>
            You fill out a quick form, a real doctor reviews it, and if you qualify, it shows up at
            your door. That's it.
          </P>
        </Col>

        <CtaBand />

        {/* ---------------------------------------------- 6. PROOF */}
        <Col>
          <H2>Ruby was our very first patient</H2>
          <P>Here's what actually happened.</P>

          <Figure
            src="/assets/adv-ruby-ba.png"
            alt="Ruby before and after treatment, side by side"
            caption="Ruby, before and after. Individual results vary."
          />

          <StoryTimeline
            steps={[
              {
                label: "Week 1",
                body: "The food noise got quieter. Not gone. Quieter. Like someone finally turned down a volume that had been blasting for years. She said it was the first time in forever her head felt calm.",
              },
              {
                label: "Week 3",
                body: "She stopped grazing. She'd eat, feel full, and just… stop. She told me she caught herself throwing away half a plate and stared at it because she'd never done that in her adult life.",
              },
              {
                label: "Week 6",
                body: "First real drop on the scale. She showed me the number and started crying at her desk.",
              },
              {
                label: "Month 3",
                body: "She was back in the group photos. Front and center. She came to team dinner and actually ate slow and laughed.",
              },
              {
                label: "Last week",
                body: "She told me, word for word, that this is the only thing that's ever worked.",
              },
            ]}
          />

          <BigQuote who="Ruby, 34 · Head of brand development">
            I got my life back. This is the only thing that's ever worked.
          </BigQuote>

          <P>
            She said men hit on her now, and that's new. She said she's got her confidence back to
            dress the way she wants. She's not the person who angled out of photos anymore.
          </P>
          <P>
            <strong>That is the entire reason I'm putting this in front of you.</strong>
          </P>

          {/* ---------------------------------------------- 7. OBJECTIONS */}
          <div id="reviews" className="scroll-mt-24">
            <H2>Ruby's not the only one</H2>
          </div>
          <P>Since we launched two months ago, we've heard it over and over.</P>

          <Figure
            src="/assets/adv-patient-ba.jpg"
            alt="Patient before and after photos"
            caption="Consented patient photos. Individual results vary."
          />

          <div className="my-7 grid gap-4 md:grid-cols-2">
            <TestimonialCard
              name="Verified patient"
              tag="Failed everything before"
              quote="I tried so many different medications, diets, supplements. This is the only thing that has ever helped me."
            />
            <TestimonialCard
              name="Verified patient"
              tag="The milestone"
              quote="Welcome to Onederland. Under 200 for the first time in 16 years. I didn't think I'd ever see that number."
            />
            <TestimonialCard
              name="Verified patient"
              tag="The emotional one"
              quote="I've gotten parts of myself back I thought were gone forever."
            />
            <TestimonialCard
              name="Verified patient"
              tag="The food noise"
              quote="The noise in my head about food finally went quiet. I can't explain what that's worth."
            />
          </div>

          <H2>You might be wondering…</H2>
          <FaqAccordion
            items={[
              {
                q: "If this works so well, why didn't my doctor just give it to me?",
                a: "Because your doctor has 12 minutes with you and a system that rewards sending you home, not fixing the signal. We're not saying doctors are bad. The system they work in isn't built for this.",
              },
              {
                q: "Is this safe?",
                a: "It's FDA-approved medication, prescribed and monitored by a real licensed doctor who reviews your intake first. If you don't qualify, you don't get prescribed. Simple.",
              },
              {
                q: "What if it doesn't work for me?",
                a: "Then a real human helps you adjust or stop. You're never stuck talking to a wall.",
              },
            ]}
          />
        </Col>

        <CtaBand />

        {/* ---------------------------------------------- 8. PRICE */}
        <Col>
          <H2>Let's talk about what this is worth</H2>
          <Figure
            src="/assets/adv-anchor-list.webp"
            alt="Handwritten list of what people spend before Blissley"
            caption="What people spend before Blissley."
          />
          <P>
            People spend thousands on diets that fail. $600 a year on a gym they stop going to. And
            the clinics gatekeeping the real medication charge <strong>$1,300 a month</strong> to hand
            you the exact same thing.
          </P>

          <AnchorRows
            rows={[
              { label: "Diets, programs, apps", price: "$2,000+" },
              { label: "Gym membership", price: "$600/yr" },
              { label: "Other weight-loss clinics", price: "$1,300/mo" },
            ]}
            final={{ label: "Blissley — real doctor, real medication, delivered", price: "$249/mo" }}
          />

          <P>
            And because you came from UO, and because Ruby's results made this personal for me, I'm
            doing something I won't do again:
          </P>
          <P>
            <Highlight>For the next 24 hours, UO fam gets 45% off your first month.</Highlight>
          </P>

          <OfferCard />

          {/* ---------------------------------------------- 9. CLOSE */}
          <H2>Here's what I'd tell you if you were my sister</H2>
          <P>
            <strong>You're at a crossroads.</strong>
          </P>

          <PathCards />

          <P>
            Real doctors. Real medication. A real human that answers. And if it's not right for you,
            a real person helps you stop, no runaround.
          </P>
          <P>
            The 45% off dies in 24 hours. And the food noise will still be there tomorrow if you let
            it.
          </P>
          <P>
            <strong>Don't let that be your story.</strong>
          </P>

          <div className="my-8">
            <CtaButton />
            <p className="mt-3 text-center text-[12.5px] text-ink/50">
              2-minute quiz · Reviewed by a licensed physician · Cancel anytime
            </p>
          </div>

          {/* ---------------------------------------------- 10. COMMENTS */}
          <div className="mt-14 border-t border-hairline pt-8">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-[20px] font-bold tracking-tight text-ink">Comments</h2>
              <span className="text-[12.5px] text-ink/45">412 comments</span>
            </div>

            <CommentThread
              comments={[
                {
                  name: "Danielle R.",
                  body: "does this actually work or is it another scam",
                  time: "3h",
                  likes: 84,
                  reply:
                    "It's prescription medication reviewed by a licensed physician — if you don't qualify, you're not prescribed. The quiz takes 2 minutes.",
                },
                {
                  name: "Marissa K.",
                  body: "the food noise stopping is not something i can explain to people who never had it. life changing.",
                  time: "5h",
                  likes: 211,
                },
                {
                  name: "Tonya B.",
                  body: "how long does shipping take?",
                  time: "7h",
                  likes: 19,
                  reply: "Mine came in a few days — ships straight to your door once approved.",
                },
                {
                  name: "Jess M.",
                  body: "45% off?? just did the quiz",
                  time: "9h",
                  likes: 47,
                },
              ]}
            />
          </div>

          {/* fine print */}
          <div className="mt-10 space-y-3 rounded-2xl bg-ink/[0.03] p-5 text-[12px] leading-[1.7] text-ink/50">
            <p>
              <strong className="text-ink/70">Results vary.</strong> Individual results differ based
              on starting weight, adherence, medical history and lifestyle. Nothing on this page is a
              promise or guarantee of any specific outcome.
            </p>
            <p>
              All testimonials, photos and comments are from real Blissley patients who provided
              written consent. Compensation may have been provided for the use of a photo or quote.
            </p>
            <p>
              This page is for general information and is not medical advice, diagnosis or treatment.
              Prescription products require an evaluation by a licensed healthcare provider, who will
              determine if a prescription is appropriate. Compounded medications are not
              FDA-approved; the active ingredients referenced are FDA-approved. Talk to your provider
              about risks and side effects.
            </p>
          </div>
        </Col>
      </article>

      <StickyCta />
      <Footer />
    </div>
  );
}
