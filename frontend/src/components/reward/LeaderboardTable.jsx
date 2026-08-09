import LeaderboardRow from "./LeaderboardRow";

const LeaderboardTable = ({ leaderboard, currentUserId }) => {
  if (leaderboard.length === 0) {
    return <p className="text-center text-gray-400 py-10">No reward data yet.</p>;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 space-y-1">
      {leaderboard.map((user, index) => (
        <LeaderboardRow
          key={user._id}
          rank={index + 1}
          user={user}
          isCurrentUser={user._id === currentUserId}
        />
      ))}
    </div>
  );
};

export default LeaderboardTable;