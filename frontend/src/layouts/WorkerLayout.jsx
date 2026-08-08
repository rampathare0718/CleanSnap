import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Topbar from "../components/layout/Topbar";

const PAGE_TITLES = {
    "/worker/dashboard": "Dashboard",
    "/worker/complaints": "Assigned Tasks",
    "/worker/profile": "My Profile"
};

const getPageTitle = (pathname) => {
    if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
    if (pathname.endsWith("/upload-proof")) return "Upload Proof";
    if (pathname.startsWith("/worker/complaints/")) return "Task Details";
    return "CleanSnap";
};

const WorkerLayout = () => {
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

export default WorkerLayout;