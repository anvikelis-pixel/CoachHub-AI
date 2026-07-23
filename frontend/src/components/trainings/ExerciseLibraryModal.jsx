import { useMemo, useState } from "react";

function ExerciseLibraryModal({
  exercises,
  onClose,
  onSelectExercise,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("Όλες");

  const categories = useMemo(() => {
    return [
      ...new Set(
        exercises.map(
          (exercise) => exercise.category
        )
      ),
    ].sort((first, second) =>
      first.localeCompare(second, "el")
    );
  }, [exercises]);

  const filteredExercises = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return exercises
      .filter((exercise) => {
        const searchableText = [
          exercise.title,
          exercise.category,
          exercise.objective,
          exercise.description,
          ...(exercise.tags || []),
        ]
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          !normalizedSearch ||
          searchableText.includes(normalizedSearch);

        const matchesCategory =
          categoryFilter === "Όλες" ||
          exercise.category === categoryFilter;

        return matchesSearch && matchesCategory;
      })
      .sort((firstExercise, secondExercise) => {
        if (
          firstExercise.favorite !==
          secondExercise.favorite
        ) {
          return firstExercise.favorite ? -1 : 1;
        }

        return (
          Number(secondExercise.rating || 0) -
          Number(firstExercise.rating || 0)
        );
      });
  }, [exercises, searchTerm, categoryFilter]);

  return (
    <div
      className="exercise-library-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="exercise-library-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exercise-library-modal-title"
      >
        <div className="exercise-library-modal-accent" />

        <header className="exercise-library-modal-header">
          <div>
            <p className="section-eyebrow dark">
              EXERCISE LIBRARY
            </p>

            <h2 id="exercise-library-modal-title">
              Προσθήκη από βιβλιοθήκη
            </h2>

            <p>
              Επίλεξε έτοιμη άσκηση και πρόσθεσέ την
              απευθείας στο πλάνο προπόνησης.
            </p>
          </div>

          <button
            type="button"
            className="premium-close-button"
            onClick={onClose}
            aria-label="Κλείσιμο βιβλιοθήκης"
          >
            ×
          </button>
        </header>

        <div className="exercise-library-modal-toolbar">
          <label>
            <span>Αναζήτηση</span>

            <input
              type="search"
              placeholder="Τίτλος, στόχος ή tag..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </label>

          <label>
            <span>Κατηγορία</span>

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value
                )
              }
            >
              <option value="Όλες">
                Όλες οι κατηγορίες
              </option>

              {categories.map((category) => (
                <option
                  value={category}
                  key={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="exercise-library-modal-results">
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <article
                className="exercise-library-select-card"
                key={exercise.id}
              >
                <div className="exercise-library-select-main">
                  <div className="exercise-library-select-heading">
                    <div>
                      <span>
                        {exercise.category}
                      </span>

                      <h3>{exercise.title}</h3>
                    </div>

                    {exercise.favorite && (
                      <strong
                        className="exercise-library-select-favorite"
                        title="Αγαπημένη άσκηση"
                      >
                        ★
                      </strong>
                    )}
                  </div>

                  <p>{exercise.objective}</p>

                  <div className="exercise-library-select-meta">
                    <span>
                      ⏱ {exercise.duration}'
                    </span>

                    <span>
                      👥 {exercise.minPlayers}-
                      {exercise.maxPlayers}
                    </span>

                    <span>
                      🔥 {exercise.intensity}%
                    </span>

                    <span>
                      ⭐ {exercise.rating}/5
                    </span>
                  </div>

                  <div className="exercise-library-select-tags">
                    {(exercise.tags || [])
                      .slice(0, 4)
                      .map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="exercise-library-select-button"
                  onClick={() =>
                    onSelectExercise(exercise)
                  }
                >
                  + Επιλογή
                </button>
              </article>
            ))
          ) : (
            <div className="exercise-library-modal-empty">
              <span>NO EXERCISES</span>
              <h3>Δεν βρέθηκαν ασκήσεις.</h3>
              <p>
                Δοκίμασε άλλη αναζήτηση ή κατηγορία.
              </p>
            </div>
          )}
        </div>

        <footer className="exercise-library-modal-footer">
          <span>
            {filteredExercises.length} διαθέσιμες
            ασκήσεις
          </span>

          <button
            type="button"
            className="premium-secondary-button"
            onClick={onClose}
          >
            Κλείσιμο
          </button>
        </footer>
      </section>
    </div>
  );
}

export default ExerciseLibraryModal;