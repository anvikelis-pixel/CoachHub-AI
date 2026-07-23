function PlayerSelector({
  players,
  filteredPlayers,
  selectedPlayerIds,
  playerSearchTerm,
  availableCount,
  injuredCount,
  onSearchChange,
  onTogglePlayer,
  onSelectAvailable,
  onClear,
}) {
  return (
    <section className="training-player-selector">
      <header className="player-selector-header">
        <div>
          <h3>Συμμετέχοντες προπόνησης</h3>

          <p>
            {selectedPlayerIds.length} επιλεγμένοι από{" "}
            {players.length}
          </p>
        </div>

        <div className="player-selector-actions">
          <button
            type="button"
            onClick={onSelectAvailable}
          >
            Επιλογή διαθέσιμων
          </button>

          <button
            type="button"
            onClick={onClear}
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
          onSearchChange(event.target.value)
        }
      />

      <div className="training-player-list">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map((player) => {
            const isInjured =
              player.status === "Τραυματίας";

            const isSelected =
              selectedPlayerIds.includes(player.id);

            const firstName = String(
              player.firstName || ""
            );

            const lastName = String(
              player.lastName || ""
            );

            const initials =
              `${firstName.charAt(0)}${lastName.charAt(0)}`;

            return (
              <label
                key={player.id}
                className={`training-player-option ${
                  isSelected ? "selected" : ""
                } ${
                  isInjured ? "disabled" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={isInjured}
                  onChange={() =>
                    onTogglePlayer(player.id)
                  }
                />

                <div className="training-player-avatar">
                  {initials || "—"}
                </div>

                <div className="training-player-info">
                  <strong>
                    {firstName || "Χωρίς όνομα"}{" "}
                    {lastName}
                  </strong>

                  <span>
                    {player.position ||
                      "Χωρίς θέση"}{" "}
                    · #{player.number || "—"}
                  </span>
                </div>

                <span
                  className={`selector-player-status ${
                    isInjured
                      ? "injured"
                      : "available"
                  }`}
                >
                  {player.status || "Άγνωστη"}
                </span>
              </label>
            );
          })
        ) : (
          <p className="empty-exercises-message">
            Δεν βρέθηκαν παίκτες.
          </p>
        )}
      </div>

      <footer className="player-selector-summary">
        <span>
          Διαθέσιμοι: {availableCount}
        </span>

        <span>
          Τραυματίες: {injuredCount}
        </span>

        <strong>
          Επιλεγμένοι: {selectedPlayerIds.length}
        </strong>
      </footer>
    </section>
  );
}

export default PlayerSelector;