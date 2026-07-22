import { Link, useParams } from "react-router-dom";

function PlayerProfile() {
  const { playerId } = useParams();

  let players = [];

  try {
    const savedPlayers = localStorage.getItem("coachhub-players");

    players = savedPlayers ? JSON.parse(savedPlayers) : [];
  } catch (error) {
    console.error("Αποτυχία φόρτωσης παίκτη:", error);
  }

  const player = players.find(
    (currentPlayer) => String(currentPlayer.id) === playerId
  );

  if (!player) {
    return (
      <div className="player-profile-page">
        <section className="player-not-found">
          <p className="section-eyebrow dark">PLAYER PROFILE</p>

          <h1>Ο παίκτης δεν βρέθηκε.</h1>

          <p>
            Ο συγκεκριμένος παίκτης μπορεί να έχει διαγραφεί ή να μην
            έχει αποθηκευτεί σωστά.
          </p>

          <Link to="/players" className="profile-back-link">
            ← Επιστροφή στους παίκτες
          </Link>
        </section>
      </div>
    );
  }

  const initials =
    `${player.firstName?.charAt(0) ?? ""}${
      player.lastName?.charAt(0) ?? ""
    }`;

  return (
    <div className="player-profile-page">
      <section className="player-profile-hero">
        <div className="player-profile-topbar">
          <Link to="/players" className="profile-back-link light">
            ← Επιστροφή στο ρόστερ
          </Link>

          <span className="player-profile-category">
            PLAYER PROFILE / SQUAD
          </span>
        </div>

        <div className="player-profile-identity">
          <div className="player-profile-avatar">{initials}</div>

          <div className="player-profile-name">
            <span>{player.position}</span>

            <h1>
              {player.firstName} {player.lastName}
            </h1>

            <p>
              #{String(player.number).padStart(2, "0")} ·{" "}
              {player.age} ετών
            </p>
          </div>

          <div className="player-profile-shirt-number">
            {String(player.number).padStart(2, "0")}
          </div>
        </div>
      </section>

      <section className="player-profile-summary">
        <article>
          <span>ΚΑΤΑΣΤΑΣΗ</span>

          <strong
            className={
              player.status === "Διαθέσιμος"
                ? "profile-status available"
                : "profile-status injured"
            }
          >
            {player.status}
          </strong>
        </article>

        <article>
          <span>ΥΨΟΣ</span>
          <strong>
            {player.height ? `${player.height} cm` : "Δεν καταχωρήθηκε"}
          </strong>
        </article>

        <article>
          <span>ΒΑΡΟΣ</span>
          <strong>
            {player.weight ? `${player.weight} kg` : "Δεν καταχωρήθηκε"}
          </strong>
        </article>

        <article>
          <span>ΠΡΟΤΙΜΩΜΕΝΟ ΠΟΔΙ</span>
          <strong>{player.preferredFoot || "Δεν καταχωρήθηκε"}</strong>
        </article>
      </section>

      <section className="player-profile-content">
        <div className="player-profile-main">
          <section className="profile-section">
            <header className="profile-section-header">
              <div>
                <p className="section-eyebrow dark">
                  SEASON PERFORMANCE
                </p>

                <h2>Αγωνιστικά στοιχεία</h2>
              </div>
            </header>

            <div className="profile-stats-grid">
              <article>
                <span>Συμμετοχές</span>
                <strong>{player.appearances ?? 0}</strong>
              </article>

              <article>
                <span>Βασικός</span>
                <strong>{player.starts ?? 0}</strong>
              </article>

              <article>
                <span>Λεπτά</span>
                <strong>{player.minutes ?? 0}</strong>
              </article>

              <article>
                <span>Γκολ</span>
                <strong>{player.goals ?? 0}</strong>
              </article>

              <article>
                <span>Ασίστ</span>
                <strong>{player.assists ?? 0}</strong>
              </article>

              <article>
                <span>Κίτρινες</span>
                <strong>{player.yellowCards ?? 0}</strong>
              </article>

              <article>
                <span>Κόκκινες</span>
                <strong>{player.redCards ?? 0}</strong>
              </article>

              <article>
                <span>Παρουσίες</span>
                <strong>{player.attendance ?? 0}</strong>
              </article>
            </div>
          </section>

          <section className="profile-section">
            <header className="profile-section-header">
              <div>
                <p className="section-eyebrow dark">COACH NOTES</p>
                <h2>Σημειώσεις προπονητή</h2>
              </div>
            </header>

            <div className="coach-notes-box">
              {player.coachNotes ? (
                <p>{player.coachNotes}</p>
              ) : (
                <p className="empty-profile-text">
                  Δεν υπάρχουν ακόμα σημειώσεις για τον συγκεκριμένο
                  παίκτη.
                </p>
              )}
            </div>
          </section>
        </div>

        <aside className="player-profile-sidebar">
          <section className="profile-side-card">
            <p className="section-eyebrow dark">PERSONAL DATA</p>

            <h2>Προσωπικά στοιχεία</h2>

            <dl className="player-details-list">
              <div>
                <dt>Όνομα</dt>
                <dd>{player.firstName}</dd>
              </div>

              <div>
                <dt>Επώνυμο</dt>
                <dd>{player.lastName}</dd>
              </div>

              <div>
                <dt>Ηλικία</dt>
                <dd>{player.age} ετών</dd>
              </div>

              <div>
                <dt>Θέση</dt>
                <dd>{player.position}</dd>
              </div>

              <div>
                <dt>Αριθμός</dt>
                <dd>#{player.number}</dd>
              </div>

              <div>
                <dt>Ύψος</dt>
                <dd>
                  {player.height
                    ? `${player.height} cm`
                    : "Δεν καταχωρήθηκε"}
                </dd>
              </div>

              <div>
                <dt>Βάρος</dt>
                <dd>
                  {player.weight
                    ? `${player.weight} kg`
                    : "Δεν καταχωρήθηκε"}
                </dd>
              </div>

              <div>
                <dt>Πόδι</dt>
                <dd>{player.preferredFoot || "Δεν καταχωρήθηκε"}</dd>
              </div>
            </dl>
          </section>

          <section className="profile-side-card dark-card">
            <p className="section-eyebrow">AVAILABILITY</p>

            <h2>Διαθεσιμότητα</h2>

            <strong className="availability-value">
              {player.status}
            </strong>

            <p>
              Η κατάσταση ενημερώνεται από τη σελίδα διαχείρισης
              παικτών.
            </p>
          </section>
        </aside>
      </section>
    </div>
  );
}

export default PlayerProfile;