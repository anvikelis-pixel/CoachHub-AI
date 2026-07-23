function ExerciseBuilder({
  exerciseForm,
  exercises,
  totalDuration,
  onExerciseChange,
  onAddExercise,
  onRemoveExercise,
  onMoveExercise,
  onOpenLibrary,
}) {
  return (
    <>
      <div className="training-exercise-section-heading">
        <p className="player-form-section-title">
          Προσθήκη άσκησης
        </p>

        {onOpenLibrary && (
          <button
            type="button"
            className="open-exercise-library-button"
            onClick={onOpenLibrary}
          >
            📚 Από βιβλιοθήκη
          </button>
        )}
      </div>

      <div className="exercise-builder">
        <input
          type="text"
          name="name"
          value={exerciseForm.name}
          onChange={onExerciseChange}
          placeholder="Όνομα άσκησης"
        />

        <select
          name="category"
          value={exerciseForm.category}
          onChange={onExerciseChange}
        >
          <option value="Προθέρμανση">
            Προθέρμανση
          </option>

          <option value="Τεχνική">
            Τεχνική
          </option>

          <option value="Τακτική">
            Τακτική
          </option>

          <option value="Φυσική κατάσταση">
            Φυσική κατάσταση
          </option>

          <option value="Τελειώματα">
            Τελειώματα
          </option>

          <option value="Στημένες φάσεις">
            Στημένες φάσεις
          </option>

          <option value="Αγωνιστικό παιχνίδι">
            Αγωνιστικό παιχνίδι
          </option>

          <option value="Αποθεραπεία">
            Αποθεραπεία
          </option>
        </select>

        <input
          type="number"
          name="duration"
          min="1"
          max="120"
          value={exerciseForm.duration}
          onChange={onExerciseChange}
        />

        <button
          type="button"
          className="premium-primary-button"
          onClick={onAddExercise}
        >
          + Προσθήκη
        </button>
      </div>

      <div className="training-exercise-list">
        <header>
          <h3>Πλάνο ασκήσεων</h3>

          <strong>
            {totalDuration}' συνολικά
          </strong>
        </header>

        {exercises.length > 0 ? (
          exercises.map((exercise, index) => (
            <article key={exercise.id}>
              <span className="exercise-order">
                {index + 1}
              </span>

              <div>
                <strong>{exercise.name}</strong>

                <p>
                  {exercise.category} ·{" "}
                  {exercise.duration} λεπτά
                </p>
              </div>

              <div className="exercise-actions">
                <button
                  type="button"
                  onClick={() =>
                    onMoveExercise(index, -1)
                  }
                  disabled={index === 0}
                  aria-label="Μετακίνηση άσκησης πάνω"
                >
                  ↑
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onMoveExercise(index, 1)
                  }
                  disabled={
                    index === exercises.length - 1
                  }
                  aria-label="Μετακίνηση άσκησης κάτω"
                >
                  ↓
                </button>

                <button
                  type="button"
                  className="danger"
                  onClick={() =>
                    onRemoveExercise(exercise.id)
                  }
                  aria-label="Διαγραφή άσκησης"
                >
                  ×
                </button>
              </div>
            </article>
          ))
        ) : (
          <p className="empty-exercises-message">
            Δεν έχουν προστεθεί ακόμη ασκήσεις.
          </p>
        )}
      </div>
    </>
  );
}

export default ExerciseBuilder;