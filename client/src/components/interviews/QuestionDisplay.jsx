const QuestionDisplay = ({ question, questionNumber, totalQuestions }) => {
  return (
    <div className="question-display">

      {/* Question Progress */}
      <div className="question-progress">
        <span>
          Question {questionNumber} of {totalQuestions}
        </span>

        <span className="question-category">
          {question?.category || "Technical"}
        </span>
      </div>

      {/* Question */}
      <h2 className="question-text">
        {question?.question || "Loading question..."}
      </h2>

      {/* Tags */}
      <div className="question-tags">
        <span className="question-tag">
          {question?.category || "Technical"}
        </span>

        {question?.difficulty && (
          <span className="question-tag">
            {question.difficulty}
          </span>
        )}

        {question?.topic && (
          <span className="question-tag">
            {question.topic}
          </span>
        )}
      </div>

    </div>
  );
};

export default QuestionDisplay;