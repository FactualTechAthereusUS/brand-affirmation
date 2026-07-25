import { X } from "lucide-react";

const ROWS: [string, string][] = [
  ["G", "Switch to globe view"],
  ["M", "Switch to map view"],
  ["S", "Toggle streamer mode"],
  ["F", "Toggle fullscreen"],
  ["+  /  =", "Zoom in"],
  ["−  /  _", "Zoom out"],
  ["← ↑ ↓ →", "Pan the map / rotate the globe"],
  ["?", "Open this shortcuts sheet"],
  ["Esc", "Close overlays"],
];

export function ShortcutsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/25 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-2xl border border-ink/10 bg-white p-5 shadow-[0_30px_60px_-20px_rgba(15,23,42,0.35)]"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">Live view</div>
            <h2 className="mt-0.5 font-hero text-[18px] font-semibold text-ink">Keyboard shortcuts</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md border border-ink/10 text-ink/60 hover:bg-ink/[0.04]"
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-4 divide-y divide-ink/[0.06] rounded-lg border border-ink/[0.06]">
          {ROWS.map(([keys, label]) => (
            <div key={keys} className="flex items-center justify-between gap-4 px-3 py-2 text-[12.5px]">
              <span className="text-ink/70">{label}</span>
              <kbd className="rounded-md border border-ink/10 bg-ink/[0.04] px-2 py-0.5 text-[11px] font-medium text-ink/70">
                {keys}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
