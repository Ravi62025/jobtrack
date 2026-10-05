import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createApplication } from "../api/applications";
import ApplicationForm from "../components/ApplicationForm";

function NewApplication() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    setError("");
    setSubmitting(true);

    try {
      await createApplication(formData);
      navigate("/applications");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create application"
      );
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "500px" }}>
      <h1>Add Application</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ApplicationForm
        onSubmit={handleCreate}
        submitting={submitting}
        submitLabel="Add Application"
      />
    </div>
  );
}

export default NewApplication;