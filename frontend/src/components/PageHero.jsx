function PageHero({
  eyebrow,
  title,
  description,
  label,
  value,
  children,
}) {
  return (
    <section className="shared-page-hero">
      <div className="shared-page-hero-content">
        {eyebrow && (
          <p className="section-eyebrow">
            {eyebrow}
          </p>
        )}

        <h1>{title}</h1>

        {description && (
          <p className="shared-page-hero-description">
            {description}
          </p>
        )}

        {children && (
          <div className="shared-page-hero-actions">
            {children}
          </div>
        )}
      </div>

      {(label || value !== undefined) && (
        <div className="shared-page-hero-stat">
          {label && <span>{label}</span>}

          {value !== undefined && (
            <strong>{value}</strong>
          )}
        </div>
      )}
    </section>
  );
}

export default PageHero;