import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const adminApi = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token to every request
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================================================
// Complaints
// ==========================================================
export const getAllComplaints = (status) =>
  adminApi.get("/complaints", { params: status ? { status } : {} });

export const getComplaintById = (id) => adminApi.get(`/complaints/${id}`);

export const approveComplaint = (id, adminRemark) =>
  adminApi.put(`/complaints/${id}/approve`, { adminRemark });

export const rejectComplaint = (id, adminRemark) =>
  adminApi.put(`/complaints/${id}/reject`, { adminRemark });

export const assignWorker = (id, workerId, deadline) =>
  adminApi.put(`/complaints/${id}/assign`, { workerId, deadline });

// ==========================================================
// Users / Workers
// ==========================================================
export const getAllWorkers = () =>
  adminApi.get("/users", { params: { role: "worker" } });

export const getAllCitizens = () =>
  adminApi.get("/users", { params: { role: "citizen" } });

export const getUserById = (id) => adminApi.get(`/users/${id}`);

export const createWorker = (workerData) =>
  adminApi.post("/users/worker", workerData);

export const deleteUser = (id) => adminApi.delete(`/users/${id}`);

// ==========================================================
// Dashboard Stats
// NOTE: assumes GET /api/admin/stats exists on your adminRoutes.js.
// Confirm it matches your existing route before relying on this.
// ==========================================================
export const getDashboardStats = () => adminApi.get("/admin/stats");

export default adminApi;