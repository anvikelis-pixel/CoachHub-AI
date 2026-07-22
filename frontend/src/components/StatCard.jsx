function StatCard({ icon, title, value, description }) {
  return (
    <article className="stat-card">
      <div className="stat-card-icon">{icon}</div>

      <div>
        <p className="stat-card-title">{title}</p>
        <h3>{value}</h3>
        <p className="stat-card-description">{description}</p>
      </div>
    </article>
  );
}

export default StatCard;
