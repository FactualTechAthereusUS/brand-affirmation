export function AnnouncementBar() {
  return (
    <div
      id="announcement-bar"
      className="sticky top-0 z-50 w-full bg-white text-ink"
    >
      <a
        href="#"
        className="mx-auto flex min-h-[36px] max-w-7xl items-center justify-center gap-2 whitespace-nowrap px-4 py-2 text-center font-sans text-[12px] font-semibold tracking-[0.02em] md:text-[13px]"
        <span className="hidden sm:inline">
          Limited time: 50% off your 1st month of membership!
        </span>
        <span className="sm:hidden">
          Limited time: 50% off your 1st month!
        </span>
        <span>→</span>
      </a>
    </div>
  );
}
