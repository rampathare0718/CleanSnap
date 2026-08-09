import api from "./api";

export const governmentApi = {
  // Public — works for logged-out visitors too (interceptor only attaches
  // a token if one exists, backend just treats it as req.user = undefined)
  getAll: async (params = {}) => {
    const { data } = await api.get("/government-updates", { params });
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/government-updates/${id}`);
    return data;
  },

  // Admin only — needs multipart/form-data because of the image file
  create: async (formData) => {
    const payload = buildFormData(formData);
    const { data } = await api.post("/government-updates", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  update: async (id, formData) => {
    const payload = buildFormData(formData);
    const { data } = await api.put(`/government-updates/${id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  remove: async (id) => {
    const { data } = await api.delete(`/government-updates/${id}`);
    return data;
  },

  toggleStatus: async (id) => {
    const { data } = await api.patch(`/government-updates/${id}/status`);
    return data;
  },
};

// Converts a plain JS object into FormData, skipping the image field
// if it's not a new File (i.e. editing without changing the image)
const buildFormData = (fields) => {
  const fd = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (key === "image") {
      if (value instanceof File) fd.append("image", value);
      return;
    }
    if (value !== null && value !== undefined && value !== "") {
      fd.append(key, value);
    }
  });
  return fd;
};