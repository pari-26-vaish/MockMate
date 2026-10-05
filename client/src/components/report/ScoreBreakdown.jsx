const ScoreBreakdown = ({ score = 0 }) => {
  const percentage = Math.min(100, Math.max(0, Number(score) || 0));

  const getLabel = () => {
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Good";
    if (percentage >= 40) return "Needs Improvement";
    return "Keep Practicing";
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="mb-6">
        <p className="text-xs font-medium tracking-wider text-cyan-400">
          PERFORMANCE
        </p>

        <h2 className="mt-1 text-xl font-semibold text-white">
          Score Breakdown
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Your overall interview performance
        </p>
      </div>

      <div className="flex flex-col items-center justify-center">
        {/* Circular Gauge */}
        <div
          className="relative h-44 w-44 rounded-full"
          style={{
            background: `conic-gradient(
              rgb(34 211 238) ${percentage * 3.6}deg,
              rgb(30 41 59) ${percentage * 3.6}deg
            )`,
          }}
        >
          <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-slate-950">
            <span className="text-4xl font-bold text-white">
              {Math.round(percentage)}%
            </span>

            <span className="mt-1 text-xs text-slate-500">
              Overall Score
            </span>
          </div>
        </div>

        {/* Performance Label */}
        <div className="mt-5 text-center">
          <p className="text-lg font-semibold text-cyan-400">
            {getLabel()}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Keep improving your interview skills.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScoreBreakdown;