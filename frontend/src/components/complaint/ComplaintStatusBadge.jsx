// Colors mapped 1:1 to the "status" enum in models/Complaints.js:
// ["Pending", "Approved", "Assigned", "In Progress", "Completed", "Rejected"]
const STATUS_STYLES = {
    Pending: "bg-amber-100 text-amber-700",
    Approved: "bg-blue-100 text-blue-700",
    Assigned: "bg-indigo-100 text-indigo-700",
    "In Progress": "bg-purple-100 text-purple-700",
    Completed: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-red-100 text-red-700"
};

const ComplaintStatusBadge = ({ status }) => {
    const style = STATUS_STYLES[status] || "bg-neutral-100 text-neutral-600";

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${style}`}>
            {status}
        </span>
    );
};

export default ComplaintStatusBadge;