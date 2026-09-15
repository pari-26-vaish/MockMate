import { useState } from "react";
import { LogOut, Zap } from "lucide-react";
import AudioVisualizer from "../components/interviews/AudioVisualizer";
import SpeechToTextControl from "../components/interviews/SpeechToTextControl";
import Timer from "../components/interviews/Timer";

const TOTAL_QUESTIONS = 10;

const DIFFICULTY_STYLES = {
  Easy: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  Medium: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  Hard: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  Expert: "border-red-500/30 bg-red-500/10 text-red-300",
};

const InterviewRoomPage = () => {
  const [answer, setAnswer] = useState("");
  const [recordingStatus, setRecordingStatus] = useState("idle");
  const [questionNumber] = useState(3);
  const [difficulty] = useState("Medium");
  const [credits] = useState(4);

  const question =
    "Explain how you would design a scalable authentication system for a MERN application.";

  const isAnswering = recordingStatus === "listening";
  const progressPct = Math.round((questionNumber / TOTAL_QUESTIONS) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-cyan-400 text-sm font-medium">AI INTERVIEW</p>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1">
              Interview Room
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Role: Frontend Developer
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">
                <Zap className="h-3.5 w-3.5 text-cyan-400" />
                {credits} credits
              </span>
              <button className="flex items-center gap-1.5 rounded-full border border-slate-800 px-3 py-1 text-xs text-slate-400 transition hover:border-red-500/40 hover:text-red-300">
                <LogOut className="h-3.5 w-3.5" />
                Exit Interview
              </button>
            </div>
            <Timer isAnswering={isAnswering} recommendedMin={60} recommendedMax={120} />
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>
              Question {questionNumber} of {TOTAL_QUESTIONS}
            </span>
            <span>
              Answered: {questionNumber - 1} · Remaining:{" "}
              {TOTAL_QUESTIONS - questionNumber + 1}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-cyan-400 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <p className="text-slate-400 text-sm">Question {questionNumber}</p>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${DIFFICULTY_STYLES[difficulty]}`}
            >
              {difficulty}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold leading-relaxed">
            {question}
          </h2>
        </div>

        {/* Recording + transcript */}
        <SpeechToTextControl
          onAnswerChange={(value) => setAnswer(value)}
          onStatusChange={(s) => setRecordingStatus(s)}
        />

        {/* Debug / Answer Preview */}
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs text-slate-500 mb-2">CURRENT ANSWER</p>
          <p className="text-slate-300">{answer || "No answer yet"}</p>
        </div>

        {/* Submit */}
        <div className="mt-6 flex justify-end">
          <button
            disabled={recordingStatus !== "completed"}
            className="rounded-full bg-cyan-500 px-6 py-2.5 text-sm font-medium text-slate-950 transition enabled:hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Submit Answer →
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewRoomPage;