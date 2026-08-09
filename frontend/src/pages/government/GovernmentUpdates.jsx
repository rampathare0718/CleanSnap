import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { governmentApi } from "../../services/governmentApi";
import UpdateCard from "../../components/government/UpdateCard";
import Loader from "../../components/common/Loader";

const CATEGORIES = ["Environment", "Cleanliness", "Recycling", "Event", "Public Notice"];

const GovernmentUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ category: "", status: "", search: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await governmentApi.getAll({ ...filters, page, limit: 9 });
      setUpdates(data.data);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load updates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this update permanently?")) return;
    try {
      await governmentApi.remove(id);
      fetchUpdates();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete update.");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await governmentApi.toggleStatus(id);
      fetchUpdates();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Government Updates</h1>
        <Link
          to="/admin/government-updates/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          + New Update
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search updates..."
          value={filters.search}
          onChange={(e) => { setPage(1); setFilters({ ...filters, search: e.target.value }); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filters.category}
          onChange={(e) => { setPage(1); setFilters({ ...filters, category: e.target.value }); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select
          value={filters.status}
          onChange={(e) => { setPage(1); setFilters({ ...filters, status: e.target.value }); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
        >
          <option value="">All Status</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">{error}</div>}

      {loading ? (
        <Loader />
      ) : updates.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No updates found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {updates.map((update) => (
              <UpdateCard
                key={update._id}
                update={update}
                showAdminActions
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                basePath="/admin/government-updates"
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-8 w-8 rounded-lg text-sm ${
                    p === page ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GovernmentUpdates;