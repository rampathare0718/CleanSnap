import { useState } from "react";
import { approveComplaint, rejectComplaint } from "../../services/adminApi";

export default function ApprovalModal({ complaint, onClose, onSuccess }) {
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApprove = async () => {
    try {
      setLoading(true);
      setError("");
      await approveComplaint(complaint._id, remark);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve complaint.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!remark.trim()) {
      setError("Please provide a reason for rejection.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await rejectComplaint(complaint._id, remark);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Review Complaint: {complaint.title}
        </h3>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Remark (required for rejection)
        </label>
        <textarea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-3"
          placeholder="Add a remark..."
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
            onClick={handleReject}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            Reject
          </button>
          <button
            onClick={handleApprove}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}