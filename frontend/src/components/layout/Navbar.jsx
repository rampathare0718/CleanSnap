import { NavLink } from "react-router-dom";
import { LayoutDashboard, PlusCircle, ListChecks, X } from "lucide-react";

const links = [
    { to: "/citizen/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/citizen/complaints/new", label: "Report Issue", icon: PlusCircle },
    { to: "/citizen/complaints", label: "My Complaints", icon: ListChecks }
];

const Navbar = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            {/* Drawer */}
            <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col">
                <div className="flex items-center justify-between px-5 h-16 border-b border-neutral-200">
                    <div className="flex items-center gap-2.5">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-xs">
                            CS
                        </span>
                        <span className="font-bold text-neutral-900">CleanSnap</span>
                    </div>
                    <button onClick={onClose} className="text-neutral-500 hover:text-neutral-800">
                        <X size={22} />
                    </button>
                </div>

                <nav className="flex-1 px-3 py-5 space-y-1">
                    {links.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                                    isActive
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "text-neutral-600 hover:bg-neutral-50"
                                }`
                            }
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default Navbar;