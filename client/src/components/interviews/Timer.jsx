import { useEffect, useRef, useState } from "react";
import { Clock, AlarmClock } from "lucide-react";

const formatTime = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

/**
 * Timer
 * - Runs a continuous interview clock from mount.
 * - When `isAnswering` is true, also tracks how long the current
 *   answer has been going, and compares it against a recommended
 *   range (in seconds) to give the candidate gentle pacing feedback.
 */
const Timer = ({
  isAnswering = false,
  recommendedMin = 60,
  recommendedMax = 120,
  onAnswerTick,
}) => {
  const [interviewSeconds, setInterviewSeconds] = useState(0);
  const [answerSeconds, setAnswerSeconds] = useState(0);
  const answerStartedAt = useRef(null);

  // Overall interview clock — always running
  useEffect(() => {
    const id = setInterval(() => setInterviewSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Per-answer clock — only while isAnswering is true
  useEffect(() => {
    if (!isAnswering) {
      answerStartedAt.current = null;
      setAnswerSeconds(0);
      return;
    }
    const id = setInterval(() => {
      setAnswerSeconds((s) => {
        const next = s + 1;
        onAnswerTick?.(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isAnswering, onAnswerTick]);

  const pacing =
    answerSeconds === 0
      ? null
      : answerSeconds < recommendedMin
      ? "short"
      : answerSeconds <= recommendedMax
      ? "good"
      : "long";

  const pacingCopy = {
    short: { label: "Keep going", tone: "text-slate-400" },
    good: { label: "Good answer length", tone: "text-emerald-400" },
    long: { label: "Consider wrapping up", tone: "text-amber-400" },
  };

  return (
    <div className="flex items-center gap-4">
      {/* Interview-wide clock */}
      <div className="flex items-center gap-1.5 text-slate-300">
        <Clock className="h-4 w-4 text-cyan-400" />
        <span className="font-mono text-sm tabular-nums">
          {formatTime(interviewSeconds)}
        </span>
      </div>

      {/* Per-answer clock, only shown while answering */}
      {isAnswering && (
        <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1">
          <AlarmClock className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-mono text-xs tabular-nums text-slate-200">
            {formatTime(answerSeconds)}
          </span>
          {pacing && (
            <span className={`text-xs font-medium ${pacingCopy[pacing].tone}`}>
              {pacingCopy[pacing].label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Timer;