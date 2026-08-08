import { Link } from "react-router-dom";

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-blue-100 text-blue-800",
  Assigned: "bg-indigo-100 text-indigo-800",
  "In Progress": "bg-purple-100 text-purple-800",
  Completed: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

export default function ComplaintTable({ complaints }) {
  if (!complaints || complaints.length === 0) {
    return <p className="text-gray-500 text-sm">No complaints found.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Reported By</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Deadline</th>
            <th className="px-4 py-3 font-medium">Rating</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {complaints.map((c) => (
            <tr key={c._id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-800">{c.title}</td>
              <td className="px-4 py-3 text-gray-600">
                {c.reportedBy?.fullName || "-"}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    STATUS_COLORS[c.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {c.status}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">
                {c.deadline ? new Date(c.deadline).toLocaleDateString() : "-"}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {c.rating ? `${c.rating} / 5` : "-"}
              </td>
              <td className="px-4 py-3 text-gray-500">
                {new Date(c.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  to={`/admin/complaints/${c._id}`}
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}