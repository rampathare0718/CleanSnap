const RANK_STYLES = {
  1: "bg-amber-100 text-amber-700",
  2: "bg-gray-200 text-gray-700",
  3: "bg-orange-100 text-orange-700",
};

const LeaderboardRow = ({ rank, user, isCurrentUser }) => {
  const rankStyle = RANK_STYLES[rank] || "bg-gray-100 text-gray-500";

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-xl transition ${
        isCurrentUser ? "bg-emerald-50 border border-emerald-200" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold ${rankStyle}`}>
          {rank}
        </span>

        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center h-9 w-9 rounded-full bg-blue-600 text-white text-sm font-semibold">
            {user.fullName?.charAt(0)?.toUpperCase() || "U"}
          </span>
          <div>
            <p className="text-sm font-medium text-gray-800">
              {user.fullName}
              {isCurrentUser && <span className="ml-2 text-xs text-emerald-600 font-normal">(You)</span>}
            </p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
      </div>

      <span className="text-sm font-bold text-gray-800">{user.rewardPoints} pts</span>
    </div>
  );
};

export default LeaderboardRow;