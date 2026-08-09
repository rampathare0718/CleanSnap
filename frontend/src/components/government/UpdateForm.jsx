import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";

const CATEGORIES = ["Environment", "Cleanliness", "Recycling", "Event", "Public Notice"];

const UpdateForm = ({ initialData = null, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    status: initialData?.status || "Published",
    eventDate: initialData?.eventDate ? initialData.eventDate.split("T")[0] : "",
    image: null,
  });
  const [preview, setPreview] = useState(
    initialData?.image ? `${import.meta.env.VITE_API_URL?.replace("/api", "")}/${initialData.image}` : null
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Title"
        name="title"
        placeholder="e.g. Ward 12 Cleanliness Drive"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          rows={5}
          placeholder="Full details of the update..."
          value={formData.description}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg outline-none transition
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${errors.description ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg outline-none
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${errors.category ? "border-red-500" : "border-gray-300"}`}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      <Input
        label="Event Date (optional)"
        type="date"
        name="eventDate"
        value={formData.eventDate}
        onChange={handleChange}
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4
            file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600
            hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
        />
        {preview && (
          <img src={preview} alt="Preview" className="mt-3 h-32 w-full object-cover rounded-lg border border-gray-200" />
        )}
      </div>

      <Button type="submit" loading={loading}>
        {initialData ? "Save Changes" : "Publish Update"}
      </Button>
    </form>
  );
};

export default UpdateForm;