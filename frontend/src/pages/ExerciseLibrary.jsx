import { useEffect, useMemo, useState } from "react";

import ExerciseCard from "../components/exercises/ExerciseCard";
import initialExercises from "../data/exercises";

function ExerciseLibrary() {
  const [exercises, setExercises] = useState(() => {
    try {
      const savedExercises = localStorage.getItem(
        "coachhub-exercises"
      );

      return savedExercises
        ? JSON.parse(savedExercises)
        : initialExercises;
    } catch (error) {
      console.error(
        "Αποτυχία φόρτωσης ασκήσεων:",
        error
      );

      return initialExercises;
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("Όλες");
  const [libraryFilter, setLibraryFilter] =
    useState("Όλες");
  const [sortOption, setSortOption] =
    useState("rating");

  useEffect(() => {
    try {
      localStorage.setItem(
        "coachhub-exercises",
        JSON.stringify(exercises)
      );
    } catch (error) {
      console.error(
        "Αποτυχία αποθήκευσης ασκήσεων:",
        error
      );
    }
  }, [exercises]);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        exercises.map(
          (exercise) => exercise.category
        )
      ),
    ];

    return uniqueCategories.sort((first, second) =>
      first.localeCompare(second, "el")
    );
  }, [exercises]);

  const filteredExercises = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    const matchingExercises = exercises.filter(
      (exercise) => {
        const searchableText = [
          exercise.title,
          exercise.category,
          exercise.description,
          exercise.objective,
          exercise.difficulty,
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

        const matchesLibrary =
          libraryFilter === "Όλες" ||
          (libraryFilter === "Αγαπημένες" &&
            exercise.favorite) ||
          (libraryFilter === "Official" &&
            exercise.source === "official") ||
          (libraryFilter === "Οι ασκήσεις μου" &&
            exercise.source === "custom");

        return (
          matchesSearch &&
          matchesCategory &&
          matchesLibrary
        );
      }
    );

    return [...matchingExercises].sort(
      (firstExercise, secondExercise) => {
        /*
         * Οι αγαπημένες ασκήσεις εμφανίζονται
         * πάντα πριν από τις μη αγαπημένες.
         */
        if (
          firstExercise.favorite !==
          secondExercise.favorite
        ) {
          return firstExercise.favorite ? -1 : 1;
        }

        /*
         * Μέσα στην ομάδα των αγαπημένων και
         * μέσα στην ομάδα των υπόλοιπων εφαρμόζεται
         * η ταξινόμηση που επέλεξε ο χρήστης.
         */
        if (sortOption === "rating") {
          return (
            Number(secondExercise.rating || 0) -
            Number(firstExercise.rating || 0)
          );
        }

        if (sortOption === "duration") {
          return (
            Number(firstExercise.duration || 0) -
            Number(secondExercise.duration || 0)
          );
        }

        if (sortOption === "intensity") {
          return (
            Number(secondExercise.intensity || 0) -
            Number(firstExercise.intensity || 0)
          );
        }

        if (sortOption === "usage") {
          return (
            Number(secondExercise.timesUsed || 0) -
            Number(firstExercise.timesUsed || 0)
          );
        }

        return firstExercise.title.localeCompare(
          secondExercise.title,
          "el"
        );
      }
    );
  }, [
    exercises,
    searchTerm,
    categoryFilter,
    libraryFilter,
    sortOption,
  ]);

  const favoriteExercises = exercises.filter(
    (exercise) => exercise.favorite
  ).length;

  const averageRating =
    exercises.length > 0
      ? (
          exercises.reduce(
            (total, exercise) =>
              total + Number(exercise.rating || 0),
            0
          ) / exercises.length
        ).toFixed(1)
      : "0.0";

  function toggleFavorite(exerciseId) {
    setExercises((currentExercises) =>
      currentExercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              favorite: !exercise.favorite,
            }
          : exercise
      )
    );
  }

  function clearFilters() {
    setSearchTerm("");
    setCategoryFilter("Όλες");
    setLibraryFilter("Όλες");
    setSortOption("rating");
  }

  return (
    <div className="exercise-library-page">
      <section className="exercise-library-hero">
        <div>
          <p className="section-eyebrow">
            FOOTBALL KNOWLEDGE BASE
          </p>

          <h1>Exercise Library</h1>

          <p className="exercise-library-description">
            Βρες, οργάνωσε και επαναχρησιμοποίησε
            ασκήσεις για κάθε στόχο προπόνησης.
          </p>
        </div>

        <div className="exercise-library-hero-number">
          <span>EXERCISES</span>

          <strong>
            {String(exercises.length).padStart(
              2,
              "0"
            )}
          </strong>
        </div>
      </section>

      <section className="exercise-library-insights">
        <article className="exercise-library-insight featured">
          <span>ΣΥΝΟΛΟ ΑΣΚΗΣΕΩΝ</span>
          <strong>{exercises.length}</strong>
          <p>Ασκήσεις διαθέσιμες στη βιβλιοθήκη</p>
        </article>

        <article className="exercise-library-insight">
          <span>ΑΓΑΠΗΜΕΝΕΣ</span>
          <strong>{favoriteExercises}</strong>
          <p>Ασκήσεις που έχεις ξεχωρίσει</p>
        </article>

        <article className="exercise-library-insight">
          <span>ΚΑΤΗΓΟΡΙΕΣ</span>
          <strong>{categories.length}</strong>
          <p>Διαφορετικοί στόχοι προπόνησης</p>
        </article>

        <article className="exercise-library-insight">
          <span>ΜΕΣΗ ΒΑΘΜΟΛΟΓΙΑ</span>
          <strong>{averageRating}/5</strong>
          <p>Αξιολόγηση όλων των ασκήσεων</p>
        </article>
      </section>

      <section className="exercise-library-directory">
        <header className="exercise-library-directory-header">
          <div>
            <p className="section-eyebrow dark">
              EXERCISE DATABASE
            </p>

            <h2>Βιβλιοθήκη ασκήσεων</h2>

            <p>
              {filteredExercises.length} από{" "}
              {exercises.length} ασκήσεις
            </p>
          </div>

          <button
            type="button"
            className="exercise-clear-filters"
            onClick={clearFilters}
          >
            Καθαρισμός φίλτρων
          </button>
        </header>

        <div className="exercise-library-toolbar">
          <label className="exercise-search-field">
            <span>Αναζήτηση</span>

            <input
              type="search"
              placeholder="Τίτλος, στόχος, tag..."
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

          <label>
            <span>Βιβλιοθήκη</span>

            <select
              value={libraryFilter}
              onChange={(event) =>
                setLibraryFilter(
                  event.target.value
                )
              }
            >
              <option value="Όλες">
                Όλες
              </option>

              <option value="Αγαπημένες">
                Αγαπημένες
              </option>

              <option value="Official">
                Official Library
              </option>

              <option value="Οι ασκήσεις μου">
                Οι ασκήσεις μου
              </option>
            </select>
          </label>

          <label>
            <span>Ταξινόμηση</span>

            <select
              value={sortOption}
              onChange={(event) =>
                setSortOption(event.target.value)
              }
            >
              <option value="rating">
                Υψηλότερη βαθμολογία
              </option>

              <option value="usage">
                Περισσότερες χρήσεις
              </option>

              <option value="intensity">
                Υψηλότερη ένταση
              </option>

              <option value="duration">
                Μικρότερη διάρκεια
              </option>

              <option value="alphabetical">
                Αλφαβητικά
              </option>
            </select>
          </label>
        </div>

        {filteredExercises.length > 0 ? (
          <div className="exercise-grid">
            {filteredExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="exercise-empty-state">
            <span>NO EXERCISES</span>

            <h3>Δεν βρέθηκαν ασκήσεις.</h3>

            <p>
              Δοκίμασε διαφορετική αναζήτηση ή
              καθάρισε τα φίλτρα.
            </p>

            <button
              type="button"
              onClick={clearFilters}
            >
              Εμφάνιση όλων
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default ExerciseLibrary;