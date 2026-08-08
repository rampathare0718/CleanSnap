import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import ComplaintCard from "../../components/complaint/ComplaintCard";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { getMyComplaints } from "../../services/complaintApi";

const STATUS_FILTERS = ["All", "Pending", "Approved", "Assigned", "In Progress", "Completed", "Rejected"];

const MyComplaints = () => {
    const navigate = useNavigate();

    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

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

    const filteredComplaints = useMemo(() => {
        if (activeFilter === "All") return complaints;
        return complaints.filter((c) => c.status === activeFilter);
    }, [complaints, activeFilter]);

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-neutral-900">My Complaints</h2>
                    <p className="text-sm text-neutral-500 mt-1">
                        {complaints.length} complaint{complaints.length !== 1 ? "s" : ""} reported so far.
                    </p>
                </div>
                <Button
                    fullWidth={false}
                    onClick={() => navigate("/citizen/complaints/new")}
                >
                    <span className="flex items-center gap-1.5">
                        <PlusCircle size={16} />
                        New Complaint
                    </span>
                </Button>
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
                            ? "You haven't reported any complaints yet."
                            : `No complaints with status "${activeFilter}".`}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredComplaints.map((c) => (
                        <ComplaintCard key={c._id} complaint={c} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyComplaints;