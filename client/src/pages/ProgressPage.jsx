import Navbar from "../components/common/Navbar";
import {
  TrendingUp,
  BarChart3,
  Trophy,
  Award,
  Brain,
  ThumbsUp,
  Target,
  Flame,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import "./ProgressPage.css";

// All values below are honest zero-states — nothing here is faked.
// Every section is wired to real fields (score, skills, streak, etc.)
// so once interviews start flowing in from the backend, these render
// live data with no structural changes needed.

const OVERALL_SCORE = 0; // out of 100
const MONTHLY_CHANGE = null; // e.g. +12 once there's history to compare

const STATS = [
  { label: "Interviews Completed", value: "0", icon: BarChart3 },
  { label: "Average Score", value: "--", icon: TrendingUp, accent: true },
  { label: "Best Score", value: "--", icon: Trophy },
  { label: "Current Level", value: "Beginner", icon: Award, accent: true },
];

const SKILLS = [
  { name: "Technical Knowledge", score: 0 },
  { name: "Communication", score: 0 },
  { name: "Problem Solving", score: 0 },
  { name: "Confidence", score: 0 },
  { name: "Clarity", score: 0 },
];

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CURRENT_STREAK = 0;
const STREAK_DONE = WEEK_DAYS.map(() => false); // swap in real streak data later

const ProgressPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Header */}
        <section className="page-fade mb-8 sm:mb-10">
          <p className="text-cyan-400 text-sm font-medium mb-2">
            Your Performance
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 tracking-tight">
            Track your progress 📈
          </h1>

          <p className="text-slate-400 max-w-2xl text-sm sm:text-base">
            See how your interview performance is improving over time and
            identify the areas where you can grow.
          </p>
        </section>

        {/* Overall Performance */}
        <section className="page-fade page-fade-1 mb-8 sm:mb-10">
          <div className="hero-score-card relative overflow-hidden rounded-2xl border border-cyan-500/20 p-6 sm:p-8">
            <div className="hero-glow" aria-hidden="true" />

            <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">
                  Overall Performance
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl sm:text-6xl font-bold">
                    {OVERALL_SCORE}
                  </span>
                  <span className="text-slate-500 text-lg sm:text-xl font-medium">
                    / 100
                  </span>
                </div>
              </div>

              {MONTHLY_CHANGE !== null ? (
                <span className="trend-badge inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold self-start">
                  <TrendingUp className="w-4 h-4" />
                  +{MONTHLY_CHANGE}% this month
                </span>
              ) : (
                <span className="text-slate-500 text-xs sm:text-sm self-start">
                  Trend appears after your second interview
                </span>
              )}
            </div>

            <div className="relative progress-track h-3 rounded-full overflow-hidden">
              <div
                className="progress-fill h-full rounded-full"
                style={{ width: `${OVERALL_SCORE}%` }}
              />
            </div>

            <p className="relative text-slate-500 text-xs sm:text-sm mt-3">
              Complete your first interview to start tracking your
              performance trend.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="page-fade page-fade-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 sm:mb-10">
          {STATS.map(({ label, value, icon: Icon, accent }) => (
            <div
              key={label}
              className="stat-card rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6"
            >
              <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm mb-3">
                <Icon className="w-4 h-4 text-cyan-400" />
                {label}
              </div>
              <h2
                className={`text-2xl sm:text-3xl font-bold ${
                  accent ? "text-cyan-400" : ""
                }`}
              >
                {value}
              </h2>
            </div>
          ))}
        </section>

        {/* Score Progress Chart + Improvement card */}
        <section className="page-fade page-fade-3 grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 mb-8 sm:mb-10">
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold">
                  Score Progress
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Your score across recent interviews will plot here.
                </p>
              </div>
              <span className="text-cyan-400 text-xl sm:text-2xl">✦</span>
            </div>

            {/* Empty chart state */}
            <div className="chart-placeholder h-56 sm:h-64 rounded-xl border border-dashed border-slate-700 flex items-center justify-center">
              <div className="text-center px-4">
                <BarChart3 className="w-9 h-9 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-300 font-medium text-sm sm:text-base">
                  No performance data yet
                </p>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Complete a few interviews and this chart will start
                  plotting your score trend.
                </p>
              </div>
            </div>
          </div>

          {/* Improvement Card */}
          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 to-cyan-950/40 p-5 sm:p-7">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center mb-5">
              <Lightbulb className="w-6 h-6 text-cyan-300" />
            </div>

            <h2 className="text-lg sm:text-xl font-semibold mb-3">
              Keep improving
            </h2>

            <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
              Your progress journey starts with your first interview.
              Practice consistently and use AI feedback to improve your
              answers.
            </p>

            <div className="mt-6 pt-5 border-t border-slate-800">
              <p className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">
                Pro Tip
              </p>
              <p className="text-sm text-slate-300 mt-2">
                Focus on clarity, confidence, and explaining your thought
                process.
              </p>
            </div>
          </div>
        </section>

        {/* Skill Performance */}
        <section className="page-fade page-fade-4 mb-8 sm:mb-10">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg sm:text-xl font-semibold">
                Skill Performance
              </h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              Generated from AI feedback across your interviews.
            </p>

            <div className="space-y-5">
              {SKILLS.map((skill) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between mb-1.5 text-sm">
                    <span className="text-slate-300">{skill.name}</span>
                    <span className="text-slate-500">
                      {skill.score > 0 ? `${skill.score}%` : "--"}
                    </span>
                  </div>
                  <div className="skill-track h-2 rounded-full overflow-hidden">
                    <div
                      className="skill-fill h-full rounded-full"
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-slate-500 text-xs sm:text-sm mt-6">
              Skill scores will populate after your first AI-evaluated
              interview.
            </p>
          </div>
        </section>

        {/* Strengths & Focus Areas */}
        <section className="page-fade page-fade-5 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-8 sm:mb-10">
          <div className="insight-card rounded-2xl border border-emerald-500/20 bg-slate-900 p-5 sm:p-7">
            <div className="flex items-center gap-2 mb-4">
              <ThumbsUp className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base sm:text-lg font-semibold">
                Your Strengths
              </h3>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Your standout strengths will appear here after your first
              AI-evaluated interview — highlighting what you're already
              doing well.
            </p>
          </div>

          <div className="insight-card rounded-2xl border border-amber-500/20 bg-slate-900 p-5 sm:p-7">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-amber-400" />
              <h3 className="text-base sm:text-lg font-semibold">
                Focus Areas
              </h3>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Once you complete an interview, we'll surface specific areas
              to work on — so every session has a clear next step.
            </p>
          </div>
        </section>

        {/* Practice Streak */}
        <section className="page-fade page-fade-6 mb-8 sm:mb-10">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
            <div className="flex items-center gap-2 mb-5">
              <Flame className={`w-5 h-5 ${CURRENT_STREAK > 0 ? "text-orange-400" : "text-slate-600"}`} />
              <h2 className="text-lg sm:text-xl font-semibold">
                {CURRENT_STREAK} Day Streak
              </h2>
            </div>

            <div className="flex items-center justify-between max-w-md">
              {WEEK_DAYS.map((day, i) => (
                <div key={day} className="flex flex-col items-center gap-2">
                  <span className="text-xs text-slate-500">{day}</span>
                  <span
                    className={`streak-dot w-4 h-4 rounded-full ${
                      STREAK_DONE[i] ? "streak-dot-active" : ""
                    }`}
                  />
                </div>
              ))}
            </div>

            <p className="text-slate-500 text-xs sm:text-sm mt-5">
              Complete an interview today to start your streak!
            </p>
          </div>
        </section>

        {/* AI Recommendation */}
        <section className="page-fade page-fade-7">
          <div className="ai-rec-card rounded-2xl border border-cyan-500/20 p-5 sm:p-7 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-400/25 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1.5">
                AI Recommendation
              </p>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Complete a few interviews and I'll tailor personalized
                recommendations here — based on your actual answers and
                scores, not generic tips.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProgressPage;