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

  const fieldStyle = { marginBottom: "1rem" };

  return (
    <form onSubmit={handleSubmit}>
      <div style={fieldStyle}>
        <label htmlFor="company">Company *</label>
        <br />
        <input
          id="company"
          name="company"
          type="text"
          value={formData.company}
          onChange={handleChange}
          required
        />
      </div>

      <div style={fieldStyle}>
        <label htmlFor="role">Role *</label>
        <br />
        <input
          id="role"
          name="role"
          type="text"
          value={formData.role}
          onChange={handleChange}
          required
        />
      </div>

      <div style={fieldStyle}>
        <label htmlFor="status">Status</label>
        <br />
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

      <div style={fieldStyle}>
        <label htmlFor="jobType">Job type</label>
        <br />
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

      <div style={fieldStyle}>
        <label htmlFor="location">Location</label>
        <br />
        <input
          id="location"
          name="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
        />
      </div>

      <div style={fieldStyle}>
        <label htmlFor="jobUrl">Job posting URL</label>
        <br />
        <input
          id="jobUrl"
          name="jobUrl"
          type="url"
          value={formData.jobUrl}
          onChange={handleChange}
        />
      </div>

      <div style={fieldStyle}>
        <label htmlFor="appliedDate">Applied date</label>
        <br />
        <input
          id="appliedDate"
          name="appliedDate"
          type="date"
          value={formData.appliedDate}
          onChange={handleChange}
        />
      </div>

      <div style={fieldStyle}>
        <label htmlFor="deadline">Deadline</label>
        <br />
        <input
          id="deadline"
          name="deadline"
          type="date"
          value={formData.deadline}
          onChange={handleChange}
        />
      </div>

      <div style={fieldStyle}>
        <label htmlFor="notes">Notes</label>
        <br />
        <textarea
          id="notes"
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

export default ApplicationForm;