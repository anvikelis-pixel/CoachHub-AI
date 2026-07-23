import { useEffect, useRef, useState } from "react";

const emptyVideoForm = {
  title: "",
  category: "Πλήρης αγώνας",
  sourceType: "link",
  videoUrl: "",
  description: "",
  matchDate: "",
  duration: "",
  tags: "",
};

const MAXIMUM_FILE_SIZE = 500 * 1024 * 1024;

function VideoUploadModal({ onClose, onSave }) {
  const [formData, setFormData] =
    useState(emptyVideoForm);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [previewUrl, setPreviewUrl] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const titleInputRef = useRef(null);

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";
    titleInputRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose]);

  useEffect(() => {
    return () => {
      if (
        previewUrl &&
        previewUrl.startsWith("blob:")
      ) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function clearPreview() {
    if (
      previewUrl &&
      previewUrl.startsWith("blob:")
    ) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl("");
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrorMessage("");
  }

  function handleSourceChange(sourceType) {
    clearPreview();

    setFormData((currentData) => ({
      ...currentData,
      sourceType,
      videoUrl: "",
    }));

    setErrorMessage("");
  }

  function validateAndSelectFile(file) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("video/")) {
      setErrorMessage(
        "Επίλεξε έγκυρο αρχείο βίντεο."
      );
      return;
    }

    if (file.size > MAXIMUM_FILE_SIZE) {
      setErrorMessage(
        "Το βίντεο δεν πρέπει να ξεπερνά τα 500 MB."
      );
      return;
    }

    clearPreview();

    const newPreviewUrl =
      URL.createObjectURL(file);

    setSelectedFile(file);
    setPreviewUrl(newPreviewUrl);
    setErrorMessage("");
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    validateAndSelectFile(file);

    event.target.value = "";
  }

  function handleDrop(event) {
    event.preventDefault();

    const file =
      event.dataTransfer.files?.[0];

    validateAndSelectFile(file);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const title = String(
      formData.title || ""
    ).trim();

    const description = String(
      formData.description || ""
    ).trim();

    const videoUrl = String(
      formData.videoUrl || ""
    ).trim();

    const duration = Number(
      formData.duration || 0
    );

    if (!title) {
      setErrorMessage(
        "Γράψε έναν τίτλο για το βίντεο."
      );
      return;
    }

    if (
      formData.sourceType === "link" &&
      !videoUrl
    ) {
      setErrorMessage(
        "Πρόσθεσε έναν σύνδεσμο YouTube ή Vimeo."
      );
      return;
    }

    if (
      formData.sourceType === "file" &&
      !selectedFile
    ) {
      setErrorMessage(
        "Επίλεξε ένα αρχείο βίντεο."
      );
      return;
    }

    if (
      duration < 0 ||
      duration > 300
    ) {
      setErrorMessage(
        "Η διάρκεια πρέπει να είναι από 0 έως 300 λεπτά."
      );
      return;
    }

    const tags = String(
      formData.tags || ""
    )
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const newVideo = {
      id: Date.now(),
      title,
      category: formData.category,
      sourceType: formData.sourceType,

      videoUrl:
        formData.sourceType === "link"
          ? videoUrl
          : previewUrl,

      fileName:
        formData.sourceType === "file"
          ? selectedFile.name
          : "",

      fileSize:
        formData.sourceType === "file"
          ? selectedFile.size
          : 0,

      mimeType:
        formData.sourceType === "file"
          ? selectedFile.type
          : "",

      description,
      matchDate: formData.matchDate,
      duration,
      tags,
      notes: [],
      createdAt: new Date().toISOString(),
    };

    onSave(newVideo);
  }

  return (
    <div
      className="video-upload-backdrop"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <section
        className="video-upload-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-upload-title"
      >
        <div className="video-upload-accent" />

        <header className="video-upload-header">
          <div>
            <p className="video-upload-eyebrow">
              VIDEO INTELLIGENCE
            </p>

            <h2 id="video-upload-title">
              Νέα ανάλυση βίντεο
            </h2>

            <p>
              Πρόσθεσε αγωνιστικό υλικό και
              οργάνωσέ το για scouting και
              τακτική ανάλυση.
            </p>
          </div>

          <button
            type="button"
            className="video-upload-close"
            onClick={onClose}
            aria-label="Κλείσιμο φόρμας"
          >
            ×
          </button>
        </header>

        <form
          className="video-upload-form"
          onSubmit={handleSubmit}
        >
          <section className="video-upload-form-section">
            <div className="video-upload-section-title">
              <span>01</span>

              <div>
                <h3>Στοιχεία βίντεο</h3>

                <p>
                  Βασικές πληροφορίες για το
                  αγωνιστικό υλικό.
                </p>
              </div>
            </div>

            <div className="video-upload-grid">
              <label>
                <span>Τίτλος βίντεο *</span>

                <input
                  ref={titleInputRef}
                  type="text"
                  name="title"
                  placeholder="π.χ. High Pressing — 1ο ημίχρονο"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                <span>Κατηγορία</span>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="Πλήρης αγώνας">
                    Πλήρης αγώνας
                  </option>

                  <option value="Pressing">
                    Pressing
                  </option>

                  <option value="Build Up">
                    Build Up
                  </option>

                  <option value="Μεταβάσεις">
                    Μεταβάσεις
                  </option>

                  <option value="Αμυντική οργάνωση">
                    Αμυντική οργάνωση
                  </option>

                  <option value="Στατικές φάσεις">
                    Στατικές φάσεις
                  </option>

                  <option value="Παίκτης-κλειδί">
                    Παίκτης-κλειδί
                  </option>

                  <option value="Άλλο">
                    Άλλο
                  </option>
                </select>
              </label>

              <label>
                <span>Ημερομηνία αγώνα</span>

                <input
                  type="date"
                  name="matchDate"
                  value={formData.matchDate}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                <span>Διάρκεια σε λεπτά</span>

                <input
                  type="number"
                  name="duration"
                  min="0"
                  max="300"
                  placeholder="90"
                  value={formData.duration}
                  onChange={handleInputChange}
                />
              </label>
            </div>
          </section>

          <section className="video-upload-form-section">
            <div className="video-upload-section-title">
              <span>02</span>

              <div>
                <h3>Πηγή βίντεο</h3>

                <p>
                  Σύνδεσμος πλατφόρμας ή τοπικό
                  αρχείο.
                </p>
              </div>
            </div>

            <div className="video-source-switch">
              <button
                type="button"
                className={
                  formData.sourceType === "link"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  handleSourceChange("link")
                }
              >
                <strong>🔗</strong>

                <span>
                  YouTube / Vimeo
                  <small>
                    Προσθήκη εξωτερικού συνδέσμου
                  </small>
                </span>
              </button>

              <button
                type="button"
                className={
                  formData.sourceType === "file"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  handleSourceChange("file")
                }
              >
                <strong>⬆</strong>

                <span>
                  Upload αρχείου
                  <small>
                    MP4, MOV ή WEBM
                  </small>
                </span>
              </button>
            </div>

            {formData.sourceType === "link" ? (
              <label className="video-link-field">
                <span>Σύνδεσμος βίντεο *</span>

                <input
                  type="url"
                  name="videoUrl"
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                />
              </label>
            ) : (
              <div
                className={`video-drop-zone ${
                  selectedFile
                    ? "has-file"
                    : ""
                }`}
                onDragOver={(event) =>
                  event.preventDefault()
                }
                onDrop={handleDrop}
              >
                <input
                  id="opponent-video-file"
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/*"
                  onChange={handleFileChange}
                />

                {!selectedFile ? (
                  <label htmlFor="opponent-video-file">
                    <span className="video-drop-icon">
                      ⬆
                    </span>

                    <strong>
                      Σύρε το βίντεο εδώ
                    </strong>

                    <p>
                      ή πάτησε για επιλογή αρχείου
                    </p>

                    <small>
                      MP4, MOV, WEBM — έως 500 MB
                    </small>
                  </label>
                ) : (
                  <div className="selected-video-file">
                    <div className="selected-video-file-icon">
                      ▶
                    </div>

                    <div>
                      <strong>
                        {selectedFile.name}
                      </strong>

                      <span>
                        {(
                          selectedFile.size /
                          1024 /
                          1024
                        ).toFixed(1)}{" "}
                        MB
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={clearPreview}
                    >
                      Αφαίρεση
                    </button>
                  </div>
                )}
              </div>
            )}

            {previewUrl &&
              formData.sourceType === "file" && (
                <div className="video-preview-box">
                  <div>
                    <span>VIDEO PREVIEW</span>
                    <small>
                      Έλεγξε το αρχείο πριν την
                      αποθήκευση.
                    </small>
                  </div>

                  <video
                    src={previewUrl}
                    controls
                    preload="metadata"
                  />
                </div>
              )}
          </section>

          <section className="video-upload-form-section">
            <div className="video-upload-section-title">
              <span>03</span>

              <div>
                <h3>Scouting πληροφορίες</h3>

                <p>
                  Περιγραφή και tags για γρήγορη
                  αναζήτηση.
                </p>
              </div>
            </div>

            <label className="video-description-field">
              <span>Περιγραφή</span>

              <textarea
                name="description"
                rows="4"
                placeholder="Γράψε τι περιλαμβάνει το βίντεο και τι πρέπει να προσέξει το staff..."
                value={formData.description}
                onChange={handleInputChange}
              />
            </label>

            <label className="video-tags-field">
              <span>Tags</span>

              <input
                type="text"
                name="tags"
                placeholder="pressing, transition, set pieces"
                value={formData.tags}
                onChange={handleInputChange}
              />

              <small>
                Χώρισε τα tags με κόμμα.
              </small>
            </label>
          </section>

          {errorMessage && (
            <p className="video-upload-error">
              <strong>!</strong>
              {errorMessage}
            </p>
          )}

          <footer className="video-upload-actions">
            <button
              type="button"
              className="video-upload-cancel"
              onClick={onClose}
            >
              Ακύρωση
            </button>

            <button
              type="submit"
              className="video-upload-submit"
            >
              <span>✓</span>
              Αποθήκευση βίντεο
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default VideoUploadModal;