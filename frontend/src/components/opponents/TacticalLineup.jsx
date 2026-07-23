function TacticalLineup({
  players = [],
  formation = "4-2-3-1",
}) {
  if (!players.length) {
    return (
      <div className="tactical-lineup-empty">
        <span>NO LINEUP DATA</span>

        <h3>
          Δεν έχει καταχωρηθεί πιθανή ενδεκάδα.
        </h3>

        <p>
          Πρόσθεσε τους πιθανούς βασικούς παίκτες
          και τις θέσεις τους στο γήπεδο.
        </p>
      </div>
    );
  }

  return (
    <section className="tactical-lineup">
      <header className="tactical-lineup-header">
        <div>
          <p>COACH TACTICAL BOARD</p>

          <h2>Πιθανή ενδεκάδα</h2>

          <span>
            Εκτιμώμενη αρχική διάταξη αντιπάλου
          </span>
        </div>

        <div className="tactical-formation-badge">
          <span>FORMATION</span>
          <strong>{formation}</strong>
        </div>
      </header>

      <div className="tactical-lineup-layout">
        <div className="tactical-pitch-shell">
          <div className="tactical-pitch">
            <div className="pitch-halfway-line" />
            <div className="pitch-center-circle" />
            <div className="pitch-center-dot" />

            <div className="pitch-box pitch-box-top">
              <div className="pitch-goal-box" />
            </div>

            <div className="pitch-box pitch-box-bottom">
              <div className="pitch-goal-box" />
            </div>

            <div className="pitch-penalty-arc pitch-penalty-arc-top" />
            <div className="pitch-penalty-arc pitch-penalty-arc-bottom" />

            {players.map((player) => (
              <article
                className="tactical-player-marker"
                key={player.id}
                style={{
                  left: `${player.x}%`,
                  top: `${player.y}%`,
                }}
              >
                <div className="tactical-player-token">
                  <span>{player.role}</span>
                  <strong>{player.number}</strong>
                </div>

                <div className="tactical-player-label">
                  <strong>{player.name}</strong>
                  <span>{player.position}</span>
                </div>
              </article>
            ))}
          </div>

          <footer className="tactical-pitch-footer">
            <span>
              ↑ Κατεύθυνση επίθεσης
            </span>

            <strong>
              Opponent tactical setup
            </strong>
          </footer>
        </div>

        <aside className="tactical-squad-panel">
          <header>
            <div>
              <p>STARTING XI</p>
              <h3>Πιθανοί βασικοί</h3>
            </div>

            <strong>{players.length}</strong>
          </header>

          <div className="tactical-squad-list">
            {players.map((player, index) => (
              <article key={player.id}>
                <span className="tactical-list-order">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="tactical-list-number">
                  {player.number}
                </div>

                <div>
                  <strong>{player.name}</strong>
                  <p>{player.position}</p>
                </div>

                <span className="tactical-list-role">
                  {player.role}
                </span>
              </article>
            ))}
          </div>

          <footer>
            <span>Σχηματισμός</span>
            <strong>{formation}</strong>
          </footer>
        </aside>
      </div>
    </section>
  );
}

export default TacticalLineup;