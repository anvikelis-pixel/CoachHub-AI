import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span>⚽</span>
        <h2>CoachHub AI</h2>
      </div>

      <nav className="sidebar-menu">

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          ▦ Dashboard
        </NavLink>

        <NavLink
          to="/players"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          👥 Παίκτες
        </NavLink>

        <NavLink
          to="/trainings"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          📋 Προπονήσεις
        </NavLink>

        <NavLink
          to="/exercises"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          📚 Exercise Library
        </NavLink>

        <NavLink
          to="/matches"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          🏆 Αγώνες
        </NavLink>

        <NavLink
          to="/injuries"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          🤕 Τραυματισμοί
        </NavLink>

        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          📅 Ημερολόγιο
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          📊 Αναλύσεις
        </NavLink>

      </nav>

      <button className="menu-item settings">
        ⚙️ Ρυθμίσεις
      </button>
    </aside>
  );
}

export default Sidebar;