import { useEffect, useState } from "react";
import WorkerTable from "../../components/admin/WorkerTable";
import { getAllWorkers, createWorker, deleteUser } from "../../services/adminApi";

const EMPTY_FORM = {
  fullName: "",
  email: "",
  password: "",
  mobileNumber: "",
  age: "",
  gender: "Male",
  address: { street: "", area: "", city: "", state: "", pincode: "" },
};

export default function Workers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllWorkers();
      setWorkers(res.data.users);
    } catch (err) {
      console.error(err);
      setError("Failed to load workers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleDelete = async (worker) => {
    if (!window.confirm(`Delete worker "${worker.fullName}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteUser(worker._id);
      fetchWorkers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete worker.");
    }
  };

  const handleFormChange = (field, value) => {
    if (field.startsWith("address.")) {
      const key = field.split(".")[1];
      setForm((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    setFormError("");

    if (
      !form.fullName ||
      !form.email ||
      !form.password ||
      !form.mobileNumber ||
      !form.age ||
      !form.address.city ||
      !form.address.state ||
      !form.address.pincode
    ) {
      setFormError("Please fill all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      await createWorker({ ...form, age: Number(form.age) });
      setShowAddModal(false);
      setForm(EMPTY_FORM);
      fetchWorkers();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create worker.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Workers</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          + Add Worker
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading workers...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <WorkerTable workers={workers} onDelete={handleDelete} />
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Worker</h3>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                placeholder="Full Name"
                value={form.fullName}
                onChange={(e) => handleFormChange("fullName", e.target.value)}
                className="col-span-2 border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => handleFormChange("email", e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => handleFormChange("password", e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Mobile Number"
                value={form.mobileNumber}
                onChange={(e) => handleFormChange("mobileNumber", e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Age"
                value={form.age}
                onChange={(e) => handleFormChange("age", e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <select
                value={form.gender}
                onChange={(e) => handleFormChange("gender", e.target.value)}
                className="col-span-2 border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Street"
                value={form.address.street}
                onChange={(e) => handleFormChange("address.street", e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Area"
                value={form.address.area}
                onChange={(e) => handleFormChange("address.area", e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="City"
                value={form.address.city}
                onChange={(e) => handleFormChange("address.city", e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="State"
                value={form.address.state}
                onChange={(e) => handleFormChange("address.state", e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Pincode"
                value={form.address.pincode}
                onChange={(e) => handleFormChange("address.pincode", e.target.value)}
                className="col-span-2 border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            {formError && <p className="text-red-600 text-sm mb-3">{formError}</p>}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setForm(EMPTY_FORM);
                  setFormError("");
                }}
                disabled={submitting}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Worker"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}