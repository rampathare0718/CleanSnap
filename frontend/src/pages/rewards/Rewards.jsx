import { useState, useEffect } from "react";
import {
  Award,
  Sparkles,
  TrendingUp,
  History,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Gift,
  Calendar,
  FileText,
  Zap,
} from "lucide-react";
import { rewardApi } from "../../services/rewardApi";
import PointsCard from "../../components/reward/PointsCard";
import Loader from "../../components/common/Loader";

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await rewardApi.getMy({ page, limit: 8 });
      setRewards(data.data);
      setTotalPoints(data.totalPoints);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your rewards.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (loading && page === 1) return <Loader fullScreen />;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 text-slate-800">
      
      {/* 🚀 Dynamic Hero Banner (Matches Report Complaint & Dashboard Header) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl shadow-indigo-950/30 transition-transform duration-300 hover:scale-[1.005]">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Header Title Info */}
          <div className="md:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 shadow-sm backdrop-blur-sm">
              <Sparkles size={14} className="text-amber-400 animate-spin" />
              <span>Civic Impact Rewards</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300">Rewards & Points</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg">
              Earn points every time you report and help resolve community issues.
              Redeem civic badges and boost your local community rank!
            </p>
          </div>

          {/* Points Highlight Container */}
          <div className="md:col-span-5 flex justify-start md:justify-end">
            <div className="w-full max-w-xs bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-300">
              <PointsCard points={totalPoints} />
            </div>
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

      {/* 📝 Main Colorful History Container */}
      <div className="relative bg-gradient-to-br from-violet-50/50 via-indigo-50/30 to-purple-50/40 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-purple-100 overflow-hidden space-y-6">
        {/* Top Multi-gradient Accent Rail */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-violet-500 via-pink-500 to-emerald-400" />

        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-purple-100/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-violet-100 text-violet-700 shadow-xs">
              <History size={18} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Reward History
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Log of earned impact points from your civic contributions
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-extrabold border border-emerald-200 shadow-xs">
            <TrendingUp size={14} className="text-emerald-600" />
            <span>Active Contributor</span>
          </div>
        </div>

        {/* History List or Empty State */}
        {rewards.length === 0 ? (
          <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
            <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Gift size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-800">
                No Rewards Earned Yet
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Resolved complaints earn you points! Report issues in your area to start building your civic score.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {rewards.map((reward) => (
              <div
                key={reward._id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white via-slate-50/80 to-purple-50/30 hover:from-amber-50/40 hover:via-purple-50/40 hover:to-indigo-50/40 border border-purple-100/80 hover:border-purple-300 p-4 sm:px-5 sm:py-4 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-3.5">
                  {/* Badge Icon Box */}
                  <div className="p-3 bg-violet-100/80 group-hover:bg-amber-100/80 text-violet-700 group-hover:text-amber-700 rounded-2xl border border-violet-200 group-hover:border-amber-300 transition-colors shadow-xs shrink-0">
                    <Award size={20} />
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug">
                      {reward.reason}
                    </p>

                    {reward.complaint?.title && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <FileText size={12} className="text-purple-600 shrink-0" />
                        <span className="truncate max-w-xs sm:max-w-md">
                          {reward.complaint.title}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold pt-0.5">
                      <Calendar size={12} className="shrink-0 text-slate-400" />
                      <span>{new Date(reward.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Colorful Points Pill */}
                <div className="self-end sm:self-center shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-xs transition-transform group-hover:scale-105 ${
                      reward.points > 0
                        ? "bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-700 border border-emerald-300/80"
                        : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}
                  >
                    <Zap size={13} className="text-emerald-600 fill-emerald-500" />
                    +{reward.points} PTS
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pt-4 border-t border-purple-100 flex items-center justify-between">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-purple-200 bg-white text-purple-700 text-xs font-extrabold hover:bg-purple-600 hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-purple-700 transition shadow-xs active:scale-95"
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-8 w-8 rounded-xl text-xs font-extrabold transition-all duration-200 active:scale-95 ${
                    p === page
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200 scale-105"
                      : "bg-white text-slate-700 border border-purple-100 hover:bg-purple-100/60 hover:text-purple-900"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-purple-200 bg-white text-purple-700 text-xs font-extrabold hover:bg-purple-600 hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-purple-700 transition shadow-xs active:scale-95"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;