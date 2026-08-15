import { NavLink } from "react-router-dom";
import CleanSnapLogo from "../../assets/cleansnap_logo.png";
import {
  LayoutDashboard,
  PlusCircle,
  ListChecks,
  ClipboardList,
  Users,
  HardHat,
  Megaphone,
  UserCircle,
  ClipboardCheck,
  UserCheck,
  Gift,
  Trophy,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const LINKS_BY_ROLE = {
  citizen: [
    { to: "/citizen/dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { to: "/citizen/complaints/new", label: "Report Issue", icon: PlusCircle, badge: "New" },
    { to: "/citizen/complaints", label: "My Complaints", icon: ListChecks, badge: null },
    { to: "/citizen/rewards", label: "Rewards", icon: Gift, badge: null },
    { to: "/citizen/leaderboard", label: "Leaderboard", icon: Trophy, badge: null },
    { to: "/citizen/profile", label: "Profile", icon: UserCircle, badge: null },
  ],
  worker: [
    { to: "/worker/dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { to: "/worker/complaints", label: "Assigned Complaints", icon: ClipboardCheck, badge: null },
    { to: "/worker/profile", label: "Profile", icon: UserCircle, badge: null },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { to: "/admin/complaints", label: "Complaints", icon: ClipboardList, badge: null },
    { to: "/admin/assign-worker", label: "Assign Worker", icon: UserCheck, badge: null },
    { to: "/admin/workers", label: "Workers", icon: HardHat, badge: null },
    { to: "/admin/users", label: "Users", icon: Users, badge: null },
    { to: "/admin/government-updates", label: "Government Updates", icon: Megaphone, badge: null },
    { to: "/admin/leaderboard", label: "Leaderboard", icon: Trophy, badge: null },
    { to: "/admin/profile", label: "Profile", icon: UserCircle, badge: null },
  ],
};

const Sidebar = () => {
  const { user } = useAuth();
  const links = LINKS_BY_ROLE[user?.role] || [];

  return (
    <aside className="hidden md:flex md:flex-col w-72 shrink-0 h-screen sticky top-0 bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-950 text-white p-5 shadow-2xl justify-between overflow-y-auto">
      <div>
        {/* Branding / Logo Box */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg">
          <img
            src={CleanSnapLogo}
            alt="CleanSnap Logo"
            className="w-10 h-10 rounded-xl object-contain shadow-md"
          />
          <div>
            <h1 className="font-black text-lg tracking-wide text-white">CleanSnap</h1>
            <p className="text-[10px] text-indigo-200 font-medium tracking-wider uppercase">
              Community Portal
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="space-y-2.5">
          {links.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `group relative flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-white text-indigo-950 shadow-xl shadow-indigo-950/40 translate-x-1 font-bold"
                    : "text-indigo-100/80 hover:bg-white/10 hover:text-white hover:translate-x-1"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`p-2 rounded-xl transition-colors ${
                        isActive
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-white/5 text-indigo-200 group-hover:bg-white/15 group-hover:text-white"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <span>{label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {badge && (
                      <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-emerald-400 text-indigo-950 shadow-sm">
                        {badge}
                      </span>
                    )}
                    <ChevronRight
                      size={15}
                      className={`transition-transform duration-200 ${
                        isActive
                          ? "opacity-100 translate-x-0 text-indigo-900"
                          : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-indigo-300"
                      }`}
                    />
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Decorative Bottom Vector Graphic Element (Inspired by Reference UI) */}
      <div className="mt-8 pt-4">
        <div className="relative p-4 rounded-2xl bg-gradient-to-tr from-purple-600/40 to-indigo-500/30 border border-white/10 backdrop-blur-sm overflow-hidden text-center space-y-2">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-purple-400/20 rounded-full blur-xl pointer-events-none" />
          <div className="w-9 h-9 mx-auto rounded-xl bg-white/20 flex items-center justify-center text-amber-300 shadow-inner">
            <Sparkles size={20} />
          </div>
          <p className="text-xs font-bold text-white tracking-wide">
            Making Cities Cleaner
          </p>
          <p className="text-[11px] text-indigo-200/80 leading-tight">
            Report local civic issues & earn reward points instantly.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;