import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, UploadCloud, X } from "lucide-react";
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
        <div className="max-w-2xl">
            <div className="bg-white border border-neutral-200 rounded-xl p-6">
                <h2 className="text-lg font-bold text-neutral-900 mb-1">Report an Issue</h2>
                <p className="text-sm text-neutral-500 mb-6">
                    Add a photo and a few details — our team will review it shortly.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                    <Input
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Garbage pile near bus stop"
                        error={fieldErrors.title}
                        required
                    />

                    <div className="flex flex-col mb-4">
                        <label className="mb-1.5 text-[13px] font-semibold text-neutral-800">
                            Description<span className="ml-0.5 text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe what you saw — how large is the issue, how long has it been there, etc."
                            rows={4}
                            className={`w-full px-3.5 py-2.5 rounded-lg border-[1.5px] bg-neutral-50 text-sm text-neutral-900 outline-none transition-colors focus:bg-white focus:ring-4 ${
                                fieldErrors.description
                                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                    : "border-neutral-200 focus:border-emerald-600 focus:ring-emerald-100"
                            }`}
                        />
                        {fieldErrors.description && (
                            <span className="mt-1.5 text-xs text-red-500">{fieldErrors.description}</span>
                        )}
                    </div>

                    <Input
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Street, area, landmark"
                        error={fieldErrors.address}
                        required
                    />

                    <button
                        type="button"
                        onClick={handleUseLocation}
                        disabled={isLocating}
                        className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:underline mb-5 disabled:opacity-60"
                    >
                        <MapPin size={15} />
                        {isLocating
                            ? "Fetching location..."
                            : formData.latitude
                            ? "Location captured ✓"
                            : "Use my current location"}
                    </button>

                    {/* Image upload */}
                    <div className="mb-5">
                        <label className="mb-1.5 block text-[13px] font-semibold text-neutral-800">
                            Photo of the issue<span className="ml-0.5 text-red-500">*</span>
                        </label>

                        {imagePreview ? (
                            <div className="relative w-full max-w-xs">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-lg border border-neutral-200"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-black/60 text-white hover:bg-black/75"
                                >
                                    <X size={15} />
                                </button>
                            </div>
                        ) : (
                            <label
                                className={`flex flex-col items-center justify-center gap-2 w-full h-40 rounded-lg border-2 border-dashed cursor-pointer transition ${
                                    fieldErrors.beforeImage
                                        ? "border-red-300 bg-red-50"
                                        : "border-neutral-300 bg-neutral-50 hover:bg-neutral-100"
                                }`}
                            >
                                <UploadCloud size={24} className="text-neutral-400" />
                                <span className="text-sm text-neutral-500">
                                    Click to upload a photo
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}

                        {fieldErrors.beforeImage && (
                            <span className="mt-1.5 block text-xs text-red-500">
                                {fieldErrors.beforeImage}
                            </span>
                        )}
                    </div>

                    {formError && (
                        <p className="mb-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700">
                            {formError}
                        </p>
                    )}

                    <div className="flex gap-3">
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