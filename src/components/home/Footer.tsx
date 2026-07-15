import logo from "@/assets/blissley-logo.png.asset.json";

const col1 = ["Treatments", "Weight Loss", "Skin & Hair", "Sexual Health", "Longevity"];
const col2 = ["About", "Blog", "Contact", "FAQ", "Careers"];

export function Footer() {
  return (
    <footer className="bg-ink px-6 py-12 text-white md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div>
            <img src={logo.url} alt="Blissley" className="h-6 w-auto invert md:h-7" />
            <p className="mt-3 max-w-xs font-display text-[14px] italic text-white/50 md:text-[15px]">
              Become who you were always supposed to be.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:gap-16">
            <ul className="space-y-2.5">
              {col1.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[14px] text-white/60 hover:text-white">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="space-y-2.5">
              {col2.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[14px] text-white/60 hover:text-white">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-wrap gap-x-3 gap-y-2 text-[12px] text-white/40">
            <a href="#" className="hover:text-white/70">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-white/70">Terms</a>
            <span>·</span>
            <a href="#" className="hover:text-white/70">HIPAA Notice</a>
            <span>·</span>
            <a href="#" className="hover:text-white/70">Cancellation Policy</a>
          </div>

          <p className="mt-5 text-[12px] text-white/35">
            © 2026 TheFactual LLC DBA Blissley
          </p>

          <p className="mt-4 max-w-3xl text-[11px] leading-[1.6] text-white/30">
            Blissley is a technology platform and does not provide medical advice.
            Physician services are provided by independent licensed practitioners.
            Individual results may vary.
          </p>

          <div className="mt-5 flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.1em] text-white/30">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Amex</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
