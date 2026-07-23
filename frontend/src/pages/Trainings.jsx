import { useEffect, useMemo, useState } from "react";

import TrainingCard from "../components/trainings/TrainingCard";
import TrainingForm from "../components/trainings/TrainingForm";

import {
  emptyExercise,
  emptyTraining,
  initialTrainings,
} from "../data/trainingsData";

function Trainings() {
  const [trainings, setTrainings] = useState(() => {
    try {
      const savedTrainings = localStorage.getItem(
        "coachhub-trainings"
      );

      if (!savedTrainings) {
        return initialTrainings;
      }

      const parsedTrainings = JSON.parse(savedTrainings);

      return Array.isArray(parsedTrainings)
        ? parsedTrainings
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

      if (!savedPlayers) {
        return [];
      }

      const parsedPlayers = JSON.parse(savedPlayers);

      return Array.isArray(parsedPlayers)
        ? parsedPlayers
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

  const [formData, setFormData] = useState(() => ({
    ...emptyTraining,
    exercises: [],
    selectedPlayerIds: [],
  }));

  const [exerciseForm, setExerciseForm] = useState(() => ({
    ...emptyExercise,
  }));

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
      const title = String(
        training.title || ""
      ).toLowerCase();

      const objective = String(
        training.objective || ""
      ).toLowerCase();

      const intensity = String(
        training.intensity || ""
      );

      const matchesSearch =
        !normalizedSearch ||
        title.includes(normalizedSearch) ||
        objective.includes(normalizedSearch);

      const matchesIntensity =
        intensityFilter === "Όλες" ||
        intensity === intensityFilter;

      return matchesSearch && matchesIntensity;
    });
  }, [
    trainings,
    searchTerm,
    intensityFilter,
  ]);

  const filteredPlayers = useMemo(() => {
    const normalizedSearch = playerSearchTerm
      .trim()
      .toLowerCase();

    if (!normalizedSearch) {
      return players;
    }

    return players.filter((player) => {
      const firstName = String(
        player.firstName || ""
      );

      const lastName = String(
        player.lastName || ""
      );

      const position = String(
        player.position || ""
      );

      const fullName =
        `${firstName} ${lastName}`.toLowerCase();

      return (
        fullName.includes(normalizedSearch) ||
        position
          .toLowerCase()
          .includes(normalizedSearch)
      );
    });
  }, [players, playerSearchTerm]);

  const availableSquadPlayers = useMemo(
    () =>
      players.filter(
        (player) =>
          player.status === "Διαθέσιμος"
      ),
    [players]
  );

  const injuredSquadPlayers = useMemo(
    () =>
      players.filter(
        (player) =>
          player.status === "Τραυματίας"
      ),
    [players]
  );

  const totalExercises = useMemo(
    () =>
      trainings.reduce((total, training) => {
        const exercises = Array.isArray(
          training.exercises
        )
          ? training.exercises
          : [];

        return total + exercises.length;
      }, 0),
    [trainings]
  );

  const totalMinutes = useMemo(
    () =>
      trainings.reduce(
        (trainingsTotal, training) => {
          const exercises = Array.isArray(
            training.exercises
          )
            ? training.exercises
            : [];

          const trainingMinutes = exercises.reduce(
            (exerciseTotal, exercise) =>
              exerciseTotal +
              Number(exercise.duration || 0),
            0
          );

          return trainingsTotal + trainingMinutes;
        },
        0
      ),
    [trainings]
  );

  const upcomingTrainings = useMemo(
    () =>
      trainings.filter((training) => {
        if (!training.date) {
          return false;
        }

        const trainingDateTime = new Date(
          `${training.date}T${
            training.time || "00:00"
          }`
        );

        return trainingDateTime >= new Date();
      }).length,
    [trainings]
  );

  const formTotalDuration = useMemo(
    () =>
      formData.exercises.reduce(
        (total, exercise) =>
          total +
          Number(exercise.duration || 0),
        0
      ),
    [formData.exercises]
  );

  function formatDate(date) {
    if (!date) {
      return "Χωρίς ημερομηνία";
    }

    const parsedDate = new Date(
      `${date}T12:00:00`
    );

    if (Number.isNaN(parsedDate.getTime())) {
      return "Μη έγκυρη ημερομηνία";
    }

    return new Intl.DateTimeFormat("el-GR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(parsedDate);
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
      const selectedPlayerIds = Array.isArray(
        currentData.selectedPlayerIds
      )
        ? currentData.selectedPlayerIds
        : [];

      const isAlreadySelected =
        selectedPlayerIds.includes(playerId);

      return {
        ...currentData,
        selectedPlayerIds: isAlreadySelected
          ? selectedPlayerIds.filter(
              (id) => id !== playerId
            )
          : [...selectedPlayerIds, playerId],
      };
    });
  }

  function selectAllAvailablePlayers() {
    setFormData((currentData) => ({
      ...currentData,
      selectedPlayerIds:
        availableSquadPlayers.map(
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
      exercises: [],
      selectedPlayerIds:
        availableSquadPlayers.map(
          (player) => player.id
        ),
    });

    setExerciseForm({
      ...emptyExercise,
    });

    setPlayerSearchTerm("");
    setErrorMessage("");
    setIsFormOpen(true);
  }

  function openEditTrainingForm(training) {
    setEditingTrainingId(training.id);

    let selectedPlayerIds = Array.isArray(
      training.selectedPlayerIds
    )
      ? [...training.selectedPlayerIds]
      : [];

    if (
      selectedPlayerIds.length === 0 &&
      Number(training.availablePlayers) > 0
    ) {
      selectedPlayerIds = availableSquadPlayers
        .slice(
          0,
          Number(training.availablePlayers)
        )
        .map((player) => player.id);
    }

    const trainingExercises = Array.isArray(
      training.exercises
    )
      ? training.exercises
      : [];

    setFormData({
      title: String(training.title || ""),
      date: String(training.date || ""),
      time: String(training.time || ""),
      intensity:
        training.intensity || "Μέτρια",
      objective: String(
        training.objective || ""
      ),
      notes: String(training.notes || ""),
      exercises: trainingExercises.map(
        (exercise) => ({
          ...exercise,
        })
      ),
      selectedPlayerIds,
    });

    setExerciseForm({
      ...emptyExercise,
    });

    setPlayerSearchTerm("");
    setErrorMessage("");
    setIsFormOpen(true);
  }

  function closeTrainingForm() {
    setIsFormOpen(false);
    setEditingTrainingId(null);

    setFormData({
      ...emptyTraining,
      exercises: [],
      selectedPlayerIds: [],
    });

    setExerciseForm({
      ...emptyExercise,
    });

    setPlayerSearchTerm("");
    setErrorMessage("");
  }

  function addExercise() {
    const exerciseName = String(
      exerciseForm.name || ""
    ).trim();

    const duration = Number(
      exerciseForm.duration
    );

    if (!exerciseName) {
      setErrorMessage(
        "Γράψε το όνομα της άσκησης."
      );
      return;
    }

    if (
      !Number.isFinite(duration) ||
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
      name: exerciseName,
      category:
        exerciseForm.category ||
        "Προθέρμανση",
      duration,
    };

    setFormData((currentData) => ({
      ...currentData,
      exercises: [
        ...currentData.exercises,
        newExercise,
      ],
    }));

    setExerciseForm({
      ...emptyExercise,
    });

    setErrorMessage("");
  }

  function removeExercise(exerciseId) {
    setFormData((currentData) => ({
      ...currentData,
      exercises:
        currentData.exercises.filter(
          (exercise) =>
            exercise.id !== exerciseId
        ),
    }));
  }

  function moveExercise(
    exerciseIndex,
    direction
  ) {
    const targetIndex =
      exerciseIndex + direction;

    if (
      targetIndex < 0 ||
      targetIndex >=
        formData.exercises.length
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

    const title = String(
      formData.title || ""
    ).trim();

    const objective = String(
      formData.objective || ""
    ).trim();

    const notes = String(
      formData.notes || ""
    ).trim();

    if (
      !title ||
      !formData.date ||
      !formData.time ||
      !objective
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
      title,
      date: formData.date,
      time: formData.time,
      intensity:
        formData.intensity || "Μέτρια",
      availablePlayers:
        formData.selectedPlayerIds.length,
      selectedPlayerIds: [
        ...formData.selectedPlayerIds,
      ],
      objective,
      notes,
      exercises: formData.exercises.map(
        (exercise) => ({
          ...exercise,
        })
      ),
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
    const exercises = Array.isArray(
      training.exercises
    )
      ? training.exercises
      : [];

    const copiedTraining = {
      ...training,
      id: Date.now(),
      title: `${training.title} — Αντίγραφο`,
      date: "",
      exercises: exercises.map(
        (exercise, index) => ({
          ...exercise,
          id: Date.now() + index + 1,
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
            ασκήσεις και κράτησε οργανωμένο ολόκληρο
            το εβδομαδιαίο πρόγραμμα.
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
              (training) => (
                <TrainingCard
                  key={training.id}
                  training={training}
                  isExpanded={expandedTrainingIds.includes(
                    training.id
                  )}
                  formatDate={formatDate}
                  onToggleExercises={
                    toggleTrainingExercises
                  }
                  onEdit={
                    openEditTrainingForm
                  }
                  onCopy={copyTraining}
                  onDelete={deleteTraining}
                />
              )
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
        <TrainingForm
          editingTrainingId={editingTrainingId}
          formData={formData}
          exerciseForm={exerciseForm}
          players={players}
          filteredPlayers={filteredPlayers}
          playerSearchTerm={playerSearchTerm}
          availablePlayersCount={
            availableSquadPlayers.length
          }
          injuredPlayersCount={
            injuredSquadPlayers.length
          }
          totalDuration={formTotalDuration}
          errorMessage={errorMessage}
          onClose={closeTrainingForm}
          onSubmit={handleSubmit}
          onTrainingInputChange={
            handleTrainingInputChange
          }
          onExerciseInputChange={
            handleExerciseInputChange
          }
          onPlayerSearchChange={
            setPlayerSearchTerm
          }
          onTogglePlayer={
            togglePlayerSelection
          }
          onSelectAvailablePlayers={
            selectAllAvailablePlayers
          }
          onClearPlayers={
            clearSelectedPlayers
          }
          onAddExercise={addExercise}
          onRemoveExercise={removeExercise}
          onMoveExercise={moveExercise}
        />
      )}
    </div>
  );
}

export default Trainings;