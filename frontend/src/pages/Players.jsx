import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const initialPlayers = [
  {
    id: 1,
    firstName: "Νίκος",
    lastName: "Παπαδόπουλος",
    age: 20,
    position: "Εξτρέμ",
    number: 11,
    status: "Διαθέσιμος",
    height: 178,
    weight: 71,
    preferredFoot: "Δεξί",
    appearances: 12,
    starts: 8,
    minutes: 760,
    goals: 4,
    assists: 3,
    yellowCards: 1,
    redCards: 0,
    attendance: 18,
    coachNotes:
      "Δυνατός στο ένας εναντίον ενός. Χρειάζεται βελτίωση στις αμυντικές επιστροφές.",
  },
  {
    id: 2,
    firstName: "Γιώργος",
    lastName: "Αντωνίου",
    age: 22,
    position: "Τερματοφύλακας",
    number: 1,
    status: "Διαθέσιμος",
    height: 188,
    weight: 82,
    preferredFoot: "Δεξί",
    appearances: 14,
    starts: 14,
    minutes: 1260,
    goals: 0,
    assists: 0,
    yellowCards: 1,
    redCards: 0,
    attendance: 20,
    coachNotes:
      "Σταθερός στις εξόδους και στην επικοινωνία με την άμυνα.",
  },
  {
    id: 3,
    firstName: "Μάριος",
    lastName: "Κωνσταντίνου",
    age: 19,
    position: "Κεντρικός μέσος",
    number: 8,
    status: "Τραυματίας",
    height: 181,
    weight: 74,
    preferredFoot: "Αριστερό",
    appearances: 9,
    starts: 7,
    minutes: 610,
    goals: 2,
    assists: 4,
    yellowCards: 2,
    redCards: 0,
    attendance: 15,
    coachNotes:
      "Καλή κυκλοφορία μπάλας. Βρίσκεται σε περίοδο αποκατάστασης.",
  },
  {
    id: 4,
    firstName: "Αλέξανδρος",
    lastName: "Νικολάου",
    age: 21,
    position: "Σέντερ φορ",
    number: 9,
    status: "Διαθέσιμος",
    height: 185,
    weight: 79,
    preferredFoot: "Δεξί",
    appearances: 13,
    starts: 10,
    minutes: 905,
    goals: 8,
    assists: 2,
    yellowCards: 3,
    redCards: 0,
    attendance: 19,
    coachNotes:
      "Καλές κινήσεις στην περιοχή. Να δουλέψει περισσότερο στο πρέσινγκ.",
  },
];

const emptyForm = {
  firstName: "",
  lastName: "",
  age: "",
  position: "",
  number: "",
  status: "Διαθέσιμος",
  height: "",
  weight: "",
  preferredFoot: "Δεξί",
  appearances: "0",
  starts: "0",
  minutes: "0",
  goals: "0",
  assists: "0",
  yellowCards: "0",
  redCards: "0",
  attendance: "0",
  coachNotes: "",
};

