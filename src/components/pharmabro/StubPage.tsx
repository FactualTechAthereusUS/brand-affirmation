import { Link } from "@tanstack/react-router";
import {
  Btn,
  Chip,
  Container,
  MicroLabel,
  Reveal,
  Section,
  TwoTone,
} from "./primitives";

/**
 * Interim page shell used by routes whose full content is built in a later
 * phase. Renders real nav-reachable copy and CTAs so the site is never blank
 * and internal links stay crawlable.
 */
export function StubPage({
  eyebrow,
  lead,
  trail,
  intro,
  points,
}: {
  eyebrow: string;
  lead: string;
  trail?: string;
  intro: string;
  points?: string[];
}) {
  return (
    <>
      <Section className="pt-12 sm:pt-16">
        <Container size="wide">
          <Reveal>
            <MicroLabel className="mb-5">{eyebrow}</MicroLabel>
            <TwoTone as="h1" lead={lead} trail={trail} className="max-w-[880px]" />
            <p className="pb-body mt-6 max-w-[620px] text-[16px] leading-relaxed sm:text-[17px]">
              {intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <Btn to="/pharmabro/booking" size="lg">
                Book a demo
              </Btn>
              <Btn to="/pharmabro/pricing" variant="ghost" size="lg">
                See pricing
              </Btn>
            </div>
          </Reveal>
        </Container>
      </Section>

      {points?.length ? (
        <Section band className="py-14 sm:py-16">
          <Container size="wide">
            <div className="grid gap-px overflow-hidden rounded-xl border border-[var(--color-hairline)] bg-[var(--color-hairline)] sm:grid-cols-3">
              {points.map((p, i) => (
                <Reveal key={p} delay={i * 0.06} className="bg-canvas p-6">
                  <MicroLabel className="mb-3">
                    {String(i + 1).padStart(2, "0")}
                  </MicroLabel>
                  <p className="text-[14.5px] leading-relaxed text-ink">{p}</p>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section className="py-14 sm:py-16">
        <Container size="wide">
          <Chip to="/pharmabro">Back to overview</Chip>
          <p className="pb-body mt-4 max-w-[620px] text-[14px] leading-relaxed">
            Want the numbers for your own patient volume? Our team will model
            your margin against your current platform on a 20 minute call.{" "}
            <Link
              to="/pharmabro/contact"
              className="font-medium text-[var(--color-marine)] underline underline-offset-2"
            >
              Talk to us
            </Link>
            .
          </p>
        </Container>
      </Section>
    </>
  );
}
