import { useState, useMemo, useRef } from "react";
import {
  createInterview,
  parseResume,
} from "../services/interviewService.js";
import {
  Upload,
  FileText,
  X,
  Check,
  Sparkles,
  Loader2,
  Zap,
  Mic,
  Video,
  MessageSquare,
} from "lucide-react";
import "./CreateInterviewPage.css";

/* ---------------------------------------------------------------
   Static option sets — edit these to change what's offered.
--------------------------------------------------------------- */

const POPULAR_ROLES = [
  "MERN Stack Developer",
  "Java Developer",
  "Frontend Developer",
  "Backend Developer",
  "Data Analyst",
  "Software Engineer",
];

const TECH_OPTIONS = [
  "React",
  "Node.js",
  "MongoDB",
  "Express",
  "Java",
  "Python",
  "C++",
  "SQL",
];

const EXPERIENCE_LEVELS = [
  { id: "Beginner", label: "Beginner", range: "0–1 years" },
  { id: "Intermediate", label: "Intermediate", range: "1–3 years" },
  { id: "Advanced", label: "Advanced", range: "3+ years" },
];

const FOCUS_AREAS = [
  "Technical",
  "Problem Solving",
  "Behavioral",
  "HR",
  "System Design",
  "Resume Based",
  "Project Based",
];

const QUESTION_COUNTS = [10, 15, 20, 30];
const DURATIONS = [15, 30, 45, 60];

const INTERVIEW_TYPES = [
  "Campus Placement",
  "Internship",
  "Technical Round",
  "HR Round",
  "Product Company",
  "Service Company",
  "Mock Interview",
];

const GENERATION_STEPS = [
  "Reading your resume",
  "Matching it against the role",
  "Weighing question difficulty",
  "Assembling your interview",
];

/* ---------------------------------------------------------------
   Component
--------------------------------------------------------------- */

