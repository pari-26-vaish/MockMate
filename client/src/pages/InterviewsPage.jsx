import { useState } from "react";
import Navbar from "../components/common/Navbar";
import Button from "../components/common/Button";
import { Mic, BarChart3, Trophy, Bot, Calendar, Layers, User2 } from "lucide-react";
import "./InterviewsPage.css";

// Shape each interview will eventually have once wired to the backend:
// { id, role, techStack, experienceLevel, score, date, status }
// status is one of: "completed" | "in_progress" | "not_started"
const MOCK_INTERVIEWS = [];

const FILTERS = ["All", "Completed", "In Progress"];

const STATUS_STYLES = {
  completed: { label: "Completed", className: "status-completed" },
  in_progress: { label: "In Progress", className: "status-progress" },
  not_started: { label: "Not Started", className: "status-pending" },
};

const InterviewsPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const handleStartInterview = () => {
    // Launchpad only — this hooks into Interview Setup later.
    console.log("Start New Interview clicked");
  };

  const filteredInterviews = MOCK_INTERVIEWS.filter((interview) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Completed") return interview.status === "completed";
    if (activeFilter === "In Progress") return interview.status === "in_progress";
    return true;
  });

  const totalInterviews = MOCK_INTERVIEWS.length;
  const completedScores = MOCK_INTERVIEWS.filter((i) => typeof i.score === "number").map(
    (i) => i.score
  );
  const averageScore = completedScores.length
    ? Math.round(completedScores.reduce((a, b) => a + b, 0) / completedScores.length)
    : null;
  const bestScore = completedScores.length ? Math.max(...completedScores) : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Header */}
        <section className="page-fade mb-8 sm:mb-10">
          <p className="text-cyan-400 text-sm font-medium mb-2">
            Interview Practice
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 tracking-tight">
            Your Interviews 🎯
          </h1>

          <p className="text-slate-400 max-w-2xl text-sm sm:text-base">
            Practice, review, and improve your interview performance with
            AI-powered mock interviews.
          </p>
        </section>

        {/* Stats */}
        <section className="page-fade page-fade-1 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 sm:mb-10">
          <div className="stat-card rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm mb-3">
              <Mic className="w-4 h-4 text-cyan-400" />
              Total Interviews
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{totalInterviews}</p>
          </div>

          <div className="stat-card rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm mb-3">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Average Score
            </div>
            <p className="text-2xl sm:text-3xl font-bold">
              {averageScore !== null ? `${averageScore}%` : "--"}
            </p>
          </div>

          <div className="stat-card rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm mb-3">
              <Trophy className="w-4 h-4 text-cyan-400" />
              Best Score
            </div>
            <p className="text-2xl sm:text-3xl font-bold">
              {bestScore !== null ? `${bestScore}%` : "--"}
            </p>
          </div>
        </section>

        {/* Start Interview Card */}
        <section className="page-fade page-fade-2 mb-8 sm:mb-10">
          <div className="hero-card relative overflow-hidden rounded-2xl border border-cyan-500/20 p-6 sm:p-8">
            <div className="hero-glow" aria-hidden="true" />

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="hero-icon w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-cyan-300" />
                </div>

                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  Ready for a new challenge?
                </h2>

                <p className="text-slate-400 max-w-xl text-sm sm:text-base">
                  Start a personalized AI interview based on your target role,
                  technology stack, and experience level.
                </p>
              </div>

              <div className="shrink-0">
                <Button onClick={handleStartInterview} className="hero-btn">
                  Start New Interview →
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Interviews */}
        <section className="page-fade page-fade-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold">
                Recent Interviews
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Your completed interviews will appear here.
              </p>
            </div>

            {/* Filter tabs */}
            <div className="filter-tabs flex items-center gap-1 rounded-lg p-1 self-start">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition ${
                    activeFilter === filter
                      ? "filter-tab-active"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {filteredInterviews.length === 0 ? (
            /* Empty state */
            <div className="empty-card rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 sm:p-14 text-center">
              <div className="empty-icon w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5">
                <Mic className="w-6 h-6 text-cyan-300" />
              </div>

              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                No interviews yet
              </h3>

              <p className="text-slate-400 max-w-md mx-auto text-sm sm:text-base mb-6">
                Complete your first mock interview and your interview history —
                scores, feedback, and progress — will show up right here.
              </p>

              <Button onClick={handleStartInterview}>
                Start Your First Interview →
              </Button>
            </div>
          ) : (
            /* Interview cards — this grid renders once real data exists */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInterviews.map((interview) => {
                const status = STATUS_STYLES[interview.status] || STATUS_STYLES.not_started;
                return (
                  <div
                    key={interview.id}
                    className="interview-card rounded-xl border border-slate-800 bg-slate-900/70 p-5"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={`status-badge ${status.className}`}>
                        {status.label}
                      </span>
                      {typeof interview.score === "number" && (
                        <span className="text-cyan-300 font-semibold text-sm">
                          {interview.score}%
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-semibold mb-3">
                      {interview.role}
                    </h3>

                    <div className="space-y-1.5 text-xs sm:text-sm text-slate-400 mb-5">
                      <div className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5" />
                        {interview.techStack}
                      </div>
                      <div className="flex items-center gap-2">
                        <User2 className="w-3.5 h-3.5" />
                        {interview.experienceLevel}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {interview.date}
                      </div>
                    </div>

                    <button className="view-result-btn w-full py-2 rounded-lg text-sm font-medium">
                      View Result
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default InterviewsPage;