function Players() {
  const [players, setPlayers] = useState(() => {
    try {
      const savedPlayers = localStorage.getItem("coachhub-players");

      return savedPlayers
        ? JSON.parse(savedPlayers)
        : initialPlayers;
    } catch (error) {
      console.error("Αποτυχία φόρτωσης παικτών:", error);
      return initialPlayers;
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(
        "coachhub-players",
        JSON.stringify(players)
      );
    } catch (error) {
      console.error("Αποτυχία αποθήκευσης παικτών:", error);
    }
  }, [players]);

  const filteredPlayers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return players;
    }

    return players.filter((player) => {
      const fullName =
        `${player.firstName} ${player.lastName}`.toLowerCase();

      return (
        fullName.includes(normalizedSearch) ||
        player.position.toLowerCase().includes(normalizedSearch) ||
        player.status.toLowerCase().includes(normalizedSearch) ||
        String(player.number).includes(normalizedSearch)
      );
    });
  }, [players, searchTerm]);

  const availablePlayers = players.filter(
    (player) => player.status === "Διαθέσιμος"
  ).length;

  const injuredPlayers = players.filter(
    (player) => player.status === "Τραυματίας"
  ).length;

  const averageAge =
    players.length > 0
      ? (
          players.reduce(
            (total, player) => total + Number(player.age || 0),
            0
          ) / players.length
        ).toFixed(1)
      : "0";

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function openAddPlayerForm() {
    setEditingPlayerId(null);
    setFormData(emptyForm);
    setErrorMessage("");
    setIsFormOpen(true);
  }

  function openEditPlayerForm(player) {
    setEditingPlayerId(player.id);

    setFormData({
      firstName: player.firstName ?? "",
      lastName: player.lastName ?? "",
      age: String(player.age ?? ""),
      position: player.position ?? "",
      number: String(player.number ?? ""),
      status: player.status ?? "Διαθέσιμος",
      height: String(player.height ?? ""),
      weight: String(player.weight ?? ""),
      preferredFoot: player.preferredFoot ?? "Δεξί",
      appearances: String(player.appearances ?? 0),
      starts: String(player.starts ?? 0),
      minutes: String(player.minutes ?? 0),
      goals: String(player.goals ?? 0),
      assists: String(player.assists ?? 0),
      yellowCards: String(player.yellowCards ?? 0),
      redCards: String(player.redCards ?? 0),
      attendance: String(player.attendance ?? 0),
      coachNotes: player.coachNotes ?? "",
    });

    setErrorMessage("");
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingPlayerId(null);
    setFormData(emptyForm);
    setErrorMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const age = Number(formData.age);
    const number = Number(formData.number);
    const height = Number(formData.height);
    const weight = Number(formData.weight);

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.position.trim() ||
      !formData.age ||
      !formData.number ||
      !formData.height ||
      !formData.weight
    ) {
      setErrorMessage(
        "Συμπλήρωσε όλα τα βασικά υποχρεωτικά πεδία."
      );
      return;
    }

    if (age < 14 || age > 50) {
      setErrorMessage("Η ηλικία πρέπει να είναι από 14 έως 50.");
      return;
    }

    if (number < 1 || number > 99) {
      setErrorMessage(
        "Ο αριθμός φανέλας πρέπει να είναι από 1 έως 99."
      );
      return;
    }

    if (height < 140 || height > 220) {
      setErrorMessage(
        "Το ύψος πρέπει να είναι από 140 έως 220 cm."
      );
      return;
    }

    if (weight < 40 || weight > 150) {
      setErrorMessage(
        "Το βάρος πρέπει να είναι από 40 έως 150 kg."
      );
      return;
    }

    const numberAlreadyExists = players.some(
      (player) =>
        Number(player.number) === number &&
        player.id !== editingPlayerId
    );

    if (numberAlreadyExists) {
      setErrorMessage(
        "Αυτός ο αριθμός φανέλας χρησιμοποιείται ήδη."
      );
      return;
    }

    const playerData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      age,
      position: formData.position,
      number,
      status: formData.status,
      height,
      weight,
      preferredFoot: formData.preferredFoot,
      appearances: Number(formData.appearances) || 0,
      starts: Number(formData.starts) || 0,
      minutes: Number(formData.minutes) || 0,
      goals: Number(formData.goals) || 0,
      assists: Number(formData.assists) || 0,
      yellowCards: Number(formData.yellowCards) || 0,
      redCards: Number(formData.redCards) || 0,
      attendance: Number(formData.attendance) || 0,
      coachNotes: formData.coachNotes.trim(),
    };

    if (editingPlayerId !== null) {
      setPlayers((currentPlayers) =>
        currentPlayers.map((player) =>
          player.id === editingPlayerId
            ? { ...player, ...playerData }
            : player
        )
      );
    } else {
      setPlayers((currentPlayers) => [
        ...currentPlayers,
        {
          id: Date.now(),
          ...playerData,
        },
      ]);
    }

    closeForm();
  }

  function deletePlayer(playerId) {
    const playerToDelete = players.find(
      (player) => player.id === playerId
    );

    if (!playerToDelete) {
      return;
    }

    const shouldDelete = window.confirm(
      `Θέλεις σίγουρα να διαγράψεις τον παίκτη ${playerToDelete.firstName} ${playerToDelete.lastName};`
    );

    if (!shouldDelete) {
      return;
    }

    setPlayers((currentPlayers) =>
      currentPlayers.filter((player) => player.id !== playerId)
    );
  }

  return (
    <div className="players-page">
      <section className="players-hero">
        <div className="players-hero-content">
          <p className="section-eyebrow">
            TEAM MANAGEMENT / SQUAD
          </p>

          <h1>Χτίσε και διαχειρίσου το ρόστερ σου.</h1>

          <p className="players-hero-description">
            Όλοι οι παίκτες, οι θέσεις και η αγωνιστική τους
            κατάσταση σε μία καθαρή και οργανωμένη προβολή.
          </p>

          <div className="players-hero-actions">
            <button
              type="button"
              className="premium-primary-button"
              onClick={openAddPlayerForm}
            >
              + Προσθήκη παίκτη
            </button>

            <span className="hero-update-text">
              Τελευταία ενημέρωση: σήμερα
            </span>
          </div>
        </div>

        <div className="players-hero-number">
          <span>ROSTER</span>
          <strong>
            {String(players.length).padStart(2, "0")}
          </strong>
        </div>
      </section>

      <section className="players-insights">
        <article className="insight-card featured">
          <span className="insight-label">ΣΥΝΟΛΟ</span>
          <strong>{players.length}</strong>
          <p>Καταχωρημένοι ποδοσφαιριστές</p>
        </article>

        <article className="insight-card">
          <span className="insight-label">ΔΙΑΘΕΣΙΜΟΙ</span>
          <strong>{availablePlayers}</strong>
          <p>Έτοιμοι για προπόνηση και αγώνα</p>
        </article>

        <article className="insight-card">
          <span className="insight-label">ΤΡΑΥΜΑΤΙΕΣ</span>
          <strong>{injuredPlayers}</strong>
          <p>Παίκτες υπό αποκατάσταση</p>
        </article>

        <article className="insight-card">
          <span className="insight-label">ΜΕΣΗ ΗΛΙΚΙΑ</span>
          <strong>{averageAge}</strong>
          <p>Μέσος όρος ηλικίας ρόστερ</p>
        </article>
      </section>

      <section className="players-directory">
        <header className="directory-header">
          <div>
            <p className="section-eyebrow dark">
              PLAYER DIRECTORY
            </p>

            <h2>Ρόστερ ομάδας</h2>

            <p>
              {filteredPlayers.length} από {players.length} παίκτες
            </p>
          </div>

          <div className="directory-tools">
            <input
              type="search"
              className="premium-search"
              placeholder="Αναζήτηση ονόματος, θέσης ή αριθμού"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>
        </header>

        {filteredPlayers.length > 0 ? (
          <div className="premium-player-list">
            {filteredPlayers.map((player) => (
              <article
                className="premium-player-card"
                key={player.id}
              >
                <div className="player-card-number">
                  {String(player.number).padStart(2, "0")}
                </div>

                <div className="player-card-avatar">
                  {player.firstName.charAt(0)}
                  {player.lastName.charAt(0)}
                </div>

                <div className="player-card-identity">
                  <span className="player-position-label">
                    {player.position}
                  </span>

                  <h3>
                    {player.firstName} {player.lastName}
                  </h3>

                  <p>
                    {player.age} ετών ·{" "}
                    {player.height
                      ? `${player.height} cm`
                      : "Χωρίς ύψος"}{" "}
                    ·{" "}
                    {player.weight
                      ? `${player.weight} kg`
                      : "Χωρίς βάρος"}
                  </p>
                </div>

                <div className="player-card-status">
                  <span
                    className={
                      player.status === "Διαθέσιμος"
                        ? "premium-status available"
                        : "premium-status injured"
                    }
                  >
                    {player.status}
                  </span>
                </div>

                <div className="player-card-actions">
                  <Link
                    to={`/players/${player.id}`}
                    className="text-action-button profile"
                  >
                    Προφίλ
                  </Link>

                  <button
                    type="button"
                    className="text-action-button"
                    onClick={() =>
                      openEditPlayerForm(player)
                    }
                  >
                    Επεξεργασία
                  </button>

                  <button
                    type="button"
                    className="text-action-button danger"
                    onClick={() => deletePlayer(player.id)}
                  >
                    Διαγραφή
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="premium-empty-state">
            <span>NO RESULTS</span>
            <h3>Δεν βρέθηκαν παίκτες.</h3>
            <p>
              Δοκίμασε άλλο όνομα, θέση ή αριθμό φανέλας.
            </p>
          </div>
        )}
      </section>

      {isFormOpen && (
        <div
          className="player-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <div className="premium-player-modal">
            <div className="premium-modal-accent" />

            <header className="premium-modal-header">
              <div>
                <p className="section-eyebrow dark">
                  PLAYER PROFILE
                </p>

                <h2>
                  {editingPlayerId !== null
                    ? "Επεξεργασία παίκτη"
                    : "Προσθήκη νέου παίκτη"}
                </h2>

                <p>
                  Συμπλήρωσε τα στοιχεία του ποδοσφαιριστή.
                </p>
              </div>

              <button
                type="button"
                className="premium-close-button"
                onClick={closeForm}
                aria-label="Κλείσιμο"
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
                  <span>Όνομα *</span>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="π.χ. Αντώνης"
                  />
                </label>

                <label>
                  <span>Επώνυμο *</span>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="π.χ. Βικέλης"
                  />
                </label>

                <label>
                  <span>Ηλικία *</span>
                  <input
                    type="number"
                    name="age"
                    min="14"
                    max="50"
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  <span>Αριθμός φανέλας *</span>
                  <input
                    type="number"
                    name="number"
                    min="1"
                    max="99"
                    value={formData.number}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  <span>Ύψος σε cm *</span>
                  <input
                    type="number"
                    name="height"
                    min="140"
                    max="220"
                    value={formData.height}
                    onChange={handleInputChange}
                    placeholder="183"
                  />
                </label>

                <label>
                  <span>Βάρος σε kg *</span>
                  <input
                    type="number"
                    name="weight"
                    min="40"
                    max="150"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="72"
                  />
                </label>

                <label>
                  <span>Θέση *</span>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                  >
                    <option value="">Επίλεξε θέση</option>
                    <option value="Τερματοφύλακας">
                      Τερματοφύλακας
                    </option>
                    <option value="Δεξί μπακ">
                      Δεξί μπακ
                    </option>
                    <option value="Αριστερό μπακ">
                      Αριστερό μπακ
                    </option>
                    <option value="Κεντρικός αμυντικός">
                      Κεντρικός αμυντικός
                    </option>
                    <option value="Αμυντικός μέσος">
                      Αμυντικός μέσος
                    </option>
                    <option value="Κεντρικός μέσος">
                      Κεντρικός μέσος
                    </option>
                    <option value="Επιτελικός μέσος">
                      Επιτελικός μέσος
                    </option>
                    <option value="Εξτρέμ">Εξτρέμ</option>
                    <option value="Σέντερ φορ">
                      Σέντερ φορ
                    </option>
                  </select>
                </label>

                <label>
                  <span>Προτιμώμενο πόδι</span>
                  <select
                    name="preferredFoot"
                    value={formData.preferredFoot}
                    onChange={handleInputChange}
                  >
                    <option value="Δεξί">Δεξί</option>
                    <option value="Αριστερό">Αριστερό</option>
                    <option value="Και τα δύο">
                      Και τα δύο
                    </option>
                  </select>
                </label>

                <label>
                  <span>Κατάσταση</span>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Διαθέσιμος">
                      Διαθέσιμος
                    </option>
                    <option value="Τραυματίας">
                      Τραυματίας
                    </option>
                  </select>
                </label>
              </div>

              <p className="player-form-section-title">
                Αγωνιστικά στοιχεία
              </p>

              <div className="premium-form-grid">
                <label>
                  <span>Συμμετοχές</span>
                  <input
                    type="number"
                    name="appearances"
                    min="0"
                    value={formData.appearances}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  <span>Βασικός</span>
                  <input
                    type="number"
                    name="starts"
                    min="0"
                    value={formData.starts}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  <span>Λεπτά συμμετοχής</span>
                  <input
                    type="number"
                    name="minutes"
                    min="0"
                    value={formData.minutes}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  <span>Γκολ</span>
                  <input
                    type="number"
                    name="goals"
                    min="0"
                    value={formData.goals}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  <span>Ασίστ</span>
                  <input
                    type="number"
                    name="assists"
                    min="0"
                    value={formData.assists}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  <span>Κίτρινες κάρτες</span>
                  <input
                    type="number"
                    name="yellowCards"
                    min="0"
                    value={formData.yellowCards}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  <span>Κόκκινες κάρτες</span>
                  <input
                    type="number"
                    name="redCards"
                    min="0"
                    value={formData.redCards}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  <span>Παρουσίες προπονήσεων</span>
                  <input
                    type="number"
                    name="attendance"
                    min="0"
                    value={formData.attendance}
                    onChange={handleInputChange}
                  />
                </label>
              </div>

              <p className="player-form-section-title">
                Σημειώσεις προπονητή
              </p>

              <label className="player-notes-field">
                <span>Παρατηρήσεις</span>
                <textarea
                  name="coachNotes"
                  rows="5"
                  value={formData.coachNotes}
                  onChange={handleInputChange}
                  placeholder="Κατέγραψε αγωνιστικές παρατηρήσεις, σημεία βελτίωσης ή οδηγίες..."
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
                  onClick={closeForm}
                >
                  Ακύρωση
                </button>

                <button
                  type="submit"
                  className="premium-primary-button"
                >
                  {editingPlayerId !== null
                    ? "Αποθήκευση αλλαγών"
                    : "Προσθήκη παίκτη"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Players;