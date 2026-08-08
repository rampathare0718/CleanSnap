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

import WorkerLayout from "../layouts/WorkerLayout";
import WorkerDashboard from "../pages/worker/Dashboard";
import AssignedComplaints from "../pages/worker/AssignedComplaints";
import WorkerComplaintDetails from "../pages/worker/ComplaintDetails";
import UploadProof from "../pages/worker/UploadProof";
import WorkerProfile from "../pages/worker/Profile";

const ROLE_HOME = {
    citizen: "/citizen/dashboard",
    worker: "/worker/dashboard",
    admin: "/admin/dashboard"
};

// Blocks logged-in users from re-visiting /login or /register
const PublicOnlyRoute = ({ children }) => {
    const { isAuthenticated, loading, user } = useAuth();
    if (loading) return <Loader fullScreen />;
    if (!isAuthenticated) return children;

    return <Navigate to={ROLE_HOME[user?.role] || "/login"} replace />;
};

// Blocks anonymous users AND blocks the wrong role from a section.
// e.g. a "worker" hitting /citizen/dashboard directly gets bounced to
// /worker/dashboard instead of rendering the citizen page — this is the
// actual fix for a worker ever seeing the citizen dashboard.
const ProtectedRoute = ({ allowedRoles, children }) => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) return <Loader fullScreen />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to={ROLE_HOME[user?.role] || "/login"} replace />;
    }

    return children;
};

// Placeholder — swap in the real module once it's built
const AdminDashboardPlaceholder = () => <h2 style={{ padding: 40 }}>Admin dashboard coming soon</h2>;

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

            {/* Citizen module — only role "citizen" can enter */}
            <Route
                path="/citizen"
                element={
                    <ProtectedRoute allowedRoles={["citizen"]}>
                        <CitizenLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="complaints" element={<MyComplaints />} />
                <Route path="complaints/new" element={<CreateComplaint />} />
                <Route path="complaints/:id" element={<ComplaintDetails />} />
            </Route>

            {/* Worker module — only role "worker" can enter */}
            <Route
                path="/worker"
                element={
                    <ProtectedRoute allowedRoles={["worker"]}>
                        <WorkerLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<WorkerDashboard />} />
                <Route path="complaints" element={<AssignedComplaints />} />
                <Route path="complaints/:id" element={<WorkerComplaintDetails />} />
                <Route path="complaints/:id/upload-proof" element={<UploadProof />} />
                <Route path="profile" element={<WorkerProfile />} />
            </Route>

            {/* Admin module — only role "admin" can enter (placeholder for now) */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminDashboardPlaceholder />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;