function EmptyState({
  eyebrow = "NO RESULTS",
  title,
  description,
  action,
}) {
  return (
    <div className="shared-empty-state">
      <span>{eyebrow}</span>

      <h3>{title}</h3>

      {description && <p>{description}</p>}

      {action && (
        <div className="shared-empty-state-action">
          {action}
        </div>
      )}
    </div>
  );
}

export default EmptyState;