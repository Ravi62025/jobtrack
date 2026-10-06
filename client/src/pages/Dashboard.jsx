import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getApplicationStats } from "../api/applications";

const CARDS = [
  { key: "total", label: "Total" },
  { key: "wishlist", label: "Wishlist" },
  { key: "applied", label: "Applied" },
  { key: "interviewing", label: "Interviewing" },
  { key: "offer", label: "Offer" },
  { key: "rejected", label: "Rejected" },
];

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

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>
      <p>
        Logged in as {user.name} ({user.email})
      </p>

      {loading && <p className="status-message">Loading statistics...</p>}
      {error && <div className="alert-error">{error}</div>}

      {stats && (
        <div className="stats-grid">
          {CARDS.map((card) => (
            <div key={card.key} className="card stat-card">
              <div className="stat-value">{stats[card.key]}</div>
              <div className="stat-label">{card.label}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Dashboard;