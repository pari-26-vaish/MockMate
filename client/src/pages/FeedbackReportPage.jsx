import Navbar from "../components/common/Navbar";
import ScoreBreakdown from "../components/report/ScoreBreakdown";
import AnswerComparison from "../components/report/AnswerComparison";
import PerformanceChart from "../components/dashboard/PerformanceChart";

const FeedbackReportPage = () => {
  // Temporary data for UI development.
  // We will replace this with real backend data later.
  const report = {
    overallScore: 85,

    strengths: [
      "Strong understanding of the MERN stack",
      "Good knowledge of React fundamentals",
      "Clear explanation of technical concepts",
      "Good problem-solving approach",
    ],

    weaknesses: [
      "Some answers could be more detailed",
      "System design explanations need more depth",
      "Improve confidence when explaining complex concepts",
    ],

    takeaways: [
      "Focus on explaining the WHY behind your technical decisions.",
      "Practice system design and scalability questions.",
      "Keep answers structured and concise.",
    ],

    question: "What is the difference between state and props in React?",

    userAnswer:
      "Props are used to pass data from parent to child components. State is used to manage data inside a component.",

    idealAnswer:
      "Props are read-only data passed from a parent component to a child. State is mutable data managed inside the component. Props help communication between components, while state manages component behavior and UI updates.",
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