export function AnnouncementBar() {
  return (
    <div
      className="w-full text-white"
      style={{
        background:
          "linear-gradient(90deg, #ee6a6a 0%, #f28a72 50%, #f6a97e 100%)",
      }}
    >
      <a
        href="#"
        className="mx-auto flex min-h-[36px] max-w-7xl items-center justify-center px-4 py-2 text-center text-[12px] font-medium tracking-[0.02em] md:text-[13px]"
      >
        Now accepting patients in all 50 states
        <span className="mx-2">→</span>
        <span className="underline underline-offset-2">
          Start Your Free Assessment
        </span>
      </a>
    </div>
  );
}
