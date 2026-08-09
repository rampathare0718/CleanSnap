const PointsCard = ({ points, rank }) => {
  return (
    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-sm">
      <p className="text-emerald-100 text-sm font-medium mb-1">Your Reward Points</p>
      <p className="text-4xl font-bold mb-4">{points}</p>

      {rank && (
        <div className="flex items-center gap-2 text-emerald-50 text-sm">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-white/20 text-xs font-semibold">
            #{rank}
          </span>
          <span>on the leaderboard</span>
        </div>
      )}
    </div>
  );
};

export default PointsCard;