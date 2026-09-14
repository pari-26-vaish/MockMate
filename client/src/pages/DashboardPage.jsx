import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserHistory } from "../services/interviewService.js";
import InterviewCard from "../components/dashboard/InterviewCard";
import Navbar from "../components/common/Navbar";
import Button from "../components/common/Button";
import { Mic, BarChart3, Zap, Sparkles, ArrowRight, Clock } from "lucide-react";
import "./DashboardPage.css";
import useTextToSpeech from "../hooks/useTextToSpeech.js";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "there";

  const [interviews, setInterviews] = useState([]);
  const [loadingInterviews, setLoadingInterviews] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const data = await getUserHistory();
        setInterviews(data.interviews || []);
      } catch (error) {
        console.error("Failed to fetch interview history:", error);
      } finally {
        setLoadingInterviews(false);
      }
    };

    fetchInterviews();
  }, []);
  const handleStartInterview = () => {
    // NOTE: This dashboard is only the launchpad.
    // Navigation to the interview setup flow gets wired here later:
    // Dashboard -> Start New Interview -> Interview Setup -> AI Questions -> Answer -> AI Feedback -> Results
    navigate("/create-interview");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Greeting */}
        <section className="dash-fade-in mb-8 sm:mb-10">
          <p className="text-cyan-400 text-sm font-medium mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            {getGreeting()}, {firstName} 👋
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 tracking-tight">
            Ready to sharpen your interview skills?
          </h2>

          <p className="text-slate-400 max-w-2xl text-sm sm:text-base">
            Practice realistic interviews, improve your answers, and get
            AI-powered feedback to become interview-ready.
          </p>
        </section>

        {/* Hero CTA */}
        <section className="dash-fade-in dash-fade-delay-1 mb-8 sm:mb-10">
          <div className="hero-card relative overflow-hidden rounded-2xl border border-slate-800 p-6 sm:p-10">
            <div className="hero-glow" aria-hidden="true" />

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-xl">
                <div className="hero-icon w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Mic className="w-6 h-6 text-cyan-300" />
                </div>

                <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                  Start a New Interview
                </h3>

                <p className="text-slate-400 text-sm sm:text-base">
                  Choose your role, technology stack, and experience level to
                  begin a personalized AI interview.
                </p>
              </div>

              <div className="shrink-0">
                <Button onClick={handleStartInterview} className="hero-btn">
                  🚀 Start New Interview
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="dash-fade-in dash-fade-delay-2 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 sm:mb-12">
          <div className="stat-card rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm mb-3">
              <Mic className="w-4 h-4 text-cyan-400" />
              Interviews Completed
            </div>
            <p className="text-2xl sm:text-3xl font-bold">
              {interviews.length}
            </p>
          </div>

          <div className="stat-card rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm mb-3">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Average Score
            </div>
            <p className="text-2xl sm:text-3xl font-bold">
              {interviews.length > 0
                ? Math.round(
                  interviews.reduce(
                    (total, interview) => total + (interview.score || 0),
                    0
                  ) / interviews.length
                )
                : "--"}
            </p>
          </div>

          <div className="stat-card rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm mb-3">
              <Zap className="w-4 h-4 text-cyan-400" />
              Credits Remaining
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-cyan-300">
              {user?.credits ?? 0}
            </p>
          </div>
        </section>

        {/* Recent Interviews */}
        <section className="dash-fade-in dash-fade-delay-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-semibold">Recent Interviews</h3>
          </div>

          {loadingInterviews ? (
            <div className="empty-card rounded-2xl border border-slate-800 bg-slate-900/40 p-10 text-center">
              <p className="text-slate-400">
                Loading your interviews...
              </p>
            </div>
          ) : interviews.length === 0 ? (
            <div className="empty-card rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 sm:p-14 text-center">
              <div className="empty-icon w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-5 h-5 text-slate-400" />
              </div>

              <p className="text-slate-200 font-medium mb-1">
                No interviews yet
              </p>

              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                Start your first AI interview and your results will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interviews.map((interview) => (
                <InterviewCard
                  key={interview._id}
                  interview={interview}
                />
              ))}
            </div>
          )}
        </section>

        <div className="mt-6 flex gap-3 items-center">
          <button
            onClick={() =>
              speak(
                "Welcome to MockMate. Let's begin your AI interview."
              )
            }
          >
            🔊 Test Voice
          </button>

          <button onClick={stop}>
            ⏹ Stop
          </button>

          <span>
            {isSpeaking ? "Speaking..." : "Ready"}
          </span>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;