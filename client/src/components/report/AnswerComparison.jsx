const AnswerComparison = ({
  question = "Interview Question",
  userAnswer = "",
  idealAnswer = "",
}) => {
  const highlightPoints = (text) => {
    if (!text) return [];

    return text
      .split(/[.!?]+/)
      .map((point) => point.trim())
      .filter(Boolean);
  };

  const userPoints = highlightPoints(userAnswer);
  const idealPoints = highlightPoints(idealAnswer);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-medium tracking-wider text-cyan-400">
          ANSWER ANALYSIS
        </p>

        <h2 className="mt-1 text-xl font-semibold text-white">
          Answer Comparison
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Compare your response with the AI-generated ideal answer.
        </p>
      </div>

      {/* Question */}
      <div className="mb-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <p className="mb-2 text-xs uppercase tracking-wider text-slate-500">
          Question
        </p>

        <p className="text-sm font-medium leading-6 text-slate-200">
          {question}
        </p>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* User Answer */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-white">
              Your Answer
            </h3>

            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
              User
            </span>
          </div>

          {userPoints.length > 0 ? (
            <ul className="space-y-3">
              {userPoints.map((point, index) => (
                <li
                  key={index}
                  className="flex gap-3 text-sm leading-6 text-slate-300"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm italic text-slate-500">
              No answer provided.
            </p>
          )}
        </div>

        {/* AI Ideal Answer */}
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-cyan-300">
              AI Ideal Answer
            </h3>

            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400">
              AI
            </span>
          </div>

          {idealPoints.length > 0 ? (
            <ul className="space-y-3">
              {idealPoints.map((point, index) => (
                <li
                  key={index}
                  className="flex gap-3 text-sm leading-6 text-slate-300"
                >
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-xs text-cyan-400">
                    ✓
                  </span>

                  <span>{point}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm italic text-slate-500">
              AI ideal answer is not available yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnswerComparison;