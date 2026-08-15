import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Topbar from "../components/layout/Topbar";

const PAGE_TITLES = {
    "/admin/dashboard": "Dashboard",
    "/admin/complaints": "Complaints",
    "/admin/workers": "Workers",
    "/admin/users": "Users",
    "/admin/government-updates": "Government Updates",
    "/admin/leaderboard": "Leaderboard",
    "/admin/profile": "Profile",
};

const getPageTitle = (pathname) => {
    if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
    if (pathname.startsWith("/admin/complaints/")) return "Complaint Details";
    if (pathname.startsWith("/admin/government-updates/")) return "Government Update";
    return "CleanSnap Admin";
};

const AdminLayout = () => {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-neutral-50">
            <Sidebar />
            <Navbar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

            <div className="flex-1 min-w-0">
                <Topbar
                    title={getPageTitle(location.pathname)}
                    onMenuClick={() => setMobileNavOpen(true)}
                />
                <main className="p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;