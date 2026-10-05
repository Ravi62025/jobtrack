import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getApplications, deleteApplication } from "../api/applications";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getApplications();
        setApplications(data.applications);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load applications"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleDelete = async (app) => {
    if (!window.confirm(`Delete application for ${app.company}?`)) {
      return;
    }

    setDeleteError("");
    setDeletingId(app._id);

    try {
      await deleteApplication(app._id);
      setApplications((prev) => prev.filter((a) => a._id !== app._id));
    } catch (err) {
      setDeleteError(
        err.response?.data?.message || "Failed to delete application"
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <p>Loading applications...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h1 style={{ margin: 0 }}>Applications</h1>
        <Link to="/applications/new">Add Application</Link>
      </div>

      {deleteError && <p style={{ color: "red" }}>{deleteError}</p>}

      {applications.length === 0 ? (
        <p>
          No applications yet.{" "}
          <Link to="/applications/new">Add your first application</Link>
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {applications.map((app) => (
            <li
              key={app._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ margin: 0 }}>{app.company}</h3>
              <p style={{ margin: "0.25rem 0" }}>{app.role}</p>
              <p style={{ margin: "0.25rem 0" }}>Status: {app.status}</p>
              <p style={{ margin: "0.25rem 0" }}>Type: {app.jobType}</p>
              <p style={{ margin: "0.25rem 0" }}>
                Location: {app.location || "Not specified"}
              </p>
              <p style={{ margin: "0.25rem 0" }}>
                Applied:{" "}
                {app.appliedDate
                  ? new Date(app.appliedDate).toLocaleDateString()
                  : "Not applied yet"}
              </p>

              <Link to={`/applications/${app._id}/edit`}>Edit</Link>{" "}
              <button
                onClick={() => handleDelete(app)}
                disabled={deletingId !== null}
              >
                {deletingId === app._id ? "Deleting..." : "Delete"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Applications;