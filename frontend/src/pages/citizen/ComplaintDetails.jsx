import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  MessageSquareWarning, 
  Sparkles, 
  CheckCircle2, 
  Clock 
} from "lucide-react";
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
        const confirmed = window.confirm("Are you sure you want to delete this complaint? This action cannot be undone.");
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
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
                <Loader />
                <p className="text-sm font-medium text-emerald-800/60 animate-pulse">Fetching complaint details...</p>
            </div>
        );
    }

    if (error && !complaint) {
        return (
            <div className="max-w-2xl mx-auto space-y-4 py-8">
                <div className="rounded-2xl bg-red-50 border border-red-200 p-5 text-sm text-red-700 shadow-sm flex items-center gap-3">
                    <MessageSquareWarning className="w-5 h-5 text-red-500 shrink-0" />
                    <span>{error}</span>
                </div>
                <Link
                    to="/citizen/complaints"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition"
                >
                    <ArrowLeft size={16} /> Back to My Complaints
                </Link>
            </div>
        );
    }

    if (!complaint) return null;

    const formattedDate = new Date(complaint.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            {/* Top Navigation & Brand Header */}
            <div className="flex items-center justify-between">
                <Link
                    to="/citizen/complaints"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-neutral-200/80 text-sm font-semibold text-neutral-600 hover:text-emerald-600 hover:border-emerald-300 shadow-sm transition-all"
                >
                    <ArrowLeft size={16} /> Back to My Complaints
                </Link>

                <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100 px-3.5 py-1.5 rounded-full">
                    <img src="/cleansnap_logo.png" alt="CleanSnap Logo" className="h-5 w-auto object-contain" />
                    <span className="text-xs font-semibold text-emerald-900 tracking-tight">CleanSnap Tracker</span>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-sm overflow-hidden">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-emerald-950 p-6 sm:p-8 text-white relative">
                    <div className="absolute top-0 right-0 w-64 h-full bg-emerald-500/10 blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2 max-w-2xl">
                            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-300/90">
                                <Calendar size={13} />
                                <span>Reported on {formattedDate}</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                                {complaint.title}
                            </h1>
                        </div>
                        <div className="shrink-0 pt-1">
                            <ComplaintStatusBadge status={complaint.status} />
                        </div>
                    </div>
                </div>

                <div className="p-6 sm:p-8 space-y-8">
                    {/* Location & Details Box */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Issue Description</h3>
                            <p className="text-neutral-700 text-sm sm:text-base leading-relaxed bg-neutral-50/80 p-4 rounded-xl border border-neutral-100">
                                {complaint.description}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Location</h3>
                            <div className="bg-neutral-50/80 p-4 rounded-xl border border-neutral-100 space-y-3">
                                <div className="flex items-start gap-2 text-neutral-700 text-sm">
                                    <MapPin size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                                    <span className="font-medium leading-snug">{complaint.location?.address || "Address not provided"}</span>
                                </div>
                                {complaint.location?.latitude && complaint.location?.longitude && (
                                    <a
                                        href={`https://www.google.com/maps?q=${complaint.location.latitude},${complaint.location.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100 transition-all w-full justify-center"
                                    >
                                        <span>View on Google Maps</span>
                                        <ExternalLink size={12} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Before & After Photo Proof Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-emerald-600" />
                            <h3 className="text-base font-bold text-neutral-900">Resolution Photo Proof</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* BEFORE IMAGE */}
                            <div className="group relative rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-900 shadow-sm">
                                <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold tracking-wider border border-white/20">
                                    BEFORE REPORTED
                                </div>
                                <img
                                    src={getImageUrl(complaint.beforeImage)}
                                    alt="Before cleanup"
                                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* AFTER IMAGE */}
                            <div className="relative rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50 shadow-sm">
                                {complaint.afterImage ? (
                                    <div className="group relative w-full h-full min-h-[256px]">
                                        <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold tracking-wider border border-white/20 flex items-center gap-1">
                                            <CheckCircle2 size={12} />
                                            CLEANED UP
                                        </div>
                                        <img
                                            src={getImageUrl(complaint.afterImage)}
                                            alt="After cleanup"
                                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-64 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50">
                                        <div className="p-3 bg-amber-50 text-amber-600 rounded-full mb-3">
                                            <Clock className="w-6 h-6" />
                                        </div>
                                        <p className="font-semibold text-neutral-700 text-sm">Cleanup in Progress</p>
                                        <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                                            Our cleanup crew will upload the verified photo once the site is fully restored.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Assigned Worker Badge */}
                    {complaint.assignedWorker && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-sky-50 to-emerald-50 border border-sky-100/80">
                            <div className="p-2.5 bg-sky-600 text-white rounded-lg">
                                <User size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-sky-800 uppercase tracking-wider">Assigned Field Specialist</p>
                                <p className="text-sm font-bold text-neutral-900 mt-0.5">
                                    {complaint.assignedWorker.fullName}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Admin Remark */}
                    {complaint.adminRemark && (
                        <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 p-4 space-y-1">
                            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Admin Remark</p>
                            <p className="text-sm text-amber-900">{complaint.adminRemark}</p>
                        </div>
                    )}

                    {/* Error Notice */}
                    {error && (
                        <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
                    )}

                    {/* Delete Option */}
                    {complaint.status === "Pending" && (
                        <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                            <p className="text-xs text-neutral-400">Changed your mind? You can cancel pending issues.</p>
                            <Button
                                variant="secondary"
                                fullWidth={false}
                                isLoading={isDeleting}
                                onClick={handleDelete}
                            >
                                <span className="flex items-center gap-1.5 text-red-600 font-semibold">
                                    <Trash2 size={15} />
                                    Delete Complaint
                                </span>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetails;