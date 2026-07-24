import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import KeyPlayersScouting from "../components/opponents/KeyPlayersScouting";
import OpponentTabs from "../components/opponents/OpponentTabs";
import OpponentVideoSection from "../components/opponents/OpponentVideoSection";
import TacticalLineup from "../components/opponents/TacticalLineup";
import VideoUploadModal from "../components/opponents/VideoUploadModal";
import AiMatchPlanEditor from "../components/opponents/ai/AiMatchPlanEditor";

const fallbackOpponents = [
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
    buildUp:
      "Ξεκινά με τους δύο στόπερ ανοιχτά και τον αμυντικό μέσο χαμηλά. Προσπαθεί να δημιουργήσει αριθμητικό πλεονέκτημα στην πρώτη γραμμή ανάπτυξης.",
    pressing:
      "Εφαρμόζει επιθετική πίεση όταν η μπάλα μεταφέρεται στα πλάγια. Ο επιθετικός κλείνει την επιστροφή προς τον αντίθετο στόπερ.",
    defensiveShape:
      "Χωρίς την μπάλα οργανώνεται κυρίως σε 4-4-1-1, με μικρές αποστάσεις ανάμεσα στις γραμμές.",
    transition:
      "Μετά την ανάκτηση αναζητά άμεσα τον δεξιό εξτρέμ ή κάθετη πάσα προς τον επιθετικό.",
    setPieces:
      "Στα επιθετικά κόρνερ χρησιμοποιεί τέσσερις παίκτες στην περιοχή και έναν παίκτη στο δεύτερο δοκάρι.",
    aiSummary:
      "Η ομάδα πρέπει να επιδιώξει γρήγορες αλλαγές πλευράς, επιθέσεις στον χώρο πίσω από τα πλάγια μπακ και κάθετες μεταβιβάσεις ανάμεσα στις γραμμές.",
    videos: [],
    likelyLineup: [
      {
        id: 1,
        number: 1,
        name: "Μ. Αντωνίου",
        position: "Τερματοφύλακας",
        role: "GK",
        x: 50,
        y: 88,
      },
      {
        id: 2,
        number: 2,
        name: "Ν. Κρητικός",
        position: "Δεξί μπακ",
        role: "RB",
        x: 82,
        y: 69,
      },
      {
        id: 3,
        number: 4,
        name: "Γ. Παπαδάκης",
        position: "Στόπερ",
        role: "CB",
        x: 62,
        y: 73,
      },
      {
        id: 4,
        number: 5,
        name: "Α. Μαρκάκης",
        position: "Στόπερ",
        role: "CB",
        x: 38,
        y: 73,
      },
      {
        id: 5,
        number: 3,
        name: "Π. Βασιλείου",
        position: "Αριστερό μπακ",
        role: "LB",
        x: 18,
        y: 69,
      },
      {
        id: 6,
        number: 6,
        name: "Κ. Νικολάου",
        position: "Αμυντικός μέσος",
        role: "DM",
        x: 40,
        y: 51,
      },
      {
        id: 7,
        number: 8,
        name: "Σ. Μανωλάκης",
        position: "Κεντρικός μέσος",
        role: "CM",
        x: 60,
        y: 51,
      },
      {
        id: 8,
        number: 7,
        name: "Δ. Σταυράκης",
        position: "Δεξιός εξτρέμ",
        role: "RW",
        x: 82,
        y: 30,
      },
      {
        id: 9,
        number: 10,
        name: "Χ. Γεωργίου",
        position: "Επιτελικός μέσος",
        role: "AM",
        x: 50,
        y: 36,
      },
      {
        id: 10,
        number: 11,
        name: "Ε. Κουρουπάκης",
        position: "Αριστερός εξτρέμ",
        role: "LW",
        x: 18,
        y: 30,
      },
      {
        id: 11,
        number: 9,
        name: "Ι. Πετράκης",
        position: "Επιθετικός",
        role: "ST",
        x: 50,
        y: 15,
      },
    ],
    keyPlayers: [
      {
        id: 1,
        number: 10,
        name: "Χ. Γεωργίου",
        position: "Επιτελικός μέσος",
        threat: 88,
        description:
          "Ο κύριος δημιουργός της ομάδας. Κινείται ανάμεσα στις γραμμές και αναζητά κάθετες πάσες.",
      },
      {
        id: 2,
        number: 7,
        name: "Δ. Σταυράκης",
        position: "Δεξιός εξτρέμ",
        threat: 84,
        description:
          "Γρήγορος σε ανοιχτό χώρο και επικίνδυνος στις επιθετικές μεταβάσεις.",
      },
      {
        id: 3,
        number: 9,
        name: "Ι. Πετράκης",
        position: "Επιθετικός",
        threat: 79,
        description:
          "Ισχυρός με πλάτη στην εστία και καλός στις κινήσεις προς το πρώτο δοκάρι.",
      },
    ],
  },
];

