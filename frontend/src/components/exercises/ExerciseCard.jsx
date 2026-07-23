import { Link } from "react-router-dom";

function ExerciseCard({
  exercise,
  onToggleFavorite,
}) {
  const intensityLevel =
    exercise.intensity >= 85
      ? "Υψηλή"
      : exercise.intensity >= 60
        ? "Μέτρια"
        : "Χαμηλή";

  const visibleTags = exercise.tags.slice(0, 4);

  const hiddenTagsCount =
    exercise.tags.length - visibleTags.length;

  function handleFavoriteClick() {
    if (onToggleFavorite) {
      onToggleFavorite(exercise.id);
    }
  }

  return (
    <article className="exercise-card">
      <header className="exercise-card-header">
        <div>
          <span className="exercise-category">
            {exercise.category}
          </span>

          <h3>{exercise.title}</h3>
        </div>

        <button
          className={`exercise-favorite ${
            exercise.favorite ? "active" : ""
          }`}
          type="button"
          onClick={handleFavoriteClick}
          aria-label={
            exercise.favorite
              ? "Αφαίρεση από αγαπημένα"
              : "Προσθήκη στα αγαπημένα"
          }
          title={
            exercise.favorite
              ? "Αφαίρεση από αγαπημένα"
              : "Προσθήκη στα αγαπημένα"
          }
        >
          {exercise.favorite ? "★" : "☆"}
        </button>
      </header>

      <p className="exercise-description">
        {exercise.description}
      </p>

      <div className="exercise-card-stats">
        <article>
          <span>ΔΙΑΡΚΕΙΑ</span>
          <strong>{exercise.duration}'</strong>
        </article>

        <article>
          <span>ΠΑΙΚΤΕΣ</span>
          <strong>
            {exercise.minPlayers}-{exercise.maxPlayers}
          </strong>
        </article>

        <article>
          <span>ΒΑΘΜΟΛΟΓΙΑ</span>
          <strong>{exercise.rating}/5</strong>
        </article>

        <article>
          <span>ΧΡΗΣΕΙΣ</span>
          <strong>{exercise.timesUsed}</strong>
        </article>
      </div>

      <div className="exercise-card-badges">
        <span
          className={`exercise-difficulty ${exercise.difficulty.toLowerCase()}`}
        >
          {exercise.difficulty}
        </span>

        <span
          className={`exercise-intensity-label ${intensityLevel.toLowerCase()}`}
        >
          {intensityLevel} ένταση
        </span>
      </div>

      <div className="exercise-intensity-block">
        <div className="exercise-intensity-header">
          <span>Ένταση</span>
          <strong>{exercise.intensity}%</strong>
        </div>

        <div className="exercise-intensity-track">
          <div
            className="exercise-intensity-value"
            style={{
              width: `${exercise.intensity}%`,
            }}
          />
        </div>
      </div>

      <div className="exercise-tags">
        {visibleTags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}

        {hiddenTagsCount > 0 && (
          <span className="exercise-tags-more">
            +{hiddenTagsCount}
          </span>
        )}
      </div>

      <footer className="exercise-card-footer">
        <div className="exercise-card-source">
          <span>
            {exercise.source === "official"
              ? "OFFICIAL LIBRARY"
              : "MY LIBRARY"}
          </span>

          <p>
            Τελευταία χρήση:{" "}
            {exercise.lastUsed ||
              "Δεν έχει χρησιμοποιηθεί"}
          </p>
        </div>

        <Link
          to={`/exercises/${exercise.id}`}
          className="exercise-button"
        >
          Προβολή άσκησης →
        </Link>
      </footer>
    </article>
  );
}

export default ExerciseCard;