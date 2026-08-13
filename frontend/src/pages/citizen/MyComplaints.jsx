import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search, Filter, Sparkles, AlertCircle, Inbox, Tag } from "lucide-react";
import ComplaintCard from "../../components/complaint/ComplaintCard";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { getMyComplaints } from "../../services/complaintApi";

const STATUS_FILTERS = ["All", "Pending", "Approved", "Assigned", "In Progress", "Completed", "Rejected"];

// Multi-tone active states for filter buttons to break up white/grey monotony
const FILTER_ACTIVE_COLORS = {
  All: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-violet-200",
  Pending: "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 shadow-amber-200",
  Approved: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-200",
  Assigned: "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-200",
  "In Progress": "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-cyan-200",
  Completed: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-200",
  Rejected: "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-rose-200",
};

const MyComplaints = () => {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchesStatus = activeFilter === "All" || c.status === activeFilter;
      const matchesSearch =
        c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location?.address?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [complaints, activeFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 text-slate-800">
      
      {/* 🚀 Dynamic Multi-tone Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl shadow-indigo-950/30 transition-transform duration-300 hover:scale-[1.005]">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 shadow-sm backdrop-blur-sm">
              <Sparkles size={14} className="text-amber-400 animate-spin" />
              <span>Issue Management Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300">Complaints</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Track real-time progress on your reported civic issues. Showing{" "}
              <span className="font-extrabold text-amber-300 underline underline-offset-4 decoration-amber-400">
                {filteredComplaints.length}
              </span>{" "}
              of {complaints.length} total logged tickets.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => navigate("/citizen/complaints/new")}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <PlusCircle size={18} />
              <span>New Complaint</span>
            </button>
          </div>
        </div>
      </div>

      {/* 🎛️ Interactive Vibrant Control Panel */}
      <div className="relative bg-gradient-to-br from-violet-50/50 via-indigo-50/30 to-purple-50/40 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-purple-100 space-y-4 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 via-pink-500 to-emerald-400" />

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-600" />
          <input
            type="text"
            placeholder="Search complaints by title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-purple-200/80 bg-white/90 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all shadow-xs"
          />
        </div>

        {/* Filter Pills with Color Themes */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-purple-800 uppercase tracking-wider pr-3 border-r border-purple-200 shrink-0">
            <Filter className="w-3.5 h-3.5 text-purple-600" />
            <span>Filter</span>
          </div>

          <div className="flex items-center gap-2">
            {STATUS_FILTERS.map((status) => {
              const isActive = activeFilter === status;
              const activeBg = FILTER_ACTIVE_COLORS[status] || "bg-purple-600 text-white";

              return (
                <button
                  key={status}
                  onClick={() => setActiveFilter(status)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isActive
                      ? `${activeBg} shadow-md scale-102`
                      : "bg-white/80 text-slate-700 border border-purple-100 hover:bg-purple-100/60 hover:text-purple-900"
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Error Alert Box */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-800 shadow-sm">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4 bg-gradient-to-br from-violet-50/30 to-purple-50/20 backdrop-blur-sm rounded-3xl border border-dashed border-purple-200">
          <Loader />
          <p className="text-xs font-extrabold uppercase tracking-wider text-purple-600 animate-pulse">
            Fetching your complaint records...
          </p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        /* Empty State Container */
        <div className="bg-gradient-to-br from-violet-50/40 via-white to-indigo-50/30 border border-purple-100 rounded-3xl py-16 px-6 text-center shadow-sm space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Inbox size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900">
              No Complaints Found
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {activeFilter === "All" && !searchQuery
                ? "You haven't submitted any civic complaints yet. Click below to start reporting issues in your neighborhood."
                : `We couldn't find any complaints matching "${searchQuery || activeFilter}".`}
            </p>
          </div>

          {activeFilter === "All" && !searchQuery && (
            <div className="pt-2">
              <button
                onClick={() => navigate("/citizen/complaints/new")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow-md hover:scale-105 transition-all active:scale-95"
              >
                <PlusCircle size={16} />
                <span>Submit Your First Ticket</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Complaints Grid Container */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredComplaints.map((c) => (
            <div key={c._id} className="transition-transform duration-300 hover:-translate-y-1">
              <ComplaintCard complaint={c} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplaints;