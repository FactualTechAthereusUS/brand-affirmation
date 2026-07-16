import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "@tanstack/react-router";
import { Nav } from "@/components/home/Nav";
import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { Footer } from "@/components/home/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Reveal } from "@/components/Reveal";

interface LegalPageProps {
  eyebrow: string;
  title: string;
  content: string;
}

export function LegalPage({ eyebrow, title, content }: LegalPageProps) {
  return (
    <SmoothScroll>
      <div className="bg-canvas text-ink">
        <AnnouncementBar />
        <Nav />

        {/* Header */}
        <header className="relative overflow-hidden pt-28 pb-14 md:pt-36 md:pb-20">
          {/* Ambient glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-60"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 0%, rgba(238,114,115,0.18) 0%, rgba(238,114,115,0) 70%)",
            }}
          />
          <div className="relative mx-auto max-w-3xl px-6">
            <Reveal>
              <Link
                to="/"
                className="mb-6 inline-flex items-center gap-1.5 text-[12px] text-ink/50 hover:text-ink"
              >
                <span aria-hidden>←</span> Back to home
              </Link>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-ink/70 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ee7273]" />
                {eyebrow}
              </div>
              <h1 className="text-[40px] leading-[1.02] md:text-[64px] font-medium tracking-tight text-ink">
                {title.split(" ").map((w, i, arr) =>
                  i === arr.length - 1 ? (
                    <span key={i} className="font-serif italic font-normal">
                      {w}
                    </span>
                  ) : (
                    <span key={i}>{w} </span>
                  )
                )}
              </h1>
            </Reveal>
          </div>
        </header>

        {/* Content */}
        <main className="pb-24 md:pb-32">
          <div className="mx-auto max-w-3xl px-6">
            <Reveal>
              <article className="legal-prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </article>
            </Reveal>

            {/* Contact card */}
            <div className="mt-14 rounded-3xl border border-black/8 bg-white/70 p-6 backdrop-blur md:mt-20 md:p-8">
              <p className="text-[11px] uppercase tracking-[0.14em] text-ink/50">Questions?</p>
              <h3 className="mt-2 text-[22px] font-medium tracking-tight md:text-[26px]">
                We're here to help.
              </h3>
              <p className="mt-2 text-[14px] text-ink/60">
                Email{" "}
                <a
                  href="mailto:support@blissley.com"
                  className="text-[#ee7273] underline underline-offset-4"
                >
                  support@blissley.com
                </a>{" "}
                and a real human will get back to you.
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}
