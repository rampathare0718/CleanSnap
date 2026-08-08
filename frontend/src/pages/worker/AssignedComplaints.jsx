import { useNavigate } from "react-router-dom";
import { MapPin, User, Calendar, AlertTriangle } from "lucide-react";
import TaskStatusBadge from "../../components/worker/TaskStatusBadge";
import { getImageUrl } from "../../services/complaintApi";

const AssignedComplaints = ({ complaint }) => {
    const navigate = useNavigate();

    const formattedDate = new Date(complaint.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    // Optional — only renders if your backend adds a `deadline` field to the
    // Complaint model. Safe no-op otherwise.
    const deadline = complaint.deadline ? new Date(complaint.deadline) : null;
    const isOverdue = deadline && deadline < new Date() && complaint.status !== "Completed";

    return (
        <div
            onClick={() => navigate(`/worker/complaints/${complaint._id}`)}
            className="flex gap-4 p-4 rounded-xl border border-neutral-200 bg-white hover:border-emerald-300 hover:shadow-sm transition cursor-pointer"
        >
            <img
                src={getImageUrl(complaint.beforeImage)}
                alt={complaint.title}
                className="w-20 h-20 rounded-lg object-cover shrink-0 bg-neutral-100"
            />

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-neutral-900 truncate">{complaint.title}</h3>
                    <TaskStatusBadge status={complaint.status} />
                </div>

                <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1.5">
                    <MapPin size={13} />
                    <span className="truncate">{complaint.location?.address}</span>
                </div>

                {complaint.reportedBy && (
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
                        <User size={13} />
                        <span className="truncate">
                            {complaint.reportedBy.fullName} • {complaint.reportedBy.mobileNumber}
                        </span>
                    </div>
                )}

                {deadline && (
                    <div className={`flex items-center gap-1.5 text-xs mt-1 ${isOverdue ? "text-red-600" : "text-neutral-500"}`}>
                        {isOverdue ? <AlertTriangle size={13} /> : <Calendar size={13} />}
                        <span>
                            {isOverdue ? "Overdue — was due" : "Due"}{" "}
                            {deadline.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                    </div>
                )}

                <p className="text-xs text-neutral-400 mt-1.5">{formattedDate}</p>
            </div>
        </div>
    );
};

export default AssignedComplaints;