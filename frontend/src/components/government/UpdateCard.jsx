import { Link } from "react-router-dom";
import UpdateCategoryBadge from "./UpdateCategoryBadge";

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

const UpdateCard = ({ update, showAdminActions = false, onDelete, onToggleStatus, basePath = "/updates" }) => {
  const imageUrl = update.image ? `${API_BASE_URL}/${update.image}` : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      {imageUrl && (
        <img src={imageUrl} alt={update.title} className="w-full h-40 object-cover" />
      )}

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <UpdateCategoryBadge category={update.category} />
          {showAdminActions && (
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                update.status === "Published"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {update.status}
            </span>
          )}
        </div>

        <Link to={`${basePath}/${update._id}`}>
          <h3 className="font-semibold text-gray-800 mb-1 hover:text-blue-600 transition line-clamp-2">
            {update.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{update.description}</p>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{new Date(update.createdAt).toLocaleDateString()}</span>
          {update.eventDate && (
            <span>Event: {new Date(update.eventDate).toLocaleDateString()}</span>
          )}
        </div>

        {showAdminActions && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
            <Link
              to={`/admin/government-updates/${update._id}/edit`}
              className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
            >
              Edit
            </Link>
            <button
              onClick={() => onToggleStatus(update._id)}
              className="text-xs px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition"
            >
              {update.status === "Published" ? "Unpublish" : "Publish"}
            </button>
            <button
              onClick={() => onDelete(update._id)}
              className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateCard;