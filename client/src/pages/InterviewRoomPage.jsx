import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import axios from "axios";

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

  const [answers, setAnswers] = useState(() =>
    questions.map(() => "")
  );

  const [timePerQuestion, setTimePerQuestion] = useState(() =>
    questions.map(() => 0)
  );

  const [scores, setScores] = useState(() =>
    questions.map(() => null)
  );

  const [evaluations, setEvaluations] = useState(() =>
    questions.map(() => null)
  );

  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const [phase, setPhase] = useState("interview");

  const [flash, setFlash] = useState(false);

  // Day 22 states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const { speak, stop, isSpeaking } = useTextToSpeech();

  const activeQuestion = questions[currentQuestion];
  const answer = answers[currentQuestion];

  const isLastQuestion =
    currentQuestion === questions.length - 1;

  const answeredCount = answers.filter(
    (a) => a.trim().length > 0
  ).length;

  const hasSpokenRef = useRef(new Set());

  // -----------------------------------------
  // Per-question stopwatch
  // -----------------------------------------
  useEffect(() => {
    if (isPaused || phase !== "interview" || isSubmitting) {
      return;
    }

    const id = setInterval(() => {
      setTimePerQuestion((prev) => {
        const next = [...prev];
        next[currentQuestion] += 1;
        return next;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [currentQuestion, isPaused, phase, isSubmitting]);

  // -----------------------------------------
  // Auto speak question
  // -----------------------------------------
  useEffect(() => {
    if (phase !== "interview" || !autoSpeak) return;

    if (hasSpokenRef.current.has(currentQuestion)) {
      return;
    }

    hasSpokenRef.current.add(currentQuestion);

    stop();
    speak(activeQuestion.question);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, phase, autoSpeak]);

  // -----------------------------------------
  // Update answer
  // -----------------------------------------
  const setAnswer = useCallback(
    (value) => {
      setAnswers((prev) => {
        const next = [...prev];
        next[currentQuestion] = value;
        return next;
      });

      // Clear previous error when user edits answer
      setSubmitError("");
    },
    [currentQuestion]
  );

  // -----------------------------------------
  // Speak question
  // -----------------------------------------
  const handleSpeakQuestion = useCallback(() => {
    stop();
    speak(activeQuestion.question);
  }, [activeQuestion, speak, stop]);

  // -----------------------------------------
  // Navigate
  // -----------------------------------------
  const goTo = useCallback(
    (index) => {
      if (index < 0 || index >= questions.length) return;

      stop();
      setCurrentQuestion(index);
      setSubmitError("");
    },
    [stop]
  );

  // -----------------------------------------
  // DAY 22
  // Submit answer to AI
  // -----------------------------------------
  const handleSubmitAnswer = useCallback(async () => {
    if (isSubmitting) return;

    const cleanAnswer = answer.trim();

    if (!cleanAnswer) {
      setSubmitError("Please provide an answer before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/evaluation/evaluate",
        {
          question: activeQuestion.question,
          userResponse: cleanAnswer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const evaluation = response.data;

      // Save complete AI evaluation
      setEvaluations((prev) => {
        const next = [...prev];
        next[currentQuestion] = evaluation;
        return next;
      });

      // Save score
      setScores((prev) => {
        const next = [...prev];
        next[currentQuestion] = Number(evaluation.score) || 0;
        return next;
      });

      // -----------------------------------------
      // Question 5 completed
      // -----------------------------------------
      if (isLastQuestion) {
        const finalScores = [...scores];

        finalScores[currentQuestion] =
          Number(evaluation.score) || 0;

        const validScores = finalScores.filter(
          (score) => typeof score === "number"
        );

        const totalScore = validScores.reduce(
          (sum, score) => sum + score,
          0
        );

        const overallScore =
          validScores.length > 0
            ? Math.round(
                (totalScore / validScores.length) * 10
              ) / 10
            : 0;

        console.log("Interview completed");
        console.log("Overall Score:", overallScore);

        // Save final score for summary
        setScores(finalScores);

        // Move to review after question 5
        setPhase("review");
      } else {
        // Move to next question
        goTo(currentQuestion + 1);
      }
    } catch (error) {
      console.error("Answer evaluation error:", error);

      setSubmitError(
        error.response?.data?.message ||
          "Unable to evaluate your answer. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    answer,
    activeQuestion,
    currentQuestion,
    goTo,
    isLastQuestion,
    isSubmitting,
    scores,
  ]);

  // -----------------------------------------
  // Next question
  // -----------------------------------------
  const handleNextQuestion = useCallback(() => {
    if (isSubmitting) return;

    if (isLastQuestion) {
      setPhase("review");
      return;
    }

    goTo(currentQuestion + 1);
  }, [
    currentQuestion,
    isLastQuestion,
    goTo,
    isSubmitting,
  ]);

  // -----------------------------------------
  // Previous question
  // -----------------------------------------
  const handlePrevQuestion = useCallback(() => {
    if (isSubmitting) return;

    goTo(currentQuestion - 1);
  }, [currentQuestion, goTo, isSubmitting]);

  // -----------------------------------------
  // Flash effect
  // -----------------------------------------
  const triggerFlash = useCallback(() => {
    setFlash(true);

    setTimeout(() => {
      setFlash(false);
    }, 250);
  }, []);

  // -----------------------------------------
  // Keyboard shortcuts
  // -----------------------------------------
  useEffect(() => {
    if (phase !== "interview") return;

    const onKey = (e) => {
      if (
        e.target.tagName === "TEXTAREA" ||
        e.target.tagName === "INPUT"
      ) {
        return;
      }

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

    return () => {
      window.removeEventListener("keydown", onKey);
    };
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
    ((currentQuestion +
      (phase === "review" ? 1 : 0)) /
      questions.length) *
      100
  );
  // -----------------------------------------
  // REVIEW SCREEN
  // -----------------------------------------
  if (phase === "review") {
    const validScores = scores.filter(
      (score) => typeof score === "number"
    );

    const totalScore = validScores.reduce(
      (sum, score) => sum + score,
      0
    );

    const overallScore =
      validScores.length > 0
        ? Math.round(
            (totalScore / validScores.length) * 10
          ) / 10
        : 0;

    return (
      <div className="min-h-screen bg-slate-950 text-white px-4 py-8">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <header className="mb-8">
            <p className="text-cyan-400 text-sm font-medium">
              MOCKMATE • AI INTERVIEW
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold mt-1">
              Interview Completed
            </h1>

            <p className="text-slate-400 text-sm mt-2">
              {answeredCount} of {questions.length} answered ·{" "}
              {formatSeconds(totalElapsed)} total time
            </p>
          </header>

          {/* Overall Score */}
          <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-6 mb-8 text-center">

            <p className="text-sm text-slate-400 mb-2">
              OVERALL INTERVIEW SCORE
            </p>

            <div className="text-5xl font-bold text-cyan-400">
              {overallScore}
              <span className="text-2xl text-slate-500">
                /10
              </span>
            </div>

            <p className="text-sm text-slate-500 mt-2">
              AI evaluation completed
            </p>

          </div>

          {/* Question Evaluations */}
          <div className="space-y-5 mb-8">

            {questions.map((q, i) => {
              const evaluation = evaluations[i];
              const score = scores[i];

              return (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
                >

                  {/* Question Header */}
                  <div className="flex items-center justify-between gap-4 mb-3">

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          DIFFICULTY_DOT[q.difficulty] ||
                          "bg-slate-600"
                        }`}
                      />

                      Question {i + 1} · {q.category}
                    </div>

                    <span className="text-sm font-semibold text-cyan-400">
                      {score !== null ? `${score}/10` : "Not evaluated"}
                    </span>

                  </div>

                  {/* Question */}
                  <p className="text-slate-200 font-medium mb-3">
                    {q.question}
                  </p>

                  {/* User Answer */}
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-1">
                      YOUR ANSWER
                    </p>

                    <p className="text-sm text-slate-400 whitespace-pre-wrap">
                      {answers[i] || "No answer recorded."}
                    </p>
                  </div>

                  {/* AI Evaluation */}
                  {evaluation && (
                    <div className="border-t border-slate-800 pt-4 space-y-4">

                      {/* Strengths */}
                      {evaluation.keyStrengths && (
                        <div>
                          <p className="text-xs text-cyan-400 mb-1">
                            KEY STRENGTHS
                          </p>

                          <p className="text-sm text-slate-400">
                            {Array.isArray(
                              evaluation.keyStrengths
                            )
                              ? evaluation.keyStrengths.join(", ")
                              : evaluation.keyStrengths}
                          </p>
                        </div>
                      )}

                      {/* Improvements */}
                      {evaluation.areasOfImprovement && (
                        <div>
                          <p className="text-xs text-cyan-400 mb-1">
                            AREAS TO IMPROVE
                          </p>

                          <p className="text-sm text-slate-400">
                            {Array.isArray(
                              evaluation.areasOfImprovement
                            )
                              ? evaluation.areasOfImprovement.join(
                                  ", "
                                )
                              : evaluation.areasOfImprovement}
                          </p>
                        </div>
                      )}

                      {/* Ideal Answer */}
                      {evaluation.idealAnswer && (
                        <div>
                          <p className="text-xs text-cyan-400 mb-1">
                            IDEAL ANSWER
                          </p>

                          <p className="text-sm text-slate-400 whitespace-pre-wrap">
                            {evaluation.idealAnswer}
                          </p>
                        </div>
                      )}

                    </div>
                  )}

                  {/* Time */}
                  <div className="mt-4 text-xs text-slate-600">
                    Time spent: {formatSeconds(timePerQuestion[i])}
                  </div>

                </div>
              );
            })}

          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">

            <button
              type="button"
              onClick={() => {
                setPhase("interview");
                setCurrentQuestion(0);
                setSubmitError("");
              }}
              className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
            >
              ← Back to Interview
            </button>

            <button
              type="button"
              onClick={() => {
                setAnswers(questions.map(() => ""));
                setTimePerQuestion(questions.map(() => 0));
                setScores(questions.map(() => null));
                setEvaluations(questions.map(() => null));

                hasSpokenRef.current = new Set();

                setCurrentQuestion(0);
                setSubmitError("");
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

  // -----------------------------------------
  // MAIN INTERVIEW SCREEN
  // -----------------------------------------
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
              disabled={isSubmitting}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 transition disabled:opacity-40"
            >
              {isPaused ? "▶ Resume" : "⏸ Pause"}
            </button>

            <label className="flex items-center gap-2 text-xs text-slate-400 select-none">

              <input
                type="checkbox"
                checked={autoSpeak}
                onChange={(e) =>
                  setAutoSpeak(e.target.checked)
                }
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
            Question {currentQuestion + 1} of{" "}
            {questions.length}
          </span>

          <span>
            {progressPct}% complete
          </span>

        </div>

        <div className="flex gap-2 mb-6">

          {questions.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              disabled={isSubmitting}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                index === currentQuestion
                  ? "bg-cyan-400"
                  : index < currentQuestion
                  ? "bg-cyan-400/50"
                  : "bg-slate-800"
              } disabled:cursor-not-allowed`}
              title={`Go to question ${index + 1}`}
            />
          ))}

        </div>

        {/* Paused Message */}
        {isPaused && (
          <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900/70 px-5 py-4 text-sm text-slate-400 text-center">
            Interview paused. Timers are frozen — resume when
            you're ready.
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
                  DIFFICULTY_DOT[
                    activeQuestion.difficulty
                  ] || "bg-slate-600"
                }`}
              />

              {activeQuestion.category} ·{" "}
              {activeQuestion.topic} ·{" "}
              {activeQuestion.difficulty}

            </div>

            <span className="text-xs text-slate-500 tabular-nums">
              {formatSeconds(
                timePerQuestion[currentQuestion]
              )}
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
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg border border-slate-700 text-sm text-slate-300 hover:bg-slate-800 transition disabled:opacity-40"
            >
              {isSpeaking
                ? "🔊 Speaking..."
                : "🔊 Hear Question"}
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

            <p className="text-xs text-slate-500">
              CURRENT ANSWER
            </p>

            <p className="text-xs text-slate-600">
              {answer
                ? `${answer.trim().split(/\s+/).length} words`
                : ""}
            </p>

          </div>

          <p className="text-slate-300 min-h-6 whitespace-pre-wrap">
            {answer || "Your answer will appear here..."}
          </p>

        </div>

        {/* Error */}
        {submitError && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {submitError}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 gap-3">

          <button
            type="button"
            onClick={handlePrevQuestion}
            disabled={
              currentQuestion === 0 || isSubmitting
            }
            className="px-5 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <button
            type="button"
            onClick={() => setPhase("review")}
            disabled={isSubmitting}
            className="px-4 py-3 text-sm text-slate-500 hover:text-slate-300 transition disabled:opacity-30"
          >
            Skip to summary
          </button>

          {/* DAY 22 SUBMIT BUTTON */}
          <button
            type="button"
            onClick={handleSubmitAnswer}
            disabled={isSubmitting}
            className="min-w-[170px] px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >

            {isSubmitting ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-slate-950/30 border-t-slate-950 animate-spin" />
                <span>AI Scoring...</span>
              </>
            ) : (
              <>
                {isLastQuestion
                  ? "Submit & Finish ✓"
                  : "Submit Answer →"}
              </>
            )}

          </button>

        </div>

        {/* AI Processing Message */}
        {isSubmitting && (
          <div className="mt-4 text-center">

            <p className="text-xs text-slate-500">
              MockMate AI is analyzing your answer...
            </p>

          </div>
        )}

      </div>
    </div>
  );
};

export default InterviewRoomPage;