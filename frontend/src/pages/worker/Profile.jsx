import { Mail, Phone, MapPin, Calendar, BadgeCheck, ShieldAlert, Star, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
    const { user } = useAuth();

    if (!user) return null;

    const memberSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
        : null;

    const addressParts = [
        user.address?.street,
        user.address?.area,
        user.address?.city,
        user.address?.state,
        user.address?.pincode
    ].filter(Boolean);

    return (
        <div className="max-w-2xl space-y-5">
            <div>
                <h2 className="text-xl font-bold text-neutral-900">My Profile</h2>
                <p className="text-sm text-neutral-500 mt-1">
                    Your account details as registered with CleanSnap.
                </p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center gap-4 pb-5 border-b border-neutral-100">
                    {user.profileImage ? (
                        <img
                            src={user.profileImage}
                            alt={user.fullName}
                            className="w-16 h-16 rounded-full object-cover"
                        />
                    ) : (
                        <span className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-600 text-white text-xl font-bold">
                            {user.fullName?.charAt(0)?.toUpperCase()}
                        </span>
                    )}
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-neutral-900">{user.fullName}</h3>
                            {user.isVerified ? (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                                    <BadgeCheck size={14} /> Verified
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                                    <ShieldAlert size={14} /> Not Verified
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-neutral-500 capitalize">{user.role}</p>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-3 pt-5">
                    <div className="flex items-center gap-3 text-sm text-neutral-700">
                        <Mail size={16} className="text-neutral-400" />
                        {user.email}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-neutral-700">
                        <Phone size={16} className="text-neutral-400" />
                        {user.mobileNumber}
                    </div>
                    {addressParts.length > 0 && (
                        <div className="flex items-start gap-3 text-sm text-neutral-700">
                            <MapPin size={16} className="text-neutral-400 mt-0.5" />
                            {addressParts.join(", ")}
                        </div>
                    )}
                    {memberSince && (
                        <div className="flex items-center gap-3 text-sm text-neutral-700">
                            <Calendar size={16} className="text-neutral-400" />
                            Member since {memberSince}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-neutral-100">
                    <div>
                        <p className="text-xs text-neutral-400">Age</p>
                        <p className="text-sm font-medium text-neutral-900">{user.age}</p>
                    </div>
                    <div>
                        <p className="text-xs text-neutral-400">Gender</p>
                        <p className="text-sm font-medium text-neutral-900">{user.gender}</p>
                    </div>
                </div>
            </div>

            <p className="text-xs text-neutral-400">
                Need to update these details? Contact an administrator — editing isn't available yet.
            </p>

            {/* Ratings — placeholder until a feedback/rating backend exists */}
            <div className="bg-white border border-dashed border-neutral-300 rounded-xl p-6 text-center">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-amber-50 text-amber-500 mb-3">
                    <Star size={20} />
                </div>
                <h3 className="font-semibold text-neutral-900">My Rating</h3>
                <p className="text-sm text-neutral-500 mt-1 max-w-sm mx-auto">
                    Your average rating from citizens, based on completed cleanups, will
                    appear here once feedback collection is added on the backend.
                </p>
                <p className="inline-flex items-center gap-1 text-xs text-neutral-400 mt-3">
                    <Sparkles size={13} /> Coming soon
                </p>
            </div>
        </div>
    );
};

export default Profile;