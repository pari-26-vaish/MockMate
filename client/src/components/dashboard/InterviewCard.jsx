import { useNavigate } from "react-router-dom";
import { BriefcaseBusiness, CalendarDays, ArrowRight, Sparkles } from "lucide-react";

const InterviewCard = ({ interview }) => {
  const navigate = useNavigate();

  const formattedDate = new Date(interview.createdAt).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  const score = interview.score ?? 0;

  const scoreTier =
    score >= 80 ? "excellent" : score >= 60 ? "good" : score > 0 ? "low" : "none";

  const scoreLabel =
    scoreTier === "excellent"
      ? "Excellent"
      : scoreTier === "good"
      ? "Good"
      : scoreTier === "low"
      ? "Needs Work"
      : "Not Attempted";

  // Circle math for the progress ring
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;

  const handleAction = () => {
    navigate(`/interview/${interview._id}`);
  };

  return (
    <div className={`interview-card tier-${scoreTier}`}>
      <div className="interview-card-glow" />

      {/* Top section */}
      <div className="interview-card-top">
        <div className="interview-card-info">
          <div className="interview-icon">
            <BriefcaseBusiness size={20} />
          </div>

          <div>
            <p className="interview-label">
              <Sparkles size={12} />
              AI INTERVIEW
            </p>
            <h3>{interview.role}</h3>
            <p className="interview-tech">{interview.techStack}</p>
          </div>
        </div>

        {/* Score Ring */}
        <div className="score-ring-wrapper">
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle
              className="score-ring-track"
              cx="32"
              cy="32"
              r={radius}
              strokeWidth="5"
              fill="none"
            />
            <circle
              className={`score-ring-fill tier-${scoreTier}`}
              cx="32"
              cy="32"
              r={radius}
              strokeWidth="5"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={progress}
              strokeLinecap="round"
              transform="rotate(-90 32 32)"
            />
          </svg>
          <div className="score-ring-text">
            <span className="score-value">{score}</span>
            <span className="score-max">/100</span>
          </div>
        </div>
      </div>

      {/* Tier badge + Date */}
      <div className="interview-meta">
        <span className={`score-badge tier-${scoreTier}`}>{scoreLabel}</span>
        <div className="interview-date">
          <CalendarDays size={14} />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Action */}
      <button className="interview-action-btn" onClick={handleAction}>
        <span>{score > 0 ? "View Interview" : "Start Interview"}</span>
        <ArrowRight size={17} className="btn-arrow" />
      </button>
    </div>
  );
};

export default InterviewCard;