export default function WorkerTable({ workers, onDelete }) {
  if (!workers || workers.length === 0) {
    return <p className="text-gray-500 text-sm">No workers found.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Mobile</th>
            <th className="px-4 py-3 font-medium">Joined</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {workers.map((w) => (
            <tr key={w._id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-800">{w.fullName}</td>
              <td className="px-4 py-3 text-gray-600">{w.email}</td>
              <td className="px-4 py-3 text-gray-600">{w.mobileNumber}</td>
              <td className="px-4 py-3 text-gray-500">
                {new Date(w.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onDelete(w)}
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