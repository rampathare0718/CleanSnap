import { useEffect, useState } from "react";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  UserCheck,
  Loader2,
  PackageCheck,
  XCircle,
  AlertTriangle,
  HardHat,
  Users,
  Star,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import StatCard from "../../components/dashboard/StatCard";
import Loader from "../../components/common/Loader";
import { getDashboardStats } from "../../services/adminApi";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getDashboardStats();
        setStats(res.data.stats);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Failed to load dashboard stats."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 text-slate-800">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl shadow-indigo-950/30">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 shadow-sm backdrop-blur-sm">
            <ShieldCheck size={14} className="text-amber-400" />
            <span>Admin Control Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300">{user?.fullName || "Admin"}</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg">
            Here's a live snapshot of complaints, workers, and citizen activity across CleanSnap right now.
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-800 shadow-sm">
          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {!error && stats && (
        <>
          {/* Overdue banner, only shown when relevant */}
          {stats.overdue > 0 && (
            <div className="flex items-center gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs font-semibold text-amber-800 shadow-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <p>
                {stats.overdue} complaint{stats.overdue > 1 ? "s are" : " is"} past its deadline and still unresolved.
              </p>
            </div>
          )}

          {/* Complaint status grid */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700">
                <ClipboardList size={18} />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Complaints</h2>
                <p className="text-xs text-slate-500 font-medium">Status breakdown across the whole system</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Complaints" value={stats.totalComplaints} icon={ClipboardList} accent="blue" />
              <StatCard label="Pending" value={stats.pending} icon={Clock} accent="amber" />
              <StatCard label="Approved" value={stats.approved} icon={CheckCircle2} accent="blue" />
              <StatCard label="Assigned" value={stats.assigned} icon={UserCheck} accent="purple" />
              <StatCard label="In Progress" value={stats.inProgress} icon={Loader2} accent="amber" />
              <StatCard label="Completed" value={stats.completed} icon={PackageCheck} accent="emerald" />
              <StatCard label="Rejected" value={stats.rejected} icon={XCircle} accent="blue" />
              <StatCard label="Overdue" value={stats.overdue} icon={AlertTriangle} accent="amber" />
            </div>
          </div>

          {/* Overview: people + ratings */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                <Sparkles size={18} />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Overview</h2>
                <p className="text-xs text-slate-500 font-medium">Community and satisfaction snapshot</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Workers" value={stats.totalWorkers} icon={HardHat} accent="purple" />
              <StatCard label="Total Citizens" value={stats.totalCitizens} icon={Users} accent="blue" />
              <StatCard
                label="Average Rating"
                value={stats.averageRating ? stats.averageRating.toFixed(1) : "N/A"}
                icon={Star}
                accent="amber"
              />
              <StatCard label="Total Ratings" value={stats.totalRatings} icon={Star} accent="amber" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}