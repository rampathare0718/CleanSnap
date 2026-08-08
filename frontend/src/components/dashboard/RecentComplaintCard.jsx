import { useNavigate } from "react-router-dom";
import ComplaintStatusBadge from "../complaint/ComplaintStatusBadge";
import { getImageUrl } from "../../services/complaintApi";

const RecentComplaintCard = ({ complaint }) => {
    const navigate = useNavigate();

    const formattedDate = new Date(complaint.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short"
    });

    return (
        <div
            onClick={() => navigate(`/citizen/complaints/${complaint._id}`)}
            className="flex items-center gap-3 py-3 border-b border-neutral-100 last:border-0 cursor-pointer hover:bg-neutral-50 -mx-2 px-2 rounded-lg transition"
        >
            <img
                src={getImageUrl(complaint.beforeImage)}
                alt={complaint.title}
                className="w-12 h-12 rounded-lg object-cover shrink-0 bg-neutral-100"
            />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">{complaint.title}</p>
                <p className="text-xs text-neutral-400">{formattedDate}</p>
            </div>
            <ComplaintStatusBadge status={complaint.status} />
        </div>
    );
};

export default RecentComplaintCard;