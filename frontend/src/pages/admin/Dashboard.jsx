import { useEffect, useState } from "react";
import AdminStatCard from "../../components/admin/AdminStatCard";
import { getDashboardStats } from "../../services/adminApi";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getDashboardStats();
        setStats(res.data.stats);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p className="text-gray-500">Loading dashboard...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!stats) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <AdminStatCard label="Total Complaints" value={stats.totalComplaints} accent="blue" />
        <AdminStatCard label="Pending" value={stats.pending} accent="yellow" />
        <AdminStatCard label="Approved" value={stats.approved} accent="blue" />
        <AdminStatCard label="Assigned" value={stats.assigned} accent="blue" />
        <AdminStatCard label="In Progress" value={stats.inProgress} accent="yellow" />
        <AdminStatCard label="Completed" value={stats.completed} accent="green" />
        <AdminStatCard label="Rejected" value={stats.rejected} accent="red" />
        <AdminStatCard label="Overdue" value={stats.overdue} accent="red" />
      </div>

      <h3 className="text-md font-semibold text-gray-700 mb-3">Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard label="Total Workers" value={stats.totalWorkers} accent="gray" />
        <AdminStatCard label="Total Citizens" value={stats.totalCitizens} accent="gray" />
        <AdminStatCard
          label="Average Rating"
          value={stats.averageRating ? stats.averageRating.toFixed(1) : "N/A"}
          accent="gray"
        />
        <AdminStatCard label="Total Ratings" value={stats.totalRatings} accent="gray" />
      </div>
    </div>
  );
}