import { NavLink } from "react-router-dom";
import { LayoutDashboard, PlusCircle, ListChecks } from "lucide-react";

const links = [
    { to: "/citizen/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/citizen/complaints/new", label: "Report Issue", icon: PlusCircle },
    { to: "/citizen/complaints", label: "My Complaints", icon: ListChecks }
];

const Sidebar = () => {
    return (
        <aside className="hidden md:flex md:flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-neutral-200 bg-white">
            <div className="flex items-center gap-2.5 px-6 h-16 border-b border-neutral-200">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-xs">
                    CS
                </span>
                <span className="font-bold text-neutral-900">CleanSnap</span>
            </div>

            <nav className="flex-1 px-3 py-5 space-y-1">
                {links.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end
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
        </aside>
    );
};

export default Sidebar;