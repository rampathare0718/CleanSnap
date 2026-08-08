import { useEffect, useState } from "react";
import { getAllComplaints } from "../../services/adminApi";
import AssignWorkerModal from "../../components/admin/AssignWorkerModal";

export default function AssignWorker() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchApproved = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllComplaints("Approved");
      setComplaints(res.data.complaints);
    } catch (err) {
      console.error(err);
      setError("Failed to load approved complaints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApproved();
  }, []);

  const handleSuccess = () => {
    setSelectedComplaint(null);
    fetchApproved();
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Assign Workers (Approved Complaints)
      </h2>

      {complaints.length === 0 ? (
        <p className="text-gray-500 text-sm">No complaints awaiting assignment.</p>
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => (
            <div
              key={c._id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between flex-wrap gap-3"
            >
              <div>
                <p className="font-medium text-gray-800">{c.title}</p>
                <p className="text-sm text-gray-500">
                  Reported by {c.reportedBy?.fullName}
                </p>
              </div>
              <button
                onClick={() => setSelectedComplaint(c)}
                className="px-4 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Assign Worker
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedComplaint && (
        <AssignWorkerModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}