const CreateInterviewPage = ({ credits = 4 }) => {
  const [role, setRole] = useState("");
  const [customTech, setCustomTech] = useState("");
  const [techStack, setTechStack] = useState([]);
  const [experience, setExperience] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [focusAreas, setFocusAreas] = useState(["Technical"]);
  const [numQuestions, setNumQuestions] = useState(15);
  const [duration, setDuration] = useState(30);
  const [mode, setMode] = useState("text");
  const [company, setCompany] = useState("");
  const [interviewType, setInterviewType] = useState("");

  const [resume, setResume] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const timers = useRef([]);

  const isReady =
    role.trim() && techStack.length > 0 && experience && resume;

  /* ---------------- helpers ---------------- */

  const toggleTech = (t) => {
    setTechStack((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const addCustomTech = () => {
    const t = customTech.trim();
    if (t && !techStack.includes(t)) setTechStack((prev) => [...prev, t]);
    setCustomTech("");
  };

  const toggleFocus = (f) => {
    setFocusAreas((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  };

  const handleFile = (file) => {
    if (!file) return;
    const isPDF =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    if (!isPDF) {
      alert("Please select a PDF file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Resume must be under 5 MB.");
      return;
    }
    setResume(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const runGenerationSequence = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStepIndex(0);
    GENERATION_STEPS.forEach((_, i) => {
      if (i === 0) return;
      const t = setTimeout(() => setStepIndex(i), i * 650);
      timers.current.push(t);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role || techStack.length === 0 || !experience) {
      alert("Please complete the interview setup fields.");
      return;
    }
    if (!resume) {
      alert("Please upload your PDF resume.");
      return;
    }
    if (credits < 1) {
      alert("You're out of credits.");
      return;
    }

    try {
      setLoading(true);
      runGenerationSequence();

      const [resumeData] = await Promise.all([
        parseResume(resume),
        new Promise((res) => setTimeout(res, GENERATION_STEPS.length * 650)),
      ]);

      const interviewData = {
        role,
        techStack: techStack.join(", "),
        experience,
        resumeText: resumeData.text,
        jobDescription: jobDescription || undefined,
        difficulty,
        focusAreas,
        numQuestions,
        duration,
        mode,
        company: company || undefined,
        interviewType: interviewType || undefined,
      };

      const data = await createInterview(interviewData);
      console.log("Interview created:", data);

      setStepIndex(GENERATION_STEPS.length);
      await new Promise((res) => setTimeout(res, 500));

      alert("Interview created successfully!");

      setRole("");
      setTechStack([]);
      setExperience("");
      setResume(null);
      setJobDescription("");
      setCompany("");
      setInterviewType("");
    } catch (error) {
      console.error("Failed to create interview:", error);
      alert(error.response?.data?.message || "Failed to create interview");
    } finally {
      timers.current.forEach(clearTimeout);
      setLoading(false);
    }
  };

  const previewTech = useMemo(() => techStack.slice(0, 4), [techStack]);

  /* ---------------- render ---------------- */

  return (
    <div className="mm-page">
      <header className="mm-topbar">
        <div className="mm-brand">
          <span className="mm-brand-mark">MM</span>
          <span className="mm-brand-name">MockMate</span>
        </div>
        <div className="mm-topbar-right">
          <span className="mm-ai-ready">
            <span className="mm-dot" /> AI engine ready
          </span>
          <span className="mm-credits">
            <Zap size={14} strokeWidth={2.4} />
            {credits} credits
          </span>
        </div>
      </header>

      <div className="mm-hero">
        <h1>Build your interview</h1>
        <p>
          Tell MockMate what you're preparing for — the role, your stack, and
          your resume. It builds a rehearsal around exactly that.
        </p>
      </div>

      <div className="mm-layout">
        <form className="mm-form" onSubmit={handleSubmit}>
          {/* ---- Section 1 ---- */}
          <section className="mm-section">
            <h2><span className="mm-step-no">1</span> Interview setup</h2>

            <div className="mm-field">
              <label>Target role</label>
              <input
                type="text"
                placeholder="e.g. MERN Stack Developer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
              <div className="mm-chip-row">
                {POPULAR_ROLES.map((r) => (
                  <button
                    type="button"
                    key={r}
                    className={`mm-chip ${role === r ? "is-selected" : ""}`}
                    onClick={() => setRole(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="mm-field">
              <label>Tech stack</label>
              <div className="mm-chip-row">
                {TECH_OPTIONS.map((t) => (
                  <button
                    type="button"
                    key={t}
                    className={`mm-chip mm-chip-mono ${
                      techStack.includes(t) ? "is-selected" : ""
                    }`}
                    onClick={() => toggleTech(t)}
                  >
                    {t}
                  </button>
                ))}
                {techStack
                  .filter((t) => !TECH_OPTIONS.includes(t))
                  .map((t) => (
                    <button
                      type="button"
                      key={t}
                      className="mm-chip mm-chip-mono is-selected"
                      onClick={() => toggleTech(t)}
                    >
                      {t} <X size={11} />
                    </button>
                  ))}
                <span className="mm-add-tech">
                  <input
                    type="text"
                    placeholder="+ Add technology"
                    value={customTech}
                    onChange={(e) => setCustomTech(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomTech();
                      }
                    }}
                  />
                </span>
              </div>
            </div>

            <div className="mm-field">
              <label>Experience level</label>
              <div className="mm-exp-row">
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <button
                    type="button"
                    key={lvl.id}
                    className={`mm-exp-card ${
                      experience === lvl.id ? "is-selected" : ""
                    }`}
                    onClick={() => setExperience(lvl.id)}
                  >
                    <strong>{lvl.label}</strong>
                    <span>{lvl.range}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ---- Section 2 ---- */}
          <section className="mm-section">
            <h2><span className="mm-step-no">2</span> Resume &amp; preferences</h2>

            <div className="mm-field">
              <label>Resume (PDF, max 5 MB)</label>
              {!resume ? (
                <div
                  className={`mm-dropzone ${dragActive ? "is-drag" : ""}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                >
                  <Upload size={22} strokeWidth={1.6} />
                  <p>Drop your resume here</p>
                  <span className="mm-muted">or</span>
                  <label className="mm-browse">
                    Browse file
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      hidden
                      onChange={(e) => handleFile(e.target.files[0])}
                    />
                  </label>
                </div>
              ) : (
                <div className="mm-resume-card">
                  <FileText size={20} strokeWidth={1.8} />
                  <div className="mm-resume-info">
                    <strong>{resume.name}</strong>
                    <span>{(resume.size / (1024 * 1024)).toFixed(1)} MB</span>
                  </div>
                  <div className="mm-resume-actions">
                    <label className="mm-link-btn">
                      Replace
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        hidden
                        onChange={(e) => handleFile(e.target.files[0])}
                      />
                    </label>
                    <button
                      type="button"
                      className="mm-link-btn mm-danger"
                      onClick={() => setResume(null)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
              {resume && (
                <div className="mm-analysis">
                  <Sparkles size={13} /> Ready to analyze against{" "}
                  {role || "your target role"}
                  {techStack.length > 0 && (
                    <> and {techStack.slice(0, 3).join(", ")}</>
                  )}
                  .
                </div>
              )}
            </div>

            <div className="mm-field">
              <label>Job description <span className="mm-optional">optional</span></label>
              <textarea
                rows={4}
                placeholder="Paste the job description you're preparing for — MockMate will lean questions toward it."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <div className="mm-field-grid">
              <div className="mm-field">
                <label>Company <span className="mm-optional">optional</span></label>
                <input
                  type="text"
                  placeholder="e.g. TCS, Google"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div className="mm-field">
                <label>Interview type <span className="mm-optional">optional</span></label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                >
                  <option value="">Select type</option>
                  {INTERVIEW_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* ---- Section 3 ---- */}
          <section className="mm-section">
            <h2><span className="mm-step-no">3</span> Shape the interview</h2>

            <div className="mm-field">
              <label>Difficulty</label>
              <div className="mm-segmented">
                {["Easy", "Medium", "Hard"].map((d) => (
                  <button
                    type="button"
                    key={d}
                    className={difficulty === d ? "is-selected" : ""}
                    onClick={() => setDifficulty(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="mm-field">
              <label>Focus areas</label>
              <div className="mm-chip-row">
                {FOCUS_AREAS.map((f) => (
                  <button
                    type="button"
                    key={f}
                    className={`mm-chip ${
                      focusAreas.includes(f) ? "is-selected" : ""
                    }`}
                    onClick={() => toggleFocus(f)}
                  >
                    {focusAreas.includes(f) && <Check size={11} />} {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="mm-field-grid">
              <div className="mm-field">
                <label>Number of questions</label>
                <div className="mm-pill-row">
                  {QUESTION_COUNTS.map((n) => (
                    <button
                      type="button"
                      key={n}
                      className={numQuestions === n ? "is-selected" : ""}
                      onClick={() => setNumQuestions(n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mm-field">
                <label>Duration</label>
                <div className="mm-pill-row">
                  {DURATIONS.map((d) => (
                    <button
                      type="button"
                      key={d}
                      className={duration === d ? "is-selected" : ""}
                      onClick={() => setDuration(d)}
                    >
                      {d}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mm-field">
              <label>Interview mode</label>
              <div className="mm-mode-row">
                <button
                  type="button"
                  className={`mm-mode-card ${mode === "text" ? "is-selected" : ""}`}
                  onClick={() => setMode("text")}
                >
                  <MessageSquare size={16} />
                  Text
                </button>
                <button type="button" className="mm-mode-card" disabled>
                  <Mic size={16} />
                  Voice
                  <span className="mm-soon">Coming soon</span>
                </button>
                <button type="button" className="mm-mode-card" disabled>
                  <Video size={16} />
                  Video
                  <span className="mm-soon">Coming soon</span>
                </button>
              </div>
            </div>
          </section>

          <button type="submit" className="mm-submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className="mm-spin" />
                {GENERATION_STEPS[Math.min(stepIndex, GENERATION_STEPS.length - 1)]}
                {stepIndex >= GENERATION_STEPS.length && "Your interview is ready"}
              </>
            ) : (
              "Generate my interview"
            )}
          </button>
          <p className="mm-credit-note">This will use 1 credit.</p>
        </form>

        {/* ---- Live preview ---- */}
        <aside className="mm-preview">
          <div className={`mm-preview-card ${isReady ? "is-ready" : ""}`}>
            <span className="mm-preview-label">Your interview</span>
            <strong className="mm-preview-role">
              {role || "Choose a role"}
            </strong>
            <span className="mm-preview-exp">
              {experience || "Experience level"}
            </span>

            <div className="mm-preview-tech">
              {previewTech.length > 0 ? (
                previewTech.map((t) => (
                  <span key={t} className="mm-preview-chip">
                    {t}
                  </span>
                ))
              ) : (
                <span className="mm-muted">No stack selected yet</span>
              )}
              {techStack.length > 4 && (
                <span className="mm-preview-chip">+{techStack.length - 4}</span>
              )}
            </div>

            <div className="mm-preview-stats">
              <div>
                <strong>{numQuestions}</strong>
                <span>questions</span>
              </div>
              <div>
                <strong>{duration}m</strong>
                <span>duration</span>
              </div>
              <div>
                <strong>{difficulty}</strong>
                <span>difficulty</span>
              </div>
            </div>

            <div className="mm-preview-focus">
              {focusAreas.length > 0
                ? focusAreas.join(" · ")
                : "No focus areas yet"}
            </div>

            <div className={`mm-preview-status ${isReady ? "is-ready" : ""}`}>
              {isReady ? (
                <>
                  <Check size={13} /> AI ready
                </>
              ) : (
                "Fill in setup to continue"
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CreateInterviewPage;