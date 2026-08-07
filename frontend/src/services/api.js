import axios from "axios";

// Base URL comes from an env variable so you can point at localhost while
// developing and at your real server once deployed.
// Create a .env file in your project root with:
// VITE_API_BASE_URL=http://localhost:5000/api
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// Attach the JWT (if we have one) to every outgoing request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Centralized response handling — if the token is invalid/expired,
// clear local storage so the app falls back to a logged-out state.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
        return Promise.reject(error);
    }
);

export default api;