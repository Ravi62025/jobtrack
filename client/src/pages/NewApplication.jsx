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
    <div className="page-narrow">
      <h1>Add Application</h1>

      {error && <div className="alert-error">{error}</div>}

      <ApplicationForm
        onSubmit={handleCreate}
        submitting={submitting}
        submitLabel="Add Application"
      />
    </div>
  );
}

export default NewApplication;