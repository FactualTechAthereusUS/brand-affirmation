const logos = ["Forbes", "Women's Health", "Healthline", "USA Today", "WebMD", "Vogue"];

export function PressLogos() {
  return (
    <section className="bg-white px-6 py-8">
      <p className="text-center text-[10px] font-medium uppercase tracking-[0.1em] text-[#9A9A9A]">
        As featured in
      </p>
      <div className="no-scrollbar mt-5 flex items-center gap-9 overflow-x-auto md:justify-center">
        {logos.map((name) => (
          <span
            key={name}
            className="shrink-0 font-display text-[18px] italic text-[#9A9A9A] opacity-45 grayscale"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
