import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { governmentApi } from "../../services/governmentApi";
import UpdateForm from "../../components/government/UpdateForm";
import Loader from "../../components/common/Loader";

const EditUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUpdate = async () => {
      try {
        const data = await governmentApi.getById(id);
        setInitialData(data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load update.");
      } finally {
        setFetching(false);
      }
    };
    fetchUpdate();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError("");
      await governmentApi.update(id, formData);
      navigate("/admin/government-updates");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loader fullScreen />;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Government Update</h1>
      {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">{error}</div>}
      {initialData && <UpdateForm initialData={initialData} onSubmit={handleSubmit} loading={loading} />}
    </div>
  );
};

export default EditUpdate;