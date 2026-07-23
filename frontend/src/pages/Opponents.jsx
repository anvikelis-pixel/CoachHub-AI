import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const initialOpponents = [
  {
    id: 1,
    name: "ΑΟ Ηρακλείου",
    shortName: "ΑΟΗ",
    formation: "4-2-3-1",
    nextMatchDate: "2026-08-02",
    venue: "Εκτός έδρας",
    analysisStatus: "Ολοκληρωμένη",
    strengthLevel: 82,
    strengths: [
      "Γρήγορη επιθετική μετάβαση",
      "Ισχυρή δεξιά πλευρά",
      "Πίεση ψηλά μετά την απώλεια",
    ],
    weaknesses: [
      "Κενό πίσω από τα πλάγια μπακ",
      "Δυσκολία απέναντι σε κάθετο παιχνίδι",
      "Αργή αμυντική μετατόπιση",
    ],
  },
  {
    id: 2,
    name: "ΠΟΑ",
    shortName: "ΠΟΑ",
    formation: "4-3-3",
    nextMatchDate: "2026-08-09",
    venue: "Εντός έδρας",
    analysisStatus: "Σε εξέλιξη",
    strengthLevel: 76,
    strengths: [
      "Καλή κυκλοφορία στο κέντρο",
      "Αποτελεσματική πίεση στον άξονα",
    ],
    weaknesses: [
      "Αδυναμία στις στατικές φάσεις",
      "Χώρος ανάμεσα στις γραμμές",
    ],
  },
];

