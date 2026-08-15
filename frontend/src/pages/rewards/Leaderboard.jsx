import { useState, useEffect } from "react";
import { Trophy, Sparkles, AlertCircle, Medal, Flame } from "lucide-react";
import { rewardApi } from "../../services/rewardApi";
import { useAuth } from "../../context/AuthContext";
import LeaderboardTable from "../../components/reward/LeaderboardTable";
import PointsCard from "../../components/reward/PointsCard";
import Loader from "../../components/common/Loader";

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [myPoints, setMyPoints] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const calls = [rewardApi.getLeaderboard(10)];
        // Admins don't have a rewardPoints concept — only fetch "my points" for citizens
        if (user?.role === "citizen") {
          calls.push(rewardApi.getMy({ limit: 1 }));
        }

        const results = await Promise.all(calls);
        setLeaderboard(results[0].data);
        if (results[1]) setMyPoints(results[1].totalPoints);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load leaderboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.role]);

  if (loading) return <Loader fullScreen />;

  const myRankInTop10 = leaderboard.findIndex((u) => u._id === user?._id) + 1;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 text-slate-800">
      
      {/* 🚀 Dynamic Hero Banner (Matches Report & Rewards Header) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl shadow-indigo-950/30 transition-transform duration-300 hover:scale-[1.005]">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Header Title Info */}
          <div className="md:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 shadow-sm backdrop-blur-sm">
              <Sparkles size={14} className="text-amber-400 animate-spin" />
              <span>Community Champions</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Reward <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300">Leaderboard</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg">
              Recognizing the top civic heroes keeping our city clean and safe. Report issues, earn impact points, and claim your place at the top!
            </p>
          </div>

          {/* Citizen My Points Highlight Box */}
          {user?.role === "citizen" && myPoints !== null && (
            <div className="md:col-span-5 flex flex-col items-start md:items-end">
              <div className="w-full max-w-xs bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-300">
                <PointsCard
                  points={myPoints}
                  rank={myRankInTop10 > 0 ? myRankInTop10 : null}
                />
              </div>

              {myRankInTop10 === 0 && (
                <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400/20 backdrop-blur-md text-amber-300 border border-amber-400/30 text-[11px] font-extrabold shadow-xs">
                  <Flame size={14} className="text-amber-400 shrink-0 animate-bounce" />
                  <span>Not in top 10 yet — keep reporting to climb up!</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error Alert Box */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-800 shadow-sm">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* 🏆 Main Colorful Leaderboard Container */}
      <div className="relative bg-gradient-to-br from-violet-50/50 via-indigo-50/30 to-purple-50/40 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-purple-100 overflow-hidden space-y-6">
        {/* Top Multi-gradient Accent Rail */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-pink-500 to-indigo-500" />

        {/* Section Title Bar */}
        <div className="flex items-center justify-between border-b border-purple-100/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 shadow-xs border border-amber-200">
              <Trophy size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Top 10 Citizens
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Rankings update automatically based on verified contributions
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-500/10 text-violet-700 text-xs font-extrabold border border-violet-200 shadow-xs">
            <Medal size={14} className="text-violet-600" />
            <span>Monthly Honors</span>
          </div>
        </div>

        {/* Embedded Leaderboard Table Component */}
        <div className="overflow-x-auto">
          <LeaderboardTable
            leaderboard={leaderboard}
            currentUserId={user?._id}
          />
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;