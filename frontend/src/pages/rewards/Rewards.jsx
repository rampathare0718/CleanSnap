import { useState, useEffect } from "react";
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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Rewards</h1>

      <div className="mb-8 max-w-xs">
        <PointsCard points={totalPoints} />
      </div>

      {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">{error}</div>}

      <h2 className="text-lg font-semibold text-gray-700 mb-3">Reward History</h2>

      {rewards.length === 0 ? (
        <p className="text-gray-400 text-center py-10">
          No rewards yet — resolved complaints earn you points here.
        </p>
      ) : (
        <div className="space-y-2">
          {rewards.map((reward) => (
            <div
              key={reward._id}
              className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{reward.reason}</p>
                {reward.complaint?.title && (
                  <p className="text-xs text-gray-400 mt-0.5">Complaint: {reward.complaint.title}</p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(reward.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`text-sm font-bold ${
                  reward.points > 0 ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                +{reward.points} pts
              </span>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-8 w-8 rounded-lg text-sm ${
                p === page ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rewards;