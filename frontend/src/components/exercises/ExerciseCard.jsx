import { Link } from "react-router-dom";

function ExerciseCard({ exercise }) {
  return (
    <article className="exercise-card">

      <div className="exercise-card-header">

        <div>

          <span className="exercise-category">
            {exercise.category}
          </span>

          <h3>{exercise.title}</h3>

        </div>

        <button
          className="exercise-favorite"
          type="button"
        >
          {exercise.favorite ? "★" : "☆"}
        </button>

      </div>

      <p className="exercise-description">
        {exercise.description}
      </p>

      <div className="exercise-info">

        <span>⏱ {exercise.duration}'</span>

        <span>
          👥 {exercise.minPlayers}-{exercise.maxPlayers}
        </span>

      </div>

      <div className="exercise-tags">

        {exercise.tags.map((tag) => (
          <span key={tag}>
            {tag}
          </span>
        ))}

      </div>

      <Link
        to={`/exercises/${exercise.id}`}
        className="exercise-button"
      >
        Προβολή Άσκησης
      </Link>

    </article>
  );
}

export default ExerciseCard;