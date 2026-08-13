import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ListChecks,
  Clock,
  CheckCircle2,
  PlusCircle,
  ListOrdered,
  AlertCircle,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Edit3,
  ArrowUpRight,
  Sparkles,
  Zap,
  Activity,
  Award,
} from "lucide-react";
import StatCard from "../../components/dashboard/StatCard";
import Loader from "../../components/common/Loader";
import { getMyComplaints } from "../../services/complaintApi";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await getMyComplaints();
        setComplaints(data.complaints || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load your complaints.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  // Performance optimized count metrics
  const { total, pending, inProgress, completed, completionRate } = useMemo(() => {
    const tot = complaints.length;
    const pend = complaints.filter((c) => c.status === "Pending").length;
    const prog = complaints.filter((c) =>
      ["Approved", "Assigned", "In Progress"].includes(c.status)
    ).length;
    const comp = complaints.filter((c) => c.status === "Completed").length;
    const rate = tot > 0 ? Math.round((comp / tot) * 100) : 0;

    return { total: tot, pending: pend, inProgress: prog, completed: comp, completionRate: rate };
  }, [complaints]);

  const recentComplaints = complaints.slice(0, 5);
  const initials = (user?.fullName || "U")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const joinedOn = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

  const location = [user?.address?.city, user?.address?.state].filter(Boolean).join(", ") || "—";

  // Dynamic multicolor theme rotation for timeline cards
  const complaintCardThemes = [
    {
      bg: "bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/5 hover:from-violet-500/20 hover:to-indigo-500/15 border-violet-200/80 hover:border-violet-400",
      badge: "bg-violet-600 text-white shadow-md shadow-violet-200",
      btn: "bg-violet-100 text-violet-700 hover:bg-violet-600 hover:text-white hover:scale-105",
      dot: "border-violet-500 bg-violet-100",
    },
    {
      bg: "bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/5 hover:from-emerald-500/20 hover:to-cyan-500/15 border-emerald-200/80 hover:border-emerald-400",
      badge: "bg-emerald-600 text-white shadow-md shadow-emerald-200",
      btn: "bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white hover:scale-105",
      dot: "border-emerald-500 bg-emerald-100",
    },
    {
      bg: "bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/5 hover:from-amber-500/20 hover:to-amber-500/15 border-amber-200/80 hover:border-amber-400",
      badge: "bg-amber-500 text-slate-900 shadow-md shadow-amber-200",
      btn: "bg-amber-100 text-amber-800 hover:bg-amber-500 hover:text-slate-900 hover:scale-105",
      dot: "border-amber-500 bg-amber-100",
    },
    {
      bg: "bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-red-500/5 hover:from-rose-500/20 hover:to-rose-500/15 border-rose-200/80 hover:border-rose-400",
      badge: "bg-rose-600 text-white shadow-md shadow-rose-200",
      btn: "bg-rose-100 text-rose-700 hover:bg-rose-600 hover:text-white hover:scale-105",
      dot: "border-rose-500 bg-rose-100",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-3">
        <Loader />
        <p className="text-sm font-semibold text-purple-600 animate-pulse">
          Loading dashboard experience...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-16 space-y-8 text-slate-800">
      
      {/* 🚀 Dynamic Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl shadow-indigo-950/30 transition-transform duration-300 hover:scale-[1.005]">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 shadow-sm backdrop-blur-sm">
              <Sparkles size={14} className="text-amber-400 animate-spin" />
              <span>Citizen Community Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome Back,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300">
                {user?.fullName?.split(" ")[0] || "Citizen"}
              </span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm">
              Track live civic issue updates and community contributions in real-time.
            </p>
          </div>

          <button
            onClick={() => navigate("/citizen/complaints/new")}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <PlusCircle size={18} />
            <span>New Complaint</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800 shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* ================= LEFT COLUMN ================= */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 👤 Colorful Profile Card with Hover Elevation */}
          <div className="relative bg-gradient-to-br from-violet-50/50 via-indigo-50/30 to-purple-50/40 hover:from-violet-50 hover:to-purple-50 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-purple-100 overflow-hidden group">
            {/* Top Multi-gradient Accent Rail */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-violet-500 via-pink-500 to-emerald-400" />

            <button
              onClick={() => navigate("/citizen/profile")}
              className="absolute top-6 right-6 p-2.5 rounded-xl bg-white/80 text-purple-600 hover:bg-purple-600 hover:text-white transition-all shadow-sm hover:scale-110"
              title="Edit Profile"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            {/* Profile Avatar */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-3xl bg-gradient-to-tr from-violet-600 via-purple-600 to-pink-500 text-white flex items-center justify-center text-3xl font-extrabold shadow-xl shadow-purple-300/50 ring-4 ring-white group-hover:rotate-3 transition-transform duration-300">
                {initials}
              </div>

              {/* Details Info */}
              <div className="flex-1 text-center sm:text-left space-y-3">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-purple-900 transition-colors">
                    {user?.fullName || "Citizen"}
                  </h2>
                  <span className="inline-block mt-1 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-[11px] font-bold border border-emerald-300/60 shadow-xs">
                    Verified Community Resident
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5 font-medium">
                  <p className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-slate-400">Joined:</span>{" "}
                    <span className="text-slate-800 font-bold">{joinedOn}</span>
                  </p>
                  <p className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-slate-400">Location:</span>{" "}
                    <span className="text-slate-800 font-bold">{location}</span>
                  </p>
                  <p className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-slate-400">E-mail:</span>{" "}
                    <span className="text-slate-800 font-bold">{user?.email || "—"}</span>
                  </p>
                  <p className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-slate-400">Phone:</span>{" "}
                    <span className="text-slate-800 font-bold">{user?.mobileNumber || "—"}</span>
                  </p>
                </div>

                {/* Interactive Multi-tone Social / Contact Icons */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2.5 pt-2">
                  <span className="p-2.5 bg-violet-100 text-violet-700 rounded-xl hover:bg-violet-600 hover:text-white hover:-translate-y-1 transition-all duration-200 cursor-pointer shadow-xs">
                    <Mail className="w-4 h-4" />
                  </span>
                  <span className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-600 hover:text-white hover:-translate-y-1 transition-all duration-200 cursor-pointer shadow-xs">
                    <Phone className="w-4 h-4" />
                  </span>
                  <span className="p-2.5 bg-amber-100 text-amber-800 rounded-xl hover:bg-amber-500 hover:text-white hover:-translate-y-1 transition-all duration-200 cursor-pointer shadow-xs">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <span className="p-2.5 bg-pink-100 text-pink-700 rounded-xl hover:bg-pink-600 hover:text-white hover:-translate-y-1 transition-all duration-200 cursor-pointer shadow-xs">
                    <CalendarDays className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 📋 Complaints Activity Timeline Container */}
          <div className="bg-gradient-to-br from-slate-50/80 via-white to-purple-50/20 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-shadow border border-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-purple-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700 shadow-xs">
                  <Activity size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Recent Complaints</h3>
                  <p className="text-xs text-slate-500">Live timeline of reported issues</p>
                </div>
              </div>

              <button
                onClick={() => navigate("/citizen/complaints")}
                className="text-xs font-extrabold text-purple-600 hover:text-purple-800 underline underline-offset-4 hover:scale-105 transition-transform"
              >
                View All
              </button>
            </div>

            {recentComplaints.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-indigo-50/40 rounded-2xl border border-dashed border-indigo-200">
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-3 shadow-inner">
                  <PlusCircle className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-800">No complaints reported yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5">
                  Start by logging issues in your community to track resolutions live.
                </p>
                <button
                  onClick={() => navigate("/citizen/complaints/new")}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md hover:scale-105 transition-all active:scale-95"
                >
                  Report Your First Issue
                </button>
              </div>
            ) : (
              <div className="space-y-4 relative pl-2">
                {/* Vertical Gradient Timeline Rail */}
                <div className="absolute left-5 top-4 bottom-4 w-1.5 bg-gradient-to-b from-violet-400 via-teal-400 to-amber-400 rounded-full z-0 opacity-40" />

                {recentComplaints.map((c, idx) => {
                  const theme = complaintCardThemes[idx % complaintCardThemes.length];
                  return (
                    <div key={c._id || idx} className="relative z-10 flex items-center gap-4 group">
                      {/* Interactive Timeline Dot */}
                      <div className={`w-7 h-7 rounded-full border-4 ${theme.dot} shrink-0 shadow-sm flex items-center justify-center group-hover:scale-125 transition-transform duration-200`}>
                        <div className="w-2 h-2 bg-slate-800 rounded-full" />
                      </div>

                      {/* Content Card */}
                      <div className={`flex-1 ${theme.bg} border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}>
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-900 text-sm">{c.title || c.category || "Issue Report"}</h4>
                          <p className="text-xs text-slate-600 line-clamp-1">
                            {c.description || "No additional description provided."}
                          </p>
                          <div className="pt-1">
                            <span className="text-[11px] font-semibold text-slate-500">
                              Status: <strong className="text-slate-800">{c.status}</strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                          <span className={`px-3 py-1 rounded-xl text-xs font-extrabold ${theme.badge}`}>
                            {c.status}
                          </span>
                          <button
                            onClick={() => navigate(`/citizen/complaints/${c._id}`)}
                            className={`p-2.5 rounded-xl transition-all shadow-xs ${theme.btn}`}
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="space-y-8">
          
          {/* 📊 Overview Statistics Card */}
          <div className="bg-gradient-to-br from-amber-50/40 via-white to-purple-50/30 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 space-y-5">
            <div className="flex items-center gap-2.5 pb-2 border-b border-amber-100">
              <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 shadow-xs">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Overview Statistics</h3>
                <p className="text-xs text-slate-500">Real-time status breakdown</p>
              </div>
            </div>

            {/* Stat Cards Subgrid with Hover Scaling */}
            <div className="grid grid-cols-2 gap-3">
              <div className="transition-transform duration-200 hover:scale-105">
                <StatCard label="Total" value={total} icon={ListChecks} accent="purple" />
              </div>
              <div className="transition-transform duration-200 hover:scale-105">
                <StatCard label="Pending" value={pending} icon={Clock} accent="amber" />
              </div>
              <div className="transition-transform duration-200 hover:scale-105">
                <StatCard label="In Progress" value={inProgress} icon={ListOrdered} accent="blue" />
              </div>
              <div className="transition-transform duration-200 hover:scale-105">
                <StatCard label="Completed" value={completed} icon={CheckCircle2} accent="emerald" />
              </div>
            </div>

            {/* Glowing Resolution Rate Bar */}
            <div className="rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-indigo-500/15 hover:from-emerald-500/25 hover:to-indigo-500/25 border border-emerald-300/80 p-4 flex items-center justify-between transition-all duration-300 shadow-xs">
              <div className="space-y-0.5">
                <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                  Resolution Rate
                </span>
                <span className="text-[11px] text-emerald-800 font-bold">Community Impact Score</span>
              </div>
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700">
                {completionRate}%
              </span>
            </div>
          </div>

          {/* 🌟 Dynamic Action Banner */}
          <div className="relative bg-gradient-to-br from-purple-800 via-indigo-800 to-teal-800 rounded-3xl p-6 text-white shadow-xl shadow-purple-900/30 hover:shadow-2xl hover:shadow-purple-900/40 transition-all duration-300 space-y-5 overflow-hidden hover:-translate-y-1">
            {/* Background Glow Spheres */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-pink-500/25 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-400/25 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20">
                <Award size={14} />
                <span>Civic Hero Action</span>
              </div>
              <h3 className="text-lg font-bold leading-snug">
                Keep your neighborhood clean & safe
              </h3>
              <p className="text-xs text-purple-100/90 leading-relaxed">
                Log civic issues directly to help local authorities resolve them quickly.
              </p>
            </div>

            <ul className="relative z-10 space-y-2.5 text-xs text-purple-100 font-medium">
              <li className="flex items-center gap-2">
                <span className="p-1 rounded-full bg-emerald-400/20 text-emerald-300">
                  <Zap size={12} />
                </span>
                <span>Snap photos with instant auto-location</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="p-1 rounded-full bg-amber-400/20 text-amber-300">
                  <Zap size={12} />
                </span>
                <span>Track live ticket assignment progress</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="p-1 rounded-full bg-cyan-400/20 text-cyan-300">
                  <Zap size={12} />
                </span>
                <span>Earn reward points upon resolution</span>
              </li>
            </ul>

            <button
              onClick={() => navigate("/citizen/complaints/new")}
              className="relative z-10 w-full py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-900 font-extrabold text-xs rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-102 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>Report An Issue Now</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;