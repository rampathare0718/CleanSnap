import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../services/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Restore session on first load
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const persistSession = (data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
    };

    const login = async (credentials) => {
        setError(null);
        setLoading(true);
        try {
            const data = await loginUser(credentials);
            persistSession(data);
            return { success: true, user: data.user };
        } catch (err) {
            const message = err.response?.data?.message || "Login failed. Please try again.";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const register = async (formData) => {
        setError(null);
        setLoading(true);
        try {
            const data = await registerUser(formData);
            persistSession(data);
            return { success: true, user: data.user };
        } catch (err) {
            const message = err.response?.data?.message || "Registration failed. Please try again.";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    // Call after a successful profile update so the rest of the app
    // (Topbar avatar/name, Profile page, etc.) reflects the new data
    // immediately, without requiring the user to log in again.
    const updateUser = (updatedUser) => {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        error,
        isAuthenticated: !!token,
        login,
        register,
        updateUser,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for consuming the context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};