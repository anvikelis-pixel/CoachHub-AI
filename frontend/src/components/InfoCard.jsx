function InfoCard({
  eyebrow,
  title,
  children,
  dark = false,
  className = "",
}) {
  return (
    <section
      className={`shared-info-card ${
        dark ? "dark" : ""
      } ${className}`}
    >
      {eyebrow && (
        <p
          className={`section-eyebrow ${
            dark ? "" : "dark"
          }`}
        >
          {eyebrow}
        </p>
      )}

      {title && <h2>{title}</h2>}

      <div className="shared-info-card-content">
        {children}
      </div>
    </section>
  );
}

export default InfoCard;