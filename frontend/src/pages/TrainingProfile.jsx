import { Link, useParams } from "react-router-dom";

function clampScore(score) {
  return Math.min(100, Math.max(0, Math.round(score)));
}

function TrainingProfile() {
  const { trainingId } = useParams();

  let trainings = [];

  try {
    const savedTrainings = localStorage.getItem(
      "coachhub-trainings"
    );

    trainings = savedTrainings
      ? JSON.parse(savedTrainings)
      : [];
  } catch (error) {
    console.error(
      "Αποτυχία φόρτωσης προπόνησης:",
      error
    );
  }

  const training = trainings.find(
    (currentTraining) =>
      String(currentTraining.id) === trainingId
  );

  function formatDate(date) {
    if (!date) {
      return "Χωρίς ημερομηνία";
    }

    return new Intl.DateTimeFormat("el-GR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(`${date}T12:00:00`));
  }

  if (!training) {
    return (
      <div className="training-profile-page">
        <section className="training-not-found">
          <p className="section-eyebrow dark">
            TRAINING PROFILE
          </p>

          <h1>Η προπόνηση δεν βρέθηκε.</h1>

          <p>
            Η συγκεκριμένη προπόνηση μπορεί να έχει
            διαγραφεί ή να μην έχει αποθηκευτεί σωστά.
          </p>

          <Link
            to="/trainings"
            className="profile-back-link"
          >
            ← Επιστροφή στις προπονήσεις
          </Link>
        </section>
      </div>
    );
  }

  const exercises = Array.isArray(training.exercises)
    ? training.exercises
    : [];

  const totalDuration = exercises.reduce(
    (total, exercise) =>
      total + Number(exercise.duration || 0),
    0
  );

  const categories = exercises.map(
    (exercise) => exercise.category
  );

  const uniqueCategories = new Set(categories).size;

  const technicalExercises = categories.filter(
    (category) =>
      category === "Τεχνική" ||
      category === "Τελειώματα"
  ).length;

  const tacticalExercises = categories.filter(
    (category) =>
      category === "Τακτική" ||
      category === "Αγωνιστικό παιχνίδι" ||
      category === "Στημένες φάσεις"
  ).length;

  const hasWarmUp = categories.includes("Προθέρμανση");
  const hasCoolDown = categories.includes("Αποθεραπεία");

  const balanceScore = clampScore(
    45 +
      uniqueCategories * 9 +
      (hasWarmUp ? 10 : 0) +
      (hasCoolDown ? 10 : 0)
  );

  const intensityScore = clampScore(
    training.intensity === "Υψηλή"
      ? 88
      : training.intensity === "Μέτρια"
        ? 74
        : 58
  );

  const technicalScore = clampScore(
    45 +
      technicalExercises * 15 +
      (categories.includes("Τεχνική") ? 10 : 0)
  );

  const tacticalScore = clampScore(
    40 +
      tacticalExercises * 16 +
      (categories.includes("Τακτική") ? 10 : 0)
  );

  const durationScore = clampScore(
    totalDuration >= 75 && totalDuration <= 105
      ? 92
      : totalDuration >= 60 && totalDuration <= 120
        ? 78
        : 60
  );

  const overallScore = clampScore(
    (
      balanceScore +
      intensityScore +
      technicalScore +
      tacticalScore +
      durationScore
    ) / 5
  );

  const ratingOutOfFive = (
    overallScore / 20
  ).toFixed(1);

  const ratingItems = [
    {
      label: "Ισορροπία",
      score: balanceScore,
      description:
        "Ποικιλία και σωστή δομή ασκήσεων",
    },
    {
      label: "Ένταση",
      score: intensityScore,
      description:
        "Εκτιμώμενο επίπεδο επιβάρυνσης",
    },
    {
      label: "Τεχνική",
      score: technicalScore,
      description:
        "Περιεχόμενο τεχνικής και τελειωμάτων",
    },
    {
      label: "Τακτική",
      score: tacticalScore,
      description:
        "Τακτική εφαρμογή και αγωνιστικά παιχνίδια",
    },
    {
      label: "Διάρκεια",
      score: durationScore,
      description:
        "Καταλληλότητα συνολικού χρόνου",
    },
  ];

  return (
    <div className="training-profile-page">
      <section className="training-profile-hero">
        <div className="training-profile-topbar">
          <Link
            to="/trainings"
            className="profile-back-link light"
          >
            ← Επιστροφή στα πλάνα
          </Link>

          <span className="training-profile-category">
            TRAINING PROFILE / SESSION
          </span>
        </div>

        <div className="training-profile-heading">
          <div>
            <p className="section-eyebrow">
              {training.intensity} INTENSITY
            </p>

            <h1>{training.title}</h1>

            <p className="training-profile-date">
              {formatDate(training.date)} ·{" "}
              {training.time || "Χωρίς ώρα"}
            </p>
          </div>

          <div className="training-profile-duration">
            <span>TOTAL DURATION</span>
            <strong>{totalDuration}'</strong>
          </div>
        </div>
      </section>

      <section className="training-profile-summary">
        <article>
          <span>ΗΜΕΡΟΜΗΝΙΑ</span>
          <strong>{formatDate(training.date)}</strong>
        </article>

        <article>
          <span>ΩΡΑ</span>
          <strong>{training.time || "—"}</strong>
        </article>

        <article>
          <span>ΕΝΤΑΣΗ</span>
          <strong
            className={`training-summary-intensity ${training.intensity.toLowerCase()}`}
          >
            {training.intensity}
          </strong>
        </article>

        <article>
          <span>ΔΙΑΘΕΣΙΜΟΙ ΠΑΙΚΤΕΣ</span>
          <strong>
            {training.availablePlayers}
          </strong>
        </article>
      </section>

      <section className="training-profile-content">
        <div className="training-profile-main">
          <section className="training-profile-section">
            <header className="training-profile-section-header">
              <div>
                <p className="section-eyebrow dark">
                  SESSION OBJECTIVE
                </p>

                <h2>Κύριος στόχος</h2>
              </div>
            </header>

            <div className="training-objective-box">
              <p>{training.objective}</p>
            </div>
          </section>

          <section className="training-profile-section">
            <header className="training-profile-section-header">
              <div>
                <p className="section-eyebrow dark">
                  EXERCISE TIMELINE
                </p>

                <h2>Πλάνο ασκήσεων</h2>
              </div>

              <strong>
                {exercises.length} ασκήσεις ·{" "}
                {totalDuration}'
              </strong>
            </header>

            <div className="training-timeline">
              {exercises.map((exercise, index) => (
                <article key={exercise.id}>
                  <div className="training-timeline-line">
                    <span />
                  </div>

                  <div className="training-timeline-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="training-timeline-content">
                    <span>{exercise.category}</span>

                    <h3>{exercise.name}</h3>
                  </div>

                  <strong>
                    {exercise.duration}'
                  </strong>
                </article>
              ))}
            </div>
          </section>

          <section className="training-profile-section">
            <header className="training-profile-section-header">
              <div>
                <p className="section-eyebrow dark">
                  SESSION RATING
                </p>

                <h2>Αξιολόγηση προπόνησης</h2>
              </div>

              <div className="session-overall-rating">
                <strong>{ratingOutOfFive}</strong>
                <span>/ 5</span>
              </div>
            </header>

            <div className="session-rating-content">
              <div className="session-rating-score">
                <span>SESSION SCORE</span>

                <strong>{overallScore}</strong>

                <p>
                  Προσωρινή αυτόματη αξιολόγηση με βάση
                  τη διάρκεια, την ένταση και τις
                  κατηγορίες των ασκήσεων.
                </p>
              </div>

              <div className="session-rating-bars">
                {ratingItems.map((item) => (
                  <article key={item.label}>
                    <div className="rating-bar-header">
                      <div>
                        <strong>{item.label}</strong>
                        <p>{item.description}</p>
                      </div>

                      <span>{item.score}%</span>
                    </div>

                    <div className="rating-bar-track">
                      <div
                        className="rating-bar-value"
                        style={{
                          width: `${item.score}%`,
                        }}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="training-profile-section">
            <header className="training-profile-section-header">
              <div>
                <p className="section-eyebrow dark">
                  COACH NOTES
                </p>

                <h2>Σημειώσεις προπονητή</h2>
              </div>
            </header>

            <div className="training-notes-box">
              {training.notes ? (
                <p>{training.notes}</p>
              ) : (
                <p className="empty-profile-text">
                  Δεν υπάρχουν σημειώσεις για αυτή την
                  προπόνηση.
                </p>
              )}
            </div>
          </section>
        </div>

        <aside className="training-profile-sidebar">
          <section className="training-side-card">
            <p className="section-eyebrow dark">
              SESSION DATA
            </p>

            <h2>Στοιχεία προπόνησης</h2>

            <dl className="training-details-list">
              <div>
                <dt>Τίτλος</dt>
                <dd>{training.title}</dd>
              </div>

              <div>
                <dt>Ημερομηνία</dt>
                <dd>{formatDate(training.date)}</dd>
              </div>

              <div>
                <dt>Ώρα</dt>
                <dd>{training.time || "—"}</dd>
              </div>

              <div>
                <dt>Ένταση</dt>
                <dd>{training.intensity}</dd>
              </div>

              <div>
                <dt>Παίκτες</dt>
                <dd>{training.availablePlayers}</dd>
              </div>

              <div>
                <dt>Ασκήσεις</dt>
                <dd>{exercises.length}</dd>
              </div>

              <div>
                <dt>Κατηγορίες</dt>
                <dd>{uniqueCategories}</dd>
              </div>

              <div>
                <dt>Διάρκεια</dt>
                <dd>{totalDuration}'</dd>
              </div>
            </dl>
          </section>

          <section className="training-side-card session-score-card">
            <p className="section-eyebrow">
              SESSION SCORE
            </p>

            <div className="side-score-circle">
              <strong>{overallScore}</strong>
              <span>/100</span>
            </div>

            <h2>
              {overallScore >= 85
                ? "Πολύ καλό πλάνο"
                : overallScore >= 70
                  ? "Ισορροπημένο πλάνο"
                  : "Χρειάζεται βελτίωση"}
            </h2>

            <p>
              Η βαθμολογία είναι προσωρινή και
              υπολογίζεται από βασικούς κανόνες της
              εφαρμογής.
            </p>
          </section>

          <section className="training-side-card training-ai-card">
            <p className="section-eyebrow">
              COACHHUB AI
            </p>

            <h2>Αξιολόγηση από AI</h2>

            <p>
              Σύντομα το AI θα εξετάζει τη σειρά, τη
              διάρκεια, την ένταση και τον στόχο της
              προπόνησης και θα προτείνει συγκεκριμένες
              αλλαγές.
            </p>

            <ul className="training-ai-checklist">
              <li>Έλεγχος συνολικής διάρκειας</li>
              <li>Έλεγχος επιπέδου έντασης</li>
              <li>Έλεγχος ισορροπίας ασκήσεων</li>
              <li>Προτάσεις βελτίωσης</li>
            </ul>

            <button type="button" disabled>
              ✦ Ανάλυση από AI — Σύντομα
            </button>
          </section>
        </aside>
      </section>
    </div>
  );
}

export default TrainingProfile;