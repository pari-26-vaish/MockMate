import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import QuestionDisplay from "../components/interviews/QuestionDisplay";
import AudioVisualizer from "../components/interviews/AudioVisualizer";
import SpeechToTextControl from "../components/interviews/SpeechToTextControl";
import Timer from "../components/interviews/Timer";
import useTextToSpeech from "../hooks/useTextToSpeech";

const questions = [
  {
    question:
      "Tell me about yourself and your experience with the MERN stack.",
    category: "HR",
    difficulty: "Easy",
    topic: "Introduction",
  },
  {
    question: "What is the difference between state and props in React?",
    category: "Technical",
    difficulty: "Easy",
    topic: "React",
  },
  {
    question:
      "Explain how JWT authentication works in a MERN application.",
    category: "Technical",
    difficulty: "Medium",
    topic: "Authentication",
  },
  {
    question:
      "How would you improve the performance of a Node.js application?",
    category: "Technical",
    difficulty: "Medium",
    topic: "Node.js",
  },
  {
    question:
      "How would you design a scalable MERN application for thousands of users?",
    category: "System Design",
    difficulty: "Hard",
    topic: "Scalability",
  },
];

const DIFFICULTY_DOT = {
  Easy: "bg-cyan-400",
  Medium: "bg-cyan-300",
  Hard: "bg-cyan-200",
};

