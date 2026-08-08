import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Loader from "../components/common/Loader";
import { useAuth } from "../context/AuthContext";

import CitizenLayout from "../layouts/CitizenLayout";
import Dashboard from "../pages/citizen/Dashboard";
import CreateComplaint from "../pages/citizen/CreateComplaint";
import MyComplaints from "../pages/citizen/MyComplaints";
import ComplaintDetails from "../pages/citizen/ComplaintDetails";

// Blocks logged-in users from re-visiting /login or /register
const PublicOnlyRoute = ({ children }) => {
    const { isAuthenticated, loading, user } = useAuth();
    if (loading) return <Loader fullScreen />;
    if (!isAuthenticated) return children;

    if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === "worker") return <Navigate to="/worker/dashboard" replace />;
    return <Navigate to="/citizen/dashboard" replace />;
};

// Blocks anonymous users from protected pages
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <Loader fullScreen />;
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Placeholders — swap in the real modules once they're built
const AdminDashboardPlaceholder = () => <h2 style={{ padding: 40 }}>Admin dashboard coming soon</h2>;
const WorkerDashboardPlaceholder = () => <h2 style={{ padding: 40 }}>Worker dashboard coming soon</h2>;

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

            {/* Citizen module */}
            <Route
                path="/citizen"
                element={
                    <ProtectedRoute>
                        <CitizenLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="complaints" element={<MyComplaints />} />
                <Route path="complaints/new" element={<CreateComplaint />} />
                <Route path="complaints/:id" element={<ComplaintDetails />} />
            </Route>

            {/* Admin / Worker — placeholders until those modules are built */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute>
                        <AdminDashboardPlaceholder />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/worker/dashboard"
                element={
                    <ProtectedRoute>
                        <WorkerDashboardPlaceholder />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;