import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { governmentApi } from "../../services/governmentApi";
import UpdateForm from "../../components/government/UpdateForm";

const CreateUpdate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError("");
      await governmentApi.create(formData);
      navigate("/admin/government-updates");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create update.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Government Update</h1>
      {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">{error}</div>}
      <UpdateForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default CreateUpdate;