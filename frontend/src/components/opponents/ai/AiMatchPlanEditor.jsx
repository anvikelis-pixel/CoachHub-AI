import {
  useEffect,
  useMemo,
  useState,
} from "react";

const initialPlan = {
  formation: {
    title: "Σχηματισμός",
    aiValue: "4-2-3-1",
    coachValue: "4-2-3-1",
    confidence: 94,
    reason:
      "Ο σχηματισμός προσφέρει ισορροπία στον άξονα και επιτρέπει επιθέσεις στους χώρους πίσω από τα πλάγια μπακ.",
  },

  pressing: {
    title: "Pressing",
    aiValue:
      "Υψηλή πίεση όταν η μπάλα μεταφέρεται προς τον αριστερό στόπερ.",
    coachValue:
      "Υψηλή πίεση όταν η μπάλα μεταφέρεται προς τον αριστερό στόπερ.",
    confidence: 87,
    reason:
      "Ο αντίπαλος δυσκολεύεται όταν πιέζεται στην πρώτη φάση ανάπτυξης και κάνει συχνά λάθη στην αριστερή πλευρά.",
  },

  buildUp: {
    title: "Build Up",
    aiValue:
      "Ανάπτυξη 3-2 με τον αμυντικό μέσο χαμηλά ανάμεσα στους στόπερ.",
    coachValue:
      "Ανάπτυξη 3-2 με τον αμυντικό μέσο χαμηλά ανάμεσα στους στόπερ.",
    confidence: 91,
    reason:
      "Η διάταξη δημιουργεί αριθμητικό πλεονέκτημα απέναντι στην πρώτη γραμμή πίεσης του αντιπάλου.",
  },

  transition: {
    title: "Μεταβάσεις",
    aiValue:
      "Άμεση αλλαγή πλευράς μετά την ανάκτηση και επίθεση στον χώρο πίσω από το δεξί μπακ.",
    coachValue:
      "Άμεση αλλαγή πλευράς μετά την ανάκτηση και επίθεση στον χώρο πίσω από το δεξί μπακ.",
    confidence: 89,
    reason:
      "Ο αντίπαλος αφήνει μεγάλο χώρο στην αδύνατη πλευρά όταν χάνει την κατοχή.",
  },

  defensiveBlock: {
    title: "Αμυντικό Block",
    aiValue:
      "Μεσαίο block σε 4-4-1-1 με μικρές αποστάσεις μεταξύ των γραμμών.",
    coachValue:
      "Μεσαίο block σε 4-4-1-1 με μικρές αποστάσεις μεταξύ των γραμμών.",
    confidence: 83,
    reason:
      "Το μεσαίο block περιορίζει τις κάθετες μεταβιβάσεις και μειώνει τον χώρο του αντίπαλου δεκαριού.",
  },

  setPieces: {
    title: "Στατικές φάσεις",
    aiValue:
      "Στόχευση στο δεύτερο δοκάρι και επιθετική παρουσία με τέσσερις παίκτες στην περιοχή.",
    coachValue:
      "Στόχευση στο δεύτερο δοκάρι και επιθετική παρουσία με τέσσερις παίκτες στην περιοχή.",
    confidence: 81,
    reason:
      "Ο αντίπαλος εμφανίζει αδυναμία στην κάλυψη του δεύτερου δοκαριού.",
  },
};

function createInitialState() {
  return {
    plan: initialPlan,
    coachNotes: "",
    status: "Draft",
    savedAt: "",
    publishedAt: "",
  };
}

function AiMatchPlanEditor({
  opponentId,
  opponentName = "Αντίπαλος",
}) {
  const storageKey = useMemo(
    () =>
      `coachhub-ai-match-plan-${opponentId}`,
    [opponentId]
  );

  const [plan, setPlan] =
    useState(initialPlan);

  const [editingSection, setEditingSection] =
    useState(null);

  const [activeView, setActiveView] =
    useState("coach");

  const [coachNotes, setCoachNotes] =
    useState("");

  const [status, setStatus] =
    useState("Draft");

  const [savedAt, setSavedAt] =
    useState("");

  const [feedbackMessage, setFeedbackMessage] =
    useState("");

  useEffect(() => {
    const emptyState = createInitialState();

    try {
      const savedPlan =
        localStorage.getItem(storageKey);

      if (!savedPlan) {
        setPlan(emptyState.plan);
        setCoachNotes(emptyState.coachNotes);
        setStatus(emptyState.status);
        setSavedAt(emptyState.savedAt);
        setEditingSection(null);
        setFeedbackMessage("");
        return;
      }

      const parsedPlan = JSON.parse(savedPlan);

      setPlan(
        parsedPlan.plan &&
          typeof parsedPlan.plan === "object"
          ? parsedPlan.plan
          : emptyState.plan
      );

      setCoachNotes(
        typeof parsedPlan.coachNotes === "string"
          ? parsedPlan.coachNotes
          : ""
      );

      setStatus(
        parsedPlan.status || "Draft"
      );

      setSavedAt(
        parsedPlan.publishedAt ||
          parsedPlan.savedAt ||
          ""
      );

      setEditingSection(null);
      setFeedbackMessage(
        "Το αποθηκευμένο πλάνο φορτώθηκε."
      );
    } catch (error) {
      console.error(
        "Αποτυχία φόρτωσης AI Match Plan:",
        error
      );

      setPlan(emptyState.plan);
      setCoachNotes("");
      setStatus("Draft");
      setSavedAt("");
      setFeedbackMessage(
        "Δεν ήταν δυνατή η φόρτωση του πλάνου."
      );
    }
  }, [storageKey]);

  const modifiedSections = useMemo(
    () =>
      Object.values(plan).filter(
        (section) =>
          section.aiValue !==
          section.coachValue
      ).length,
    [plan]
  );

  const averageConfidence = useMemo(() => {
    const sections = Object.values(plan);

    if (!sections.length) {
      return 0;
    }

    const totalConfidence = sections.reduce(
      (total, section) =>
        total +
        Number(section.confidence || 0),
      0
    );

    return Math.round(
      totalConfidence / sections.length
    );
  }, [plan]);

  function formatSavedDate(date) {
    if (!date) {
      return "Δεν έχει αποθηκευτεί";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Άγνωστη ημερομηνία";
    }

    return new Intl.DateTimeFormat("el-GR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsedDate);
  }

  function updateCoachValue(
    sectionKey,
    value
  ) {
    setPlan((currentPlan) => ({
      ...currentPlan,
      [sectionKey]: {
        ...currentPlan[sectionKey],
        coachValue: value,
      },
    }));

    setStatus("Unsaved changes");
    setFeedbackMessage("");
  }

  function resetSection(sectionKey) {
    setPlan((currentPlan) => ({
      ...currentPlan,
      [sectionKey]: {
        ...currentPlan[sectionKey],
        coachValue:
          currentPlan[sectionKey].aiValue,
      },
    }));

    setEditingSection(null);
    setStatus("Unsaved changes");
    setFeedbackMessage(
      "Η ενότητα επανήλθε στην πρόταση AI."
    );
  }

  function updatePlanIndex(planStatus, date) {
    try {
      const indexKey =
        "coachhub-ai-match-plans-index";

      const savedIndex =
        localStorage.getItem(indexKey);

      const parsedIndex = savedIndex
        ? JSON.parse(savedIndex)
        : {};

      const safeIndex =
        parsedIndex &&
        typeof parsedIndex === "object" &&
        !Array.isArray(parsedIndex)
          ? parsedIndex
          : {};

      const updatedIndex = {
        ...safeIndex,
        [String(opponentId)]: {
          opponentId,
          opponentName,
          status: planStatus,
          updatedAt: date,
        },
      };

      localStorage.setItem(
        indexKey,
        JSON.stringify(updatedIndex)
      );
    } catch (error) {
      console.error(
        "Αποτυχία ενημέρωσης AI Plan index:",
        error
      );
    }
  }

  function saveDraft() {
    const currentDate =
      new Date().toISOString();

    const draftData = {
      opponentId,
      opponentName,
      plan,
      coachNotes,
      status: "Draft",
      savedAt: currentDate,
      publishedAt: "",
    };

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(draftData)
      );

      updatePlanIndex(
        "Draft",
        currentDate
      );

      setStatus("Draft saved");
      setSavedAt(currentDate);
      setFeedbackMessage(
        `Το draft για τον αντίπαλο «${opponentName}» αποθηκεύτηκε.`
      );
    } catch (error) {
      console.error(
        "Αποτυχία αποθήκευσης draft:",
        error
      );

      setFeedbackMessage(
        "Δεν ήταν δυνατή η αποθήκευση του draft."
      );
    }
  }

  function publishPlan() {
    const currentDate =
      new Date().toISOString();

    const publishedData = {
      opponentId,
      opponentName,
      plan,
      coachNotes,
      status: "Published",
      savedAt: currentDate,
      publishedAt: currentDate,
    };

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(publishedData)
      );

      updatePlanIndex(
        "Published",
        currentDate
      );

      setStatus("Published");
      setSavedAt(currentDate);
      setFeedbackMessage(
        `Το πλάνο για τον αντίπαλο «${opponentName}» δημοσιεύτηκε.`
      );
    } catch (error) {
      console.error(
        "Αποτυχία δημοσίευσης πλάνου:",
        error
      );

      setFeedbackMessage(
        "Δεν ήταν δυνατή η δημοσίευση του πλάνου."
      );
    }
  }

  function resetEntirePlan() {
    const shouldReset = window.confirm(
      "Θέλεις να επαναφέρεις ολόκληρο το πλάνο στην αρχική πρόταση AI;"
    );

    if (!shouldReset) {
      return;
    }

    setPlan(initialPlan);
    setCoachNotes("");
    setEditingSection(null);
    setStatus("Unsaved changes");
    setFeedbackMessage(
      "Το πλάνο επανήλθε στην αρχική πρόταση AI."
    );
  }

  return (
    <section className="ai-match-plan-editor">
      <header className="ai-match-plan-header">
        <div>
          <p>
            COACHHUB AI / MATCH PLAN
          </p>

          <h2>AI Match Plan</h2>

          <span>
            Αντίπαλος:{" "}
            <strong>{opponentName}</strong>
          </span>
        </div>

        <div className="ai-plan-status">
          <span>STATUS</span>

          <strong>{status}</strong>

          <small className="ai-plan-last-saved">
            {formatSavedDate(savedAt)}
          </small>
        </div>
      </header>

      <div className="ai-plan-toolbar">
        <div className="ai-plan-view-switch">
          <button
            type="button"
            className={
              activeView === "coach"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveView("coach")
            }
          >
            Coach Version
          </button>

          <button
            type="button"
            className={
              activeView === "compare"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveView("compare")
            }
          >
            AI vs Coach
          </button>
        </div>

        <div className="ai-plan-toolbar-metrics">
          <div>
            <span>AI SCORE</span>
            <strong>
              {averageConfidence}%
            </strong>
          </div>

          <div className="ai-plan-modified-count">
            <span>CHANGES</span>
            <strong>
              {modifiedSections}
            </strong>
          </div>
        </div>
      </div>

      {feedbackMessage && (
        <div className="ai-plan-feedback">
          {feedbackMessage}
        </div>
      )}

      <div className="ai-plan-sections">
        {Object.entries(plan).map(
          ([sectionKey, section]) => {
            const isEditing =
              editingSection === sectionKey;

            const isModified =
              section.aiValue !==
              section.coachValue;

            return (
              <article
                className={`ai-plan-section ${
                  isModified
                    ? "modified"
                    : "approved"
                }`}
                key={sectionKey}
              >
                <header>
                  <div>
                    <span>
                      {section.title}
                    </span>

                    <h3>
                      {activeView === "coach"
                        ? section.coachValue
                        : section.aiValue}
                    </h3>
                  </div>

                  <div className="ai-confidence">
                    <span>
                      AI CONFIDENCE
                    </span>

                    <strong>
                      {section.confidence}%
                    </strong>
                  </div>
                </header>

                <div className="ai-plan-reason">
                  <span>ΓΙΑΤΙ;</span>
                  <p>{section.reason}</p>
                </div>

                {activeView === "compare" && (
                  <div className="ai-plan-comparison">
                    <section>
                      <span>AI VERSION</span>
                      <p>{section.aiValue}</p>
                    </section>

                    <section>
                      <span>COACH VERSION</span>
                      <p>
                        {section.coachValue}
                      </p>
                    </section>
                  </div>
                )}

                {isEditing && (
                  <div className="ai-plan-edit-box">
                    <label>
                      <span>
                        Τελική επιλογή προπονητή
                      </span>

                      <textarea
                        rows="4"
                        value={
                          section.coachValue
                        }
                        onChange={(event) =>
                          updateCoachValue(
                            sectionKey,
                            event.target.value
                          )
                        }
                      />
                    </label>
                  </div>
                )}

                <footer>
                  <div>
                    <span
                      className={
                        isModified
                          ? "section-status modified"
                          : "section-status approved"
                      }
                    >
                      {isModified
                        ? "Τροποποιήθηκε από τον προπονητή"
                        : "AI πρόταση εγκεκριμένη"}
                    </span>
                  </div>

                  <div className="ai-plan-section-actions">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingSection(
                              null
                            )
                          }
                        >
                          Ολοκλήρωση
                        </button>

                        <button
                          type="button"
                          className="reset"
                          onClick={() =>
                            resetSection(
                              sectionKey
                            )
                          }
                        >
                          Επαναφορά AI
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setEditingSection(
                            sectionKey
                          )
                        }
                      >
                        ✎ Επεξεργασία
                      </button>
                    )}
                  </div>
                </footer>
              </article>
            );
          }
        )}
      </div>

      <section className="ai-plan-coach-notes">
        <div>
          <p>COACH NOTES</p>

          <h3>
            Παρατηρήσεις προπονητή
          </h3>
        </div>

        <textarea
          rows="6"
          placeholder="Πρόσθεσε τις τελικές οδηγίες, παρατηρήσεις ή αλλαγές σου..."
          value={coachNotes}
          onChange={(event) => {
            setCoachNotes(
              event.target.value
            );

            setStatus(
              "Unsaved changes"
            );

            setFeedbackMessage("");
          }}
        />
      </section>

      <footer className="ai-plan-main-actions">
        <button
          type="button"
          className="ai-plan-save"
          onClick={saveDraft}
        >
          💾 Αποθήκευση draft
        </button>

        <button
          type="button"
          className="ai-plan-publish"
          onClick={publishPlan}
        >
          📤 Δημοσίευση πλάνου
        </button>

        <button
          type="button"
          className="ai-plan-reset-all"
          onClick={resetEntirePlan}
        >
          ↺ Επαναφορά AI
        </button>

        <button
          type="button"
          className="ai-plan-regenerate"
          disabled
        >
          ✦ Regenerate AI — Σύντομα
        </button>
      </footer>
    </section>
  );
}

export default AiMatchPlanEditor;