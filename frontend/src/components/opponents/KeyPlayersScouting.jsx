function getPlayerAttributes(player) {
  const threat = Number(player.threat || 0);

  const position = String(
    player.position || ""
  ).toLowerCase();

  if (
    position.includes("εξτρέμ") ||
    position.includes("wing")
  ) {
    return [
      {
        label: "Ταχύτητα",
        value: Math.min(99, threat + 4),
      },
      {
        label: "Ντρίμπλα",
        value: Math.min(99, threat + 1),
      },
      {
        label: "Κίνηση",
        value: Math.max(1, threat - 2),
      },
      {
        label: "Σέντρα",
        value: Math.max(1, threat - 5),
      },
    ];
  }

  if (
    position.includes("επιθετικός") ||
    position.includes("striker")
  ) {
    return [
      {
        label: "Τελείωμα",
        value: Math.min(99, threat + 3),
      },
      {
        label: "Κίνηση",
        value: Math.min(99, threat + 1),
      },
      {
        label: "Δύναμη",
        value: Math.max(1, threat - 3),
      },
      {
        label: "Κεφαλιά",
        value: Math.max(1, threat - 5),
      },
    ];
  }

  return [
    {
      label: "Δημιουργία",
      value: Math.min(99, threat + 2),
    },
    {
      label: "Τεχνική",
      value: Math.max(1, threat - 1),
    },
    {
      label: "Όραμα",
      value: Math.min(99, threat + 1),
    },
    {
      label: "Κίνηση",
      value: Math.max(1, threat - 4),
    },
  ];
}

function getRatingLevel(value) {
  if (value >= 86) {
    return "elite";
  }

  if (value >= 78) {
    return "strong";
  }

  return "medium";
}

function KeyPlayersScouting({
  players = [],
}) {
  if (!players.length) {
    return (
      <div className="scouting-players-empty">
        <span>NO PLAYER DATA</span>

        <h3>
          Δεν έχουν καταχωρηθεί παίκτες-κλειδιά.
        </h3>

        <p>
          Πρόσθεσε τους σημαντικότερους παίκτες του
          αντιπάλου και το scouting report τους.
        </p>
      </div>
    );
  }

  return (
    <section className="key-player-scouting">
      <header className="key-player-scouting-header">
        <div>
          <p>PLAYER INTELLIGENCE</p>

          <h2>Παίκτες-κλειδιά</h2>

          <span>
            Scouting reports και επίπεδο απειλής
            για τους σημαντικότερους παίκτες.
          </span>
        </div>

        <div className="key-player-count">
          <span>KEY PLAYERS</span>

          <strong>
            {String(players.length).padStart(2, "0")}
          </strong>
        </div>
      </header>

      <div className="key-player-scouting-grid">
        {players.map((player) => {
          const attributes =
            getPlayerAttributes(player);

          return (
            <article
              className="fm-player-card"
              key={player.id}
            >
              <header className="fm-player-card-header">
                <div className="fm-player-shirt">
                  <span>{player.number}</span>
                </div>

                <div className="fm-player-identity">
                  <span>
                    {player.position}
                  </span>

                  <h3>{player.name}</h3>

                  <p>
                    Αντίπαλος παίκτης · Scouting
                    profile
                  </p>
                </div>

                <div
                  className={`fm-player-rating ${getRatingLevel(
                    player.threat
                  )}`}
                >
                  <strong>
                    {player.threat}
                  </strong>

                  <span>THREAT</span>
                </div>
              </header>

              <div className="fm-player-report">
                <div className="fm-report-label">
                  <span>SCOUT REPORT</span>

                  <strong>
                    Κύρια αγωνιστική αξιολόγηση
                  </strong>
                </div>

                <p>{player.description}</p>
              </div>

              <div className="fm-player-attributes">
                {attributes.map((attribute) => (
                  <div
                    className="fm-player-attribute"
                    key={attribute.label}
                  >
                    <div>
                      <span>
                        {attribute.label}
                      </span>

                      <strong>
                        {attribute.value}
                      </strong>
                    </div>

                    <div className="fm-attribute-track">
                      <span
                        className={getRatingLevel(
                          attribute.value
                        )}
                        style={{
                          width: `${attribute.value}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <footer className="fm-player-footer">
                <div>
                  <span>PRIORITY</span>

                  <strong>
                    {player.threat >= 85
                      ? "Πολύ υψηλή"
                      : player.threat >= 78
                        ? "Υψηλή"
                        : "Μέτρια"}
                  </strong>
                </div>

                <div>
                  <span>MARKING</span>

                  <strong>
                    {player.threat >= 85
                      ? "Στενή επιτήρηση"
                      : "Ελεγχόμενη πίεση"}
                  </strong>
                </div>

                <button
                  type="button"
                  disabled
                >
                  Πλήρες report — Σύντομα
                </button>
              </footer>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default KeyPlayersScouting;