import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search, Filter } from "lucide-react";
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
    const [searchQuery, setSearchQuery] = useState("");

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
        return complaints.filter((c) => {
            const matchesStatus = activeFilter === "All" || c.status === activeFilter;
            const matchesSearch = 
                c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.location?.address?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [complaints, activeFilter, searchQuery]);

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm">
                <div className="flex items-center gap-4">
                    <img src="/cleansnap_logo.png" alt="CleanSnap Logo" className="h-10 w-auto object-contain hidden sm:block" />
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">My Complaints</h1>
                        <p className="text-sm text-neutral-500 mt-0.5">
                            Showing <span className="font-bold text-emerald-600">{filteredComplaints.length}</span> of {complaints.length} reported issues
                        </p>
                    </div>
                </div>

                <Button
                    fullWidth={false}
                    onClick={() => navigate("/citizen/complaints/new")}
                >
                    <span className="flex items-center gap-2 font-semibold">
                        <PlusCircle size={18} />
                        New Complaint
                    </span>
                </Button>
            </div>

            {/* Search & Status Filter Toolbar */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search complaints by title or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                    />
                </div>

                {/* Status Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
                    <Filter className="w-4 h-4 text-neutral-400 shrink-0 ml-1" />
                    {STATUS_FILTERS.map((status) => (
                        <button
                            key={status}
                            onClick={() => setActiveFilter(status)}
                            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                activeFilter === status
                                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70"
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}

            {/* List Display */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <Loader />
                    <p className="text-sm font-medium text-neutral-400 animate-pulse">Loading your complaints...</p>
                </div>
            ) : filteredComplaints.length === 0 ? (
                <div className="bg-white border border-neutral-200/80 rounded-2xl py-16 px-4 text-center shadow-sm space-y-3">
                    <div className="w-12 h-12 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto">
                        <Filter size={20} />
                    </div>
                    <p className="text-base font-semibold text-neutral-700">No complaints found</p>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                        {activeFilter === "All" && !searchQuery
                            ? "You haven't submitted any complaints yet. Use the button above to report an issue."
                            : `No complaints found matching "${searchQuery || activeFilter}".`}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {filteredComplaints.map((c) => (
                        <ComplaintCard key={c._id} complaint={c} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyComplaints;