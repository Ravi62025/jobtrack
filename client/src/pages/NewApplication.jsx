import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    <div className="page-form">
      <Link to="/applications" className="back-link">
        &larr; Back to Applications
      </Link>

      <header className="form-page-header">
        <h1 className="page-title">Add Application</h1>
        <p className="page-description">
          Save the details of a job you're interested in.
        </p>
      </header>

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