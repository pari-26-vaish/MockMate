return (
  <div className="credit-badge">
    <div className="credit-icon">
      ⚡
    </div>

    <div className="credit-content">
      <span className="credit-label">
        Interview Credits
      </span>

      <div className="credit-value">
        <strong>
          {credits !== null ? credits : "..."}
        </strong>

        <span>remaining</span>
      </div>
    </div>

    <div className="credit-status">
      <span></span>
    </div>
  </div>
);