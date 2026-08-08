import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MapPin, User, Trash2 } from "lucide-react";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import ComplaintStatusBadge from "../../components/complaint/ComplaintStatusBadge";
import { getComplaintById, deleteComplaint, getImageUrl } from "../../services/complaintApi";

const ComplaintDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchComplaint = async () => {
            setIsLoading(true);
            setError("");
            try {
                const data = await getComplaintById(id);
                setComplaint(data.complaint);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load this complaint.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchComplaint();
    }, [id]);

    const handleDelete = async () => {
        const confirmed = window.confirm("Delete this complaint? This cannot be undone.");
        if (!confirmed) return;

        setIsDeleting(true);
        try {
            await deleteComplaint(id);
            navigate("/citizen/complaints");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete complaint.");
            setIsDeleting(false);
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
                    to="/citizen/complaints"
                    className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-emerald-600 hover:underline"
                >
                    <ArrowLeft size={15} /> Back to complaints
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

    return (
        <div className="max-w-3xl space-y-5">
            <Link
                to="/citizen/complaints"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-emerald-600"
            >
                <ArrowLeft size={15} /> Back to My Complaints
            </Link>

            <div className="bg-white border border-neutral-200 rounded-xl p-6">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-neutral-900">{complaint.title}</h2>
                        <p className="text-sm text-neutral-400 mt-1">Reported on {formattedDate}</p>
                    </div>
                    <ComplaintStatusBadge status={complaint.status} />
                </div>

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
                                Not cleaned up yet
                            </div>
                        )}
                    </div>
                </div>

                {/* Assigned worker */}
                {complaint.assignedWorker && (
                    <div className="flex items-center gap-2 mt-5 text-sm text-neutral-600">
                        <User size={15} />
                        Assigned to{" "}
                        <span className="font-medium text-neutral-900">
                            {complaint.assignedWorker.fullName}
                        </span>
                    </div>
                )}

                {/* Admin remark (shown for rejections, etc.) */}
                {complaint.adminRemark && (
                    <div className="mt-5 rounded-lg bg-neutral-50 border border-neutral-200 px-4 py-3">
                        <p className="text-xs font-semibold text-neutral-500 mb-1">Admin Remark</p>
                        <p className="text-sm text-neutral-700">{complaint.adminRemark}</p>
                    </div>
                )}

                {error && (
                    <p className="mt-5 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
                )}

                {/* Delete — only while Pending, matching backend rule */}
                {complaint.status === "Pending" && (
                    <div className="mt-6 pt-5 border-t border-neutral-100">
                        <Button
                            variant="secondary"
                            fullWidth={false}
                            isLoading={isDeleting}
                            onClick={handleDelete}
                        >
                            <span className="flex items-center gap-1.5 text-red-600">
                                <Trash2 size={15} />
                                Delete Complaint
                            </span>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplaintDetails;