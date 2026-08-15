import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Calendar, BadgeCheck, ShieldAlert, Pencil, X, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { updateMyProfile } from "../../services/userApi";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const Profile = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [saveSuccess, setSaveSuccess] = useState("");

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

    const startEditing = () => {
        setSaveError("");
        setSaveSuccess("");
        setForm({
            fullName: user.fullName || "",
            email: user.email || "",
            mobileNumber: user.mobileNumber || "",
            password: "",
            street: user.address?.street || "",
            area: user.address?.area || "",
            city: user.address?.city || "",
            state: user.address?.state || "",
            pincode: user.address?.pincode || ""
        });
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaveError("");
        setSaveSuccess("");
        setSaving(true);

        try {
            const payload = {
                fullName: form.fullName,
                email: form.email,
                mobileNumber: form.mobileNumber,
                address: {
                    street: form.street,
                    area: form.area,
                    city: form.city,
                    state: form.state,
                    pincode: form.pincode
                }
            };

            if (form.password.trim()) {
                payload.password = form.password.trim();
            }

            const data = await updateMyProfile(payload);
            updateUser(data.user);
            setSaveSuccess("Profile updated successfully.");
            setIsEditing(false);
        } catch (err) {
            setSaveError(err.response?.data?.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-2xl space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <button
                        onClick={() => navigate("/citizen/dashboard")}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 mb-2"
                    >
                        <ArrowLeft size={14} />
                        Back to Dashboard
                    </button>
                    <h2 className="text-xl font-bold text-neutral-900">My Profile</h2>
                    <p className="text-sm text-neutral-500 mt-1">
                        Your account details as registered with CleanSnap.
                    </p>
                </div>
                {!isEditing && (
                    <button
                        onClick={startEditing}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors shrink-0"
                    >
                        <Pencil size={15} />
                        Edit Profile
                    </button>
                )}
            </div>

            {saveSuccess && !isEditing && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 font-medium">
                    {saveSuccess}
                </div>
            )}

            {isEditing ? (
                <form onSubmit={handleSave} className="bg-white border border-neutral-200 rounded-xl p-6 space-y-1">
                    {saveError && (
                        <div className="mb-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium">
                            {saveError}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} required />
                        <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
                        <Input label="Mobile Number" name="mobileNumber" value={form.mobileNumber} onChange={handleChange} required />
                        <Input
                            label="New Password"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Leave blank to keep current password"
                        />
                    </div>

                    <div className="pt-2 pb-1">
                        <p className="text-[13px] font-semibold text-neutral-800 mb-2">Address</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <Input label="Street" name="street" value={form.street} onChange={handleChange} />
                        <Input label="Area" name="area" value={form.area} onChange={handleChange} />
                        <Input label="City" name="city" value={form.city} onChange={handleChange} required />
                        <Input label="State" name="state" value={form.state} onChange={handleChange} required />
                        <Input label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} required />
                    </div>

                    <div className="flex items-center gap-3 pt-3">
                        <Button type="submit" isLoading={saving} fullWidth={false}>
                            Save Changes
                        </Button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="inline-flex items-center gap-1.5 px-4 h-[46px] rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
                        >
                            <X size={15} />
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <div className="flex items-center gap-4 pb-5 border-b border-neutral-100">
                        {user.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt={user.fullName}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                        ) : (
                            <span className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 via-purple-600 to-pink-500 text-white text-xl font-bold">
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
            )}
        </div>
    );
};

export default Profile;