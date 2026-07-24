import { useMemo, useState } from "react";

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

function AiMatchPlanEditor() {
  const [plan, setPlan] = useState(initialPlan);
  const [editingSection, setEditingSection] =
    useState(null);

  const [activeView, setActiveView] =
    useState("coach");

  const [coachNotes, setCoachNotes] =
    useState("");

  const [status, setStatus] =
    useState("Draft");

  const modifiedSections = useMemo(
    () =>
      Object.entries(plan).filter(
        ([, section]) =>
          section.aiValue !==
          section.coachValue
      ).length,
    [plan]
  );

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
  }

  function saveDraft() {
    const draftData = {
      plan,
      coachNotes,
      status: "Draft",
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "coachhub-ai-match-plan",
      JSON.stringify(draftData)
    );

    setStatus("Draft saved");
  }

  function publishPlan() {
    const publishedData = {
      plan,
      coachNotes,
      status: "Published",
      publishedAt:
        new Date().toISOString(),
    };

    localStorage.setItem(
      "coachhub-ai-match-plan",
      JSON.stringify(publishedData)
    );

    setStatus("Published");
  }

  return (
    <section className="ai-match-plan-editor">
      <header className="ai-match-plan-header">
        <div>
          <p>COACHHUB AI / MATCH PLAN</p>

          <h2>AI Match Plan</h2>

          <span>
            Το AI προτείνει. Ο προπονητής
            αποφασίζει και προσαρμόζει.
          </span>
        </div>

        <div className="ai-plan-status">
          <span>STATUS</span>
          <strong>{status}</strong>
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

        <div className="ai-plan-modified-count">
          <span>CHANGES</span>

          <strong>
            {modifiedSections}
          </strong>
        </div>
      </div>

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

                      <p>
                        {section.aiValue}
                      </p>
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
          onChange={(event) =>
            setCoachNotes(event.target.value)
          }
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