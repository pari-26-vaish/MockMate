import { useEffect,useState } from "react";
import Navbar from "../components/common/Navbar";
import ScoreBreakdown from "../components/report/ScoreBreakdown";
import AnswerComparison from "../components/report/AnswerComparison";
import PerformanceChart from "../components/dashboard/PerformanceChart";
import { useParams} from "react-router-dom";
import api from "../services/api";


const FeedbackReportPage = () => {
  const { id } = useParams();

const [interview, setInterview] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  const fetchReport = async () => {
    try {
      const response = await api.get(`/interviews/${id}`);
      setInterview(response.data);
    } catch (err) {
      console.error("Failed to fetch interview report:", err);
      setError("Unable to load this interview report.");
    } finally {
      setLoading(false);
    }
  };

  fetchReport();
}, [id]);

if (loading) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400">
      Loading interview report...
    </div>
  );
}

if (error) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-400">
      {error}
    </div>
  );
}

if (!interview) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-yellow-400">
      Interview report not found.
    </div>
  );
}

  // Temporary data for UI development.
  // We will replace this with real backend data later.
const questions = interview.questions || [];

const scores = questions
  .map((question) => Number(question.score) || 0)
  .filter((score) => score > 0);

const overallScore = scores.length
  ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  : 0;

const firstQuestion = questions[0];

let firstFeedback = {};

try {
  firstFeedback = firstQuestion?.aiFeedback
    ? JSON.parse(firstQuestion.aiFeedback)
    : {};
} catch {
  firstFeedback = {};
}

const report = {
  overallScore,

  strengths: [
    ...new Set(
      questions.flatMap(
        (question) => {
          try {
            return JSON.parse(question.aiFeedback || "{}").keyStrengths || [];
          } catch {
            return [];
          }
        }
      )
    ),
  ],

  weaknesses: [
    ...new Set(
      questions.flatMap(
        (question) => {
          try {
            return JSON.parse(question.aiFeedback || "{}").areasOfImprovement || [];
          } catch {
            return [];
          }
        }
      )
    ),
  ],

  takeaways: [
    "Review your answers and focus on the areas identified for improvement.",
    "Practice explaining technical concepts clearly.",
    "Keep practicing to improve your interview performance.",
  ],

  question: firstQuestion?.questionText || "No question available.",

  userAnswer: firstQuestion?.userAnswer || "No answer submitted.",

  idealAnswer: firstFeedback.idealAnswer || "No ideal answer available.",
};

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Header */}
        <header className="mb-8">
          <p className="text-sm font-medium text-cyan-400">
            MOCKMATE • AI FEEDBACK
          </p>

          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            Interview Feedback Report
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Review your interview performance, understand your strengths and
            weaknesses, and identify what to improve next.
          </p>
        </header>

        {/* Score + Performance */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ScoreBreakdown score={report.overallScore} />

          <PerformanceChart />
        </section>

        {/* Strengths & Weaknesses */}
        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Strengths */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">
              What went well
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              Key Strengths
            </h2>

            <ul className="mt-5 space-y-3">
              {report.strengths.map((strength, index) => (
                <li
                  key={index}
                  className="flex gap-3 text-sm leading-6 text-slate-300"
                >
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-xs text-cyan-400">
                    ✓
                  </span>

                  {strength}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">
              Areas to improve
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              Weaknesses
            </h2>

            <ul className="mt-5 space-y-3">
              {report.weaknesses.map((weakness, index) => (
                <li
                  key={index}
                  className="flex gap-3 text-sm leading-6 text-slate-300"
                >
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs text-slate-400">
                    !
                  </span>

                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">
            AI Recommendations
          </p>

          <h2 className="mt-1 text-xl font-semibold text-white">
            Key Takeaways
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {report.takeaways.map((takeaway, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <span className="text-sm font-semibold text-cyan-400">
                  0{index + 1}
                </span>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {takeaway}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Answer Comparison */}
        <section className="mt-6">
          <AnswerComparison
            question={report.question}
            userAnswer={report.userAnswer}
            idealAnswer={report.idealAnswer}
          />
        </section>
      </main>
    </div>
  );
};

export default FeedbackReportPage;