function formatSeconds(total) {
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(total % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

const InterviewRoomPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(() => questions.map(() => ""));
  const [timePerQuestion, setTimePerQuestion] = useState(() =>
    questions.map(() => 0)
  );
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [phase, setPhase] = useState("interview"); // "interview" | "review" | "exit-confirm"
  const [flash, setFlash] = useState(false);

  const { speak, stop, isSpeaking } = useTextToSpeech();

  const activeQuestion = questions[currentQuestion];
  const answer = answers[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const answeredCount = answers.filter((a) => a.trim().length > 0).length;

  const hasSpokenRef = useRef(new Set());

  // Per-question stopwatch
  useEffect(() => {
    if (isPaused || phase !== "interview") return;
    const id = setInterval(() => {
      setTimePerQuestion((prev) => {
        const next = [...prev];
        next[currentQuestion] += 1;
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [currentQuestion, isPaused, phase]);

  // Auto-speak once per question
  useEffect(() => {
    if (phase !== "interview" || !autoSpeak) return;
    if (hasSpokenRef.current.has(currentQuestion)) return;
    hasSpokenRef.current.add(currentQuestion);
    stop();
    speak(activeQuestion.question);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, phase, autoSpeak]);

  const setAnswer = useCallback(
    (value) => {
      setAnswers((prev) => {
        const next = [...prev];
        next[currentQuestion] = value;
        return next;
      });
    },
    [currentQuestion]
  );

  const handleSpeakQuestion = useCallback(() => {
    stop();
    speak(activeQuestion.question);
  }, [activeQuestion, speak, stop]);

  const goTo = useCallback(
    (index) => {
      if (index < 0 || index >= questions.length) return;
      stop();
      setCurrentQuestion(index);
    },
    [stop]
  );

  const handleNextQuestion = useCallback(() => {
    if (isLastQuestion) {
      setPhase("review");
      return;
    }
    goTo(currentQuestion + 1);
  }, [currentQuestion, isLastQuestion, goTo]);

  const handlePrevQuestion = useCallback(() => {
    goTo(currentQuestion - 1);
  }, [currentQuestion, goTo]);

  const triggerFlash = useCallback(() => {
    setFlash(true);
    setTimeout(() => setFlash(false), 250);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    if (phase !== "interview") return;
    const onKey = (e) => {
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT")
        return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextQuestion();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevQuestion();
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        triggerFlash();
        handleSpeakQuestion();
      } else if (e.key.toLowerCase() === "p") {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    phase,
    handleNextQuestion,
    handlePrevQuestion,
    handleSpeakQuestion,
    triggerFlash,
  ]);

  const totalElapsed = useMemo(
    () => timePerQuestion.reduce((a, b) => a + b, 0),
    [timePerQuestion]
  );

  const progressPct = Math.round(
    ((currentQuestion + (phase === "review" ? 1 : 0)) / questions.length) *
      100
  );

  if (phase === "review") {
    return (
      <div className="min-h-screen bg-slate-950 text-white px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <p className="text-cyan-400 text-sm font-medium">
              MOCKMATE • AI INTERVIEW
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1">
              Interview Summary
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              {answeredCount} of {questions.length} answered ·{" "}
              {formatSeconds(totalElapsed)} total time
            </p>
          </header>

          <div className="space-y-4 mb-8">
            {questions.map((q, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
              >
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        DIFFICULTY_DOT[q.difficulty] || "bg-slate-600"
                      }`}
                    />
                    {q.category} · {q.topic} · {q.difficulty}
                  </div>
                  <span className="text-xs text-slate-500">
                    {formatSeconds(timePerQuestion[i])}
                  </span>
                </div>
                <p className="text-slate-200 font-medium mb-2">
                  {q.question}
                </p>
                <p className="text-slate-400 text-sm whitespace-pre-wrap">
                  {answers[i] || "No answer recorded."}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => {
                setPhase("interview");
                setCurrentQuestion(0);
              }}
              className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
            >
              ← Back to interview
            </button>
            <button
              type="button"
              onClick={() => {
                setAnswers(questions.map(() => ""));
                setTimePerQuestion(questions.map(() => 0));
                hasSpokenRef.current = new Set();
                setCurrentQuestion(0);
                setPhase("interview");
              }}
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition"
            >
              Restart Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-cyan-400 text-sm font-medium">
              MOCKMATE • AI INTERVIEW
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1">
              Interview Room
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 transition"
              title="Pause / resume (P)"
            >
              {isPaused ? "▶ Resume" : "⏸ Pause"}
            </button>
            <label className="flex items-center gap-2 text-xs text-slate-400 select-none">
              <input
                type="checkbox"
                checked={autoSpeak}
                onChange={(e) => setAutoSpeak(e.target.checked)}
                className="accent-cyan-500"
              />
              Auto-read
            </label>
            <Timer />
          </div>
        </header>

        {/* Progress */}
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span>
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span>{progressPct}% complete</span>
        </div>
        <div className="flex gap-2 mb-6">
          {questions.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                index === currentQuestion
                  ? "bg-cyan-400"
                  : index < currentQuestion
                  ? "bg-cyan-400/50"
                  : "bg-slate-800"
              }`}
              title={`Go to question ${index + 1}`}
            />
          ))}
        </div>

        {isPaused && (
          <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900/70 px-5 py-4 text-sm text-slate-400 text-center">
            Interview paused. Timers are frozen — resume when you're ready.
          </div>
        )}

        {/* Question */}
        <div
          className={`rounded-2xl border p-6 sm:p-8 mb-6 transition-colors ${
            flash
              ? "border-cyan-400 bg-slate-900"
              : "border-slate-800 bg-slate-900/70"
          }`}
        >
          <div className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  DIFFICULTY_DOT[activeQuestion.difficulty] || "bg-slate-600"
                }`}
              />
              {activeQuestion.category} · {activeQuestion.topic} ·{" "}
              {activeQuestion.difficulty}
            </div>
            <span className="text-xs text-slate-500 tabular-nums">
              {formatSeconds(timePerQuestion[currentQuestion])}
            </span>
          </div>

          <QuestionDisplay
            question={activeQuestion}
            questionNumber={currentQuestion + 1}
            totalQuestions={questions.length}
          />

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSpeakQuestion}
              className="px-4 py-2 rounded-lg border border-slate-700 text-sm text-slate-300 hover:bg-slate-800 transition"
            >
              {isSpeaking ? "🔊 Speaking..." : "🔊 Hear Question"}
            </button>
            <span className="text-xs text-slate-600">
              Shortcuts: ← / → navigate · R replay · P pause
            </span>
          </div>
        </div>

        {/* Audio Visualizer */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 mb-6 flex justify-center">
          <AudioVisualizer isSpeaking={isSpeaking} />
        </div>

        {/* Speech / Manual Answer */}
        <SpeechToTextControl
          key={currentQuestion}
          onAnswerChange={(value) => setAnswer(value)}
        />

        {/* Answer Preview */}
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-500">CURRENT ANSWER</p>
            <p className="text-xs text-slate-600">
              {answer ? `${answer.trim().split(/\s+/).length} words` : ""}
            </p>
          </div>

          <p className="text-slate-300 min-h-6 whitespace-pre-wrap">
            {answer || "Your answer will appear here..."}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
            className="px-5 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <button
            type="button"
            onClick={() => setPhase("review")}
            className="px-4 py-3 text-sm text-slate-500 hover:text-slate-300 transition"
          >
            Skip to summary
          </button>

          <button
            type="button"
            onClick={handleNextQuestion}
            className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition"
          >
            {isLastQuestion ? "Finish Interview ✓" : "Next Question →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewRoomPage;