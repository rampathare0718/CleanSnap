import api from "./api";

// Matches: router.get("/assigned", protect, authorize("worker"), getAssignedComplaints)
// NOTE: backend only returns complaints with status "Assigned" or "In Progress" —
// completed tasks will not appear here once completeComplaint() has run.
export const getAssignedComplaints = async () => {
    const response = await api.get("/complaints/assigned");
    return response.data; // { success, count, complaints }
};

// Matches: router.put("/:id/start", protect, authorize("worker"), startWork)
export const startWork = async (id) => {
    const response = await api.put(`/complaints/${id}/start`);
    return response.data; // { success, message, complaint }
};

// Matches: router.put("/:id/complete", protect, authorize("worker"), upload.single("afterImage"), completeComplaint)
export const completeComplaint = async (id, afterImageFile) => {
    const formData = new FormData();
    formData.append("afterImage", afterImageFile);

    const response = await api.put(`/complaints/${id}/complete`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data; // { success, message, complaint }
};

// Matches: router.get("/worker/rating", protect, authorize("worker"), getMyRating)
export const getMyRating = async () => {
    const response = await api.get("/complaints/worker/rating");
    return response.data; // { success, averageRating, count, ratings }
};