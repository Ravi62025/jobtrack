import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApplicationById, updateApplication } from "../api/applications";
import ApplicationForm from "../components/ApplicationForm";

function EditApplication() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const data = await getApplicationById(id);
        setApplication(data.application);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load application"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleUpdate = async (formData) => {
    setError("");
    setSubmitting(true);

    try {
      await updateApplication(id, formData);
      navigate("/applications");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update application"
      );
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading application...</p>;
  }

  // Loading finished but there is no application: the fetch failed
  if (!application) {
    return <p style={{ padding: "2rem", color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "500px" }}>
      <h1>Edit Application</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ApplicationForm
        key={application._id}
        initialData={application}
        onSubmit={handleUpdate}
        submitting={submitting}
        submitLabel="Save changes"
      />
    </div>
  );
}

export default EditApplication;