import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const initialTrainings = [
  {
    id: 1,
    title: "Αμυντική μετάβαση",
    date: "2026-07-25",
    time: "18:30",
    intensity: "Υψηλή",
    availablePlayers: 20,
    selectedPlayerIds: [],
    objective:
      "Άμεση αντίδραση μετά την απώλεια της μπάλας και οργανωμένη επιστροφή.",
    notes:
      "Έμφαση στην επικοινωνία μεταξύ μέσων και αμυντικών.",
    exercises: [
      {
        id: 101,
        name: "Δυναμική προθέρμανση",
        category: "Προθέρμανση",
        duration: 15,
      },
      {
        id: 102,
        name: "Rondo 5v2",
        category: "Τεχνική",
        duration: 12,
      },
      {
        id: 103,
        name: "Transition game 6v6",
        category: "Τακτική",
        duration: 25,
      },
      {
        id: 104,
        name: "Παιχνίδι 10v10",
        category: "Αγωνιστικό παιχνίδι",
        duration: 30,
      },
      {
        id: 105,
        name: "Αποθεραπεία",
        category: "Αποθεραπεία",
        duration: 8,
      },
    ],
  },
  {
    id: 2,
    title: "Τελειώματα και επιθετική ανάπτυξη",
    date: "2026-07-28",
    time: "19:00",
    intensity: "Μέτρια",
    availablePlayers: 18,
    selectedPlayerIds: [],
    objective:
      "Βελτίωση τελικής πάσας, κίνησης στην περιοχή και αποτελεσματικότητας.",
    notes:
      "Χωρισμός επιθετικών και αμυντικών στο κύριο μέρος.",
    exercises: [
      {
        id: 201,
        name: "Ενεργοποίηση με μπάλα",
        category: "Προθέρμανση",
        duration: 15,
      },
      {
        id: 202,
        name: "Passing combinations",
        category: "Τεχνική",
        duration: 20,
      },
      {
        id: 203,
        name: "Τελειώματα από τα άκρα",
        category: "Τελειώματα",
        duration: 25,
      },
      {
        id: 204,
        name: "8v8 με στόχο γρήγορη επίθεση",
        category: "Αγωνιστικό παιχνίδι",
        duration: 30,
      },
    ],
  },
];

const emptyExercise = {
  name: "",
  category: "Προθέρμανση",
  duration: "10",
};

const emptyTraining = {
  title: "",
  date: "",
  time: "",
  intensity: "Μέτρια",
  objective: "",
  notes: "",
  exercises: [],
  selectedPlayerIds: [],
};

