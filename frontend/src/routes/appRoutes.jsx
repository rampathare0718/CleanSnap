import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Loader from "../components/common/loader";
import { useAuth } from "../context/AuthContext";

// Blocks logged-in users from re-visiting /login or /register
const PublicOnlyRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <Loader fullScreen />;
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

// Blocks anonymous users from protected pages
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <Loader fullScreen />;
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Placeholder — swap in the real dashboard once it's built
const DashboardPlaceholder = () => <h2 style={{ padding: 40 }}>Dashboard coming soon</h2>;

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route
                path="/login"
                element={
                    <PublicOnlyRoute>
                        <Login />
                    </PublicOnlyRoute>
                }
            />

            <Route
                path="/register"
                element={
                    <PublicOnlyRoute>
                        <Register />
                    </PublicOnlyRoute>
                }
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPlaceholder />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;