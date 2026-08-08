import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, UploadCloud, X } from "lucide-react";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { getComplaintById, getImageUrl } from "../../services/complaintApi";
import { completeComplaint } from "../../services/workerApi";

const UploadProof = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const data = await getComplaintById(id);
                setComplaint(data.complaint);
            } catch (err) {
                setLoadError(err.response?.data?.message || "Failed to load this task.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchComplaint();
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setFormError("");
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!imageFile) {
            setFormError("Please upload a photo showing the completed cleanup.");
            return;
        }

        setIsSubmitting(true);
        try {
            await completeComplaint(id, imageFile);
            navigate(`/worker/complaints/${id}`);
        } catch (err) {
            setFormError(err.response?.data?.message || "Failed to complete this task. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader />
            </div>
        );
    }

    if (loadError && !complaint) {
        return (
            <div className="max-w-xl">
                <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{loadError}</p>
                <Link
                    to="/worker/complaints"
                    className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-emerald-600 hover:underline"
                >
                    <ArrowLeft size={15} /> Back to Assigned Tasks
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-xl space-y-5">
            <Link
                to={`/worker/complaints/${id}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-emerald-600"
            >
                <ArrowLeft size={15} /> Back to Task Details
            </Link>

            <div className="bg-white border border-neutral-200 rounded-xl p-6">
                <h2 className="text-lg font-bold text-neutral-900 mb-1">Upload Proof of Cleanup</h2>
                <p className="text-sm text-neutral-500 mb-6">{complaint?.title}</p>

                {complaint && (
                    <div className="mb-5">
                        <p className="text-xs font-semibold text-neutral-500 mb-1.5">BEFORE</p>
                        <img
                            src={getImageUrl(complaint.beforeImage)}
                            alt="Before cleanup"
                            className="w-full h-44 object-cover rounded-lg border border-neutral-200"
                        />
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-5">
                        <label className="mb-1.5 block text-[13px] font-semibold text-neutral-800">
                            After Photo<span className="ml-0.5 text-red-500">*</span>
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
                            <label className="flex flex-col items-center justify-center gap-2 w-full h-40 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-neutral-100 cursor-pointer transition">
                                <UploadCloud size={24} className="text-neutral-400" />
                                <span className="text-sm text-neutral-500">Click to upload a photo</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    {formError && (
                        <p className="mb-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700">
                            {formError}
                        </p>
                    )}

                    <div className="flex gap-3">
                        <Button type="submit" isLoading={isSubmitting}>
                            Mark as Completed
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate(`/worker/complaints/${id}`)}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadProof;