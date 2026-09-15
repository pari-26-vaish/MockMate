import { useEffect, useRef, useState } from "react";
import {
  Mic,
  Square,
  RotateCcw,
  Keyboard,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import AudioVisualizer from "./AudioVisualizer";

// States: "idle" | "listening" | "processing" | "completed"

const SpeechToTextControl = ({
  onAnswerChange,
  onStatusChange,
  micAvailable = true,
}) => {
  const [status, setStatus] = useState("idle");
  const [finalText, setFinalText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [volume, setVolume] = useState(0);
  const [manualMode, setManualMode] = useState(!micAvailable);
  const [showReRecordConfirm, setShowReRecordConfirm] = useState(false);
  const listeningTimer = useRef(null);

  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  useEffect(() => {
    onAnswerChange?.(finalText);
  }, [finalText, onAnswerChange]);

  // Simulated live recognition loop — replace with real speech API events.
  useEffect(() => {
    if (status !== "listening") return;
    listeningTimer.current = setInterval(() => {
      setVolume(20 + Math.random() * 70);
      setConfidence((c) => Math.min(97, c + Math.random() * 6));
    }, 250);
    return () => clearInterval(listeningTimer.current);
  }, [status]);

  const startRecording = () => {
    setStatus("listening");
    setInterimText("");
    setConfidence(0);
  };

  const stopRecording = () => {
    setStatus("processing");
    setVolume(0);
    // Simulate finalization latency before showing the completed answer.
    setTimeout(() => {
      setFinalText((prev) =>
        (prev ? prev + " " : "") + (interimText || "").trim()
      );
      setInterimText("");
      setStatus("completed");
    }, 900);
  };

  const requestReRecord = () => setShowReRecordConfirm(true);

  const confirmReRecord = () => {
    setFinalText("");
    setInterimText("");
    setConfidence(0);
    setStatus("idle");
    setShowReRecordConfirm(false);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
      {!micAvailable && (
        <div className="mb-5 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
          <span>
            Microphone unavailable — you can continue using manual text
            input.
          </span>
        </div>
      )}

      {!manualMode && (
        <>
          <AudioVisualizer status={status} volume={volume} />

          {status === "listening" && confidence > 0 && (
            <div className="mx-auto mt-4 flex max-w-xs items-center gap-2">
              <span className="text-[11px] text-slate-500 whitespace-nowrap">
                Speech confidence
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-cyan-400"
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <span className="text-[11px] tabular-nums text-slate-400">
                {Math.round(confidence)}%
              </span>
            </div>
          )}

          <div className="mt-6 flex justify-center gap-3">
            {status === "idle" && (
              <button
                onClick={startRecording}
                className="flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-cyan-400"
              >
                <Mic className="h-4 w-4" />
                Start Answer
              </button>
            )}

            {status === "listening" && (
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-400"
              >
                <Square className="h-3.5 w-3.5" />
                Stop
              </button>
            )}

            {status === "processing" && (
              <span className="flex items-center gap-2 rounded-full border border-slate-700 px-5 py-2.5 text-sm text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing your answer...
              </span>
            )}

            {status === "completed" && (
              <>
                <span className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  Answer recorded
                </span>
                <button
                  onClick={requestReRecord}
                  className="flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition hover:border-slate-500"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Re-record
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* Re-record confirmation */}
      {showReRecordConfirm && (
        <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          <p className="mb-2">Previous answer will be replaced. Continue?</p>
          <div className="flex gap-2">
            <button
              onClick={confirmReRecord}
              className="rounded-full bg-amber-400 px-3 py-1 text-xs font-medium text-slate-950"
            >
              Yes, re-record
            </button>
            <button
              onClick={() => setShowReRecordConfirm(false)}
              className="rounded-full border border-amber-400/50 px-3 py-1 text-xs text-amber-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Live transcript */}
      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <p className="mb-2 text-[11px] uppercase tracking-wide text-slate-500">
          Live transcript
        </p>
        {finalText || interimText ? (
          <p className="text-sm leading-relaxed text-slate-200">
            {finalText}{" "}
            <span className="text-slate-500">{interimText}</span>
          </p>
        ) : (
          <p className="text-sm text-slate-600">
            Your speech will appear here...
          </p>
        )}
      </div>

      {/* Manual fallback toggle */}
      <div className="mt-4">
        <button
          onClick={() => setManualMode((m) => !m)}
          className="flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-slate-300"
        >
          <Keyboard className="h-3.5 w-3.5" />
          {manualMode ? "Use voice instead" : "Type your answer instead"}
        </button>

        {manualMode && (
          <textarea
            value={finalText}
            onChange={(e) => setFinalText(e.target.value)}
            placeholder="If speech recognition doesn't work, type your answer here..."
            rows={4}
            className="mt-2 w-full resize-none rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none"
          />
        )}
      </div>
    </div>
  );
};

export default SpeechToTextControl;