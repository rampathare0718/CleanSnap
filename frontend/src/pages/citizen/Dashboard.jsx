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
  Mail,
  Phone,
  MapPin,
  CalendarDays,
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
  const initials = (user?.fullName || "U")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const joinedOn = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

  const location = [user?.address?.city, user?.address?.state].filter(Boolean).join(", ") || "—";

  // Status accent used for the timeline dot + badge on each recent complaint
  const statusAccent = {
    Pending: { dot: "bg-amber-500", badge: "bg-amber-100 text-amber-700" },
    Approved: { dot: "bg-blue-500", badge: "bg-blue-100 text-blue-700" },
    Assigned: { dot: "bg-blue-500", badge: "bg-blue-100 text-blue-700" },
    "In Progress": { dot: "bg-blue-500", badge: "bg-blue-100 text-blue-700" },
    Completed: { dot: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700" },
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-3">
        <Loader />
        <p className="text-sm font-medium text-emerald-800/60 animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-6">
      {/* Page heading */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Clean Today, Better Tomorrow.</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-red-50/90 border border-red-200 p-4 text-sm text-red-800 shadow-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ================= LEFT COLUMN ================= */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile card */}
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 shrink-0 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-neutral-900">{user?.fullName || "Citizen"}</h2>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-neutral-600">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Joined: {joinedOn}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{location}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{user?.email || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{user?.mobileNumber || "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent complaints, styled as a status timeline */}
          <div className="relative bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-5">
              <div>
                <h3 className="font-bold text-lg text-neutral-900">My Complaints</h3>
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
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
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
              <div className="space-y-0">
                {recentComplaints.map((c, idx) => {
                  const accent = statusAccent[c.status] || statusAccent.Pending;
                  const isLast = idx === recentComplaints.length - 1;
                  return (
                    <div key={c._id} className="relative flex gap-4 pb-6 last:pb-0">
                      {/* Timeline rail */}
                      <div className="flex flex-col items-center">
                        <span className={`w-3 h-3 rounded-full ${accent.dot} ring-4 ring-white shadow`} />
                        {!isLast && <span className="w-px flex-1 bg-neutral-200 mt-1" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <RecentComplaintCard complaint={c} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="space-y-6">
          {/* Stats card */}
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-neutral-900">Overview Statistics</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Total" value={total} icon={ListChecks} accent="emerald" />
              <StatCard label="Pending" value={pending} icon={Clock} accent="amber" />
              <StatCard label="In Progress" value={inProgress} icon={ListOrdered} accent="blue" />
              <StatCard label="Completed" value={completed} icon={CheckCircle2} accent="purple" />
            </div>
            <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 flex items-baseline justify-between">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Resolution Rate</span>
              <span className="text-xl font-extrabold text-emerald-700">{completionRate}%</span>
            </div>
          </div>

          {/* Quick actions, styled like the reference's premium CTA panel */}
          <div className="bg-gradient-to-br from-emerald-700 via-teal-700 to-sky-800 rounded-2xl p-6 text-white shadow-lg space-y-4">
            <h3 className="text-lg font-bold leading-snug">Keep your neighborhood spotless</h3>
            <p className="text-sm text-emerald-50/85">
              Report issues as you spot them and track every resolution in real time.
            </p>
            <div className="space-y-3 pt-1">
              <QuickAction
                icon={PlusCircle}
                label="Report a New Issue"
                description="Snap a photo and submit a geo-tagged report in seconds."
                onClick={() => navigate("/citizen/complaints/new")}
              />
              <QuickAction
                icon={ListChecks}
                label="View All My Complaints"
                description="Monitor live status updates and resolution proof photos."
                onClick={() => navigate("/citizen/complaints")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;