function loadOpponents() {
  try {
    const savedOpponents = localStorage.getItem(
      "coachhub-opponents"
    );

    if (!savedOpponents) {
      return fallbackOpponents;
    }

    const parsedOpponents = JSON.parse(savedOpponents);

    if (!Array.isArray(parsedOpponents)) {
      return fallbackOpponents;
    }

    return parsedOpponents.map((opponent) => {
      const fallbackOpponent =
        fallbackOpponents.find(
          (item) =>
            String(item.id) ===
            String(opponent.id)
        );

      return {
        ...fallbackOpponent,
        ...opponent,
        strengths:
          opponent.strengths ||
          fallbackOpponent?.strengths ||
          [],
        weaknesses:
          opponent.weaknesses ||
          fallbackOpponent?.weaknesses ||
          [],
        likelyLineup:
          opponent.likelyLineup ||
          fallbackOpponent?.likelyLineup ||
          [],
        keyPlayers:
          opponent.keyPlayers ||
          fallbackOpponent?.keyPlayers ||
          [],
        videos:
          opponent.videos ||
          fallbackOpponent?.videos ||
          [],
      };
    });
  } catch (error) {
    console.error(
      "Αποτυχία φόρτωσης αντιπάλων:",
      error
    );

    return fallbackOpponents;
  }
}

function OpponentProfile() {
  const { opponentId } = useParams();

  const [activeTab, setActiveTab] =
    useState("overview");

  const [
    isVideoModalOpen,
    setIsVideoModalOpen,
  ] = useState(false);

  const [opponents, setOpponents] =
    useState(loadOpponents);

  const opponent = useMemo(
    () =>
      opponents.find(
        (currentOpponent) =>
          String(currentOpponent.id) ===
          String(opponentId)
      ),
    [opponents, opponentId]
  );

  const videos = useMemo(
    () =>
      Array.isArray(opponent?.videos)
        ? opponent.videos
        : [],
    [opponent]
  );

  function saveOpponents(updatedOpponents) {
    setOpponents(updatedOpponents);

    try {
      localStorage.setItem(
        "coachhub-opponents",
        JSON.stringify(updatedOpponents)
      );
    } catch (error) {
      console.error(
        "Αποτυχία αποθήκευσης αντιπάλων:",
        error
      );
    }
  }

  function addOpponentVideo(newVideo) {
    if (!opponent) {
      return;
    }

    const updatedVideos = [
      newVideo,
      ...videos,
    ];

    const updatedOpponents = opponents.map(
      (currentOpponent) =>
        String(currentOpponent.id) ===
        String(opponent.id)
          ? {
              ...currentOpponent,
              videos: updatedVideos,
            }
          : currentOpponent
    );

    saveOpponents(updatedOpponents);
    setIsVideoModalOpen(false);
  }

  function deleteOpponentVideo(videoId) {
    const videoToDelete = videos.find(
      (video) => video.id === videoId
    );

    if (!videoToDelete || !opponent) {
      return;
    }

    const shouldDelete = window.confirm(
      `Θέλεις να διαγράψεις το βίντεο «${videoToDelete.title}»;`
    );

    if (!shouldDelete) {
      return;
    }

    const updatedVideos = videos.filter(
      (video) => video.id !== videoId
    );

    const updatedOpponents = opponents.map(
      (currentOpponent) =>
        String(currentOpponent.id) ===
        String(opponent.id)
          ? {
              ...currentOpponent,
              videos: updatedVideos,
            }
          : currentOpponent
    );

    saveOpponents(updatedOpponents);
  }

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
      month: "long",
      year: "numeric",
    }).format(parsedDate);
  }

  if (!opponent) {
    return (
      <div className="opponent-profile-page">
        <section className="opponent-profile-not-found">
          <p className="section-eyebrow dark">
            OPPONENT PROFILE
          </p>

          <h1>Ο αντίπαλος δεν βρέθηκε.</h1>

          <p>
            Η συγκεκριμένη ανάλυση μπορεί να έχει
            διαγραφεί ή να μην έχει αποθηκευτεί
            σωστά.
          </p>

          <Link
            to="/opponents"
            className="opponent-profile-back-link"
          >
            ← Επιστροφή στους αντιπάλους
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="opponent-profile-page">
      <section className="opponent-profile-hero compact">
        <div className="opponent-profile-topbar">
          <Link
            to="/opponents"
            className="opponent-profile-back-link light"
          >
            ← Επιστροφή στους αντιπάλους
          </Link>

          <span>
            OPPONENT INTELLIGENCE / MATCH ANALYSIS
          </span>
        </div>

        <div className="opponent-profile-heading">
          <div className="opponent-profile-logo">
            {opponent.shortName}
          </div>

          <div className="opponent-profile-identity">
            <div className="opponent-profile-meta">
              <span
                className={`opponent-analysis-status ${
                  opponent.analysisStatus ===
                  "Ολοκληρωμένη"
                    ? "completed"
                    : "progress"
                }`}
              >
                {opponent.analysisStatus}
              </span>

              <span>{opponent.formation}</span>

              <span>{opponent.venue}</span>
            </div>

            <h1>{opponent.name}</h1>

            <p>
              Επόμενος αγώνας:{" "}
              {formatDate(opponent.nextMatchDate)}
            </p>
          </div>

          <div className="opponent-profile-score">
            <span>THREAT LEVEL</span>

            <strong>
              {opponent.strengthLevel}%
            </strong>
          </div>
        </div>
      </section>

      <OpponentTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        videoCount={videos.length}
      />

      <section className="opponent-profile-content refined">
        {activeTab === "overview" && (
          <div className="opponent-overview-layout">
            <main className="opponent-profile-main">
              <section className="opponent-profile-section">
                <header className="opponent-section-header">
                  <div>
                    <p className="section-eyebrow dark">
                      MATCH OVERVIEW
                    </p>

                    <h2>Συνολική εικόνα</h2>
                  </div>
                </header>

                <div className="opponent-overview-cards">
                  <article>
                    <span>ΣΧΗΜΑΤΙΣΜΟΣ</span>

                    <strong>
                      {opponent.formation}
                    </strong>

                    <p>Πιθανή αρχική διάταξη</p>
                  </article>

                  <article>
                    <span>ΑΓΩΝΑΣ</span>

                    <strong>
                      {formatDate(
                        opponent.nextMatchDate
                      )}
                    </strong>

                    <p>{opponent.venue}</p>
                  </article>

                  <article>
                    <span>ΑΠΕΙΛΗ</span>

                    <strong>
                      {opponent.strengthLevel}%
                    </strong>

                    <p>Εκτιμώμενη δυναμικότητα</p>
                  </article>
                </div>
              </section>

              <section className="opponent-profile-section">
                <header className="opponent-section-header">
                  <div>
                    <p className="section-eyebrow dark">
                      QUICK INTELLIGENCE
                    </p>

                    <h2>Βασικά συμπεράσματα</h2>
                  </div>
                </header>

                <div className="opponent-quick-analysis">
                  <article className="positive">
                    <span>ΔΥΝΑΤΑ ΣΗΜΕΙΑ</span>

                    <ul>
                      {(opponent.strengths || []).map(
                        (strength) => (
                          <li key={strength}>
                            {strength}
                          </li>
                        )
                      )}
                    </ul>
                  </article>

                  <article className="negative">
                    <span>ΑΔΥΝΑΤΑ ΣΗΜΕΙΑ</span>

                    <ul>
                      {(opponent.weaknesses || []).map(
                        (weakness) => (
                          <li key={weakness}>
                            {weakness}
                          </li>
                        )
                      )}
                    </ul>
                  </article>
                </div>
              </section>
            </main>

            <aside className="opponent-profile-sidebar">
              <section className="opponent-side-card opponent-ai-card">
                <p className="section-eyebrow">
                  COACHHUB AI
                </p>

                <h2>AI Match Summary</h2>

                <p>{opponent.aiSummary}</p>

                <button type="button" disabled>
                  ✦ Δημιουργία πλάνου — Σύντομα
                </button>
              </section>
            </aside>
          </div>
        )}

        {activeTab === "lineup" && (
          <TacticalLineup
            players={
              opponent.likelyLineup || []
            }
            formation={opponent.formation}
          />
        )}

        {activeTab === "tactics" && (
          <section className="opponent-profile-section">
            <header className="opponent-section-header">
              <div>
                <p className="section-eyebrow dark">
                  TEAM ANALYSIS
                </p>

                <h2>Αγωνιστική συμπεριφορά</h2>
              </div>
            </header>

            <div className="opponent-behaviour-grid">
              <article>
                <span>BUILD UP</span>

                <h3>Ανάπτυξη παιχνιδιού</h3>

                <p>{opponent.buildUp}</p>
              </article>

              <article>
                <span>PRESSING</span>

                <h3>Τρόπος πίεσης</h3>

                <p>{opponent.pressing}</p>
              </article>

              <article>
                <span>DEFENSIVE SHAPE</span>

                <h3>Αμυντική οργάνωση</h3>

                <p>{opponent.defensiveShape}</p>
              </article>

              <article>
                <span>TRANSITION</span>

                <h3>Μεταβάσεις</h3>

                <p>{opponent.transition}</p>
              </article>

              <article>
                <span>SET PIECES</span>

                <h3>Στατικές φάσεις</h3>

                <p>{opponent.setPieces}</p>
              </article>
            </div>
          </section>
        )}

        {activeTab === "players" && (
          <KeyPlayersScouting
            players={
              opponent.keyPlayers || []
            }
          />
        )}

        {activeTab === "videos" && (
          <OpponentVideoSection
            videos={videos}
            onAddVideo={() =>
              setIsVideoModalOpen(true)
            }
            onDeleteVideo={
              deleteOpponentVideo
            }
          />
        )}

        {activeTab === "ai" && (
  <AiMatchPlanEditor
    opponentId={opponent.id}
    opponentName={opponent.name}
  />
)}
      </section>

      {isVideoModalOpen && (
        <VideoUploadModal
          onClose={() =>
            setIsVideoModalOpen(false)
          }
          onSave={addOpponentVideo}
        />
      )}
    </div>
  );
}

export default OpponentProfile;