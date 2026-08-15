import { Routes, Route, Navigate } from "react-router-dom";

import CleanSnapLanding from "../pages/auth/CleanSnapLanding";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Loader from "../components/common/Loader";

import { useAuth } from "../context/AuthContext";
import UpdatesList from "../pages/government/UpdatesList";

// =========================
// Citizen
// =========================
import CitizenLayout from "../layouts/CitizenLayout";
import CitizenDashboard from "../pages/citizen/Dashboard";
import CreateComplaint from "../pages/citizen/CreateComplaint";
import MyComplaints from "../pages/citizen/MyComplaints";
import CitizenComplaintDetails from "../pages/citizen/ComplaintDetails";
import CitizenProfile from "../pages/citizen/Profile";

// =========================
// Worker
// =========================
import WorkerLayout from "../layouts/WorkerLayout";
import WorkerDashboard from "../pages/worker/Dashboard";
import AssignedComplaints from "../pages/worker/AssignedComplaints";
import WorkerComplaintDetails from "../pages/worker/ComplaintDetails";
import UploadProof from "../pages/worker/UploadProof";
import WorkerProfile from "../pages/worker/Profile";

// =========================
// Admin
// =========================
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminComplaints from "../pages/admin/Complaints";
import AdminComplaintDetails from "../pages/admin/ComplaintDetails";
import AssignWorker from "../pages/admin/AssignWorker";
import AdminWorkers from "../pages/admin/Workers";
import AdminUsers from "../pages/admin/Users";
import AdminProfile from "../pages/admin/Profile";

// =========================
// Government Updates
// =========================
import GovernmentUpdates from "../pages/government/GovernmentUpdates";
import UpdateDetails from "../pages/government/UpdateDetails";
import CreateUpdate from "../pages/government/CreateUpdate";
import EditUpdate from "../pages/government/EditUpdate";

// =========================
// Rewards
// =========================
import Rewards from "../pages/rewards/Rewards";
import Leaderboard from "../pages/rewards/Leaderboard";


// ==========================================================
// Role Home
// ==========================================================

const ROLE_HOME = {
    citizen: "/citizen/dashboard",
    worker: "/worker/dashboard",
    admin: "/admin/dashboard"
};


// ==========================================================
// Public Only Route
// Prevent logged-in users from accessing Login/Register
// ==========================================================

const PublicOnlyRoute = ({ children }) => {

    const {
        isAuthenticated,
        loading,
        user
    } = useAuth();

    if (loading) {
        return <Loader fullScreen />;
    }

    if (!isAuthenticated) {
        return children;
    }

    return (
        <Navigate
            to={ROLE_HOME[user?.role] || "/login"}
            replace
        />
    );
};


// ==========================================================
// Protected Route
// Authentication + Role Authorization
// ==========================================================

const ProtectedRoute = ({ allowedRoles, children }) => {

    const {
        isAuthenticated,
        loading,
        user
    } = useAuth();

    if (loading) {
        return <Loader fullScreen />;
    }

    // User is not logged in
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // User has wrong role
    if (
        allowedRoles &&
        !allowedRoles.includes(user?.role)
    ) {
        return (
            <Navigate
                to={ROLE_HOME[user?.role] || "/login"}
                replace
            />
        );
    }

    return children;
};


// ==========================================================
// App Routes
// ==========================================================

const AppRoutes = () => {

    return (
        <Routes>

            {/* ==================================================
                ROOT
                Logged-out visitors see the landing page.
                Logged-in users are bounced straight to their
                role's dashboard (same rule PublicOnlyRoute already
                applies to /login and /register).
            ================================================== */}

            <Route
                path="/"
                element={
                    <PublicOnlyRoute>
                        <CleanSnapLanding />
                    </PublicOnlyRoute>
                }
            />


            {/* ==================================================
                AUTH ROUTES
            ================================================== */}

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


            {/* ==================================================
                PUBLIC GOVERNMENT UPDATE VIEWS
                Accessible to everyone — logged out visitors,
                citizens, workers, and admins alike
            ================================================== */}

            <Route
                path="/updates"
                element={<UpdatesList />}
            />

            <Route
                path="/updates/:id"
                element={<UpdateDetails />}
            />


            {/* ==================================================
                CITIZEN MODULE
            ================================================== */}

            <Route
                path="/citizen"
                element={
                    <ProtectedRoute
                        allowedRoles={["citizen"]}
                    >
                        <CitizenLayout />
                    </ProtectedRoute>
                }
            >

                <Route
                    path="dashboard"
                    element={<CitizenDashboard />}
                />

                <Route
                    path="complaints"
                    element={<MyComplaints />}
                />

                <Route
                    path="complaints/new"
                    element={<CreateComplaint />}
                />

                <Route
                    path="complaints/:id"
                    element={<CitizenComplaintDetails />}
                />

                <Route
                    path="profile"
                    element={<CitizenProfile />}
                />

                {/* Rewards */}
                <Route
                    path="rewards"
                    element={<Rewards />}
                />

                <Route
                    path="leaderboard"
                    element={<Leaderboard />}
                />

            </Route>


            {/* ==================================================
                WORKER MODULE
            ================================================== */}

            <Route
                path="/worker"
                element={
                    <ProtectedRoute
                        allowedRoles={["worker"]}
                    >
                        <WorkerLayout />
                    </ProtectedRoute>
                }
            >

                <Route
                    path="dashboard"
                    element={<WorkerDashboard />}
                />

                <Route
                    path="complaints"
                    element={<AssignedComplaints />}
                />

                <Route
                    path="complaints/:id"
                    element={<WorkerComplaintDetails />}
                />

                <Route
                    path="complaints/:id/upload-proof"
                    element={<UploadProof />}
                />

                <Route
                    path="profile"
                    element={<WorkerProfile />}
                />

            </Route>


            {/* ==================================================
                ADMIN MODULE
            ================================================== */}

            <Route
                path="/admin"
                element={
                    <ProtectedRoute
                        allowedRoles={["admin"]}
                    >
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >

                {/* Admin Dashboard */}
                <Route
                    path="dashboard"
                    element={<AdminDashboard />}
                />

                {/* Complaint Management */}
                <Route
                    path="complaints"
                    element={<AdminComplaints />}
                />

                <Route
                    path="complaints/:id"
                    element={<AdminComplaintDetails />}
                />

                {/* Assign Worker */}
                <Route
                    path="assign-worker"
                    element={<AssignWorker />}
                />

                {/* Worker Management */}
                <Route
                    path="workers"
                    element={<AdminWorkers />}
                />

                {/* User Management */}
                <Route
                    path="users"
                    element={<AdminUsers />}
                />

                {/* Admin Profile */}
                <Route
                    path="profile"
                    element={<AdminProfile />}
                />

                {/* Government Update Management */}
                <Route
                    path="government-updates"
                    element={<GovernmentUpdates />}
                />

                <Route
                    path="government-updates/create"
                    element={<CreateUpdate />}
                />

                <Route
                    path="government-updates/:id"
                    element={<UpdateDetails />}
                />

                <Route
                    path="government-updates/:id/edit"
                    element={<EditUpdate />}
                />

                {/* Reward Leaderboard (admin view) */}
                <Route
                    path="leaderboard"
                    element={<Leaderboard />}
                />

            </Route>


            {/* ==================================================
                404
            ================================================== */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />

        </Routes>
    );
};

export default AppRoutes;