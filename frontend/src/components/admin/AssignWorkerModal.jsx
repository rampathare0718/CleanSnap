import { useEffect, useState } from "react";
import { getAllWorkers, assignWorker } from "../../services/adminApi";

export default function AssignWorkerModal({ complaint, onClose, onSuccess }) {
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setFetching(true);
        const res = await getAllWorkers();
        setWorkers(res.data.users);
      } catch (err) {
        console.error(err);
        setError("Failed to load workers.");
      } finally {
        setFetching(false);
      }
    };
    fetchWorkers();
  }, []);

  const handleAssign = async () => {
    if (!selectedWorker) {
      setError("Please select a worker.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await assignWorker(complaint._id, selectedWorker, deadline || undefined);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign worker.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Assign Worker: {complaint.title}
        </h3>

        {fetching ? (
          <p className="text-gray-500 text-sm mb-3">Loading workers...</p>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Worker
            </label>
            <select
              value={selectedWorker}
              onChange={(e) => setSelectedWorker(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-3"
            >
              <option value="">-- Choose a worker --</option>
              {workers.map((w) => (
                <option key={w._id} value={w._id}>
                  {w.fullName} ({w.mobileNumber})
                </option>
              ))}
            </select>
          </>
        )}

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deadline (optional)
        </label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-3"
        />

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={loading || fetching}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
} 