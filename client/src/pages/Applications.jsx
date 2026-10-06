import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getApplications, deleteApplication } from "../api/applications";

const STATUSES = ["Wishlist", "Applied", "Interviewing", "Offer", "Rejected"];
const PAGE_SIZE = 10;

const EMPTY_FILTERS = { company: "", status: "", sort: "" };

const getStatusClass = (status) => {
  return `badge-${status.toLowerCase()}`;
};

// Keep only filters that have a real value (no page info here)
const buildParams = (filters) => {
  const params = {};
  const company = filters.company.trim();

  if (company) params.company = company;
  if (filters.status) params.status = filters.status;
  if (filters.sort) params.sort = filters.sort;

  return params;
};

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const [filters, setFilters] = useState(EMPTY_FILTERS); // what the controls show
  const [activeFilters, setActiveFilters] = useState(EMPTY_FILTERS); // what the list used
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0); // matches across ALL pages

  const loadApplications = useCallback(
    async (appliedFilters = EMPTY_FILTERS, pageNumber = 1) => {
      setLoading(true);
      setError("");
      setDeleteError("");

      try {
        const data = await getApplications({
          ...buildParams(appliedFilters),
          page: pageNumber,
          limit: PAGE_SIZE,
        });
        setApplications(data.applications);
        setTotal(data.total ?? 0);
        setActiveFilters(appliedFilters);
        setPage(data.page ?? pageNumber);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = (e) => {
    e.preventDefault();
    loadApplications(filters, 1); // new filters always start at page 1
  };

  const handleClear = () => {
    setFilters(EMPTY_FILTERS);
    loadApplications(EMPTY_FILTERS, 1);
  };

  const handlePrevious = () => loadApplications(activeFilters, page - 1);
  const handleNext = () => loadApplications(activeFilters, page + 1);

  const handleDelete = async (app) => {
    if (!window.confirm(`Delete application for ${app.company}?`)) {
      return;
    }

    setDeleteError("");
    setDeletingId(app._id);

    try {
      await deleteApplication(app._id);

      // If this was the only card on a page after page 1, that page is
      // now gone, so step back one page instead of showing an empty one.
      if (applications.length === 1 && page > 1) {
        await loadApplications(activeFilters, page - 1);
      } else {
        setApplications((prev) => prev.filter((a) => a._id !== app._id));
        setTotal((prev) => Math.max(prev - 1, 0));
      }
    } catch (err) {
      setDeleteError(
        err.response?.data?.message || "Failed to delete application"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasActiveFilters = Object.keys(buildParams(activeFilters)).length > 0;

  return (
    <>
      <div className="page-header">
        <h1>Applications</h1>
        <Link to="/applications/new" className="btn btn-primary">
          Add Application
        </Link>
      </div>

      <form className="filters" onSubmit={handleApply}>
        <input
          type="text"
          name="company"
          placeholder="Search by company"
          value={filters.company}
          onChange={handleFilterChange}
        />
        <button type="submit" className="btn" disabled={loading}>
          Search
        </button>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          name="sort"
          value={filters.sort}
          onChange={handleFilterChange}
        >
          <option value="">Newest first (default)</option>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          Apply Filters
        </button>
        <button
          type="button"
          className="btn"
          onClick={handleClear}
          disabled={loading}
        >
          Clear
        </button>
      </form>

      {deleteError && <div className="alert-error">{deleteError}</div>}

      {loading ? (
        <p className="status-message">Loading applications...</p>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : applications.length === 0 ? (
        page > 1 ? (
          <p className="status-message">No more applications on this page.</p>
        ) : hasActiveFilters ? (
          <p className="status-message">No applications match your filters.</p>
        ) : (
          <p className="status-message">
            No applications yet.{" "}
            <Link to="/applications/new">Add your first application</Link>
          </p>
        )
      ) : (
        <ul className="app-list">
          {applications.map((app) => (
            <li key={app._id} className="card">
              <div className="app-card-head">
                <div>
                  <h3 className="app-card-title">{app.company}</h3>
                  <p className="app-card-role">{app.role}</p>
                </div>
                <span className={`badge ${getStatusClass(app.status)}`}>
                  {app.status}
                </span>
              </div>

              <div className="app-card-details">
                <span>Type: {app.jobType}</span>
                <span>Location: {app.location || "Not specified"}</span>
                <span>
                  Applied:{" "}
                  {app.appliedDate
                    ? new Date(app.appliedDate).toLocaleDateString()
                    : "Not applied yet"}
                </span>
              </div>

              <div className="app-card-actions">
                <Link
                  to={`/applications/${app._id}/edit`}
                  className="btn btn-sm"
                >
                  Edit
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(app)}
                  disabled={deletingId !== null}
                >
                  {deletingId === app._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!error && total > 0 && (
        <div className="pagination">
          <button
            className="btn"
            onClick={handlePrevious}
            disabled={loading || page === 1}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages} ({total} total)
          </span>
          <button
            className="btn"
            onClick={handleNext}
            disabled={loading || page >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default Applications;