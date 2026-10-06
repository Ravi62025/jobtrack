import { useState } from "react";

const STATUSES = ["Wishlist", "Applied", "Interviewing", "Offer", "Rejected"];
const JOB_TYPES = ["Full-time", "Part-time", "Internship"];

// Dates from the server look like "2026-10-01T00:00:00.000Z",
// but <input type="date"> only accepts "YYYY-MM-DD".
const toDateInput = (value) => (value ? String(value).slice(0, 10) : "");

const buildInitialState = (data = {}) => ({
  company: data.company ?? "",
  role: data.role ?? "",
  status: data.status ?? "Wishlist",
  jobType: data.jobType ?? "Full-time",
  location: data.location ?? "",
  jobUrl: data.jobUrl ?? "",
  appliedDate: toDateInput(data.appliedDate),
  deadline: toDateInput(data.deadline),
  notes: data.notes ?? "",
});

function ApplicationForm({
  onSubmit,
  initialData,
  submitting = false,
  submitLabel = "Save",
}) {
  const [formData, setFormData] = useState(() => buildInitialState(initialData));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="company">Company *</label>
        <input
          id="company"
          name="company"
          type="text"
          value={formData.company}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="role">Role *</label>
        <input
          id="role"
          name="role"
          type="text"
          value={formData.role}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="jobType">Job type</label>
          <select
            id="jobType"
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
          >
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="location">Location</label>
        <input
          id="location"
          name="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
        />
      </div>

      <div className="form-field">
        <label htmlFor="jobUrl">Job posting URL</label>
        <input
          id="jobUrl"
          name="jobUrl"
          type="url"
          value={formData.jobUrl}
          onChange={handleChange}
        />
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="appliedDate">Applied date</label>
          <input
            id="appliedDate"
            name="appliedDate"
            type="date"
            value={formData.appliedDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="deadline">Deadline</label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

export default ApplicationForm;