function Trainings() {
  const [trainings, setTrainings] = useState(() => {
    try {
      const savedTrainings = localStorage.getItem(
        "coachhub-trainings"
      );

      return savedTrainings
        ? JSON.parse(savedTrainings)
        : initialTrainings;
    } catch (error) {
      console.error(
        "Αποτυχία φόρτωσης προπονήσεων:",
        error
      );

      return initialTrainings;
    }
  });

  const [players] = useState(() => {
    try {
      const savedPlayers = localStorage.getItem(
        "coachhub-players"
      );

      return savedPlayers
        ? JSON.parse(savedPlayers)
        : [];
    } catch (error) {
      console.error(
        "Αποτυχία φόρτωσης παικτών:",
        error
      );

      return [];
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [intensityFilter, setIntensityFilter] =
    useState("Όλες");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTrainingId, setEditingTrainingId] =
    useState(null);
  const [formData, setFormData] =
    useState(emptyTraining);
  const [exerciseForm, setExerciseForm] =
    useState(emptyExercise);
  const [errorMessage, setErrorMessage] = useState("");
  const [expandedTrainingIds, setExpandedTrainingIds] =
    useState([]);
  const [playerSearchTerm, setPlayerSearchTerm] =
    useState("");

  useEffect(() => {
    try {
      localStorage.setItem(
        "coachhub-trainings",
        JSON.stringify(trainings)
      );
    } catch (error) {
      console.error(
        "Αποτυχία αποθήκευσης προπονήσεων:",
        error
      );
    }
  }, [trainings]);

  const filteredTrainings = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return trainings.filter((training) => {
      const matchesSearch =
        !normalizedSearch ||
        training.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        training.objective
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesIntensity =
        intensityFilter === "Όλες" ||
        training.intensity === intensityFilter;

      return matchesSearch && matchesIntensity;
    });
  }, [trainings, searchTerm, intensityFilter]);

  const filteredPlayers = useMemo(() => {
    const normalizedSearch = playerSearchTerm
      .trim()
      .toLowerCase();

    if (!normalizedSearch) {
      return players;
    }

    return players.filter((player) => {
      const fullName =
        `${player.firstName} ${player.lastName}`.toLowerCase();

      return (
        fullName.includes(normalizedSearch) ||
        player.position
          .toLowerCase()
          .includes(normalizedSearch)
      );
    });
  }, [players, playerSearchTerm]);

  const availableSquadPlayers = players.filter(
    (player) => player.status === "Διαθέσιμος"
  );

  const injuredSquadPlayers = players.filter(
    (player) => player.status === "Τραυματίας"
  );

  const totalExercises = trainings.reduce(
    (total, training) =>
      total + training.exercises.length,
    0
  );

  const totalMinutes = trainings.reduce(
    (trainingsTotal, training) =>
      trainingsTotal +
      training.exercises.reduce(
        (exerciseTotal, exercise) =>
          exerciseTotal +
          Number(exercise.duration || 0),
        0
      ),
    0
  );

  const upcomingTrainings = trainings.filter(
    (training) => {
      if (!training.date) {
        return false;
      }

      const trainingDateTime = new Date(
        `${training.date}T${training.time || "00:00"}`
      );

      return trainingDateTime >= new Date();
    }
  ).length;

  const formTotalDuration = formData.exercises.reduce(
    (total, exercise) =>
      total + Number(exercise.duration || 0),
    0
  );

  function formatDate(date) {
    if (!date) {
      return "Χωρίς ημερομηνία";
    }

    return new Intl.DateTimeFormat("el-GR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(`${date}T12:00:00`));
  }

  function toggleTrainingExercises(trainingId) {
    setExpandedTrainingIds((currentIds) =>
      currentIds.includes(trainingId)
        ? currentIds.filter(
            (id) => id !== trainingId
          )
        : [...currentIds, trainingId]
    );
  }

  function handleTrainingInputChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleExerciseInputChange(event) {
    const { name, value } = event.target;

    setExerciseForm((currentExercise) => ({
      ...currentExercise,
      [name]: value,
    }));
  }

  function togglePlayerSelection(playerId) {
    setFormData((currentData) => {
      const isAlreadySelected =
        currentData.selectedPlayerIds.includes(playerId);

      return {
        ...currentData,
        selectedPlayerIds: isAlreadySelected
          ? currentData.selectedPlayerIds.filter(
              (id) => id !== playerId
            )
          : [
              ...currentData.selectedPlayerIds,
              playerId,
            ],
      };
    });
  }

  function selectAllAvailablePlayers() {
    setFormData((currentData) => ({
      ...currentData,
      selectedPlayerIds: availableSquadPlayers.map(
        (player) => player.id
      ),
    }));
  }

  function clearSelectedPlayers() {
    setFormData((currentData) => ({
      ...currentData,
      selectedPlayerIds: [],
    }));
  }

  function openAddTrainingForm() {
    setEditingTrainingId(null);

    setFormData({
      ...emptyTraining,
      selectedPlayerIds: availableSquadPlayers.map(
        (player) => player.id
      ),
    });

    setExerciseForm(emptyExercise);
    setPlayerSearchTerm("");
    setErrorMessage("");
    setIsFormOpen(true);
  }

  function openEditTrainingForm(training) {
    setEditingTrainingId(training.id);

    let selectedPlayerIds = Array.isArray(
      training.selectedPlayerIds
    )
      ? training.selectedPlayerIds
      : [];

    if (
      selectedPlayerIds.length === 0 &&
      Number(training.availablePlayers) > 0
    ) {
      selectedPlayerIds = availableSquadPlayers
        .slice(0, Number(training.availablePlayers))
        .map((player) => player.id);
    }

    setFormData({
      title: training.title,
      date: training.date,
      time: training.time,
      intensity: training.intensity,
      objective: training.objective,
      notes: training.notes,
      exercises: training.exercises.map(
        (exercise) => ({
          ...exercise,
        })
      ),
      selectedPlayerIds,
    });

    setExerciseForm(emptyExercise);
    setPlayerSearchTerm("");
    setErrorMessage("");
    setIsFormOpen(true);
  }

  function closeTrainingForm() {
    setIsFormOpen(false);
    setEditingTrainingId(null);
    setFormData(emptyTraining);
    setExerciseForm(emptyExercise);
    setPlayerSearchTerm("");
    setErrorMessage("");
  }

  function addExercise() {
    const duration = Number(exerciseForm.duration);

    if (!exerciseForm.name.trim()) {
      setErrorMessage(
        "Γράψε το όνομα της άσκησης."
      );
      return;
    }

    if (
      !duration ||
      duration < 1 ||
      duration > 120
    ) {
      setErrorMessage(
        "Η διάρκεια της άσκησης πρέπει να είναι από 1 έως 120 λεπτά."
      );
      return;
    }

    const newExercise = {
      id: Date.now(),
      name: exerciseForm.name.trim(),
      category: exerciseForm.category,
      duration,
    };

    setFormData((currentData) => ({
      ...currentData,
      exercises: [
        ...currentData.exercises,
        newExercise,
      ],
    }));

    setExerciseForm(emptyExercise);
    setErrorMessage("");
  }

  function removeExercise(exerciseId) {
    setFormData((currentData) => ({
      ...currentData,
      exercises: currentData.exercises.filter(
        (exercise) =>
          exercise.id !== exerciseId
      ),
    }));
  }

  function moveExercise(exerciseIndex, direction) {
    const targetIndex =
      exerciseIndex + direction;

    if (
      targetIndex < 0 ||
      targetIndex >= formData.exercises.length
    ) {
      return;
    }

    setFormData((currentData) => {
      const reorderedExercises = [
        ...currentData.exercises,
      ];

      [
        reorderedExercises[exerciseIndex],
        reorderedExercises[targetIndex],
      ] = [
        reorderedExercises[targetIndex],
        reorderedExercises[exerciseIndex],
      ];

      return {
        ...currentData,
        exercises: reorderedExercises,
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.date ||
      !formData.time ||
      !formData.objective.trim()
    ) {
      setErrorMessage(
        "Συμπλήρωσε όλα τα βασικά στοιχεία της προπόνησης."
      );
      return;
    }

    if (
      formData.selectedPlayerIds.length === 0
    ) {
      setErrorMessage(
        "Επίλεξε τουλάχιστον έναν παίκτη."
      );
      return;
    }

    if (formData.exercises.length === 0) {
      setErrorMessage(
        "Πρόσθεσε τουλάχιστον μία άσκηση στην προπόνηση."
      );
      return;
    }

    const trainingData = {
      title: formData.title.trim(),
      date: formData.date,
      time: formData.time,
      intensity: formData.intensity,
      availablePlayers:
        formData.selectedPlayerIds.length,
      selectedPlayerIds:
        formData.selectedPlayerIds,
      objective: formData.objective.trim(),
      notes: formData.notes.trim(),
      exercises: formData.exercises,
    };

    if (editingTrainingId !== null) {
      setTrainings((currentTrainings) =>
        currentTrainings.map((training) =>
          training.id === editingTrainingId
            ? {
                ...training,
                ...trainingData,
              }
            : training
        )
      );
    } else {
      setTrainings((currentTrainings) => [
        ...currentTrainings,
        {
          id: Date.now(),
          ...trainingData,
        },
      ]);
    }

    closeTrainingForm();
  }

  function copyTraining(training) {
    const copiedTraining = {
      ...training,
      id: Date.now(),
      title: `${training.title} — Αντίγραφο`,
      date: "",
      exercises: training.exercises.map(
        (exercise, index) => ({
          ...exercise,
          id: Date.now() + index,
        })
      ),
    };

    setTrainings((currentTrainings) => [
      ...currentTrainings,
      copiedTraining,
    ]);
  }

  function deleteTraining(trainingId) {
    const trainingToDelete = trainings.find(
      (training) =>
        training.id === trainingId
    );

    if (!trainingToDelete) {
      return;
    }

    const shouldDelete = window.confirm(
      `Θέλεις σίγουρα να διαγράψεις την προπόνηση «${trainingToDelete.title}»;`
    );

    if (!shouldDelete) {
      return;
    }

    setTrainings((currentTrainings) =>
      currentTrainings.filter(
        (training) =>
          training.id !== trainingId
      )
    );

    setExpandedTrainingIds((currentIds) =>
      currentIds.filter(
        (id) => id !== trainingId
      )
    );
  }

  return (
    <div className="trainings-page">
      <section className="trainings-hero">
        <div className="trainings-hero-content">
          <p className="section-eyebrow">
            TRAINING MANAGEMENT / PRACTICE
          </p>

          <h1>
            Οργάνωσε κάθε προπόνηση με λεπτομέρεια.
          </h1>

          <p className="trainings-hero-description">
            Δημιούργησε το πλάνο σου, πρόσθεσε
            ασκήσεις και κράτησε οργανωμένο
            ολόκληρο το εβδομαδιαίο πρόγραμμα.
          </p>

          <div className="trainings-hero-actions">
            <button
              type="button"
              className="premium-primary-button"
              onClick={openAddTrainingForm}
            >
              + Νέα προπόνηση
            </button>

            <button
              type="button"
              className="training-ai-placeholder"
              disabled
            >
              ✦ Πρόταση με AI — Σύντομα
            </button>
          </div>
        </div>

        <div className="trainings-hero-number">
          <span>SESSIONS</span>

          <strong>
            {String(trainings.length).padStart(
              2,
              "0"
            )}
          </strong>
        </div>
      </section>

      <section className="training-insights">
        <article className="training-insight featured">
          <span>ΣΥΝΟΛΟ ΠΡΟΠΟΝΗΣΕΩΝ</span>
          <strong>{trainings.length}</strong>
          <p>Αποθηκευμένα προπονητικά πλάνα</p>
        </article>

        <article className="training-insight">
          <span>ΕΠΟΜΕΝΕΣ</span>
          <strong>{upcomingTrainings}</strong>
          <p>
            Προπονήσεις που δεν έχουν πραγματοποιηθεί
          </p>
        </article>

        <article className="training-insight">
          <span>ΑΣΚΗΣΕΙΣ</span>
          <strong>{totalExercises}</strong>
          <p>
            Συνολικές καταχωρημένες ασκήσεις
          </p>
        </article>

        <article className="training-insight">
          <span>ΣΥΝΟΛΙΚΟΣ ΧΡΟΝΟΣ</span>
          <strong>{totalMinutes}'</strong>
          <p>
            Λεπτά προπονητικού περιεχομένου
          </p>
        </article>
      </section>

      <section className="trainings-directory">
        <header className="trainings-directory-header">
          <div>
            <p className="section-eyebrow dark">
              TRAINING LIBRARY
            </p>

            <h2>Προπονητικά πλάνα</h2>

            <p>
              {filteredTrainings.length} από{" "}
              {trainings.length} προπονήσεις
            </p>
          </div>

          <div className="training-directory-tools">
            <input
              type="search"
              className="premium-search"
              placeholder="Αναζήτηση προπόνησης..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

            <select
              className="training-filter"
              value={intensityFilter}
              onChange={(event) =>
                setIntensityFilter(
                  event.target.value
                )
              }
            >
              <option value="Όλες">
                Όλες οι εντάσεις
              </option>
              <option value="Χαμηλή">
                Χαμηλή
              </option>
              <option value="Μέτρια">
                Μέτρια
              </option>
              <option value="Υψηλή">
                Υψηλή
              </option>
            </select>
          </div>
        </header>

        {filteredTrainings.length > 0 ? (
          <div className="training-card-grid">
            {filteredTrainings.map(
              (training) => {
                const duration =
                  training.exercises.reduce(
                    (total, exercise) =>
                      total +
                      Number(
                        exercise.duration || 0
                      ),
                    0
                  );

                const isExpanded =
                  expandedTrainingIds.includes(
                    training.id
                  );

                const visibleExercises =
                  isExpanded
                    ? training.exercises
                    : training.exercises.slice(
                        0,
                        3
                      );

                return (
                  <article
                    className="premium-training-card"
                    key={training.id}
                  >
                    <div className="training-card-top">
                      <div>
                        <span
                          className={`training-intensity ${training.intensity.toLowerCase()}`}
                        >
                          {training.intensity} ένταση
                        </span>

                        <h3>{training.title}</h3>

                        <p>
                          {training.objective}
                        </p>
                      </div>

                      <strong className="training-duration">
                        {duration}'
                      </strong>
                    </div>

                    <div className="training-card-details">
                      <span>
                        📅{" "}
                        {formatDate(training.date)}
                      </span>

                      <span>
                        🕐 {training.time || "—"}
                      </span>

                      <span>
                        👥{" "}
                        {training.selectedPlayerIds
                          ?.length ||
                          training.availablePlayers ||
                          0}{" "}
                        παίκτες
                      </span>

                      <span>
                        📋{" "}
                        {training.exercises.length}{" "}
                        ασκήσεις
                      </span>
                    </div>

                    <div className="training-exercise-preview">
                      {visibleExercises.map(
                        (exercise, index) => (
                          <div key={exercise.id}>
                            <span>{index + 1}</span>

                            <p>
                              <strong>
                                {exercise.name}
                              </strong>

                              {exercise.category} ·{" "}
                              {exercise.duration}'
                            </p>
                          </div>
                        )
                      )}

                      {training.exercises.length >
                        3 && (
                        <button
                          type="button"
                          className="more-exercises-button"
                          onClick={() =>
                            toggleTrainingExercises(
                              training.id
                            )
                          }
                        >
                          {isExpanded
                            ? "− Απόκρυψη ασκήσεων"
                            : `+ ${
                                training.exercises
                                  .length - 3
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
                        onClick={() =>
                          openEditTrainingForm(
                            training
                          )
                        }
                      >
                        Επεξεργασία
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          copyTraining(training)
                        }
                      >
                        Αντιγραφή
                      </button>

                      <button
                        type="button"
                        className="danger"
                        onClick={() =>
                          deleteTraining(
                            training.id
                          )
                        }
                      >
                        Διαγραφή
                      </button>
                    </footer>
                  </article>
                );
              }
            )}
          </div>
        ) : (
          <div className="premium-empty-state">
            <span>NO TRAININGS</span>
            <h3>
              Δεν βρέθηκαν προπονήσεις.
            </h3>
            <p>
              Άλλαξε τα φίλτρα ή δημιούργησε νέο
              προπονητικό πλάνο.
            </p>
          </div>
        )}
      </section>

      {isFormOpen && (
        <div
          className="player-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeTrainingForm();
            }
          }}
        >
          <div className="training-modal">
            <div className="premium-modal-accent" />

            <header className="premium-modal-header">
              <div>
                <p className="section-eyebrow dark">
                  TRAINING BUILDER
                </p>

                <h2>
                  {editingTrainingId !== null
                    ? "Επεξεργασία προπόνησης"
                    : "Δημιουργία προπόνησης"}
                </h2>

                <p>
                  Επίλεξε παίκτες και δημιούργησε
                  ολόκληρο το πλάνο.
                </p>
              </div>

              <button
                type="button"
                className="premium-close-button"
                onClick={closeTrainingForm}
              >
                ×
              </button>
            </header>

            <form
              className="premium-player-form"
              onSubmit={handleSubmit}
            >
              <p className="player-form-section-title">
                Βασικά στοιχεία
              </p>

              <div className="premium-form-grid">
                <label>
                  <span>
                    Τίτλος προπόνησης *
                  </span>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={
                      handleTrainingInputChange
                    }
                  />
                </label>

                <label>
                  <span>Ημερομηνία *</span>

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={
                      handleTrainingInputChange
                    }
                  />
                </label>

                <label>
                  <span>Ώρα *</span>

                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={
                      handleTrainingInputChange
                    }
                  />
                </label>

                <label>
                  <span>Ένταση</span>

                  <select
                    name="intensity"
                    value={formData.intensity}
                    onChange={
                      handleTrainingInputChange
                    }
                  >
                    <option value="Χαμηλή">
                      Χαμηλή
                    </option>
                    <option value="Μέτρια">
                      Μέτρια
                    </option>
                    <option value="Υψηλή">
                      Υψηλή
                    </option>
                  </select>
                </label>
              </div>

              <label className="player-notes-field">
                <span>Κύριος στόχος *</span>

                <textarea
                  name="objective"
                  rows="3"
                  value={formData.objective}
                  onChange={
                    handleTrainingInputChange
                  }
                />
              </label>

              <p className="player-form-section-title">
                Επιλογή παικτών
              </p>

              <section className="training-player-selector">
                <header className="player-selector-header">
                  <div>
                    <h3>
                      Συμμετέχοντες προπόνησης
                    </h3>

                    <p>
                      {
                        formData
                          .selectedPlayerIds
                          .length
                      }{" "}
                      επιλεγμένοι από{" "}
                      {players.length}
                    </p>
                  </div>

                  <div className="player-selector-actions">
                    <button
                      type="button"
                      onClick={
                        selectAllAvailablePlayers
                      }
                    >
                      Επιλογή διαθέσιμων
                    </button>

                    <button
                      type="button"
                      onClick={
                        clearSelectedPlayers
                      }
                    >
                      Καθαρισμός
                    </button>
                  </div>
                </header>

                <input
                  type="search"
                  className="player-selector-search"
                  placeholder="Αναζήτηση παίκτη..."
                  value={playerSearchTerm}
                  onChange={(event) =>
                    setPlayerSearchTerm(
                      event.target.value
                    )
                  }
                />

                <div className="training-player-list">
                  {filteredPlayers.length > 0 ? (
                    filteredPlayers.map(
                      (player) => {
                        const isInjured =
                          player.status ===
                          "Τραυματίας";

                        const isSelected =
                          formData.selectedPlayerIds.includes(
                            player.id
                          );

                        return (
                          <label
                            key={player.id}
                            className={`training-player-option ${
                              isSelected
                                ? "selected"
                                : ""
                            } ${
                              isInjured
                                ? "disabled"
                                : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={isInjured}
                              onChange={() =>
                                togglePlayerSelection(
                                  player.id
                                )
                              }
                            />

                            <div className="training-player-avatar">
                              {player.firstName.charAt(
                                0
                              )}
                              {player.lastName.charAt(
                                0
                              )}
                            </div>

                            <div className="training-player-info">
                              <strong>
                                {player.firstName}{" "}
                                {player.lastName}
                              </strong>

                              <span>
                                {player.position} · #
                                {player.number}
                              </span>
                            </div>

                            <span
                              className={`selector-player-status ${
                                isInjured
                                  ? "injured"
                                  : "available"
                              }`}
                            >
                              {player.status}
                            </span>
                          </label>
                        );
                      }
                    )
                  ) : (
                    <p className="empty-exercises-message">
                      Δεν βρέθηκαν παίκτες.
                    </p>
                  )}
                </div>

                <footer className="player-selector-summary">
                  <span>
                    Διαθέσιμοι:{" "}
                    {
                      availableSquadPlayers.length
                    }
                  </span>

                  <span>
                    Τραυματίες:{" "}
                    {
                      injuredSquadPlayers.length
                    }
                  </span>

                  <strong>
                    Επιλεγμένοι:{" "}
                    {
                      formData
                        .selectedPlayerIds
                        .length
                    }
                  </strong>
                </footer>
              </section>

              <p className="player-form-section-title">
                Προσθήκη άσκησης
              </p>

              <div className="exercise-builder">
                <input
                  type="text"
                  name="name"
                  value={exerciseForm.name}
                  onChange={
                    handleExerciseInputChange
                  }
                  placeholder="Όνομα άσκησης"
                />

                <select
                  name="category"
                  value={exerciseForm.category}
                  onChange={
                    handleExerciseInputChange
                  }
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
                  onChange={
                    handleExerciseInputChange
                  }
                />

                <button
                  type="button"
                  className="premium-primary-button"
                  onClick={addExercise}
                >
                  + Προσθήκη
                </button>
              </div>

              <div className="training-exercise-list">
                <header>
                  <h3>Πλάνο ασκήσεων</h3>

                  <strong>
                    {formTotalDuration}' συνολικά
                  </strong>
                </header>

                {formData.exercises.length > 0 ? (
                  formData.exercises.map(
                    (exercise, index) => (
                      <article key={exercise.id}>
                        <span className="exercise-order">
                          {index + 1}
                        </span>

                        <div>
                          <strong>
                            {exercise.name}
                          </strong>

                          <p>
                            {exercise.category} ·{" "}
                            {exercise.duration} λεπτά
                          </p>
                        </div>

                        <div className="exercise-actions">
                          <button
                            type="button"
                            onClick={() =>
                              moveExercise(
                                index,
                                -1
                              )
                            }
                            disabled={index === 0}
                          >
                            ↑
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              moveExercise(
                                index,
                                1
                              )
                            }
                            disabled={
                              index ===
                              formData.exercises
                                .length -
                                1
                            }
                          >
                            ↓
                          </button>

                          <button
                            type="button"
                            className="danger"
                            onClick={() =>
                              removeExercise(
                                exercise.id
                              )
                            }
                          >
                            ×
                          </button>
                        </div>
                      </article>
                    )
                  )
                ) : (
                  <p className="empty-exercises-message">
                    Δεν έχουν προστεθεί ακόμη
                    ασκήσεις.
                  </p>
                )}
              </div>

              <p className="player-form-section-title">
                Παρατηρήσεις
              </p>

              <label className="player-notes-field">
                <span>
                  Σημειώσεις προπονητή
                </span>

                <textarea
                  name="notes"
                  rows="4"
                  value={formData.notes}
                  onChange={
                    handleTrainingInputChange
                  }
                />
              </label>

              {errorMessage && (
                <p className="premium-form-error">
                  {errorMessage}
                </p>
              )}

              <footer className="premium-form-actions">
                <button
                  type="button"
                  className="premium-secondary-button"
                  onClick={closeTrainingForm}
                >
                  Ακύρωση
                </button>

                <button
                  type="submit"
                  className="premium-primary-button"
                >
                  {editingTrainingId !== null
                    ? "Αποθήκευση αλλαγών"
                    : "Δημιουργία προπόνησης"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Trainings;
