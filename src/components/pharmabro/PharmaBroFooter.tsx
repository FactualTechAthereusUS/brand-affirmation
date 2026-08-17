import { Link } from "@tanstack/react-router";
import {
  FOOTER_COLUMNS,
  FOOTER_LEGAL,
  FOOTER_DISCLAIMER,
} from "@/lib/pharmabro/nav";
import { TRUST_MARKS } from "@/lib/pharmabro/home";
import { Container } from "./primitives";
import { PharmaBroWordmark } from "./PharmaBroNav";

export function PharmaBroFooter() {
  return (
    <footer className="border-t border-[var(--color-hairline)] bg-canvas">
      <Container size="full" className="py-14 lg:py-16">
        {/* programmatic link grid: 5 columns, every internal page reachable */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {FOOTER_COLUMNS.map((col) => (
            <nav key={col.label} aria-label={col.label}>
              <h2 className="pb-micro mb-4">{col.label}</h2>
              <ul className="space-y-2.5">
                {col.items.map((it) => (
                  <li key={it.to + it.label}>
                    <Link
                      to={it.to}
                      className="text-[13.5px] leading-snug text-[color-mix(in_oklab,var(--color-ink)_62%,transparent)] transition-colors hover:text-ink"
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* trust pills */}
        <div className="mt-14 flex flex-wrap gap-2 border-t border-[var(--color-hairline)] pt-8">
          {TRUST_MARKS.map((t) => (
            <span
              key={t}
              className="rounded-full border border-[var(--color-hairline)] bg-[var(--color-mist)] px-3 py-1.5 text-[12px] font-medium text-[color-mix(in_oklab,var(--color-ink)_70%,transparent)]"
            >
              {t}
            </span>
          ))}
        </div>

        <p className="pb-body mt-8 max-w-[820px] text-[12.5px] leading-relaxed">
          {FOOTER_DISCLAIMER}
        </p>

        <div className="mt-8 flex flex-col gap-4 border-t border-[var(--color-hairline)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/pharmabro" aria-label="PharmaBro home">
            <PharmaBroWordmark />
          </Link>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {FOOTER_LEGAL.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-[12.5px] text-[color-mix(in_oklab,var(--color-ink)_55%,transparent)] transition-colors hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
            <span className="pb-micro">© 2026 PharmaBro</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
