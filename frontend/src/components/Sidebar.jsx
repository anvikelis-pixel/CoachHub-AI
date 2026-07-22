function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span>⚽</span>
        <h2>CoachHub AI</h2>
      </div>

      <nav className="sidebar-menu">
        <button className="menu-item active">▦ Dashboard</button>
        <button className="menu-item">👥 Παίκτες</button>
        <button className="menu-item">📋 Προπονήσεις</button>
        <button className="menu-item">🏆 Αγώνες</button>
        <button className="menu-item">🤕 Τραυματισμοί</button>
        <button className="menu-item">📅 Ημερολόγιο</button>
        <button className="menu-item">📊 Αναλύσεις</button>
      </nav>

      <button className="menu-item settings">⚙️ Ρυθμίσεις</button>
    </aside>
  );
}

export default Sidebar;