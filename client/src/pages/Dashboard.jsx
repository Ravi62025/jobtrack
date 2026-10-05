import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>JobTrack</h1>
      <h2>Dashboard</h2>
      <p>
        Logged in as {user.name} ({user.email})
      </p>
    </div>
  );
}

export default Dashboard;