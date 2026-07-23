function ProgressBar({
  label,
  value = 0,
  description,
  showValue = true,
}) {
  const safeValue = Math.min(
    100,
    Math.max(0, Number(value) || 0)
  );

  return (
    <div className="shared-progress">
      {(label || showValue) && (
        <div className="shared-progress-header">
          <div>
            {label && <strong>{label}</strong>}

            {description && (
              <p>{description}</p>
            )}
          </div>

          {showValue && <span>{safeValue}%</span>}
        </div>
      )}

      <div
        className="shared-progress-track"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={safeValue}
      >
        <div
          className="shared-progress-value"
          style={{
            width: `${safeValue}%`,
          }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;