import { useNavigate } from "react-router-dom";
import ComplaintStatusBadge from "./ComplaintStatusBadge";
import { getImageUrl } from "../../services/complaintApi";

const ComplaintCard = ({ complaint }) => {
    const navigate = useNavigate();

    const formattedDate = new Date(complaint.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    return (
        <div
            onClick={() => navigate(`/citizen/complaints/${complaint._id}`)}
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
                    <ComplaintStatusBadge status={complaint.status} />
                </div>

                <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{complaint.description}</p>

                <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
                    <span className="truncate">{complaint.location?.address}</span>
                    <span>•</span>
                    <span className="shrink-0">{formattedDate}</span>
                </div>
            </div>
        </div>
    );
};

export default ComplaintCard;