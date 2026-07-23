import ExerciseBuilder from "./ExerciseBuilder";
import PlayerSelector from "./PlayerSelector";

function TrainingForm({
  editingTrainingId,
  formData,
  exerciseForm,
  players,
  filteredPlayers,
  playerSearchTerm,
  availablePlayersCount,
  injuredPlayersCount,
  totalDuration,
  errorMessage,
  onClose,
  onSubmit,
  onTrainingInputChange,
  onExerciseInputChange,
  onPlayerSearchChange,
  onTogglePlayer,
  onSelectAvailablePlayers,
  onClearPlayers,
  onAddExercise,
  onRemoveExercise,
  onMoveExercise,
  onOpenExerciseLibrary,
}) {
  return (
    <div
      className="player-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="training-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="training-form-title"
      >
        <div className="premium-modal-accent" />

        <header className="premium-modal-header">
          <div>
            <p className="section-eyebrow dark">
              TRAINING BUILDER
            </p>

            <h2 id="training-form-title">
              {editingTrainingId !== null
                ? "Επεξεργασία προπόνησης"
                : "Δημιουργία προπόνησης"}
            </h2>

            <p>
              Επίλεξε παίκτες και δημιούργησε ολόκληρο
              το προπονητικό πλάνο.
            </p>
          </div>

          <button
            type="button"
            className="premium-close-button"
            onClick={onClose}
            aria-label="Κλείσιμο φόρμας"
          >
            ×
          </button>
        </header>

        <form
          className="premium-player-form"
          onSubmit={onSubmit}
        >
          <p className="player-form-section-title">
            Βασικά στοιχεία
          </p>

          <div className="premium-form-grid">
            <label>
              <span>Τίτλος προπόνησης *</span>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={onTrainingInputChange}
              />
            </label>

            <label>
              <span>Ημερομηνία *</span>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={onTrainingInputChange}
              />
            </label>

            <label>
              <span>Ώρα *</span>

              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={onTrainingInputChange}
              />
            </label>

            <label>
              <span>Ένταση</span>

              <select
                name="intensity"
                value={formData.intensity}
                onChange={onTrainingInputChange}
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
              onChange={onTrainingInputChange}
            />
          </label>

          <p className="player-form-section-title">
            Επιλογή παικτών
          </p>

          <PlayerSelector
            players={players}
            filteredPlayers={filteredPlayers}
            selectedPlayerIds={formData.selectedPlayerIds}
            playerSearchTerm={playerSearchTerm}
            availableCount={availablePlayersCount}
            injuredCount={injuredPlayersCount}
            onSearchChange={onPlayerSearchChange}
            onTogglePlayer={onTogglePlayer}
            onSelectAvailable={
              onSelectAvailablePlayers
            }
            onClear={onClearPlayers}
          />

          <ExerciseBuilder
            exerciseForm={exerciseForm}
            exercises={formData.exercises}
            totalDuration={totalDuration}
            onExerciseChange={onExerciseInputChange}
            onAddExercise={onAddExercise}
            onRemoveExercise={onRemoveExercise}
            onMoveExercise={onMoveExercise}
            onOpenLibrary={onOpenExerciseLibrary}
          />

          <p className="player-form-section-title">
            Παρατηρήσεις
          </p>

          <label className="player-notes-field">
            <span>Σημειώσεις προπονητή</span>

            <textarea
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={onTrainingInputChange}
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
              onClick={onClose}
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
  );
}

export default TrainingForm;