import { Link } from "@tanstack/react-router";
import {
  Btn,
  Card,
  Check,
  Container,
  Cross,
  MicroLabel,
  Reveal,
  RevealGroup,
  RevealItem,
  Section,
  TwoTone,
} from "./primitives";
import { Faq } from "./Faq";
import { siblingCompares, type CompareEntry } from "@/lib/pharmabro/compare";

function Mark({ value, own }: { value: string | boolean; own?: boolean }) {
  if (value === true) return <Check />;
  if (value === false) return <Cross />;
  if (value === "—") return <span className="pb-dim text-[13px]">—</span>;
  return (
    <span
      className={
        own
          ? "text-[13px] font-medium leading-snug text-[var(--color-check)]"
          : "text-[13px] leading-snug text-[color-mix(in_oklab,var(--color-ink)_58%,transparent)]"
      }
    >
      {value}
    </span>
  );
}

export function ComparePage({ entry }: { entry: CompareEntry }) {
  const siblings = siblingCompares(entry.slug);

  return (
    <>
      {/* ---------------------------------------------------------- hero */}
      <Section className="pt-10 sm:pt-14">
        <Container size="wide">
          <Reveal>
            <nav aria-label="Breadcrumb" className="pb-micro mb-6 flex flex-wrap items-center gap-2">
              <Link to="/pharmabro" className="hover:text-ink">
                Home
              </Link>
              <span aria-hidden>/</span>
              <Link to="/pharmabro/compare" className="hover:text-ink">
                Compare
              </Link>
              <span aria-hidden>/</span>
              <span className="text-ink">PharmaBro vs {entry.competitor}</span>
            </nav>

            <div className="mb-5 flex flex-wrap items-center gap-2.5">
              <MicroLabel>{entry.category}</MicroLabel>
              <span className="pb-micro rounded-full border border-[var(--color-hairline)] px-2.5 py-1">
                Updated August 2026
              </span>
            </div>

            <TwoTone as="h1" lead={entry.h1Lead} trail={entry.h1Trail} className="max-w-[900px]" />
            <p className="pb-body mt-6 max-w-[680px] text-[16px] leading-relaxed sm:text-[17px]">
              {entry.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <Btn to="/pharmabro/demo" size="lg">
                Book a demo
              </Btn>
              <Btn to="/pharmabro/pricing" variant="ghost" size="lg">
                View pricing
              </Btn>
            </div>
          </Reveal>

          {entry.banner ? (
            <Reveal delay={0.08}>
              <div className="mt-10 max-w-[820px] rounded-xl border border-[color-mix(in_oklab,var(--color-ever)_35%,transparent)] bg-[color-mix(in_oklab,var(--color-ever)_6%,white)] p-5">
                <div className="pb-micro mb-2 text-[var(--color-ever)]">{entry.banner.label}</div>
                <p className="text-[14.5px] leading-relaxed text-ink">{entry.banner.text}</p>
              </div>
            </Reveal>
          ) : null}
        </Container>
      </Section>

      {/* -------------------------------------------- direct answer + takeaways */}
      <Section band className="py-14 sm:py-16">
        <Container size="wide">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal>
              <Card className="h-full">
                <MicroLabel className="mb-3">Direct answer</MicroLabel>
                <h3 className="sr-only">Direct answer</h3>
                <p className="text-[16px] leading-relaxed text-ink sm:text-[17px]">
                  {entry.directAnswer}
                </p>
              </Card>
            </Reveal>
            <Reveal delay={0.08}>
              <Card className="h-full">
                <MicroLabel className="mb-4">Key takeaways</MicroLabel>
                <ul className="space-y-2.5">
                  {entry.takeaways.map((t) => (
                    <li key={t} className="flex gap-2.5">
                      <Check className="mt-[3px] shrink-0" />
                      <span className="pb-body text-[14.5px] leading-relaxed">{t}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------------------- table */}
      <Section>
        <Container size="wide">
          <Reveal>
            <MicroLabel className="mb-5">Side by side</MicroLabel>
            <TwoTone
              lead={`PharmaBro vs ${entry.competitor},`}
              trail="line by line."
              className="max-w-[760px]"
            />
          </Reveal>

          <Reveal delay={0.06} className="mt-10">
            <div className="overflow-hidden rounded-xl border border-[var(--color-hairline)]">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--color-hairline)]">
                    <th className="pb-micro w-[42%] px-4 py-3.5 font-normal sm:px-5">Capability</th>
                    <th className="w-[29%] bg-[color-mix(in_oklab,var(--color-marine)_5%,white)] px-4 py-3.5 text-[13px] font-medium text-ink sm:px-5">
                      PharmaBro
                    </th>
                    <th className="w-[29%] px-4 py-3.5 text-[13px] font-medium text-[color-mix(in_oklab,var(--color-ink)_60%,transparent)] sm:px-5">
                      {entry.competitor}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {entry.rows.map((r) => (
                    <tr
                      key={r.capability}
                      className="border-b border-[var(--color-hairline)] last:border-0"
                    >
                      <td className="px-4 py-3.5 text-[13.5px] leading-snug text-ink sm:px-5">
                        {r.capability}
                      </td>
                      <td className="bg-[color-mix(in_oklab,var(--color-marine)_5%,white)] px-4 py-3.5 align-middle sm:px-5">
                        <Mark value={r.us} own />
                      </td>
                      <td className="px-4 py-3.5 align-middle sm:px-5">
                        <Mark value={r.them} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          {entry.methodology ? (
            <Reveal delay={0.05}>
              <p className="pb-dim mt-5 max-w-[720px] text-[13px] leading-relaxed">
                <span className="pb-micro mr-2">Methodology</span>
                {entry.methodology}
              </p>
            </Reveal>
          ) : null}
        </Container>
      </Section>

      {/* --------------------------------------------------------- the math */}
      {entry.math ? (
        <Section band>
          <Container size="wide">
            <Reveal>
              <MicroLabel className="mb-5">The math</MicroLabel>
              <TwoTone lead="What the difference costs" trail="per year." className="max-w-[700px]" />
              <p className="pb-body mt-5 max-w-[620px] text-[15px] leading-relaxed">
                {entry.math.note}
              </p>
            </Reveal>

            <Reveal delay={0.06} className="mt-9">
              <div className="overflow-hidden rounded-xl border border-[var(--color-hairline)] bg-canvas">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[var(--color-hairline)]">
                      <th className="pb-micro px-4 py-3.5 font-normal sm:px-5">Line</th>
                      <th className="px-4 py-3.5 text-[13px] font-medium text-ink sm:px-5">
                        PharmaBro
                      </th>
                      <th className="px-4 py-3.5 text-[13px] font-medium text-[color-mix(in_oklab,var(--color-ink)_60%,transparent)] sm:px-5">
                        {entry.competitor}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {entry.math.rows.map((r) => (
                      <tr
                        key={r.label}
                        className="border-b border-[var(--color-hairline)] last:border-0"
                      >
                        <td className="px-4 py-3.5 text-[13.5px] text-ink sm:px-5">{r.label}</td>
                        <td className="px-4 py-3.5 text-[14px] font-medium text-[var(--color-check)] sm:px-5">
                          {r.us}
                        </td>
                        <td className="px-4 py-3.5 text-[14px] text-[color-mix(in_oklab,var(--color-ink)_62%,transparent)] sm:px-5">
                          {r.them}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {entry.math.footnote ? (
                <p className="pb-dim mt-4 text-[13px]">{entry.math.footnote}</p>
              ) : null}
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {/* ------------------------------------------------------ choose which */}
      {entry.chooseUs || entry.chooseThem ? (
        <Section>
          <Container size="wide">
            <RevealGroup className="grid gap-px overflow-hidden rounded-xl border border-[var(--color-hairline)] bg-[var(--color-hairline)] md:grid-cols-2">
              {entry.chooseUs ? (
                <RevealItem className="bg-canvas p-6 sm:p-8">
                  <MicroLabel className="mb-3">Choose PharmaBro</MicroLabel>
                  <p className="pb-body text-[15px] leading-relaxed">{entry.chooseUs}</p>
                </RevealItem>
              ) : null}
              {entry.chooseThem ? (
                <RevealItem className="bg-canvas p-6 sm:p-8">
                  <MicroLabel className="mb-3">Choose {entry.competitor}</MicroLabel>
                  <p className="pb-body text-[15px] leading-relaxed">{entry.chooseThem}</p>
                </RevealItem>
              ) : null}
            </RevealGroup>
          </Container>
        </Section>
      ) : null}

      {/* ------------------------------------------------------------- FAQ */}
      <Faq
        band
        items={entry.faqs}
        eyebrow="FAQ"
        lead={`PharmaBro vs ${entry.competitor},`}
        trail="answered."
      />

      {/* --------------------------------------------------------- sources */}
      {entry.sources?.length ? (
        <Section className="py-12 sm:py-14">
          <Container size="wide">
            <Reveal>
              <MicroLabel className="mb-4">Sources</MicroLabel>
              <ul className="space-y-2">
                {entry.sources.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-[14px] text-[var(--color-marine)] underline decoration-[color-mix(in_oklab,var(--color-marine)_35%,transparent)] underline-offset-4 hover:decoration-[var(--color-marine)]"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {/* -------------------------------------------------- other compares */}
      <Section band className="py-14 sm:py-16">
        <Container size="wide">
          <Reveal>
            <MicroLabel className="mb-5">Other comparisons</MicroLabel>
          </Reveal>
          <RevealGroup className="grid gap-px overflow-hidden rounded-xl border border-[var(--color-hairline)] bg-[var(--color-hairline)] sm:grid-cols-3">
            {siblings.map((s) => (
              <RevealItem key={s.slug} className="bg-canvas">
                <Link
                  to="/pharmabro/compare/$slug"
                  params={{ slug: s.slug }}
                  className="block h-full p-6 transition-colors hover:bg-[var(--color-mist)]"
                >
                  <div className="pb-micro mb-3">{s.category}</div>
                  <div className="text-[16px] font-medium text-ink">
                    PharmaBro vs {s.competitor}
                  </div>
                  <p className="pb-body mt-2 text-[13.5px] leading-relaxed">{s.teaser}</p>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.1} className="mt-10">
            <div className="flex flex-col gap-4 rounded-xl border border-[var(--color-hairline)] bg-canvas p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <p className="max-w-[520px] text-[18px] leading-snug text-ink sm:text-[20px]">
                {entry.ctaLine}
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Btn to="/pharmabro/demo">Book a demo</Btn>
                <Btn to="/pharmabro/pricing" variant="ghost">
                  View pricing
                </Btn>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
