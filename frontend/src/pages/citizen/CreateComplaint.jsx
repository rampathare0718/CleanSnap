import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  UploadCloud,
  X,
  Camera,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  Send,
  Building2,
  FileText,
  Tag,
  Zap,
  ShieldCheck,
} from "lucide-react";
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
    longitude: "",
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
          longitude: position.coords.longitude,
        }));
        setIsLocating(false);
      },
      () => {
        setFormError(
          "Unable to fetch your location. Please enter the address manually."
        );
        setIsLocating(false);
      }
    );
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required.";
    if (!formData.description.trim())
      errors.description = "Description is required.";
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
      setFormError(
        err.response?.data?.message ||
          "Failed to submit complaint. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 text-slate-800">
      
      {/* ⬅️ Back Button */}
      <button
        onClick={() => navigate("/citizen/dashboard")}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-purple-600 transition-colors group px-3 py-1.5 rounded-xl hover:bg-purple-50 w-fit"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to Dashboard</span>
      </button>

      {/* 🚀 Dynamic Hero Banner (Matches Dashboard Header) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl shadow-indigo-950/30 transition-transform duration-300 hover:scale-[1.005]">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 shadow-sm backdrop-blur-sm">
            <Sparkles size={14} className="text-amber-400 animate-spin" />
            <span>Snap & Empower Community</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Report an <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300">Issue</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Snap a clear photo, describe the issue, and pin your location. CleanSnap dispatches local municipal teams automatically.
          </p>
        </div>
      </div>

      {/* 📝 Main Colorful Form Container */}
      <div className="relative bg-gradient-to-br from-violet-50/50 via-indigo-50/30 to-purple-50/40 rounded-3xl p-6 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-300 border border-purple-100 overflow-hidden">
        {/* Top Multi-gradient Accent Rail */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-violet-500 via-pink-500 to-emerald-400" />

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          
          {/* 🏷️ Title Card Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/5 hover:from-violet-500/15 hover:to-indigo-500/10 border border-violet-200/80 transition-all duration-200 space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-violet-100 text-violet-700 shadow-xs">
                <Tag className="w-4 h-4" />
              </div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Issue Title <span className="text-rose-500">*</span>
              </label>
            </div>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Overflowing waste bin near city park"
              error={fieldErrors.title}
              required
            />
          </div>

          {/* 📄 Description Card Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/5 hover:from-emerald-500/15 hover:to-cyan-500/10 border border-emerald-200/80 transition-all duration-200 space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shadow-xs">
                <FileText className="w-4 h-4" />
              </div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Description <span className="text-rose-500">*</span>
              </label>
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what you observed — issue size, landmark details, or severity..."
              rows={4}
              className={`w-full px-4 py-3 rounded-2xl border bg-white/90 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 ${
                fieldErrors.description
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
                  : "border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100"
              }`}
            />
            {fieldErrors.description && (
              <span className="mt-1 text-xs font-semibold text-rose-500 block">
                {fieldErrors.description}
              </span>
            )}
          </div>

          {/* 📍 Location & GPS Capture Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/5 hover:from-amber-500/15 hover:to-yellow-500/10 border border-amber-200/80 transition-all duration-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shadow-xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Location Details <span className="text-rose-500">*</span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleUseLocation}
                disabled={isLocating}
                className={`inline-flex items-center justify-center gap-2 text-xs font-extrabold px-3.5 py-2 rounded-xl border transition-all duration-200 shadow-xs hover:scale-105 active:scale-95 ${
                  formData.latitude
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-500 shadow-emerald-200"
                    : "bg-white text-purple-700 border-purple-200 hover:bg-purple-600 hover:text-white"
                }`}
              >
                {formData.latitude ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <MapPin size={15} />
                )}
                {isLocating
                  ? "Detecting Coordinates..."
                  : formData.latitude
                  ? "GPS Coordinates Captured ✓"
                  : "Auto-Detect GPS"}
              </button>
            </div>

            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street name, area, or nearby landmark"
              error={fieldErrors.address}
              required
            />
          </div>

          {/* 📷 Photo Upload Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-red-500/5 hover:from-rose-500/15 hover:to-red-500/10 border border-rose-200/80 transition-all duration-200 space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shadow-xs">
                <Camera className="w-4 h-4" />
              </div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Photo Evidence <span className="text-rose-500">*</span>
              </label>
            </div>

            {imagePreview ? (
              <div className="relative w-full max-w-md rounded-3xl overflow-hidden border-2 border-rose-200 shadow-md group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-extrabold shadow-lg hover:bg-rose-700 hover:scale-105 transition active:scale-95"
                  >
                    <X size={16} /> Remove Photo
                  </button>
                </div>
              </div>
            ) : (
              <label
                className={`flex flex-col items-center justify-center gap-3 w-full h-52 rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                  fieldErrors.beforeImage
                    ? "border-rose-400 bg-rose-100/50"
                    : "border-rose-300/80 bg-white/80 hover:bg-rose-50/60 hover:border-rose-400 hover:shadow-md"
                }`}
              >
                <div className="p-3.5 bg-rose-100 text-rose-600 rounded-2xl shadow-sm border border-rose-200">
                  <UploadCloud size={26} />
                </div>
                <div className="text-center space-y-1">
                  <span className="text-xs font-extrabold text-slate-800 block">
                    Click or drag photo to upload
                  </span>
                  <span className="text-[11px] text-slate-500 block font-medium">
                    Supports PNG, JPG, or JPEG up to 10MB
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
              <span className="text-xs font-semibold text-rose-500 block">
                {fieldErrors.beforeImage}
              </span>
            )}
          </div>

          {/* Error Banner */}
          {formError && (
            <div className="flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-800 shadow-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <p>{formError}</p>
            </div>
          )}

          {/* ⚡ Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/citizen/dashboard")}
              className="px-6 rounded-xl hover:bg-slate-200"
            >
              Cancel
            </Button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-950/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Send size={15} />
              <span>{isSubmitting ? "Submitting..." : "Submit Complaint"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateComplaint;