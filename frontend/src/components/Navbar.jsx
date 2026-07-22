function Navbar() {
  return (
    <header className="navbar">
      <div>
        <h1>Dashboard</h1>
        <p>Παρακολούθησε την κατάσταση της ομάδας σου.</p>
      </div>

      <div className="profile">
        <button className="notification-button">🔔</button>

        <div className="profile-avatar">Α</div>

        <div>
          <strong>Αντώνης</strong>
          <p>Προπονητής</p>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
