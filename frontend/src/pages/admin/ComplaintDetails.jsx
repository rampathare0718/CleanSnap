import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getComplaintById } from "../../services/adminApi";
import ApprovalModal from "../../components/admin/ApprovalModal";
import AssignWorkerModal from "../../components/admin/AssignWorkerModal";

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-blue-100 text-blue-800",
  Assigned: "bg-indigo-100 text-indigo-800",
  "In Progress": "bg-purple-100 text-purple-800",
  Completed: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

const UPLOADS_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
).replace("/api", "");

export default function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getComplaintById(id);
      setComplaint(res.data.complaint);
    } catch (err) {
      console.error(err);
      setError("Failed to load complaint.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleModalSuccess = () => {
    setShowApprovalModal(false);
    setShowAssignModal(false);
    fetchComplaint();
  };

  if (loading) return <p className="text-gray-500">Loading complaint...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!complaint) return null;

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-blue-600 hover:underline mb-4"
      >
        ← Back to Complaints
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {complaint.title}
            </h2>
            <span
              className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                STATUS_COLORS[complaint.status] || "bg-gray-100 text-gray-700"
              }`}
            >
              {complaint.status}
            </span>
          </div>

          <div className="flex gap-2">
            {complaint.status === "Pending" && (
              <button
                onClick={() => setShowApprovalModal(true)}
                className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Review
              </button>
            )}
            {complaint.status === "Approved" && (
              <button
                onClick={() => setShowAssignModal(true)}
                className="px-4 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Assign Worker
              </button>
            )}
          </div>
        </div>

        <p className="text-gray-600 mb-4">{complaint.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="text-gray-500">Reported By</p>
            <p className="text-gray-800 font-medium">
              {complaint.reportedBy?.fullName} ({complaint.reportedBy?.mobileNumber})
            </p>
          </div>
          <div>
            <p className="text-gray-500">Assigned Worker</p>
            <p className="text-gray-800 font-medium">
              {complaint.assignedWorker
                ? `${complaint.assignedWorker.fullName} (${complaint.assignedWorker.mobileNumber})`
                : "Not assigned"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Location</p>
            <p className="text-gray-800 font-medium">
              {complaint.location?.address}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Deadline</p>
            <p className="text-gray-800 font-medium">
              {complaint.deadline
                ? new Date(complaint.deadline).toLocaleDateString()
                : "Not set"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Rating</p>
            <p className="text-gray-800 font-medium">
              {complaint.rating ? `${complaint.rating} / 5` : "Not rated yet"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Admin Remark</p>
            <p className="text-gray-800 font-medium">
              {complaint.adminRemark || "-"}
            </p>
          </div>
        </div>

        {complaint.ratingComment && (
          <div className="mb-4">
            <p className="text-gray-500 text-sm">Citizen Feedback</p>
            <p className="text-gray-800 text-sm italic">
              &ldquo;{complaint.ratingComment}&rdquo;
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm mb-1">Before</p>
            {complaint.beforeImage && (
              <img
                src={`${UPLOADS_BASE_URL}/uploads/${complaint.beforeImage}`}
                alt="Before"
                className="rounded-md border border-gray-200 w-full"
              />
            )}
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">After</p>
            {complaint.afterImage ? (
              <img
                src={`${UPLOADS_BASE_URL}/uploads/${complaint.afterImage}`}
                alt="After"
                className="rounded-md border border-gray-200 w-full"
              />
            ) : (
              <p className="text-gray-400 text-sm">Not completed yet</p>
            )}
          </div>
        </div>
      </div>

      {showApprovalModal && (
        <ApprovalModal
          complaint={complaint}
          onClose={() => setShowApprovalModal(false)}
          onSuccess={handleModalSuccess}
        />
      )}

      {showAssignModal && (
        <AssignWorkerModal
          complaint={complaint}
          onClose={() => setShowAssignModal(false)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}