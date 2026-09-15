import { useEffect, useState } from "react";
import { Mic } from "lucide-react";

const BAR_COUNT = 24;

/**
 * AudioVisualizer
 * status: "idle" | "listening" | "processing" | "completed"
 * volume: 0-100, only meaningful while status === "listening"
 */
const AudioVisualizer = ({ status = "idle", volume = 0 }) => {
  const [bars, setBars] = useState(Array(BAR_COUNT).fill(4));

  useEffect(() => {
    if (status !== "listening") {
      setBars(Array(BAR_COUNT).fill(status === "processing" ? 10 : 4));
      return;
    }
    const id = setInterval(() => {
      setBars((prev) =>
        prev.map(() => {
          const base = 4 + (volume / 100) * 28;
          const jitter = Math.random() * 14;
          return Math.max(4, Math.min(36, base + jitter - 7));
        })
      );
    }, 90);
    return () => clearInterval(id);
  }, [status, volume]);

  const micRing =
    status === "listening"
      ? "bg-cyan-500/15 ring-2 ring-cyan-400"
      : status === "processing"
      ? "bg-violet-500/15 ring-2 ring-violet-400"
      : status === "completed"
      ? "bg-emerald-500/15 ring-2 ring-emerald-400"
      : "bg-slate-800 ring-1 ring-slate-700";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex h-16 w-16 items-center justify-center">
        {status === "listening" && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400/20" />
        )}
        <div
          className={`relative flex h-14 w-14 items-center justify-center rounded-full transition-colors duration-300 ${micRing}`}
        >
          <Mic
            className={`h-6 w-6 ${
              status === "listening"
                ? "text-cyan-300"
                : status === "processing"
                ? "text-violet-300"
                : status === "completed"
                ? "text-emerald-300"
                : "text-slate-500"
            }`}
          />
        </div>
      </div>

      <div className="flex h-10 items-end gap-[3px]">
        {bars.map((h, i) => (
          <span
            key={i}
            className={`w-[3px] rounded-full transition-all duration-100 ${
              status === "listening"
                ? "bg-cyan-400"
                : status === "processing"
                ? "bg-violet-400/70"
                : status === "completed"
                ? "bg-emerald-400/60"
                : "bg-slate-700"
            }`}
            style={{ height: `${h}px` }}
          />
        ))}
      </div>

      {status === "listening" && (
        <div className="flex w-40 items-center gap-2">
          <span className="text-[11px] text-slate-500">Volume</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-cyan-400 transition-all duration-150"
              style={{ width: `${volume}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioVisualizer;