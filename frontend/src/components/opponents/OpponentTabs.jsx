const tabs = [
  {
    id: "overview",
    label: "Επισκόπηση",
  },
  {
    id: "lineup",
    label: "Πιθανή 11άδα",
  },
  {
    id: "tactics",
    label: "Τακτική",
  },
  {
    id: "players",
    label: "Παίκτες-κλειδιά",
  },
  {
    id: "videos",
    label: "Βίντεο",
  },
  {
    id: "ai",
    label: "AI Match Plan",
  },
];

function OpponentTabs({
  activeTab,
  onChange,
  videoCount = 0,
}) {
  return (
    <nav
      className="opponent-tabs"
      aria-label="Ενότητες ανάλυσης αντιπάλου"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={
            activeTab === tab.id ? "active" : ""
          }
          onClick={() => onChange(tab.id)}
        >
          <span>{tab.label}</span>

          {tab.id === "videos" && (
            <strong>{videoCount}</strong>
          )}
        </button>
      ))}
    </nav>
  );
}

export default OpponentTabs;