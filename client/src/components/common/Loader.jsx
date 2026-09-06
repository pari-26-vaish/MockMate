const Loader = ({ size = "medium" }) => {
  const sizeClass =
    size === "small"
      ? "w-4 h-4"
      : size === "large"
      ? "w-10 h-10"
      : "w-6 h-6";

  return (
    <div
      className={`${sizeClass} border-4 border-slate-700 border-t-cyan-400 rounded-full animate-spin`}
    />
  );
};

export default Loader;