function Opponents() {
  const [opponents] = useState(() => {
    try {
      const savedOpponents = localStorage.getItem(
        "coachhub-opponents"
      );

      if (!savedOpponents) {
        return initialOpponents;
      }

      const parsedOpponents = JSON.parse(savedOpponents);

      return Array.isArray(parsedOpponents)
        ? parsedOpponents
        : initialOpponents;
    } catch (error) {
      console.error(
        "Αποτυχία φόρτωσης αντιπάλων:",
        error
      );

      return initialOpponents;
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("Όλες");

  useEffect(() => {
    try {
      localStorage.setItem(
        "coachhub-opponents",
        JSON.stringify(opponents)
      );
    } catch (error) {
      console.error(
        "Αποτυχία αποθήκευσης αντιπάλων:",
        error
      );
    }
  }, [opponents]);

  const filteredOpponents = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return opponents.filter((opponent) => {
      const searchableText = [
        opponent.name,
        opponent.shortName,
        opponent.formation,
        opponent.venue,
        ...(opponent.strengths || []),
        ...(opponent.weaknesses || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchableText.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "Όλες" ||
        opponent.analysisStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [opponents, searchTerm, statusFilter]);

  const completedAnalyses = opponents.filter(
    (opponent) =>
      opponent.analysisStatus === "Ολοκληρωμένη"
  ).length;

  const averageStrength =
    opponents.length > 0
      ? Math.round(
          opponents.reduce(
            (total, opponent) =>
              total +
              Number(opponent.strengthLevel || 0),
            0
          ) / opponents.length
        )
      : 0;

  function formatDate(date) {
    if (!date) {
      return "Δεν ορίστηκε";
    }

    const parsedDate = new Date(
      `${date}T12:00:00`
    );

    if (Number.isNaN(parsedDate.getTime())) {
      return "Μη έγκυρη ημερομηνία";
    }

    return new Intl.DateTimeFormat("el-GR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(parsedDate);
  }

  function getVenueIcon(venue) {
    return venue === "Εντός έδρας" ? "⌂" : "✈";
  }

  return (
    <div className="opponents-page opponents-dark-page">
      <section className="opponents-stadium-hero">
        <div className="opponents-stadium-overlay" />
        <div className="opponents-field-lines" />

        <div className="opponents-hero-content">
          <div className="opponents-breadcrumb">
            <span>Αντίπαλοι</span>
            <strong>›</strong>
            <p>Match Intelligence</p>
          </div>

          <p className="opponents-kicker">
            MATCH INTELLIGENCE PLATFORM
          </p>

          <h1>
            OPPONENT
            <span>ANALYSIS</span>
          </h1>

          <p className="opponents-hero-description">
            Ανάλυσε τον αντίπαλο, εντόπισε τα δυνατά
            και αδύνατα σημεία του και προετοίμασε
            το κατάλληλο αγωνιστικό πλάνο.
          </p>

          <button
            type="button"
            className="opponents-new-analysis-button"
            disabled
          >
            <span>＋</span>
            ΝΕΑ ΑΝΑΛΥΣΗ
            <small>ΣΥΝΤΟΜΑ</small>
          </button>
        </div>

        <div className="opponents-hero-emblem">
          <div className="opponents-emblem-rings">
            <span className="opponents-emblem-ball">
              ⚽
            </span>
          </div>

          <strong>COACHHUB</strong>
          <span>INTELLIGENCE</span>
        </div>
      </section>

      <section className="opponents-dark-insights">
        <article>
          <div className="opponent-insight-icon">◎</div>

          <div>
            <span>ΣΥΝΟΛΟ ΑΝΤΙΠΑΛΩΝ</span>
            <strong>
              {String(opponents.length).padStart(2, "0")}
            </strong>
            <p>Καταχωρημένες ομάδες</p>
          </div>
        </article>

        <article>
          <div className="opponent-insight-icon">◇</div>

          <div>
            <span>ΟΛΟΚΛΗΡΩΜΕΝΕΣ ΑΝΑΛΥΣΕΙΣ</span>
            <strong>
              {String(completedAnalyses).padStart(
                2,
                "0"
              )}
            </strong>
            <p>Έτοιμες για χρήση από το staff</p>
          </div>
        </article>

        <article>
          <div className="opponent-insight-icon">↗</div>

          <div>
            <span>ΜΕΣΗ ΔΥΝΑΜΙΚΟΤΗΤΑ</span>
            <strong>{averageStrength}%</strong>
            <p>Εκτιμώμενο επίπεδο αντιπάλων</p>
          </div>
        </article>

        <article>
          <div className="opponent-insight-icon">✣</div>

          <div>
            <span>AI MATCH PLANS</span>
            <strong>00</strong>
            <p>Αυτόματα αγωνιστικά πλάνα</p>
          </div>
        </article>
      </section>

      <section className="opponents-dark-directory">
        <header className="opponents-dark-directory-header">
          <div>
            <p>OPPONENT DATABASE</p>
            <h2>Καταχωρημένες ομάδες</h2>
          </div>

          <div className="opponents-dark-tools">
            <label className="opponents-dark-search">
              <span>⌕</span>

              <input
                type="search"
                placeholder="Αναζήτηση αντιπάλου..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="Όλες">
                Όλες οι αναλύσεις
              </option>

              <option value="Ολοκληρωμένη">
                Ολοκληρωμένες
              </option>

              <option value="Σε εξέλιξη">
                Σε εξέλιξη
              </option>
            </select>
          </div>
        </header>

        {filteredOpponents.length > 0 ? (
          <div className="opponents-table-wrapper">
            <div className="opponents-table-head">
              <span>ΟΜΑΔΑ</span>
              <span>ΣΧΗΜΑΤΙΣΜΟΣ</span>
              <span>ΕΠΟΜΕΝΟΣ ΑΓΩΝΑΣ</span>
              <span>ΕΔΡΑ</span>
              <span>ΚΑΤΑΣΤΑΣΗ</span>
              <span>ΔΥΝΑΜΙΚΟΤΗΤΑ</span>
              <span>ΕΝΕΡΓΕΙΕΣ</span>
            </div>

            {filteredOpponents.map((opponent) => (
              <article
                className="opponents-table-row"
                key={opponent.id}
              >
                <div className="opponents-team-cell">
                  <div className="opponents-team-badge">
                    <span>{opponent.shortName}</span>
                  </div>

                  <div>
                    <strong>{opponent.name}</strong>
                    <p>{opponent.shortName}</p>
                  </div>
                </div>

                <div className="opponents-table-value">
                  {opponent.formation}
                </div>

                <div className="opponents-date-cell">
                  <strong>
                    {formatDate(opponent.nextMatchDate)}
                  </strong>
                  <span>Επόμενη αγωνιστική</span>
                </div>

                <div className="opponents-venue-cell">
                  <span>
                    {getVenueIcon(opponent.venue)}
                  </span>
                  {opponent.venue}
                </div>

                <div>
                  <span
                    className={`opponents-status-badge ${
                      opponent.analysisStatus ===
                      "Ολοκληρωμένη"
                        ? "completed"
                        : "progress"
                    }`}
                  >
                    {opponent.analysisStatus}
                  </span>
                </div>

                <div className="opponents-strength-cell">
                  <strong>
                    {opponent.strengthLevel}%
                  </strong>

                  <div>
                    <span
                      style={{
                        width: `${opponent.strengthLevel}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="opponents-actions-cell">
                  <Link
                    to={`/opponents/${opponent.id}`}
                    className="opponents-view-button"
                  >
                    ΠΡΟΒΟΛΗ ΑΝΑΛΥΣΗΣ
                  </Link>

                  <button
                    type="button"
                    aria-label="Περισσότερες επιλογές"
                  >
                    ⋮
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="opponents-dark-empty">
            <span>NO OPPONENTS</span>
            <h3>Δεν βρέθηκαν αντίπαλοι.</h3>
            <p>
              Άλλαξε την αναζήτηση ή το φίλτρο
              ανάλυσης.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Opponents;