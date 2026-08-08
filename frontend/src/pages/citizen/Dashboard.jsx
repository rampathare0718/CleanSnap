import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ListChecks, Clock, CheckCircle2, PlusCircle, ListOrdered } from "lucide-react";
import StatCard from "../../components/dashboard/StatCard";
import QuickAction from "../../components/dashboard/QuickAction";
import RecentComplaintCard from "../../components/dashboard/RecentComplaintCard";
import Loader from "../../components/common/Loader";
import { getMyComplaints } from "../../services/complaintApi";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const data = await getMyComplaints();
                setComplaints(data.complaints || []);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load your complaints.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchComplaints();
    }, []);

    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === "Pending").length;
    const inProgress = complaints.filter((c) =>
        ["Approved", "Assigned", "In Progress"].includes(c.status)
    ).length;
    const completed = complaints.filter((c) => c.status === "Completed").length;

    const recentComplaints = complaints.slice(0, 5);

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-neutral-900">
                    Welcome back, {user?.fullName?.split(" ")[0]} 👋
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                    Here's an overview of your reported complaints.
                </p>
            </div>

            {error && (
                <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Complaints" value={total} icon={ListChecks} accent="emerald" />
                <StatCard label="Pending" value={pending} icon={Clock} accent="amber" />
                <StatCard label="In Progress" value={inProgress} icon={ListOrdered} accent="blue" />
                <StatCard label="Completed" value={completed} icon={CheckCircle2} accent="purple" />
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <QuickAction
                    icon={PlusCircle}
                    label="Report a New Issue"
                    description="Spotted waste or an unclean area? Report it in seconds."
                    onClick={() => navigate("/citizen/complaints/new")}
                />
                <QuickAction
                    icon={ListChecks}
                    label="View All My Complaints"
                    description="Track the status of everything you've reported."
                    onClick={() => navigate("/citizen/complaints")}
                />
            </div>

            {/* Recent complaints */}
            <div className="bg-white border border-neutral-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-neutral-900">Recent Complaints</h3>
                    {complaints.length > 0 && (
                        <button
                            onClick={() => navigate("/citizen/complaints")}
                            className="text-sm font-medium text-emerald-600 hover:underline"
                        >
                            View all
                        </button>
                    )}
                </div>

                {recentComplaints.length === 0 ? (
                    <p className="py-8 text-center text-sm text-neutral-400">
                        You haven't reported any complaints yet.
                    </p>
                ) : (
                    <div>
                        {recentComplaints.map((c) => (
                            <RecentComplaintCard key={c._id} complaint={c} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;