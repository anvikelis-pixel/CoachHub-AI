import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";

function Dashboard() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <section className="dashboard-content">
          <div className="stats-grid">
            <StatCard
              icon="👥"
              title="Σύνολο παικτών"
              value="24"
              description="22 διαθέσιμοι"
            />

            <StatCard
              icon="📋"
              title="Σημερινή προπόνηση"
              value="18:00"
              description="Τακτική και τελειώματα"
            />

            <StatCard
              icon="🤕"
              title="Τραυματίες"
              value="2"
              description="1 κοντά στην επιστροφή"
            />

            <StatCard
              icon="🏆"
              title="Επόμενος αγώνας"
              value="Κυριακή"
              description="Εντός έδρας · 17:00"
            />
          </div>

          <section className="activity-panel">
            <div className="panel-header">
              <div>
                <h2>Πρόσφατη δραστηριότητα</h2>
                <p>Οι τελευταίες ενημερώσεις της ομάδας</p>
              </div>

              <button className="primary-button">+ Νέα προπόνηση</button>
            </div>

            <div className="activity-list">
              <div className="activity-item">
                <span>✓</span>
                <div>
                  <strong>Δημιουργήθηκε νέα προπόνηση</strong>
                  <p>Σήμερα στις 18:00</p>
                </div>
              </div>

              <div className="activity-item">
                <span>✓</span>
                <div>
                  <strong>Προστέθηκε νέος παίκτης</strong>
                  <p>Νίκος Παπαδόπουλος · Εξτρέμ</p>
                </div>
              </div>

              <div className="activity-item">
                <span>✓</span>
                <div>
                  <strong>Ενημερώθηκε τραυματισμός</strong>
                  <p>Εκτιμώμενη επιστροφή σε 5 ημέρες</p>
                </div>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;