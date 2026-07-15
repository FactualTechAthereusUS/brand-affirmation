const logos = [
  { name: "Forbes", src: "https://www.vectorlogo.zone/logos/forbes/forbes-wordmark.svg" },
  { name: "Bloomberg", src: "https://www.vectorlogo.zone/logos/bloomberg/bloomberg-ar21~bgwhite.svg" },
  { name: "Washington Post", src: "https://www.vectorlogo.zone/logos/washingtonpost/washingtonpost-wordmark.svg" },
  { name: "WebMD", src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/WebMD_logo.svg" },
  { name: "Today", src: "https://upload.wikimedia.org/wikipedia/commons/7/76/Today_logo.svg" },
  { name: "Featured 1", src: "https://framerusercontent.com/images/L873MSfptJNuxu9CxFGM0yz62ws.png?scale-down-to=512&width=640&height=144" },
  { name: "Featured 2", src: "https://framerusercontent.com/images/EdyKCuzUOhXKfrGJ5nlGuZBGlFk.png?width=403&height=125" },
  { name: "Featured 3", src: "https://framerusercontent.com/images/2fynBufOyZQGmqKnfJSdf8sI1rs.png?width=1893&height=368" },
];

export function PressLogos() {
  // Duplicate for seamless infinite loop
  const loop = [...logos, ...logos];

  return (
    <section className="bg-white px-6 py-10 md:py-12">
      <p className="text-center text-[11px] font-medium uppercase tracking-[0.18em] text-[#9A9A9A]">
        <span className="inline-flex items-center gap-3">
          <span className="h-px w-8 bg-[#D9D9D9]" />
          As featured in
          <span className="h-px w-8 bg-[#D9D9D9]" />
        </span>
      </p>

      {/* Desktop: static row */}
      <div className="mt-6 hidden lg:flex items-center justify-center gap-14 xl:gap-20">
        {logos.map((l) => (
          <img
            key={l.name}
            src={l.src}
            alt={l.name}
            className="h-7 w-auto max-w-[140px] object-contain opacity-70 grayscale transition hover:opacity-100"
            loading="lazy"
          />
        ))}
      </div>

      {/* Mobile & Tablet: infinite marquee */}
      <div className="press-marquee mt-6 lg:hidden">
        <div className="press-marquee__track">
          {loop.map((l, i) => (
            <img
              key={`${l.name}-${i}`}
              src={l.src}
              alt={l.name}
              className="press-marquee__logo"
              loading="lazy"
            />
          ))}
        </div>
      </div>

      <style>{`
        .press-marquee {
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
        }
        .press-marquee__track {
          display: flex;
          align-items: center;
          gap: 3rem;
          width: max-content;
          animation: press-scroll 32s linear infinite;
        }
        .press-marquee__logo {
          height: 28px;
          width: auto;
          max-width: 130px;
          object-fit: contain;
          opacity: 0.7;
          filter: grayscale(100%);
          flex-shrink: 0;
        }
        @keyframes press-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .press-marquee__track { animation: none; }
        }
      `}</style>
    </section>
  );
}
