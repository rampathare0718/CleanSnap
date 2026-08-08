import api, { SERVER_BASE_URL } from "./api";

// Builds a full image URL from the filename multer stored on the server
// (e.g. "1699999999-photo.jpg" -> "http://localhost:5000/uploads/1699999999-photo.jpg")
// Adjust the "/uploads" segment below if your backend serves static files
// from a different path.
export const getImageUrl = (filename) => {
    if (!filename) return null;
    return `${SERVER_BASE_URL}/uploads/${filename}`;
};

// Matches: router.post("/", protect, authorize("citizen"), upload.single("beforeImage"), createComplaint)
// formValues: { title, description, address, latitude, longitude, beforeImage: File }
export const createComplaint = async (formValues) => {
    const formData = new FormData();
    formData.append("title", formValues.title);
    formData.append("description", formValues.description);
    formData.append("address", formValues.address);

    if (formValues.latitude !== null && formValues.latitude !== undefined && formValues.latitude !== "") {
        formData.append("latitude", formValues.latitude);
    }
    if (formValues.longitude !== null && formValues.longitude !== undefined && formValues.longitude !== "") {
        formData.append("longitude", formValues.longitude);
    }

    // Field name MUST be "beforeImage" — it matches upload.single("beforeImage") on the backend
    formData.append("beforeImage", formValues.beforeImage);

    const response = await api.post("/complaints", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data; // { success, message, complaint }
};

// Matches: router.get("/my", protect, authorize("citizen"), getMyComplaints)
export const getMyComplaints = async () => {
    const response = await api.get("/complaints/my");
    return response.data; // { success, count, complaints }
};

// Matches: router.get("/:id", protect, getComplaintById)
export const getComplaintById = async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data; // { success, complaint }
};

// Matches: router.delete("/:id", protect, authorize("citizen"), deleteComplaint)
// Backend only allows this while status === "Pending"
export const deleteComplaint = async (id) => {
    const response = await api.delete(`/complaints/${id}`);
    return response.data; // { success, message }
};