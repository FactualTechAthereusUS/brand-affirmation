type Props = {
  label: string;
  className?: string;
  tone?: "warm" | "sage" | "clay" | "sand" | "dusk" | "morning";
};

const tones: Record<NonNullable<Props["tone"]>, string> = {
  warm: "bg-[linear-gradient(135deg,#e8dfd0_0%,#c9b99a_100%)]",
  sage: "bg-[linear-gradient(135deg,#c9d1bd_0%,#818263_100%)]",
  clay: "bg-[linear-gradient(135deg,#e4c9b8_0%,#c4998a_100%)]",
  sand: "bg-[linear-gradient(135deg,#f0ebe3_0%,#d8d2c7_100%)]",
  dusk: "bg-[linear-gradient(135deg,#b8c2d1_0%,#8b9bb4_100%)]",
  morning: "bg-[linear-gradient(135deg,#f5e6c9_0%,#c4a265_100%)]",
};

export function Placeholder({ label, className = "", tone = "warm" }: Props) {
  return (
    <div
      className={`relative flex items-end overflow-hidden ${tones[tone]} ${className}`}
    >
      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-white/90 backdrop-blur-sm">
        {label}
      </span>
    </div>
  );
}
