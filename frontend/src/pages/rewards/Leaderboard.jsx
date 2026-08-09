import { useState, useEffect } from "react";
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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reward Leaderboard</h1>

      {user?.role === "citizen" && myPoints !== null && (
        <div className="mb-8 max-w-xs">
          <PointsCard points={myPoints} rank={myRankInTop10 > 0 ? myRankInTop10 : null} />
          {myRankInTop10 === 0 && (
            <p className="text-xs text-gray-400 mt-2">
              You're not in the top 10 yet — keep reporting issues to climb up!
            </p>
          )}
        </div>
      )}

      {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">{error}</div>}

      <LeaderboardTable leaderboard={leaderboard} currentUserId={user?._id} />
    </div>
  );
};

export default Leaderboard;