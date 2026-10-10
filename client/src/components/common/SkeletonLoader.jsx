const SkeletonLoader = ({
  type = "text",
  count = 1,
  className = "",
}) => {
  const skeletons = Array.from({ length: count });

  if (type === "card") {
    return (
      <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${className}`}>
        {skeletons.map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
          >
            <div className="mb-4 h-4 w-1/3 rounded bg-slate-700" />
            <div className="mb-3 h-6 w-3/4 rounded bg-slate-700" />
            <div className="mb-2 h-3 w-full rounded bg-slate-800" />
            <div className="h-3 w-2/3 rounded bg-slate-800" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "question") {
    return (
      <div className={`space-y-4 ${className}`} aria-busy="true">
        {skeletons.map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
          >
            <div className="mb-4 h-3 w-24 rounded bg-cyan-900/60" />
            <div className="mb-3 h-5 w-full rounded bg-slate-700" />
            <div className="h-5 w-4/5 rounded bg-slate-800" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`space-y-3 animate-pulse ${className}`}
      aria-busy="true"
    >
      {skeletons.map((_, index) => (
        <div
          key={index}
          className="h-4 rounded-md bg-slate-800"
          style={{ width: `${100 - (index % 3) * 15}%` }}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;