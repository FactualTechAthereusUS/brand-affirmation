export function AnnouncementBar() {
  return (
    <div
      className="sticky top-0 z-50 w-full text-white"
      style={{
        background:
          "linear-gradient(90deg, #ee6a6a 0%, #f28a72 50%, #f6a97e 100%)",
      }}
    >
      <a
        href="#"
        className="mx-auto flex min-h-[36px] max-w-7xl items-center justify-center gap-2 whitespace-nowrap px-4 py-2 text-center text-[12px] font-medium tracking-[0.02em] md:text-[13px]"
      >
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
