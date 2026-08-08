// Same enum as ComplaintStatusBadge (models/Complaints.js), styled for the
// worker's task list where "Assigned" and "In Progress" are the common cases.
const STATUS_STYLES = {
    Pending: "bg-amber-100 text-amber-700",
    Approved: "bg-blue-100 text-blue-700",
    Assigned: "bg-indigo-100 text-indigo-700",
    "In Progress": "bg-purple-100 text-purple-700",
    Completed: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-red-100 text-red-700"
};

const STATUS_LABELS = {
    Assigned: "Awaiting Start",
    "In Progress": "In Progress",
    Completed: "Completed"
};

const TaskStatusBadge = ({ status }) => {
    const style = STATUS_STYLES[status] || "bg-neutral-100 text-neutral-600";
    const label = STATUS_LABELS[status] || status;

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${style}`}>
            {label}
        </span>
    );
};

export default TaskStatusBadge;