import { useEffect, useState } from "react";
import ComplaintTable from "../../components/admin/ComplaintTable";
import { getAllComplaints } from "../../services/adminApi";

const STATUS_OPTIONS = [
  "All",
  "Pending",
  "Approved",
  "Assigned",
  "In Progress",
  "Completed",
  "Rejected",
];

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComplaints = async (selectedStatus) => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllComplaints(
        selectedStatus === "All" ? undefined : selectedStatus
      );
      setComplaints(res.data.complaints);
    } catch (err) {
      console.error(err);
      setError("Failed to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints(status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Complaints</h2>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-500">Loading complaints...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && <ComplaintTable complaints={complaints} />}
    </div>
  );
}