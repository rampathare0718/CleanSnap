import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getMyNotifications, markNotificationAsRead } from "../../services/notificationApi";
import ComplaintStatusBadge from "../complaint/ComplaintStatusBadge";

const Topbar = ({ title, onMenuClick }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [notifOpen, setNotifOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const notifRef = useRef(null);
    const userRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
            if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const loadNotifications = async () => {
        try {
            const data = await getMyNotifications({ limit: 5 });
            setNotifications(data.data || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (err) {
            console.error("Failed to load notifications:", err);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleBellClick = () => {
        setNotifOpen((prev) => !prev);
        if (!notifOpen) loadNotifications();
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.isRead) {
            try {
                await markNotificationAsRead(notification._id);
                setUnreadCount((prev) => Math.max(0, prev - 1));
                setNotifications((prev) =>
                    prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n))
                );
            } catch (err) {
                console.error("Failed to mark notification as read:", err);
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-neutral-200">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="md:hidden text-neutral-600 hover:text-neutral-900"
                >
                    <Menu size={22} />
                </button>
                <h1 className="text-lg font-semibold text-neutral-900">{title}</h1>
            </div>

            <div className="flex items-center gap-3">
                {/* Notification bell */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={handleBellClick}
                        className="relative flex items-center justify-center w-10 h-10 rounded-full text-neutral-600 hover:bg-neutral-100"
                    >
                        <Bell size={19} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
                        )}
                    </button>

                    {notifOpen && (
                        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-neutral-200 rounded-xl shadow-lg">
                            <div className="px-4 py-3 border-b border-neutral-100 font-semibold text-sm text-neutral-900">
                                Notifications
                            </div>

                            {notifications.length === 0 ? (
                                <p className="px-4 py-6 text-sm text-neutral-400 text-center">
                                    No notifications yet.
                                </p>
                            ) : (
                                notifications.map((n) => (
                                    <div
                                        key={n._id}
                                        onClick={() => handleNotificationClick(n)}
                                        className={`px-4 py-3 border-b border-neutral-50 last:border-0 cursor-pointer hover:bg-neutral-50 ${
                                            !n.isRead ? "bg-emerald-50/40" : ""
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-sm font-medium text-neutral-900">{n.title}</p>
                                            {n.complaint?.status && (
                                                <ComplaintStatusBadge status={n.complaint.status} />
                                            )}
                                        </div>
                                        <p className="text-xs text-neutral-500 mt-0.5">{n.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* User menu */}
                <div className="relative" ref={userRef}>
                    <button
                        onClick={() => setUserMenuOpen((prev) => !prev)}
                        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-neutral-100"
                    >
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white text-sm font-semibold">
                            {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                        <span className="hidden sm:block text-sm font-medium text-neutral-700">
                            {user?.fullName}
                        </span>
                        <ChevronDown size={16} className="text-neutral-400" />
                    </button>

                    {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-44 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                            >
                                <LogOut size={16} />
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Topbar;