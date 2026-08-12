import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ListChecks, 
  Clock, 
  CheckCircle2, 
  PlusCircle, 
  ListOrdered, 
  ArrowRight, 
  AlertCircle,
  TrendingUp,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import StatCard from "../../components/dashboard/StatCard";
import QuickAction from "../../components/dashboard/QuickAction";
import RecentComplaintCard from "../../components/dashboard/RecentComplaintCard";
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
  const firstName = user?.fullName?.split(" ")[0] || "there";

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-3">
        <Loader />
        <p className="text-sm font-medium text-emerald-800/60 animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Banner with Background Image & Gradient Mesh */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-teal-700 to-sky-800 p-6 sm:p-10 text-white shadow-xl shadow-emerald-950/15">
        {/* Background Decorative Logo & Glow Effects */}
        <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none select-none">
          <img 
            src="/cleansnap_logo.png" 
            alt="CleanSnap Background" 
            className="w-96 h-96 object-contain"
          />
        </div>
        <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>CleanSnap Citizen Hub</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Welcome back, {firstName}! 👋
            </h1>
            <p className="text-emerald-50/90 text-sm sm:text-base leading-relaxed">
              Clean Today, Better Tomorrow. Keep track of your reported civic issues and watch real-time resolution progress.
            </p>
          </div>

          {/* Metric Glass Pill */}
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex items-center gap-4 min-w-[220px] shadow-lg">
            <div className="p-3 bg-white/20 rounded-xl border border-white/10 shrink-0">
              <TrendingUp className="w-7 h-7 text-emerald-200" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Resolution Rate</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold tracking-tight">{completionRate}%</span>
                <span className="text-xs font-medium text-emerald-200">resolved</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-red-50/90 border border-red-200 p-4 text-sm text-red-800 shadow-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Stat Cards Section */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Overview Statistics</h2>
          </div>
          <span className="text-xs text-neutral-400 font-semibold bg-neutral-100 px-2.5 py-1 rounded-full">Live Sync</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            label="Total Complaints" 
            value={total} 
            icon={ListChecks} 
            accent="emerald" 
          />
          <StatCard 
            label="Pending Review" 
            value={pending} 
            icon={Clock} 
            accent="amber" 
          />
          <StatCard 
            label="In Progress" 
            value={inProgress} 
            icon={ListOrdered} 
            accent="blue" 
          />
          <StatCard 
            label="Completed" 
            value={completed} 
            icon={CheckCircle2} 
            accent="purple" 
          />
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-4 px-1">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <QuickAction
            icon={PlusCircle}
            label="Report a New Issue"
            description="Spotted waste or an unclean area? Snap a photo and submit a geo-tagged report in seconds."
            onClick={() => navigate("/citizen/complaints/new")}
          />
          <QuickAction
            icon={ListChecks}
            label="View All My Complaints"
            description="Monitor live status updates, assigned workers, and verified resolution proof photos."
            onClick={() => navigate("/citizen/complaints")}
          />
        </div>
      </div>

      {/* Recent Complaints Section with Card Branding Watermark */}
      <div className="relative bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none select-none">
          <img src="/cleansnap_logo.png" alt="CleanSnap Logo" className="w-56 h-56 object-contain" />
        </div>

        <div className="relative z-10 flex items-center justify-between border-b border-neutral-100 pb-4 mb-4">
          <div>
            <h3 className="font-bold text-lg text-neutral-900">Recent Activity</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Your latest reported environmental issues</p>
          </div>
          {complaints.length > 0 && (
            <button
              onClick={() => navigate("/citizen/complaints")}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline group transition-all"
            >
              <span>View all</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>

        {recentComplaints.length === 0 ? (
          <div className="relative z-10 flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-3 border border-emerald-100 shadow-sm">
              <PlusCircle className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-neutral-800">No complaints reported yet</h4>
            <p className="max-w-sm text-xs sm:text-sm text-neutral-500 mt-1 mb-6">
              When you submit an issue, real-time status updates and resolution proofs will appear here.
            </p>
            <button
              onClick={() => navigate("/citizen/complaints/new")}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all active:scale-95"
            >
              Report Your First Issue
            </button>
          </div>
        ) : (
          <div className="relative z-10 divide-y divide-neutral-100">
            {recentComplaints.map((c) => (
              <div key={c._id} className="py-2 first:pt-0 last:pb-0">
                <RecentComplaintCard complaint={c} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;