import { useState, useEffect, useMemo } from "react";
import AssignedComplaintCard from "../../components/worker/AssignedComplaintCard";
import Loader from "../../components/common/Loader";
import { getAssignedComplaints } from "../../services/workerApi";

const STATUS_FILTERS = ["All", "Assigned", "In Progress"];

const AssignedComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

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

    const filteredComplaints = useMemo(() => {
        if (activeFilter === "All") return complaints;
        return complaints.filter((c) => c.status === activeFilter);
    }, [complaints, activeFilter]);

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-bold text-neutral-900">Assigned Tasks</h2>
                <p className="text-sm text-neutral-500 mt-1">
                    {complaints.length} task{complaints.length !== 1 ? "s" : ""} currently assigned to you.
                </p>
            </div>

            {/* Status filter tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {STATUS_FILTERS.map((status) => (
                    <button
                        key={status}
                        onClick={() => setActiveFilter(status)}
                        className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium border transition ${
                            activeFilter === status
                                ? "bg-emerald-600 text-white border-emerald-600"
                                : "bg-white text-neutral-600 border-neutral-200 hover:border-emerald-300"
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {error && (
                <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
            )}

            {isLoading ? (
                <div className="flex justify-center py-16">
                    <Loader />
                </div>
            ) : filteredComplaints.length === 0 ? (
                <div className="bg-white border border-neutral-200 rounded-xl py-16 text-center">
                    <p className="text-sm text-neutral-400">
                        {activeFilter === "All"
                            ? "No tasks assigned to you right now."
                            : `No tasks with status "${activeFilter}".`}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredComplaints.map((c) => (
                        <AssignedComplaintCard key={c._id} complaint={c} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AssignedComplaints;