import exercises from "../data/exercises";
import ExerciseCard from "../components/exercises/ExerciseCard";

function ExerciseLibrary() {
  return (
    <div className="exercise-library-page">

      <div className="page-header">

        <div>

          <h1>📚 Exercise Library</h1>

          <p>
            Όλες οι ασκήσεις της ομάδας σε μία οργανωμένη βιβλιοθήκη.
          </p>

        </div>

      </div>

      <div className="exercise-grid">

        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
          />
        ))}

      </div>

    </div>
  );
}

export default ExerciseLibrary;