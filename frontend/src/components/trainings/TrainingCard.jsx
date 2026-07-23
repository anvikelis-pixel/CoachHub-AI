import { Link } from "react-router-dom";

function TrainingCard({
  training,
  isExpanded,
  formatDate,
  onToggleExercises,
  onEdit,
  onCopy,
  onDelete,
}) {
  const exercises = Array.isArray(training.exercises)
    ? training.exercises
    : [];

  const duration = exercises.reduce(
    (total, exercise) =>
      total + Number(exercise.duration || 0),
    0
  );

  const visibleExercises = isExpanded
    ? exercises
    : exercises.slice(0, 3);

  const selectedPlayersCount =
    training.selectedPlayerIds?.length ||
    training.availablePlayers ||
    0;

  return (
    <article className="premium-training-card">
      <div className="training-card-top">
        <div>
          <span
            className={`training-intensity ${training.intensity.toLowerCase()}`}
          >
            {training.intensity} ένταση
          </span>

          <h3>{training.title}</h3>

          <p>{training.objective}</p>
        </div>

        <strong className="training-duration">
          {duration}'
        </strong>
      </div>

      <div className="training-card-details">
        <span>
          📅 {formatDate(training.date)}
        </span>

        <span>
          🕐 {training.time || "—"}
        </span>

        <span>
          👥 {selectedPlayersCount} παίκτες
        </span>

        <span>
          📋 {exercises.length} ασκήσεις
        </span>
      </div>

      <div className="training-exercise-preview">
        {visibleExercises.map((exercise, index) => (
          <div key={exercise.id}>
            <span>{index + 1}</span>

            <p>
              <strong>{exercise.name}</strong>

              {exercise.category} · {exercise.duration}'
            </p>
          </div>
        ))}

        {exercises.length > 3 && (
          <button
            type="button"
            className="more-exercises-button"
            onClick={() =>
              onToggleExercises(training.id)
            }
          >
            {isExpanded
              ? "− Απόκρυψη ασκήσεων"
              : `+ ${
                  exercises.length - 3
                } ακόμη ασκήσεις`}
          </button>
        )}
      </div>

      <footer className="training-card-actions">
        <Link
          to={`/trainings/${training.id}`}
          className="training-plan-link"
        >
          Προβολή πλάνου
        </Link>

        <button
          type="button"
          onClick={() => onEdit(training)}
        >
          Επεξεργασία
        </button>

        <button
          type="button"
          onClick={() => onCopy(training)}
        >
          Αντιγραφή
        </button>

        <button
          type="button"
          className="danger"
          onClick={() => onDelete(training.id)}
        >
          Διαγραφή
        </button>
      </footer>
    </article>
  );
}

export default TrainingCard;