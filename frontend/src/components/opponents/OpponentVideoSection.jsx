function OpponentVideoSection({
  videos,
  onAddVideo,
  onDeleteVideo,
}) {
  function formatDate(date) {
    if (!date) {
      return "Χωρίς ημερομηνία";
    }

    const parsedDate = new Date(`${date}T12:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Μη έγκυρη ημερομηνία";
    }

    return new Intl.DateTimeFormat("el-GR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(parsedDate);
  }

  function getPlatform(videoUrl) {
    const normalizedUrl = String(
      videoUrl || ""
    ).toLowerCase();

    if (
      normalizedUrl.includes("youtube.com") ||
      normalizedUrl.includes("youtu.be")
    ) {
      return "YouTube";
    }

    if (normalizedUrl.includes("vimeo.com")) {
      return "Vimeo";
    }

    return "External Link";
  }

  return (
    <section className="opponent-profile-section opponent-video-library">
      <header className="opponent-section-header">
        <div>
          <p className="section-eyebrow dark">
            VIDEO INTELLIGENCE
          </p>

          <h2>Βίντεο αντιπάλου</h2>

          <p>
            Οργάνωσε αγώνες, αποσπάσματα και
            τακτικές παρατηρήσεις.
          </p>
        </div>

        <button
          type="button"
          className="premium-primary-button"
          onClick={onAddVideo}
        >
          + Προσθήκη βίντεο
        </button>
      </header>

      {videos.length > 0 ? (
        <div className="opponent-video-grid">
          {videos.map((video) => (
            <article
              className="opponent-video-card"
              key={video.id}
            >
              <div className="opponent-video-preview">
                {video.sourceType === "file" &&
                video.videoUrl ? (
                  <video
                    src={video.videoUrl}
                    controls
                    preload="metadata"
                  />
                ) : (
                  <div className="opponent-video-link-preview">
                    <span>▶</span>

                    <strong>
                      {getPlatform(video.videoUrl)}
                    </strong>

                    <p>External video source</p>
                  </div>
                )}

                <span className="opponent-video-category">
                  {video.category}
                </span>

                {video.duration > 0 && (
                  <span className="opponent-video-duration">
                    {video.duration}'
                  </span>
                )}
              </div>

              <div className="opponent-video-content">
                <div className="opponent-video-heading">
                  <div>
                    <span>
                      {formatDate(video.matchDate)}
                    </span>

                    <h3>{video.title}</h3>
                  </div>

                  <button
                    type="button"
                    className="opponent-video-delete"
                    onClick={() =>
                      onDeleteVideo(video.id)
                    }
                    aria-label={`Διαγραφή ${video.title}`}
                  >
                    ×
                  </button>
                </div>

                {video.description && (
                  <p className="opponent-video-description">
                    {video.description}
                  </p>
                )}

                <div className="opponent-video-tags">
                  {(video.tags || []).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <div className="opponent-video-meta">
                  <span>
                    📝 {video.notes?.length || 0} σημειώσεις
                  </span>

                  <span>
                    {video.sourceType === "file"
                      ? "⬆ Τοπικό αρχείο"
                      : `🔗 ${getPlatform(
                          video.videoUrl
                        )}`}
                  </span>
                </div>

                <div className="opponent-video-actions">
                  {video.sourceType === "link" ? (
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      ▶ Άνοιγμα βίντεο
                    </a>
                  ) : (
                    <button type="button" disabled>
                      ▶ Αναπαραγωγή επάνω
                    </button>
                  )}

                  <button type="button" disabled>
                    + Coach Note — Σύντομα
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="opponent-video-empty">
          <div className="opponent-video-empty-icon">
            ▶
          </div>

          <span>NO VIDEO ANALYSIS</span>

          <h3>
            Δεν έχουν προστεθεί βίντεο.
          </h3>

          <p>
            Ανέβασε αρχείο ή πρόσθεσε σύνδεσμο
            YouTube/Vimeo για να ξεκινήσεις την
            ανάλυση.
          </p>

          <button
            type="button"
            className="premium-primary-button"
            onClick={onAddVideo}
          >
            + Πρώτο βίντεο
          </button>
        </div>
      )}
    </section>
  );
}

export default OpponentVideoSection;