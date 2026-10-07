import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApplicationStats } from "../api/applications";

const CARDS = [
  { key: "total", label: "Total Applications" },
  { key: "wishlist", label: "Wishlist" },
  { key: "applied", label: "Applied" },
  { key: "interviewing", label: "Interviewing" },
  { key: "offer", label: "Offers" },
  { key: "rejected", label: "Rejected" },
];

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 3v10M3 8h10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getApplicationStats();
        setStats(data.stats);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Uses the stats we already have. No extra request.
  const isEmpty = stats !== null && stats.total === 0;

  return (
    <>
      <header className="dashboard-header">
        <div className="dashboard-header-text">
          <h1 className="page-title">Welcome back, {user.name}</h1>
          <p className="page-description">
            Here's an overview of your job search activity.
          </p>
          <p className="dashboard-email">{user.email}</p>
        </div>

        <Link to="/applications/new" className="btn btn-primary">
          <PlusIcon />
          Add Application
        </Link>
      </header>

      {loading && <p className="status-message">Loading statistics...</p>}
      {error && <div className="alert-error">{error}</div>}

      {stats && (
        <section aria-label="Application statistics">
          <div className="stats-grid">
            {CARDS.map((card) => (
              <div
                key={card.key}
                className={`card stat-card stat-${card.key}`}
              >
                <div className="stat-label">{card.label}</div>
                <div className="stat-value">{stats[card.key]}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {!loading && (
        <section className="quick-actions" aria-labelledby="quick-actions-title">
          <div className="quick-actions-text">
            <h2 id="quick-actions-title" className="section-title">
              {isEmpty
                ? "Add your first application"
                : "Continue managing your applications"}
            </h2>
            <p>
              {isEmpty
                ? "Start tracking your job search in one place. Your numbers will appear here as soon as you add an application."
                : "Keep your application pipeline organized and up to date."}
            </p>
          </div>

          <div className="quick-actions-buttons">
            {!isEmpty && (
              <Link to="/applications" className="btn">
                View Applications
              </Link>
            )}
            <Link to="/applications/new" className="btn btn-primary">
              <PlusIcon />
              Add Application
            </Link>
          </div>
        </section>
      )}
    </>
  );
}

export default Dashboard;