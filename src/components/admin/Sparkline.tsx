export function Sparkline({
  data, stroke = "#171717", fill = "rgba(23,23,23,0.06)", height = 28, className = "",
}: { data: number[]; stroke?: string; fill?: string; height?: number; className?: string }) {
  if (data.length < 2) return <svg className={`block h-full w-full ${className}`} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${height - ((v - min) / range) * (height - 4) - 2}`);
  const line = `M${pts.join(" L")}`;
  const area = `${line} L100,${height} L0,${height} Z`;
  return (
    <svg className={`block h-full w-full ${className}`} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
      <path d={area} fill={fill} />
      <path d={line} fill="none" stroke={stroke} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
