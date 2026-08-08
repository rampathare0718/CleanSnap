import api from "./api";

// Matches: router.get("/", protect, getMyNotifications)
// params: { page, limit, isRead }
export const getMyNotifications = async (params = {}) => {
    const response = await api.get("/notifications", { params });
    return response.data; // { success, count, total, unreadCount, currentPage, totalPages, data }
};

// Matches: router.patch("/:id/read", protect, markAsRead)
export const markNotificationAsRead = async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data; // { success, message, data }
};

// Matches: router.delete("/:id", protect, deleteNotification)
export const deleteNotification = async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data; // { success, message }
};

// Matches: router.delete("/", protect, deleteAllNotifications)
export const deleteAllNotifications = async () => {
    const response = await api.delete("/notifications");
    return response.data; // { success, message }
};