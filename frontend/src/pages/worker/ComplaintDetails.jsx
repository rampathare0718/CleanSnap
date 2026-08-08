import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MapPin, User, Mail, Phone, PlayCircle, UploadCloud, Calendar, AlertTriangle } from "lucide-react";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import TaskStatusBadge from "../../components/worker/TaskStatusBadge";
import { getComplaintById, getImageUrl } from "../../services/complaintApi";
import { startWork } from "../../services/workerApi";

const ComplaintDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isStarting, setIsStarting] = useState(false);

    useEffect(() => {
        const fetchComplaint = async () => {
            setIsLoading(true);
            setError("");
            try {
                const data = await getComplaintById(id);
                setComplaint(data.complaint);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load this task.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchComplaint();
    }, [id]);

    const handleStartWork = async () => {
        setIsStarting(true);
        setError("");
        try {
            const data = await startWork(id);
            setComplaint(data.complaint);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to start work on this task.");
        } finally {
            setIsStarting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader />
            </div>
        );
    }

    if (error && !complaint) {
        return (
            <div className="max-w-2xl">
                <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
                <Link
                    to="/worker/complaints"
                    className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-emerald-600 hover:underline"
                >
                    <ArrowLeft size={15} /> Back to Assigned Tasks
                </Link>
            </div>
        );
    }

    if (!complaint) return null;

    const formattedDate = new Date(complaint.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    // Optional — only renders if your backend adds a `deadline` field to the
    // Complaint model. Safe no-op otherwise.
    const deadline = complaint.deadline ? new Date(complaint.deadline) : null;
    const isOverdue = deadline && deadline < new Date() && complaint.status !== "Completed";

    return (
        <div className="max-w-3xl space-y-5">
            <Link
                to="/worker/complaints"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-emerald-600"
            >
                <ArrowLeft size={15} /> Back to Assigned Tasks
            </Link>

            <div className="bg-white border border-neutral-200 rounded-xl p-6">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-neutral-900">{complaint.title}</h2>
                        <p className="text-sm text-neutral-400 mt-1">Reported on {formattedDate}</p>
                    </div>
                    <TaskStatusBadge status={complaint.status} />
                </div>

                {deadline && (
                    <div className={`inline-flex items-center gap-1.5 mt-3 text-sm font-medium ${isOverdue ? "text-red-600" : "text-neutral-600"}`}>
                        {isOverdue ? <AlertTriangle size={15} /> : <Calendar size={15} />}
                        {isOverdue ? "Overdue — was due" : "Due by"}{" "}
                        {deadline.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                )}

                <p className="text-sm text-neutral-600 mt-4 leading-relaxed">{complaint.description}</p>

                <div className="flex items-center gap-1.5 text-sm text-neutral-500 mt-4">
                    <MapPin size={15} />
                    {complaint.location?.address}
                    {complaint.location?.latitude && complaint.location?.longitude && (
                        <a
                            href={`https://www.google.com/maps?q=${complaint.location.latitude},${complaint.location.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:underline ml-1"
                        >
                            (view on map)
                        </a>
                    )}
                </div>

                {/* Citizen contact */}
                {complaint.reportedBy && (
                    <div className="mt-5 rounded-lg bg-neutral-50 border border-neutral-200 px-4 py-3 space-y-1.5">
                        <p className="text-xs font-semibold text-neutral-500 mb-1">Reported By</p>
                        <div className="flex items-center gap-2 text-sm text-neutral-700">
                            <User size={14} /> {complaint.reportedBy.fullName}
                        </div>
                        {complaint.reportedBy.mobileNumber && (
                            <div className="flex items-center gap-2 text-sm text-neutral-700">
                                <Phone size={14} /> {complaint.reportedBy.mobileNumber}
                            </div>
                        )}
                        {complaint.reportedBy.email && (
                            <div className="flex items-center gap-2 text-sm text-neutral-700">
                                <Mail size={14} /> {complaint.reportedBy.email}
                            </div>
                        )}
                    </div>
                )}

                {/* Images */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div>
                        <p className="text-xs font-semibold text-neutral-500 mb-1.5">BEFORE</p>
                        <img
                            src={getImageUrl(complaint.beforeImage)}
                            alt="Before cleanup"
                            className="w-full h-56 object-cover rounded-lg border border-neutral-200"
                        />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-neutral-500 mb-1.5">AFTER</p>
                        {complaint.afterImage ? (
                            <img
                                src={getImageUrl(complaint.afterImage)}
                                alt="After cleanup"
                                className="w-full h-56 object-cover rounded-lg border border-neutral-200"
                            />
                        ) : (
                            <div className="w-full h-56 flex items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 text-sm text-neutral-400">
                                Not uploaded yet
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <p className="mt-5 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
                )}

                {/* Status-driven action */}
                <div className="mt-6 pt-5 border-t border-neutral-100">
                    {complaint.status === "Assigned" && (
                        <Button fullWidth={false} isLoading={isStarting} onClick={handleStartWork}>
                            <span className="flex items-center gap-1.5">
                                <PlayCircle size={16} />
                                Start Work
                            </span>
                        </Button>
                    )}

                    {complaint.status === "In Progress" && (
                        <Button
                            fullWidth={false}
                            onClick={() => navigate(`/worker/complaints/${id}/upload-proof`)}
                        >
                            <span className="flex items-center gap-1.5">
                                <UploadCloud size={16} />
                                Upload Proof & Complete
                            </span>
                        </Button>
                    )}

                    {complaint.status === "Completed" && (
                        <p className="text-sm text-emerald-600 font-medium">
                            ✓ This task was completed
                            {complaint.completedAt &&
                                ` on ${new Date(complaint.completedAt).toLocaleDateString("en-IN")}`}
                            .
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetails;