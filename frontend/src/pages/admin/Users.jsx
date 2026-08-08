import { useEffect, useState } from "react";
import UserTable from "../../components/admin/UserTable";
import { getAllCitizens, deleteUser } from "../../services/adminApi";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllCitizens();
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user "${user.fullName}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteUser(user._id);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete user.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Citizens</h2>

      {loading && <p className="text-gray-500">Loading users...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <UserTable users={users} onDelete={handleDelete} />
      )}
    </div>
  );
}