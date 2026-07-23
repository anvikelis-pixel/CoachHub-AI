function SectionTitle({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <header className="shared-section-title">
      <div>
        {eyebrow && (
          <p className="section-eyebrow dark">
            {eyebrow}
          </p>
        )}

        <h2>{title}</h2>

        {description && <p>{description}</p>}
      </div>

      {action && (
        <div className="shared-section-action">
          {action}
        </div>
      )}
    </header>
  );
}

export default SectionTitle;