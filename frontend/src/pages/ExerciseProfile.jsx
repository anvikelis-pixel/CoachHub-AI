import { Link, useParams } from "react-router-dom";

import initialExercises from "../data/exercises";

function ExerciseProfile() {
  const { exerciseId } = useParams();

  let exercises = initialExercises;

  try {
    const savedExercises = localStorage.getItem(
      "coachhub-exercises"
    );

    if (savedExercises) {
      const parsedExercises = JSON.parse(savedExercises);

      if (Array.isArray(parsedExercises)) {
        exercises = parsedExercises;
      }
    }
  } catch (error) {
    console.error(
      "Αποτυχία φόρτωσης ασκήσεων:",
      error
    );
  }

  const exercise = exercises.find(
    (currentExercise) =>
      String(currentExercise.id) ===
      String(exerciseId)
  );

  if (!exercise) {
    return (
      <div className="exercise-profile-page">
        <section className="exercise-profile-not-found">
          <p className="section-eyebrow dark">
            EXERCISE PROFILE
          </p>

          <h1>Η άσκηση δεν βρέθηκε.</h1>

          <p>
            Η συγκεκριμένη άσκηση μπορεί να έχει
            διαγραφεί ή να μην έχει αποθηκευτεί σωστά.
          </p>

          <Link
            to="/exercises"
            className="exercise-profile-back-link"
          >
            ← Επιστροφή στη βιβλιοθήκη
          </Link>
        </section>
      </div>
    );
  }

  const intensityLevel =
    exercise.intensity >= 85
      ? "Υψηλή"
      : exercise.intensity >= 60
        ? "Μέτρια"
        : "Χαμηλή";

  const relatedExercises = exercises
    .filter((currentExercise) => {
      if (currentExercise.id === exercise.id) {
        return false;
      }

      const sameCategory =
        currentExercise.category ===
        exercise.category;

      const sharedTags = (
        currentExercise.tags || []
      ).some((tag) =>
        (exercise.tags || []).includes(tag)
      );

      return sameCategory || sharedTags;
    })
    .slice(0, 3);

  function formatLastUsed(date) {
    if (!date) {
      return "Δεν έχει χρησιμοποιηθεί";
    }

    return new Intl.DateTimeFormat("el-GR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(`${date}T12:00:00`));
  }

  return (
    <div className="exercise-profile-page">
      <section className="exercise-profile-hero">
        <div className="exercise-profile-topbar">
          <Link
            to="/exercises"
            className="exercise-profile-back-link light"
          >
            ← Επιστροφή στη βιβλιοθήκη
          </Link>

          <span className="exercise-profile-category-label">
            EXERCISE PROFILE /{" "}
            {exercise.source === "official"
              ? "OFFICIAL LIBRARY"
              : "MY LIBRARY"}
          </span>
        </div>

        <div className="exercise-profile-heading">
          <div className="exercise-profile-title-area">
            <div className="exercise-profile-badges">
              <span className="exercise-profile-category">
                {exercise.category}
              </span>

              <span
                className={`exercise-profile-intensity-badge ${intensityLevel.toLowerCase()}`}
              >
                {intensityLevel} ένταση
              </span>
            </div>

            <h1>{exercise.title}</h1>

            <p>{exercise.description}</p>

            <div className="exercise-profile-rating">
              <strong>
                ★ {exercise.rating ?? 0}/5
              </strong>

              <span>
                {exercise.timesUsed ?? 0} χρήσεις
              </span>
            </div>
          </div>

          <div className="exercise-profile-duration">
            <span>DURATION</span>
            <strong>{exercise.duration}'</strong>
          </div>
        </div>
      </section>

      <section className="exercise-profile-summary">
        <article>
          <span>ΔΙΑΡΚΕΙΑ</span>
          <strong>{exercise.duration}'</strong>
          <p>Συνολικός χρόνος άσκησης</p>
        </article>

        <article>
          <span>ΠΑΙΚΤΕΣ</span>
          <strong>
            {exercise.minPlayers ===
            exercise.maxPlayers
              ? exercise.minPlayers
              : `${exercise.minPlayers}-${exercise.maxPlayers}`}
          </strong>
          <p>Προτεινόμενος αριθμός</p>
        </article>

        <article>
          <span>ΔΥΣΚΟΛΙΑ</span>
          <strong>{exercise.difficulty}</strong>
          <p>Επίπεδο εκτέλεσης</p>
        </article>

        <article>
          <span>ΕΝΤΑΣΗ</span>
          <strong>{exercise.intensity}%</strong>
          <p>{intensityLevel} επιβάρυνση</p>
        </article>
      </section>

      <section className="exercise-profile-content">
        <main className="exercise-profile-main">
          <section className="exercise-profile-section">
            <header className="exercise-profile-section-header">
              <div>
                <p className="section-eyebrow dark">
                  TRAINING OBJECTIVE
                </p>

                <h2>Κύριος στόχος</h2>
              </div>
            </header>

            <div className="exercise-profile-objective">
              <p>{exercise.objective}</p>
            </div>
          </section>

          <section className="exercise-profile-section">
            <header className="exercise-profile-section-header">
              <div>
                <p className="section-eyebrow dark">
                  TACTICAL DIAGRAM
                </p>

                <h2>Διάγραμμα άσκησης</h2>
              </div>

              <span className="exercise-profile-coming-soon">
                AI DIAGRAM — ΣΥΝΤΟΜΑ
              </span>
            </header>

            <div className="exercise-diagram-placeholder">
              <div className="exercise-pitch">
                <span className="pitch-player blue player-one" />
                <span className="pitch-player blue player-two" />
                <span className="pitch-player blue player-three" />
                <span className="pitch-player blue player-four" />
                <span className="pitch-player blue player-five" />

                <span className="pitch-player red defender-one" />
                <span className="pitch-player red defender-two" />

                <span className="pitch-ball">⚽</span>
              </div>

              <div>
                <strong>
                  Οπτικοποίηση άσκησης
                </strong>

                <p>
                  Αργότερα το CoachHub AI θα δημιουργεί
                  αυτόματα διάγραμμα με παίκτες, κώνους,
                  πάσες και κινήσεις.
                </p>
              </div>
            </div>
          </section>

          <section className="exercise-profile-section">
            <header className="exercise-profile-section-header">
              <div>
                <p className="section-eyebrow dark">
                  COACHING POINTS
                </p>

                <h2>Σημεία προπονητή</h2>
              </div>
            </header>

            <div className="exercise-profile-list positive">
              {(exercise.coachingPoints || []).map(
                (point, index) => (
                  <article key={`${point}-${index}`}>
                    <span>✓</span>
                    <p>{point}</p>
                  </article>
                )
              )}
            </div>
          </section>

          <section className="exercise-profile-section">
            <header className="exercise-profile-section-header">
              <div>
                <p className="section-eyebrow dark">
                  COMMON MISTAKES
                </p>

                <h2>Συνηθισμένα λάθη</h2>
              </div>
            </header>

            <div className="exercise-profile-list negative">
              {(exercise.commonMistakes || []).map(
                (mistake, index) => (
                  <article
                    key={`${mistake}-${index}`}
                  >
                    <span>×</span>
                    <p>{mistake}</p>
                  </article>
                )
              )}
            </div>
          </section>

          <section className="exercise-profile-section">
            <header className="exercise-profile-section-header">
              <div>
                <p className="section-eyebrow dark">
                  VARIATIONS
                </p>

                <h2>Παραλλαγές άσκησης</h2>
              </div>
            </header>

            <div className="exercise-variations-grid">
              {(exercise.variations || []).map(
                (variation, index) => (
                  <article
                    key={`${variation}-${index}`}
                  >
                    <span>
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <p>{variation}</p>
                  </article>
                )
              )}
            </div>
          </section>

          {relatedExercises.length > 0 && (
            <section className="exercise-profile-section">
              <header className="exercise-profile-section-header">
                <div>
                  <p className="section-eyebrow dark">
                    RELATED EXERCISES
                  </p>

                  <h2>Σχετικές ασκήσεις</h2>
                </div>
              </header>

              <div className="related-exercises-grid">
                {relatedExercises.map(
                  (relatedExercise) => (
                    <Link
                      key={relatedExercise.id}
                      to={`/exercises/${relatedExercise.id}`}
                      className="related-exercise-card"
                    >
                      <span>
                        {relatedExercise.category}
                      </span>

                      <h3>
                        {relatedExercise.title}
                      </h3>

                      <p>
                        {relatedExercise.duration}' ·{" "}
                        {relatedExercise.minPlayers}-
                        {relatedExercise.maxPlayers}{" "}
                        παίκτες
                      </p>

                      <strong>
                        Προβολή άσκησης →
                      </strong>
                    </Link>
                  )
                )}
              </div>
            </section>
          )}
        </main>

        <aside className="exercise-profile-sidebar">
          <section className="exercise-profile-side-card">
            <p className="section-eyebrow dark">
              EXERCISE DATA
            </p>

            <h2>Στοιχεία άσκησης</h2>

            <dl className="exercise-profile-details">
              <div>
                <dt>Κατηγορία</dt>
                <dd>{exercise.category}</dd>
              </div>

              <div>
                <dt>Δυσκολία</dt>
                <dd>{exercise.difficulty}</dd>
              </div>

              <div>
                <dt>Ένταση</dt>
                <dd>{exercise.intensity}%</dd>
              </div>

              <div>
                <dt>Παίκτες</dt>
                <dd>
                  {exercise.minPlayers}-
                  {exercise.maxPlayers}
                </dd>
              </div>

              <div>
                <dt>Διάρκεια</dt>
                <dd>{exercise.duration}'</dd>
              </div>

              <div>
                <dt>Χρήσεις</dt>
                <dd>{exercise.timesUsed ?? 0}</dd>
              </div>

              <div>
                <dt>Βαθμολογία</dt>
                <dd>{exercise.rating ?? 0}/5</dd>
              </div>

              <div>
                <dt>Τελευταία χρήση</dt>
                <dd>
                  {formatLastUsed(
                    exercise.lastUsed
                  )}
                </dd>
              </div>
            </dl>
          </section>

          <section className="exercise-profile-side-card">
            <p className="section-eyebrow dark">
              INTENSITY LOAD
            </p>

            <h2>Προπονητική ένταση</h2>

            <div className="exercise-profile-progress-header">
              <strong>{intensityLevel}</strong>
              <span>{exercise.intensity}%</span>
            </div>

            <div className="exercise-profile-progress-track">
              <div
                className="exercise-profile-progress-value"
                style={{
                  width: `${exercise.intensity}%`,
                }}
              />
            </div>

            <p className="exercise-profile-side-description">
              Η ένταση αποτελεί εκτίμηση βάσει της
              δομής, του χώρου και των απαιτήσεων της
              άσκησης.
            </p>
          </section>

          <section className="exercise-profile-side-card">
            <p className="section-eyebrow dark">
              EQUIPMENT
            </p>

            <h2>Εξοπλισμός</h2>

            <ul className="exercise-equipment-list">
              {(exercise.equipment || []).map(
                (item, index) => (
                  <li key={`${item}-${index}`}>
                    <span>✓</span>
                    {item}
                  </li>
                )
              )}
            </ul>
          </section>

          <section className="exercise-profile-side-card">
            <p className="section-eyebrow dark">
              AI TAGS
            </p>

            <h2>Χαρακτηριστικά</h2>

            <div className="exercise-profile-tags">
              {(exercise.tags || []).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </section>

          <section className="exercise-profile-side-card exercise-ai-recommendation">
            <p className="section-eyebrow">
              COACHHUB AI
            </p>

            <h2>AI Recommendation</h2>

            <p>
              Η άσκηση είναι κατάλληλη για προπονήσεις
              με στόχο:
            </p>

            <ul>
              {(exercise.tags || [])
                .slice(0, 4)
                .map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
            </ul>

            <p>
              Σύντομα το AI θα προτείνει πότε να
              χρησιμοποιηθεί, ποια άσκηση να προηγηθεί
              και ποια να ακολουθήσει.
            </p>

            <button type="button" disabled>
              ✦ Ανάλυση από AI — Σύντομα
            </button>
          </section>
        </aside>
      </section>
    </div>
  );
}

export default ExerciseProfile;