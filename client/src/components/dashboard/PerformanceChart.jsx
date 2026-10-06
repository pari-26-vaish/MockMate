import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const performanceData = [
  { interview: "Interview 1", score: 58 },
  { interview: "Interview 2", score: 65 },
  { interview: "Interview 3", score: 72 },
  { interview: "Interview 4", score: 78 },
  { interview: "Interview 5", score: 85 },
];

const PerformanceChart = () => {
  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">
          Performance Analytics
        </p>

        <h2 className="mt-1 text-lg sm:text-xl font-semibold text-white">
          Interview Score Trend
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Track how your interview performance improves over time.
        </p>
      </div>

      {/* Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={performanceData}
            margin={{
              top: 10,
              right: 10,
              left: -15,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
            />

            <XAxis
              dataKey="interview"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={{ stroke: "#334155" }}
              tickLine={false}
            />

            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={{ stroke: "#334155" }}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "12px",
                color: "#fff",
              }}
              labelStyle={{
                color: "#94a3b8",
                marginBottom: "4px",
              }}
              formatter={(value) => [`${value}%`, "Score"]}
            />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#22d3ee"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#22d3ee",
                stroke: "#0f172a",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
        <span className="text-xs text-slate-500">
          Latest score
        </span>

        <span className="text-sm font-semibold text-cyan-400">
          85%
        </span>
      </div>
    </div>
  );
};

export default PerformanceChart;