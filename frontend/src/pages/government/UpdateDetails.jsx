import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { governmentApi } from "../../services/governmentApi";
import { useAuth } from "../../context/AuthContext";
import UpdateCategoryBadge from "../../components/government/UpdateCategoryBadge";
import Loader from "../../components/common/Loader";

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

const UpdateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // undefined/null for logged-out visitors

  const [update, setUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUpdate = async () => {
      try {
        setLoading(true);
        const data = await governmentApi.getById(id);
        setUpdate(data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Update not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchUpdate();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this update permanently?")) return;
    try {
      await governmentApi.remove(id);
      navigate("/admin/government-updates");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete update.");
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!update) return null;

  const imageUrl = update.image ? `${API_BASE_URL}/${update.image}` : null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {imageUrl && (
        <img src={imageUrl} alt={update.title} className="w-full h-64 object-cover rounded-xl mb-6" />
      )}

      <div className="flex items-center gap-3 mb-3">
        <UpdateCategoryBadge category={update.category} />
        {user?.role === "admin" && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              update.status === "Published" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
            }`}
          >
            {update.status}
          </span>
        )}
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">{update.title}</h1>

      <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
        <span>Posted {new Date(update.createdAt).toLocaleDateString()}</span>
        {update.eventDate && <span>Event Date: {new Date(update.eventDate).toLocaleDateString()}</span>}
        {update.createdBy?.fullName && <span>By {update.createdBy.fullName}</span>}
      </div>

      <p className="text-gray-600 leading-relaxed whitespace-pre-line">{update.description}</p>

      {user?.role === "admin" && (
        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
          <Link
            to={`/admin/government-updates/${update._id}/edit`}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateDetails;