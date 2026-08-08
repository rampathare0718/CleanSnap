export default function UserTable({ users, onDelete }) {
  if (!users || users.length === 0) {
    return <p className="text-gray-500 text-sm">No users found.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Mobile</th>
            <th className="px-4 py-3 font-medium">Reward Points</th>
            <th className="px-4 py-3 font-medium">Joined</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((u) => (
            <tr key={u._id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-800">{u.fullName}</td>
              <td className="px-4 py-3 text-gray-600">{u.email}</td>
              <td className="px-4 py-3 text-gray-600">{u.mobileNumber}</td>
              <td className="px-4 py-3 text-gray-600">{u.rewardPoints ?? 0}</td>
              <td className="px-4 py-3 text-gray-500">
                {new Date(u.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onDelete(u)}
                  className="text-red-600 hover:underline text-sm font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}