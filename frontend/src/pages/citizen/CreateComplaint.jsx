import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, UploadCloud, X, Camera, Sparkles, CheckCircle2 } from "lucide-react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { createComplaint } from "../../services/complaintApi";

const CreateComplaint = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        address: "",
        latitude: "",
        longitude: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isLocating, setIsLocating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setFieldErrors((prev) => ({ ...prev, beforeImage: "" }));
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleUseLocation = () => {
        if (!navigator.geolocation) {
            setFormError("Geolocation is not supported by your browser.");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData((prev) => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }));
                setIsLocating(false);
            },
            () => {
                setFormError("Unable to fetch your location. Please enter the address manually.");
                setIsLocating(false);
            }
        );
    };

    const validate = () => {
        const errors = {};
        if (!formData.title.trim()) errors.title = "Title is required.";
        if (!formData.description.trim()) errors.description = "Description is required.";
        if (!formData.address.trim()) errors.address = "Address is required.";
        if (!imageFile) errors.beforeImage = "A photo of the issue is required.";
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await createComplaint({ ...formData, beforeImage: imageFile });
            navigate("/citizen/complaints");
        } catch (err) {
            setFormError(err.response?.data?.message || "Failed to submit complaint. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-12">
            {/* Header Header */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 transform translate-x-6 -translate-y-6 opacity-10 pointer-events-none">
                    <img src="/cleansnap_logo.png" alt="Logo Watermark" className="w-64 h-64 object-contain" />
                </div>

                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-emerald-100 text-xs font-semibold">
                        <Sparkles size={14} />
                        <span>Snap & Report</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Report an Issue
                    </h1>
                    <p className="text-emerald-100 text-sm max-w-xl">
                        Add a photo and location details. CleanSnap will assign an team member to resolve it promptly.
                    </p>
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <Input
                        label="Issue Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Overflowing waste bin near city park"
                        error={fieldErrors.title}
                        required
                    />

                    <div className="flex flex-col">
                        <label className="mb-1.5 text-[13px] font-semibold text-neutral-800">
                            Description<span className="ml-0.5 text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe what you observed — issue size, landmark details, or severity..."
                            rows={4}
                            className={`w-full px-4 py-3 rounded-xl border bg-neutral-50/50 text-sm text-neutral-900 outline-none transition-all focus:bg-white focus:ring-4 ${
                                fieldErrors.description
                                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                    : "border-neutral-200 focus:border-emerald-600 focus:ring-emerald-100"
                            }`}
                        />
                        {fieldErrors.description && (
                            <span className="mt-1.5 text-xs font-medium text-red-500">{fieldErrors.description}</span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Input
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Street, area, or nearby landmark"
                            error={fieldErrors.address}
                            required
                        />

                        <button
                            type="button"
                            onClick={handleUseLocation}
                            disabled={isLocating}
                            className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg border transition-all ${
                                formData.latitude
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-emerald-300 hover:text-emerald-600"
                            }`}
                        >
                            {formData.latitude ? <CheckCircle2 size={14} className="text-emerald-600" /> : <MapPin size={14} />}
                            {isLocating
                                ? "Locating..."
                                : formData.latitude
                                ? "GPS Coordinates Captured ✓"
                                : "Attach Current GPS Location"}
                        </button>
                    </div>

                    {/* Image Upload Zone */}
                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-neutral-800">
                            Photo Evidence<span className="ml-0.5 text-red-500">*</span>
                        </label>

                        {imagePreview ? (
                            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-neutral-200 shadow-sm group">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-52 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold shadow-lg hover:bg-red-700 transition"
                                    >
                                        <X size={14} /> Remove Photo
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label
                                className={`flex flex-col items-center justify-center gap-3 w-full h-48 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                                    fieldErrors.beforeImage
                                        ? "border-red-300 bg-red-50/50"
                                        : "border-neutral-200 bg-neutral-50/50 hover:bg-emerald-50/30 hover:border-emerald-400"
                                }`}
                            >
                                <div className="p-3 bg-white text-emerald-600 rounded-full shadow-sm border border-neutral-100">
                                    <Camera size={22} />
                                </div>
                                <div className="text-center">
                                    <span className="text-sm font-semibold text-neutral-700 block">
                                        Click or drag photo to upload
                                    </span>
                                    <span className="text-xs text-neutral-400">
                                        Supports JPG, PNG up to 10MB
                                    </span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}

                        {fieldErrors.beforeImage && (
                            <span className="text-xs font-medium text-red-500 block">{fieldErrors.beforeImage}</span>
                        )}
                    </div>

                    {formError && (
                        <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs font-medium text-red-700">
                            {formError}
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="pt-4 flex items-center gap-3">
                        <Button type="submit" isLoading={isSubmitting}>
                            Submit Complaint
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate("/citizen/dashboard")}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateComplaint;