import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Clock, Hammer, Star, Sparkles } from "lucide-react";
import WorkerProfileCard from "../../components/worker/WorkerStatCard";
import WorkerStatCard from "../../components/worker/WorkerStatCard";
import AssignedComplaintCard from "../../components/worker/AssignedComplaintCard";
import Loader from "../../components/common/Loader";
import { getAssignedComplaints } from "../../services/workerApi";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAssigned = async () => {
            try {
                const data = await getAssignedComplaints();
                setComplaints(data.complaints || []);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load your tasks.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAssigned();
    }, []);

    // NOTE: /complaints/assigned only returns "Assigned" and "In Progress" tasks —
    // completed tasks drop off this list once completeComplaint() runs, so there's
    // no "Completed" stat here without an additional backend endpoint.
    const awaitingStartTasks = complaints.filter((c) => c.status === "Assigned");
    const inProgressTasks = complaints.filter((c) => c.status === "In Progress");

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Profile banner */}
            <WorkerProfileCard user={user} activeTaskCount={complaints.length} />

            {error && (
                <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <WorkerStatCard label="Active Tasks" value={complaints.length} icon={ClipboardList} accent="emerald" />
                <WorkerStatCard label="Awaiting Start" value={awaitingStartTasks.length} icon={Clock} accent="amber" />
                <WorkerStatCard label="In Progress" value={inProgressTasks.length} icon={Hammer} accent="purple" />
            </div>

            {/* Task board — kanban style, two columns instead of a flat list */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white border border-neutral-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            Awaiting Start
                        </h3>
                        <span className="text-xs font-medium text-neutral-400">
                            {awaitingStartTasks.length}
                        </span>
                    </div>

                    {awaitingStartTasks.length === 0 ? (
                        <p className="py-10 text-center text-sm text-neutral-400">
                            Nothing waiting to be started.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {awaitingStartTasks.map((c) => (
                                <AssignedComplaintCard key={c._id} complaint={c} />
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white border border-neutral-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500" />
                            In Progress
                        </h3>
                        <span className="text-xs font-medium text-neutral-400">
                            {inProgressTasks.length}
                        </span>
                    </div>

                    {inProgressTasks.length === 0 ? (
                        <p className="py-10 text-center text-sm text-neutral-400">
                            No tasks currently in progress.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {inProgressTasks.map((c) => (
                                <AssignedComplaintCard key={c._id} complaint={c} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* View all link */}
            {complaints.length > 0 && (
                <button
                    onClick={() => navigate("/worker/complaints")}
                    className="text-sm font-medium text-emerald-600 hover:underline"
                >
                    View all assigned tasks →
                </button>
            )}

            {/* Ratings — placeholder until a feedback/rating backend exists */}
            <div className="bg-white border border-dashed border-neutral-300 rounded-xl p-6 text-center">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-amber-50 text-amber-500 mb-3">
                    <Star size={20} />
                </div>
                <h3 className="font-semibold text-neutral-900">Citizen Ratings</h3>
                <p className="text-sm text-neutral-500 mt-1 max-w-sm mx-auto">
                    Feedback and star ratings from citizens on your completed cleanups will
                    appear here once feedback collection is added on the backend.
                </p>
                <p className="inline-flex items-center gap-1 text-xs text-neutral-400 mt-3">
                    <Sparkles size={13} /> Coming soon
                </p>
            </div>
        </div>
    );
};

export default Dashboard;