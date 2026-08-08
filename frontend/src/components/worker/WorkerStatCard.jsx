import { useNavigate } from "react-router-dom";
import { BadgeCheck, ShieldAlert, ChevronRight } from "lucide-react";

const WorkerStatCard = ({ user, activeTaskCount }) => {
    const navigate = useNavigate();

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-6 md:p-7">
            {/* Decorative background circles */}
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute -right-4 bottom-0 w-24 h-24 rounded-full bg-white/10" />

            <div className="relative flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                    {user?.profileImage ? (
                        <img
                            src={user.profileImage}
                            alt={user.fullName}
                            className="w-16 h-16 rounded-full object-cover ring-4 ring-white/20"
                        />
                    ) : (
                        <span className="flex items-center justify-center w-16 h-16 rounded-full bg-white/15 text-2xl font-bold ring-4 ring-white/20">
                            {user?.fullName?.charAt(0)?.toUpperCase() || "W"}
                        </span>
                    )}

                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold">{user?.fullName}</h2>
                            {user?.isVerified ? (
                                <span className="inline-flex items-center gap-1 text-xs font-medium bg-white/15 px-2 py-0.5 rounded-full">
                                    <BadgeCheck size={13} /> Verified
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-medium bg-white/15 px-2 py-0.5 rounded-full">
                                    <ShieldAlert size={13} /> Unverified
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-white/80 mt-0.5">Field Worker · CleanSnap</p>
                    </div>
                </div>

                <div className="flex items-center gap-5">
                    <div className="text-right">
                        <p className="text-3xl font-bold leading-none">{activeTaskCount}</p>
                        <p className="text-xs text-white/75 mt-1">Active Task{activeTaskCount !== 1 ? "s" : ""}</p>
                    </div>

                    <button
                        onClick={() => navigate("/worker/profile")}
                        className="flex items-center gap-1 text-sm font-medium bg-white/15 hover:bg-white/25 transition px-3.5 py-2 rounded-lg"
                    >
                        View Profile
                        <ChevronRight size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkerStatCard;